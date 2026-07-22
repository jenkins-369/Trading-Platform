package com.ftp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ftp.backend.entity.Role;
import com.ftp.backend.entity.ERole;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(ERole name);
}
