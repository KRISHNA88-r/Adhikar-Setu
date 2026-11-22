package com.adhikarsetu.dto;

public record AuthResponse(String token, UserSummary user) {
    public record UserSummary(Long id, String name, String email) {}
}
