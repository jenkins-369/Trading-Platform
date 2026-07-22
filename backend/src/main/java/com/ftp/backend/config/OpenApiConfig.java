package com.ftp.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Financial Trading Platform API")
                        .version("v1")
                        .description("Production-grade financial trading platform APIs"))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local server")
                ));
    }
}