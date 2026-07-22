package com.ftp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ftp.backend.entity.MarketData;

import java.util.List;
import java.util.Optional;

public interface MarketDataRepository extends JpaRepository<MarketData, Long> {
    Optional<MarketData> findBySymbol(String symbol);
    List<MarketData> findByCompanyNameContainingIgnoreCaseOrSymbolContainingIgnoreCase(String companyName, String symbol);
}
