package com.adhikarsetu.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import java.util.concurrent.ConcurrentHashMap;

/** Small in-memory per-IP limiter (one minute window). Good enough for a single Render instance. */
@Component
public class RateLimiter {
    private final ConcurrentHashMap<String, long[]> windows = new ConcurrentHashMap<>();

    public void check(HttpServletRequest request, String bucket, int perMinute) {
        String fwd = request.getHeader("X-Forwarded-For");
        String ip = (fwd != null && !fwd.isBlank()) ? fwd.split(",")[0].trim() : request.getRemoteAddr();
        long now = System.currentTimeMillis();
        if (windows.size() > 5000) windows.entrySet().removeIf(e -> now - e.getValue()[0] > 60_000);
        long[] w = windows.compute(bucket + "|" + ip, (k, old) -> {
            if (old == null || now - old[0] > 60_000) return new long[]{now, 1};
            old[1]++;
            return old;
        });
        if (w[1] > perMinute) throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many requests. Please wait a minute and try again.");
    }
}
