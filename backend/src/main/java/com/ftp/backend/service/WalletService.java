package com.ftp.backend.service;

import com.ftp.backend.dto.request.DepositRequest;
import com.ftp.backend.dto.request.WithdrawRequest;
import com.ftp.backend.dto.response.WalletResponse;

public interface WalletService {
    WalletResponse getBalance(Long userId);
    WalletResponse deposit(Long targetUserId, DepositRequest request);
    WalletResponse withdraw(Long targetUserId, WithdrawRequest request);
}
