package com.adhikarsetu.controller;

import com.adhikarsetu.dto.*;
import com.adhikarsetu.service.AssistantService;
import com.adhikarsetu.util.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {
    private final AssistantService assistant;
    private final RateLimiter limiter;
    public AssistantController(AssistantService assistant, RateLimiter limiter) { this.assistant = assistant; this.limiter = limiter; }

    @PostMapping("/ask")
    public AssistantResponse ask(@Valid @RequestBody AssistantRequest request, HttpServletRequest http) {
        limiter.check(http, "assistant", 20);
        return assistant.ask(request.question(), request.language());
    }
}
