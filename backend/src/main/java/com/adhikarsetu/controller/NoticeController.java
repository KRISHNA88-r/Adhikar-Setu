package com.adhikarsetu.controller;

import com.adhikarsetu.dto.NoticeRequest;
import com.adhikarsetu.dto.NoticeResponse;
import com.adhikarsetu.service.NoticeService;
import com.adhikarsetu.util.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notice")
public class NoticeController {
    private final NoticeService notices;
    private final RateLimiter limiter;
    public NoticeController(NoticeService notices, RateLimiter limiter) { this.notices = notices; this.limiter = limiter; }

    @PostMapping("/explain")
    public NoticeResponse explain(@Valid @RequestBody NoticeRequest request, HttpServletRequest http) {
        limiter.check(http, "notice", 10);
        return notices.explain(request);
    }
}
