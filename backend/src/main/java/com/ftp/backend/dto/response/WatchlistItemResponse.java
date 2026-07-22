package com.ftp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchlistItemResponse {

    private Long id;
    private String symbol;
    private String companyName;
    private LocalDateTime addedAt;
}
