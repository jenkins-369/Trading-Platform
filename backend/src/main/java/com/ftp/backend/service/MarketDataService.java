package com.ftp.backend.service;

import com.ftp.backend.entity.MarketData;
import java.util.List;

import com.ftp.backend.dto.response.MarketDataResponse;

public interface MarketDataService {
    MarketDataResponse getMarketData(String symbol);
    List<MarketDataResponse> getAllMarketData();
    List<MarketDataResponse> searchMarketData(String query);
    MarketDataResponse createOrUpdateMarketData(com.ftp.backend.entity.MarketData marketData);
    MarketDataResponse createMarketData(MarketData marketData);
    MarketDataResponse updateMarketData(String symbol, MarketData marketData);
    void deleteMarketData(String symbol);
}
