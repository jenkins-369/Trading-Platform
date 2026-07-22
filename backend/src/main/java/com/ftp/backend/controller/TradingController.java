package com.ftp.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ftp.backend.dto.request.OrderRequest;
import com.ftp.backend.dto.response.OrderResponse;
import com.ftp.backend.security.CurrentUserUtils;
import com.ftp.backend.service.TradingService;

import java.util.List;

@RestController
@RequestMapping("/api/trading")
@Tag(name = "Trading", description = "Trading APIs")
public class TradingController {

    private final TradingService tradingService;
    private final CurrentUserUtils currentUserUtils;

    public TradingController(TradingService tradingService, CurrentUserUtils currentUserUtils) {
        this.tradingService = tradingService;
        this.currentUserUtils = currentUserUtils;
    }

    @PostMapping("/orders")
    @Operation(summary = "Place a new order")
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody OrderRequest request) {
        Long userId = currentUserUtils.getCurrentUserId();
        OrderResponse response = tradingService.placeOrder(userId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/orders/{orderId}")
    @Operation(summary = "Cancel an order")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long orderId) {
        Long userId = currentUserUtils.getCurrentUserId();
        OrderResponse response = tradingService.cancelOrder(userId, orderId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders")
    @Operation(summary = "Get all orders")
    public ResponseEntity<List<OrderResponse>> getOrders() {
        Long userId = currentUserUtils.getCurrentUserId();
        List<OrderResponse> response = tradingService.getOrders(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders/{orderId}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long orderId) {
        Long userId = currentUserUtils.getCurrentUserId();
        OrderResponse response = tradingService.getOrder(userId, orderId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all orders (Admin only)")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> response = tradingService.getAllOrders();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/orders/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get orders by user ID (Admin only)")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(@PathVariable Long userId) {
        List<OrderResponse> response = tradingService.getOrdersByUserId(userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/admin/orders/{orderId}/force")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Force cancel any order (Admin only)")
    public ResponseEntity<OrderResponse> forceCancelOrder(@PathVariable Long orderId) {
        OrderResponse response = tradingService.cancelAnyOrder(orderId);
        return ResponseEntity.ok(response);
    }
}
