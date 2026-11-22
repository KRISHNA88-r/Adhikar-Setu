package com.adhikarsetu.dto;

public record NoticeResponse(boolean aiEnabled, String message, String issuer, String subject, String summary,
                             String deadline, String action, String confidence) {}
