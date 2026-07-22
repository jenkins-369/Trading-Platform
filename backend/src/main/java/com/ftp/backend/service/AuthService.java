package com.ftp.backend.service;

import com.ftp.backend.dto.request.LoginRequest;
import com.ftp.backend.dto.request.RegisterRequest;
import com.ftp.backend.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
