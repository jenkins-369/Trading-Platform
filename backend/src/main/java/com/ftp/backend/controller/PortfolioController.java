package com.ftp.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ftp.backend.dto.response.PortfolioResponse;
import com.ftp.backend.dto.response.PortfolioSummary;
import com.ftp.backend.security.CurrentUserUtils;
import com.ftp.backend.service.PortfolioService;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@Tag(name = "Portfolio", description = "Portfolio management APIs")
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final CurrentUserUtils currentUserUtils;

    public PortfolioController(PortfolioService portfolioService, CurrentUserUtils currentUserUtils) {
        this.portfolioService = portfolioService;
        this.currentUserUtils = currentUserUtils;
    }

    @GetMapping
    @Operation(summary = "Get user portfolio")
    public ResponseEntity<List<PortfolioResponse>> getPortfolio() {
        Long userId = currentUserUtils.getCurrentUserId();
        List<PortfolioResponse> response = portfolioService.getPortfolio(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary")
    @Operation(summary = "Get portfolio summary")
    public ResponseEntity<PortfolioSummary> getPortfolioSummary() {
        Long userId = currentUserUtils.getCurrentUserId();
        PortfolioSummary response = portfolioService.getPortfolioSummary(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/portfolios")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all portfolios (Admin only)")
    public ResponseEntity<List<PortfolioResponse>> getAllPortfolios() {
        List<PortfolioResponse> response = portfolioService.getAllPortfolios();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/portfolios/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get portfolio by user ID (Admin only)")
    public ResponseEntity<List<PortfolioResponse>> getPortfolioByUser(@PathVariable Long userId) {
        List<PortfolioResponse> response = portfolioService.getPortfolioByUserId(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/portfolios/summary/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get portfolio summary by user ID (Admin only)")
    public ResponseEntity<PortfolioSummary> getPortfolioSummaryByUser(@PathVariable Long userId) {
        PortfolioSummary response = portfolioService.getPortfolioSummaryByUserId(userId);
        return ResponseEntity.ok(response);
    }
}
