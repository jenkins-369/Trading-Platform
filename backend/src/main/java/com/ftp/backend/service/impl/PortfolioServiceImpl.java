package com.ftp.backend.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ftp.backend.dto.response.PortfolioResponse;
import com.ftp.backend.dto.response.PortfolioSummary;
import com.ftp.backend.entity.Portfolio;
import com.ftp.backend.repository.PortfolioRepository;
import com.ftp.backend.service.PortfolioService;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PortfolioServiceImpl implements PortfolioService {

    private final PortfolioRepository portfolioRepository;

    public PortfolioServiceImpl(PortfolioRepository portfolioRepository) {
        this.portfolioRepository = portfolioRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PortfolioResponse> getPortfolio(Long userId) {
        return portfolioRepository.findByUserId(userId).stream()
                .map(this::mapToPortfolioResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PortfolioSummary getPortfolioSummary(Long userId) {
        List<PortfolioResponse> holdings = getPortfolio(userId);
        BigDecimal totalValue = holdings.stream()
                .map(PortfolioResponse::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCost = holdings.stream()
                .map(p -> p.getAvgBuyPrice().multiply(p.getQuantity()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalProfitLoss = totalValue.subtract(totalCost);
        BigDecimal totalProfitLossPercent = BigDecimal.ZERO;
        if (totalCost.compareTo(BigDecimal.ZERO) > 0) {
            totalProfitLossPercent = totalProfitLoss.divide(totalCost, new MathContext(4, RoundingMode.HALF_UP))
                    .multiply(BigDecimal.valueOf(100));
        }
        return PortfolioSummary.builder()
                .totalValue(totalValue)
                .totalCost(totalCost)
                .totalProfitLoss(totalProfitLoss)
                .totalProfitLossPercent(totalProfitLossPercent)
                .holdings(holdings)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PortfolioResponse> getAllPortfolios() {
        return portfolioRepository.findAll().stream()
                .map(this::mapToPortfolioResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PortfolioResponse> getPortfolioByUserId(Long userId) {
        return portfolioRepository.findByUserId(userId).stream()
                .map(this::mapToPortfolioResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PortfolioSummary getPortfolioSummaryByUserId(Long userId) {
        List<PortfolioResponse> holdings = getPortfolioByUserId(userId);
        BigDecimal totalValue = holdings.stream()
                .map(PortfolioResponse::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCost = holdings.stream()
                .map(p -> p.getAvgBuyPrice().multiply(p.getQuantity()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalProfitLoss = totalValue.subtract(totalCost);
        BigDecimal totalProfitLossPercent = BigDecimal.ZERO;
        if (totalCost.compareTo(BigDecimal.ZERO) > 0) {
            totalProfitLossPercent = totalProfitLoss.divide(totalCost, new MathContext(4, RoundingMode.HALF_UP))
                    .multiply(BigDecimal.valueOf(100));
        }
        return PortfolioSummary.builder()
                .totalValue(totalValue)
                .totalCost(totalCost)
                .totalProfitLoss(totalProfitLoss)
                .totalProfitLossPercent(totalProfitLossPercent)
                .holdings(holdings)
                .build();
    }

    private PortfolioResponse mapToPortfolioResponse(Portfolio portfolio) {
        return PortfolioResponse.builder()
                .id(portfolio.getId())
                .userId(portfolio.getUser().getId())
                .symbol(portfolio.getSymbol())
                .quantity(portfolio.getQuantity())
                .avgBuyPrice(portfolio.getAvgBuyPrice())
                .currentValue(portfolio.getCurrentValue())
                .profitLoss(portfolio.getProfitLoss())
                .profitLossPercent(portfolio.getProfitLossPercent())
                .updatedAt(portfolio.getUpdatedAt())
                .build();
    }
}
