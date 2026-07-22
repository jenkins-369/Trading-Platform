package com.ftp.backend.service.impl;

import com.ftp.backend.dto.request.OrderRequest;
import com.ftp.backend.dto.response.OrderResponse;
import com.ftp.backend.entity.*;
import com.ftp.backend.repository.*;
import com.ftp.backend.service.TradingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TradingServiceImpl implements TradingService {

    private final OrderRepository orderRepository;
    private final WalletRepository walletRepository;
    private final PortfolioRepository portfolioRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TradingServiceImpl(OrderRepository orderRepository,
                              WalletRepository walletRepository,
                              PortfolioRepository portfolioRepository,
                              MarketDataRepository marketDataRepository,
                              TransactionRepository transactionRepository,
                              UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.walletRepository = walletRepository;
        this.portfolioRepository = portfolioRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OrderResponse placeOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        BigDecimal totalAmount = request.getPrice().multiply(request.getQuantity());
        BigDecimal fee = totalAmount.multiply(new BigDecimal("0.001")).setScale(2, RoundingMode.HALF_UP);

        if (request.getOrderType() == OrderType.BUY) {
            BigDecimal totalCost = totalAmount.add(fee);
            if (wallet.getAvailableBalance().compareTo(totalCost) < 0) {
                throw new RuntimeException("Insufficient funds");
            }
            wallet.setBalance(wallet.getBalance().subtract(totalCost));
            wallet.setAvailableBalance(wallet.getAvailableBalance().subtract(totalCost));
        } else {
            Portfolio portfolio = portfolioRepository.findByUserIdAndSymbol(userId, request.getSymbol());
            if (portfolio == null || portfolio.getQuantity().compareTo(request.getQuantity()) < 0) {
                throw new RuntimeException("Insufficient holdings");
            }
        }
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);

        Order order = Order.builder()
                .user(user)
                .orderType(request.getOrderType())
                .orderStatus(OrderStatus.FILLED)
                .symbol(request.getSymbol())
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .totalAmount(totalAmount)
                .filledQuantity(request.getQuantity())
                .filledPrice(request.getPrice())
                .fee(fee)
                .build();

        orderRepository.save(order);

        if (request.getOrderType() == OrderType.BUY) {
            updatePortfolioForBuy(userId, request.getSymbol(), request.getQuantity(), request.getPrice());
        } else {
            updatePortfolioForSell(userId, request.getSymbol(), request.getQuantity(), request.getPrice());
        }

        Transaction transaction = Transaction.builder()
                .user(user)
                .order(order)
                .transactionType(request.getOrderType() == OrderType.BUY ? TransactionType.BUY : TransactionType.SELL)
                .symbol(request.getSymbol())
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .totalAmount(totalAmount)
                .fee(fee)
                .build();
        transactionRepository.save(transaction);

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getOrderStatus());
        }
        order.setOrderStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
        return mapToOrderResponse(order);
    }

    @Override
    public List<OrderResponse> getOrders(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrder(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        return mapToOrderResponse(order);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse cancelAnyOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getOrderStatus());
        }
        order.setOrderStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
        return mapToOrderResponse(order);
    }

    private void updatePortfolioForBuy(Long userId, String symbol, BigDecimal quantity, BigDecimal price) {
        Portfolio portfolio = portfolioRepository.findByUserIdAndSymbol(userId, symbol);
        if (portfolio == null) {
            portfolio = Portfolio.builder()
                    .user(User.builder().id(userId).build())
                    .symbol(symbol)
                    .quantity(quantity)
                    .avgBuyPrice(price)
                    .currentValue(price.multiply(quantity))
                    .build();
        } else {
            BigDecimal totalCost = portfolio.getAvgBuyPrice().multiply(portfolio.getQuantity())
                    .add(price.multiply(quantity));
            BigDecimal totalQty = portfolio.getQuantity().add(quantity);
            portfolio.setAvgBuyPrice(totalCost.divide(totalQty, new MathContext(8, RoundingMode.HALF_UP)));
            portfolio.setQuantity(totalQty);
            portfolio.setCurrentValue(price.multiply(totalQty));
        }
        BigDecimal costBasis = portfolio.getAvgBuyPrice().multiply(portfolio.getQuantity());
        portfolio.setProfitLoss(portfolio.getCurrentValue().subtract(costBasis));
        if (costBasis.compareTo(BigDecimal.ZERO) > 0) {
            portfolio.setProfitLossPercent(
                    portfolio.getProfitLoss().divide(costBasis, new MathContext(4, RoundingMode.HALF_UP))
                            .multiply(new BigDecimal("100"))
            );
        }
        portfolio.setUpdatedAt(LocalDateTime.now());
        portfolioRepository.save(portfolio);
    }

    private void updatePortfolioForSell(Long userId, String symbol, BigDecimal quantity, BigDecimal price) {
        Portfolio portfolio = portfolioRepository.findByUserIdAndSymbol(userId, symbol);
        if (portfolio != null) {
            portfolio.setQuantity(portfolio.getQuantity().subtract(quantity));
            portfolio.setCurrentValue(price.multiply(portfolio.getQuantity()));
            BigDecimal costBasis = portfolio.getAvgBuyPrice().multiply(portfolio.getQuantity());
            portfolio.setProfitLoss(portfolio.getCurrentValue().subtract(costBasis));
            if (costBasis.compareTo(BigDecimal.ZERO) > 0) {
                portfolio.setProfitLossPercent(
                        portfolio.getProfitLoss().divide(costBasis, new MathContext(4, RoundingMode.HALF_UP))
                                .multiply(new BigDecimal("100"))
                );
            }
            if (portfolio.getQuantity().compareTo(BigDecimal.ZERO) == 0) {
                portfolioRepository.delete(portfolio);
                return;
            }
            portfolio.setUpdatedAt(LocalDateTime.now());
            portfolioRepository.save(portfolio);
        }
    }

    private OrderResponse mapToOrderResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .orderType(order.getOrderType())
                .orderStatus(order.getOrderStatus())
                .symbol(order.getSymbol())
                .quantity(order.getQuantity())
                .price(order.getPrice())
                .totalAmount(order.getTotalAmount())
                .filledQuantity(order.getFilledQuantity())
                .filledPrice(order.getFilledPrice())
                .fee(order.getFee())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
