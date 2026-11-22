package com.adhikarsetu.dto;

import java.util.List;

public record AssistantResponse(String answer, boolean aiEnabled, List<Source> sources) {
    public record Source(String name, String url) {}
}
