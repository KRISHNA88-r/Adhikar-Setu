package com.adhikarsetu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ScamRequest(@NotBlank @Size(max = 5000) String text) {}
