package com.adhikarsetu.rules;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Heuristic scam check. It reports a risk level and the reasons, never an absolute verdict.
 * Official sites are recognised by an allowlist (government suffixes plus a few named domains).
 */
public final class ScamShield {
    public record Link(String url, String host, boolean official) {}
    public record Result(String level, int score, List<Reason> reasons, List<Link> links) {}

    private static final List<String> OFFICIAL_SUFFIXES = List.of(".gov.in", ".nic.in");
    private static final Set<String> OFFICIAL_EXACT = Set.of("gov.in", "nic.in", "mudra.org.in", "npstrust.org.in", "uidai.gov.in");
    private static final Set<String> SHORTENERS = Set.of("bit.ly", "tinyurl.com", "t.co", "cutt.ly", "rb.gy", "is.gd", "shorturl.at", "goo.gl", "ow.ly", "tiny.cc");
    private static final Set<String> FILE_EXT = Set.of("pdf", "apk", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx", "txt", "zip");
    private static final List<String> LOOKALIKE = List.of("gov", "yojana", "sarkar", "pmkisan", "kisan", "ujjwala", "ayushman", "scholarship", "pmay", "aadhaar", "aadhar");

    private static final Pattern URL = Pattern.compile("(?i)\\b((?:https?://)?(?:[a-z0-9._~%-]+@)?(?:[a-z0-9-]+\\.)+[a-z]{2,}(?::\\d+)?(?:/[^\\s]*)?)");
    private static final Pattern FEE = Pattern.compile("(?i)((registration|processing|application|verification|activation|clearance|release|gst|tax)\\s+(fee|fees|charge|charges))|(\\b(pay|send|transfer|deposit)\\b[^.\\n]{0,40}(₹|\\brs\\.?|\\binr\\b|rupees|\\bupi\\b))");
    private static final Pattern OTP = Pattern.compile("(?i)\\b(share|send|tell|give|enter|forward)\\b[^.\\n]{0,30}\\b(otp|pin|cvv|password|passcode)\\b|\\b(otp|pin|cvv|password|passcode)\\b[^.\\n]{0,20}\\b(share|send|tell|give)\\b");
    private static final Pattern URGENCY = Pattern.compile("(?i)(immediately|urgent|within\\s+\\d+\\s*(hours?|hrs?)|last\\s+date\\s+today|today\\s+only|will\\s+(expire|be\\s+blocked|be\\s+suspended)|blocked|suspended|deactivat)");
    private static final Pattern PRIZE = Pattern.compile("(?i)(lottery|you\\s+(have\\s+)?won|prize|jackpot|free\\s+(laptop|phone|mobile|gift|scooty))");
    private static final Pattern APK = Pattern.compile("(?i)\\.apk\\b|install\\s+(this\\s+)?app");
    private static final Pattern KYC = Pattern.compile("(?i)(kyc|aadhaar|aadhar)\\s*(update|verification|link|expire)");
    private static final Pattern CONTACT = Pattern.compile("(?i)(whatsapp|call|contact|message)\\b[^.\\n]{0,30}\\b[6-9]\\d{9}\\b");
    private static final Pattern GUARANTEE = Pattern.compile("(?i)(guaranteed|100\\s?%\\s*(approval|sure|assured))");

    private ScamShield() {}

    public static Result check(String text) {
        String t = text == null ? "" : text;
        List<Reason> reasons = new ArrayList<>();
        List<Link> links = extractLinks(t);
        int score = 0;

        boolean anyOfficial = false, anyNonOfficial = false;
        for (Link l : links) {
            if (l.official()) { anyOfficial = true; continue; }
            anyNonOfficial = true;
            Map<String, String> p = Map.of("host", l.host());
            if (SHORTENERS.contains(l.host())) { reasons.add(new Reason("SHORT_LINK", "warn", p)); score += 2; }
            else if (LOOKALIKE.stream().anyMatch(l.host()::contains)) { reasons.add(new Reason("GOV_LOOKALIKE", "warn", p)); score += 3; }
            else { reasons.add(new Reason("NON_OFFICIAL_LINK", "warn", p)); score += 2; }
        }
        if (FEE.matcher(t).find()) { reasons.add(w("FEE_DEMAND")); score += 3; }
        if (OTP.matcher(t).find()) { reasons.add(w("OTP_PIN")); score += 4; }
        if (APK.matcher(t).find()) { reasons.add(w("APK")); score += 4; }
        if (PRIZE.matcher(t).find()) { reasons.add(w("PRIZE")); score += 3; }
        if (URGENCY.matcher(t).find()) { reasons.add(w("URGENCY")); score += 2; }
        if (KYC.matcher(t).find() && !links.isEmpty()) { reasons.add(w("KYC_LINK")); score += 2; }
        if (GUARANTEE.matcher(t).find()) { reasons.add(w("GUARANTEE")); score += 2; }
        if (CONTACT.matcher(t).find()) { reasons.add(w("PERSONAL_NUMBER")); score += 1; }

        if (anyOfficial && !anyNonOfficial) reasons.add(new Reason("OFFICIAL_LINKS", "ok", Map.of()));
        if (reasons.stream().noneMatch(r -> r.state().equals("warn"))) reasons.add(new Reason("NO_RED_FLAGS", "ok", Map.of()));

        String level = score >= 6 ? "HIGH" : score >= 3 ? "MEDIUM" : "LOW";
        return new Result(level, score, reasons, links);
    }

    public static boolean isOfficialHost(String host) {
        if (host == null) return false;
        String h = host.toLowerCase();
        return OFFICIAL_EXACT.contains(h) || OFFICIAL_SUFFIXES.stream().anyMatch(h::endsWith);
    }

    static List<Link> extractLinks(String text) {
        Map<String, Link> found = new LinkedHashMap<>();
        Matcher m = URL.matcher(text);
        while (m.find()) {
            String raw = m.group(1).replaceAll("[).,;!]+$", "");
            String host = hostOf(raw);
            if (host == null || !host.contains(".")) continue;
            String tld = host.substring(host.lastIndexOf('.') + 1);
            if (FILE_EXT.contains(tld) && !raw.toLowerCase().startsWith("http")) continue;
            found.putIfAbsent(host + "|" + raw, new Link(raw, host, isOfficialHost(host)));
        }
        return new ArrayList<>(found.values());
    }

    static String hostOf(String url) {
        String s = url.replaceFirst("(?i)^https?://", "");
        int end = s.length();
        for (char c : new char[]{'/', '?', '#'}) { int i = s.indexOf(c); if (i >= 0 && i < end) end = i; }
        s = s.substring(0, end);
        int at = s.lastIndexOf('@');
        if (at >= 0) s = s.substring(at + 1);
        s = s.replaceFirst(":\\d+$", "").toLowerCase();
        return s.isEmpty() ? null : s;
    }

    private static Reason w(String code) { return new Reason(code, "warn", Map.of()); }
}
