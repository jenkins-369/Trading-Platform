package com.ftp.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchlistRequest {

    @NotBlank(message = "Watchlist name is required")
    @Size(min = 1, max = 100)
    private String name;
}
