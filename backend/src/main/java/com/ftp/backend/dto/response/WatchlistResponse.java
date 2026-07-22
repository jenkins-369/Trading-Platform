package com.ftp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchlistResponse {

    private Long id;
    private Long userId;
    private String name;
    private List<WatchlistItemResponse> items;
    private LocalDateTime createdAt;
}
