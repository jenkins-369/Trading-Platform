package com.ftp.backend.service;

import java.util.List;

import com.ftp.backend.dto.response.PortfolioResponse;
import com.ftp.backend.dto.response.PortfolioSummary;

public interface PortfolioService {
    List<PortfolioResponse> getPortfolio(Long userId);
    PortfolioSummary getPortfolioSummary(Long userId);
    List<PortfolioResponse> getAllPortfolios();
    List<PortfolioResponse> getPortfolioByUserId(Long userId);
    PortfolioSummary getPortfolioSummaryByUserId(Long userId);
}
