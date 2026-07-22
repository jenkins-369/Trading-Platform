package com.ftp.backend.service.impl;

import com.ftp.backend.dto.response.DashboardStatsResponse;
import com.ftp.backend.repository.*;
import com.ftp.backend.service.DashboardStatsService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class DashboardStatsServiceImpl implements DashboardStatsService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final TransactionRepository transactionRepository;
    private final MarketDataRepository marketDataRepository;
    private final WatchlistRepository watchlistRepository;
    private final PortfolioRepository portfolioRepository;
    private final WalletRepository walletRepository;

    public DashboardStatsServiceImpl(UserRepository userRepository,
                                 OrderRepository orderRepository,
                                 TransactionRepository transactionRepository,
                                 MarketDataRepository marketDataRepository,
                                 WatchlistRepository watchlistRepository,
                                 PortfolioRepository portfolioRepository,
                                 WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.transactionRepository = transactionRepository;
        this.marketDataRepository = marketDataRepository;
        this.watchlistRepository = watchlistRepository;
        this.portfolioRepository = portfolioRepository;
        this.walletRepository = walletRepository;
    }

    @Override
    public DashboardStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        long totalTransactions = transactionRepository.count();
        long totalMarketData = marketDataRepository.count();
        long totalWatchlists = watchlistRepository.count();
        long totalPortfolios = portfolioRepository.count();

        BigDecimal totalWalletBalance = walletRepository.findAll().stream()
                .map(wallet -> wallet.getBalance() != null ? wallet.getBalance() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTradingVolume = orderRepository.findAll().stream()
                .map(order -> order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalOrders(totalOrders)
                .totalTransactions(totalTransactions)
                .totalMarketData(totalMarketData)
                .totalWatchlists(totalWatchlists)
                .totalPortfolios(totalPortfolios)
                .totalWalletBalance(totalWalletBalance.setScale(2, RoundingMode.HALF_UP))
                .totalTradingVolume(totalTradingVolume.setScale(2, RoundingMode.HALF_UP))
                .build();
    }
}
