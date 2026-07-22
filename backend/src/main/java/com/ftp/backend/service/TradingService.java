package com.ftp.backend.service;

import java.util.List;

import com.ftp.backend.dto.request.OrderRequest;
import com.ftp.backend.dto.response.OrderResponse;

public interface TradingService {
    OrderResponse placeOrder(Long userId, OrderRequest request);
    OrderResponse cancelOrder(Long userId, Long orderId);
    List<OrderResponse> getOrders(Long userId);
    OrderResponse getOrder(Long userId, Long orderId);
    List<OrderResponse> getAllOrders();
    List<OrderResponse> getOrdersByUserId(Long userId);
    OrderResponse cancelAnyOrder(Long orderId);
}
