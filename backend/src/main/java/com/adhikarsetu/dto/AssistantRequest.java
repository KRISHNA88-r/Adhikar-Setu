package com.adhikarsetu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AssistantRequest(@NotBlank @Size(max = 3000) String question, @Size(max = 5) String language) {}
