package com.ftp.backend.service;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.ftp.backend.dto.response.UserResponse;

import java.util.List;

public interface UserService extends UserDetailsService {
    UserResponse getCurrentUser(String username);
    UserResponse getUserById(Long userId);
    List<UserResponse> getAllUsers();
    UserResponse updateUser(String username, com.ftp.backend.dto.request.UpdateUserRequest request);
    void deleteUser(Long userId);
}
