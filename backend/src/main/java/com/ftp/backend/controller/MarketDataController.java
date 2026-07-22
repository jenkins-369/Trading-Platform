package com.ftp.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ftp.backend.dto.response.MarketDataResponse;
import com.ftp.backend.entity.MarketData;
import com.ftp.backend.service.MarketDataService;

import java.util.List;

@RestController
@RequestMapping("/api/market")
@Tag(name = "Market Data", description = "Public market data APIs")
public class MarketDataController {

    private final MarketDataService marketDataService;

    public MarketDataController(MarketDataService marketDataService) {
        this.marketDataService = marketDataService;
    }

    @GetMapping("/data/{symbol}")
    @Operation(summary = "Get market data by symbol")
    public ResponseEntity<MarketDataResponse> getMarketData(@PathVariable String symbol) {
        MarketDataResponse response = marketDataService.getMarketData(symbol);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/data")
    @Operation(summary = "Get all market data")
    public ResponseEntity<List<MarketDataResponse>> getAllMarketData() {
        List<MarketDataResponse> response = marketDataService.getAllMarketData();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Search market data")
    public ResponseEntity<List<MarketDataResponse>> searchMarketData(@RequestParam String query) {
        List<MarketDataResponse> response = marketDataService.searchMarketData(query);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/data")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create market data (Admin only)")
    public ResponseEntity<MarketDataResponse> createMarketData(@RequestBody MarketData marketData) {
        MarketDataResponse response = marketDataService.createMarketData(marketData);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/data/{symbol}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update market data (Admin only)")
    public ResponseEntity<MarketDataResponse> updateMarketData(@PathVariable String symbol,
                                                               @RequestBody MarketData marketData) {
        MarketDataResponse response = marketDataService.updateMarketData(symbol, marketData);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/data/{symbol}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete market data (Admin only)")
    public ResponseEntity<Void> deleteMarketData(@PathVariable String symbol) {
        marketDataService.deleteMarketData(symbol);
        return ResponseEntity.noContent().build();
    }
}
