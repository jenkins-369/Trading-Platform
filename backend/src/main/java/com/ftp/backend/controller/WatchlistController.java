package com.ftp.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ftp.backend.dto.request.WatchlistRequest;
import com.ftp.backend.dto.response.WatchlistResponse;
import com.ftp.backend.security.CurrentUserUtils;
import com.ftp.backend.service.WatchlistService;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@Tag(name = "Watchlist", description = "Watchlist management APIs")
public class WatchlistController {

    private final WatchlistService watchlistService;
    private final CurrentUserUtils currentUserUtils;

    public WatchlistController(WatchlistService watchlistService, CurrentUserUtils currentUserUtils) {
        this.watchlistService = watchlistService;
        this.currentUserUtils = currentUserUtils;
    }

    @PostMapping
    @Operation(summary = "Create a new watchlist")
    public ResponseEntity<WatchlistResponse> createWatchlist(@Valid @RequestBody WatchlistRequest request) {
        Long userId = currentUserUtils.getCurrentUserId();
        WatchlistResponse response = watchlistService.createWatchlist(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get user watchlists")
    public ResponseEntity<List<WatchlistResponse>> getWatchlists() {
        Long userId = currentUserUtils.getCurrentUserId();
        List<WatchlistResponse> response = watchlistService.getWatchlists(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{watchlistId}/items")
    @Operation(summary = "Add symbol to watchlist")
    public ResponseEntity<WatchlistResponse> addItem(@PathVariable Long watchlistId,
                                                     @RequestParam String symbol,
                                                     @RequestParam(required = false) String companyName) {
        Long userId = currentUserUtils.getCurrentUserId();
        WatchlistResponse response = watchlistService.addItem(userId, watchlistId, symbol, companyName);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{watchlistId}/items/{symbol}")
    @Operation(summary = "Remove symbol from watchlist")
    public ResponseEntity<WatchlistResponse> removeItem(@PathVariable Long watchlistId,
                                                        @PathVariable String symbol) {
        Long userId = currentUserUtils.getCurrentUserId();
        WatchlistResponse response = watchlistService.removeItem(userId, watchlistId, symbol);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{watchlistId}")
    @Operation(summary = "Delete watchlist")
    public ResponseEntity<Void> deleteWatchlist(@PathVariable Long watchlistId) {
        Long userId = currentUserUtils.getCurrentUserId();
        watchlistService.deleteWatchlist(userId, watchlistId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/watchlists")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all watchlists (Admin only)")
    public ResponseEntity<List<WatchlistResponse>> getAllWatchlists() {
        List<WatchlistResponse> response = watchlistService.getAllWatchlists();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/watchlists/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get watchlists by user ID (Admin only)")
    public ResponseEntity<List<WatchlistResponse>> getWatchlistsByUser(@PathVariable Long userId) {
        List<WatchlistResponse> response = watchlistService.getWatchlistsByUserId(userId);
        return ResponseEntity.ok(response);
    }
}
