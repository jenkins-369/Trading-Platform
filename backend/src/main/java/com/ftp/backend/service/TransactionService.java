package com.ftp.backend.service;

import java.util.List;

import com.ftp.backend.dto.response.TransactionResponse;

public interface TransactionService {
    List<TransactionResponse> getTransactionHistory(Long userId);
    TransactionResponse getTransaction(Long userId, Long transactionId);
}
