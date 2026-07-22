package com.ftp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "market_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String symbol;

    private String companyName;

    @Column(precision = 19, scale = 2)
    private BigDecimal currentPrice;

    @Column(precision = 19, scale = 2)
    private BigDecimal openPrice;

    @Column(precision = 19, scale = 2)
    private BigDecimal highPrice;

    @Column(precision = 19, scale = 2)
    private BigDecimal lowPrice;

    @Column(precision = 19, scale = 2)
    private BigDecimal previousClose;

    private Long volume;

    @Column(precision = 19, scale = 2)
    private BigDecimal change;

    @Column(precision = 19, scale = 2)
    private BigDecimal changePercent;

    private LocalDateTime lastUpdated;
}
