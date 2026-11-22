package com.adhikarsetu.rules;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;

class RuleEngineTest {
    private final SchemeRules kisan = new SchemeRules(null, null, null, List.of("farmer"), null, null, true, false);
    private final SchemeRules pension = new SchemeRules(60, null, 150000, List.of(), null, null, false, false);
    private final SchemeRules ujjwala = new SchemeRules(18, null, 300000, List.of(), "FEMALE", null, false, false);

    @Test void farmerWithLandIsEligible() {
        Profile p = new Profile(45, "MALE", "RURAL", "farmer", true, false, 100000, 200000);
        assertEquals(Status.ELIGIBLE, RuleEngine.evaluate(p, kisan).status());
    }
    @Test void farmerWithoutLandIsNotEligible() {
        Profile p = new Profile(45, "MALE", "RURAL", "farmer", false, false, null, null);
        assertEquals(Status.NOT_ELIGIBLE, RuleEngine.evaluate(p, kisan).status());
    }
    @Test void studentIsNotEligibleForFarmerScheme() {
        Profile p = new Profile(20, "MALE", "URBAN", "student", null, null, null, null);
        assertEquals(Status.NOT_ELIGIBLE, RuleEngine.evaluate(p, kisan).status());
    }
    @Test void incomeRangeStraddlingLimitIsAlmost() {
        Profile p = new Profile(65, "FEMALE", "RURAL", "other", null, null, 100000, 200000);
        assertEquals(Status.ALMOST, RuleEngine.evaluate(p, pension).status());
    }
    @Test void oneYearTooYoungIsNearMiss() {
        Profile p = new Profile(59, "MALE", "RURAL", "other", null, null, 0, 100000);
        assertEquals(Status.ALMOST, RuleEngine.evaluate(p, pension).status());
    }
    @Test void tenYearsTooYoungIsNotEligible() {
        Profile p = new Profile(50, "MALE", "RURAL", "other", null, null, 0, 100000);
        assertEquals(Status.NOT_ELIGIBLE, RuleEngine.evaluate(p, pension).status());
    }
    @Test void wrongGenderIsNotEligible() {
        Profile p = new Profile(30, "MALE", "RURAL", "other", null, null, 0, 100000);
        assertEquals(Status.NOT_ELIGIBLE, RuleEngine.evaluate(p, ujjwala).status());
    }
    @Test void clearlyAboveIncomeLimitIsNotEligible() {
        Profile p = new Profile(30, "FEMALE", "RURAL", "other", null, null, 900000, null);
        assertEquals(Status.NOT_ELIGIBLE, RuleEngine.evaluate(p, ujjwala).status());
    }
    @Test void emptyProfileIsAlmostNeverEligible() {
        Profile p = new Profile(null, null, null, null, null, null, null, null);
        assertEquals(Status.ALMOST, RuleEngine.evaluate(p, ujjwala).status());
    }
}
