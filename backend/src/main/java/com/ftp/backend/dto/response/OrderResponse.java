package com.ftp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ftp.backend.entity.OrderStatus;
import com.ftp.backend.entity.OrderType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;
    private Long userId;
    private OrderType orderType;
    private OrderStatus orderStatus;
    private String symbol;
    private BigDecimal quantity;
    private BigDecimal price;
    private BigDecimal totalAmount;
    private BigDecimal filledQuantity;
    private BigDecimal filledPrice;
    private BigDecimal fee;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
