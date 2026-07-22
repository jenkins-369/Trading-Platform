package com.ftp.backend.config;

import com.ftp.backend.entity.ERole;
import com.ftp.backend.entity.Role;
import com.ftp.backend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class RoleInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            Arrays.stream(ERole.values()).forEach(role -> {
                if (roleRepository.findByName(role) == null) {
                    Role r = new Role();
                    r.setName(role);
                    roleRepository.save(r);
                }
            });
        };
    }
}
