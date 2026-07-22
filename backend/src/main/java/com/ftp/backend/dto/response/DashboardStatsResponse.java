package com.ftp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

    private Long totalUsers;
    private Long totalOrders;
    private Long totalTransactions;
    private Long totalMarketData;
    private Long totalWatchlists;
    private Long totalPortfolios;
    private BigDecimal totalWalletBalance;
    private BigDecimal totalTradingVolume;
}
