package com.adhikarsetu.dto;

import jakarta.validation.constraints.Size;

public record NoticeRequest(@Size(max = 8000) String text, @Size(max = 6000000) String imageDataUrl, @Size(max = 5) String language) {}
