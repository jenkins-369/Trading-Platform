package com.ftp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ftp.backend.entity.Portfolio;

import java.util.List;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByUserId(Long userId);
    Portfolio findByUserIdAndSymbol(Long userId, String symbol);
}
