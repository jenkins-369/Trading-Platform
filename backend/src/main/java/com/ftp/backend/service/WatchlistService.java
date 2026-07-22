package com.ftp.backend.service;

import java.util.List;

import com.ftp.backend.dto.request.WatchlistRequest;
import com.ftp.backend.dto.response.WatchlistResponse;

public interface WatchlistService {
    WatchlistResponse createWatchlist(Long userId, WatchlistRequest request);
    List<WatchlistResponse> getWatchlists(Long userId);
    WatchlistResponse addItem(Long userId, Long watchlistId, String symbol, String companyName);
    WatchlistResponse removeItem(Long userId, Long watchlistId, String symbol);
    void deleteWatchlist(Long userId, Long watchlistId);
    List<WatchlistResponse> getAllWatchlists();
    List<WatchlistResponse> getWatchlistsByUserId(Long userId);
}
