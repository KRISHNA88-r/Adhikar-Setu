package com.adhikarsetu.rules;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Deterministic eligibility. No AI is involved: the same profile always gives the same answer,
 * and every answer comes with reasons.
 *
 *  ELIGIBLE     - every criterion is met.
 *  ALMOST       - nothing clearly fails, but something is unknown (for example the income range
 *                 straddles the limit), or exactly one criterion misses by a small margin.
 *  NOT_ELIGIBLE - at least one clear failure.
 */
public final class RuleEngine {
    private static final int NEAR_YEARS = 2;
    private static final double NEAR_INCOME_FACTOR = 1.25;

    private RuleEngine() {}

    public static Evaluation evaluate(Profile p, SchemeRules r) {
        List<Reason> out = new ArrayList<>();
        int hardFails = 0, nearMisses = 0, unknowns = 0;

        if (r.minAge() != null) {
            String lim = String.valueOf(r.minAge());
            if (p.age() == null) { out.add(reason("AGE_MIN", "unknown", "min", lim)); unknowns++; }
            else if (p.age() >= r.minAge()) out.add(reason("AGE_MIN", "ok", "min", lim));
            else { out.add(reason("AGE_MIN", "fail", "min", lim)); if (r.minAge() - p.age() <= NEAR_YEARS) nearMisses++; else hardFails++; }
        }
        if (r.maxAge() != null) {
            String lim = String.valueOf(r.maxAge());
            if (p.age() == null) { out.add(reason("AGE_MAX", "unknown", "max", lim)); unknowns++; }
            else if (p.age() <= r.maxAge()) out.add(reason("AGE_MAX", "ok", "max", lim));
            else { out.add(reason("AGE_MAX", "fail", "max", lim)); if (p.age() - r.maxAge() <= NEAR_YEARS) nearMisses++; else hardFails++; }
        }
        if (r.maxIncome() != null) {
            String lim = String.valueOf(r.maxIncome());
            Integer min = p.incomeMin(), max = p.incomeMax();
            if (min != null && min > r.maxIncome()) {
                out.add(reason("INCOME_MAX", "fail", "max", lim));
                if (min <= r.maxIncome() * NEAR_INCOME_FACTOR) nearMisses++; else hardFails++;
            } else if (max != null && max <= r.maxIncome()) {
                out.add(reason("INCOME_MAX", "ok", "max", lim));
            } else {
                out.add(reason("INCOME_MAX", "unknown", "max", lim)); unknowns++;
            }
        }
        if (r.occupations() != null && !r.occupations().isEmpty()) {
            String list = String.join(",", r.occupations());
            if (blank(p.occupation())) { out.add(reason("OCCUPATION", "unknown", "list", list)); unknowns++; }
            else if (r.occupations().stream().anyMatch(o -> o.equalsIgnoreCase(p.occupation()))) out.add(reason("OCCUPATION", "ok", "list", list));
            else { out.add(reason("OCCUPATION", "fail", "list", list)); hardFails++; }
        }
        if (!blank(r.gender()) && !"ANY".equalsIgnoreCase(r.gender())) {
            String lim = r.gender().toUpperCase();
            if (blank(p.gender())) { out.add(reason("GENDER", "unknown", "value", lim)); unknowns++; }
            else if (p.gender().equalsIgnoreCase(r.gender())) out.add(reason("GENDER", "ok", "value", lim));
            else { out.add(reason("GENDER", "fail", "value", lim)); hardFails++; }
        }
        if (!blank(r.area()) && !"ANY".equalsIgnoreCase(r.area())) {
            String lim = r.area().toUpperCase();
            if (blank(p.area())) { out.add(reason("AREA", "unknown", "value", lim)); unknowns++; }
            else if (p.area().equalsIgnoreCase(r.area())) out.add(reason("AREA", "ok", "value", lim));
            else { out.add(reason("AREA", "fail", "value", lim)); hardFails++; }
        }
        if (r.requiresLand()) {
            if (p.ownsLand() == null) { out.add(reason("LAND", "unknown")); unknowns++; }
            else if (p.ownsLand()) out.add(reason("LAND", "ok"));
            else { out.add(reason("LAND", "fail")); hardFails++; }
        }
        if (r.requiresDisability()) {
            if (p.hasDisability() == null) { out.add(reason("DISABILITY", "unknown")); unknowns++; }
            else if (p.hasDisability()) out.add(reason("DISABILITY", "ok"));
            else { out.add(reason("DISABILITY", "fail")); hardFails++; }
        }

        Status status;
        if (hardFails > 0 || nearMisses > 1) status = Status.NOT_ELIGIBLE;
        else if (nearMisses == 1 || unknowns > 0) status = Status.ALMOST;
        else status = Status.ELIGIBLE;
        return new Evaluation(status, out);
    }

    private static boolean blank(String s) { return s == null || s.isBlank(); }
    private static Reason reason(String code, String state) { return new Reason(code, state, Map.of()); }
    private static Reason reason(String code, String state, String k, String v) { return new Reason(code, state, Map.of(k, v)); }
}
