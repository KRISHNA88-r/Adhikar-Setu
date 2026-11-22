package com.adhikarsetu.rules;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ScamShieldTest {
    @Test void officialLinkOnlyIsLow() {
        var r = ScamShield.check("Check your status at https://pmkisan.gov.in");
        assertEquals("LOW", r.level());
        assertTrue(r.links().get(0).official());
    }
    @Test void feeAndShortLinkIsHigh() {
        var r = ScamShield.check("PM Yojana approved! Pay registration fee Rs 500 within 24 hours: bit.ly/abc123");
        assertEquals("HIGH", r.level());
    }
    @Test void otpRequestIsHigh() {
        var r = ScamShield.check("Your KYC will expire. Share your OTP now https://gov-kyc-update.com");
        assertEquals("HIGH", r.level());
    }
    @Test void govInAsSubdomainOfEvilSiteIsNotOfficial() {
        assertEquals(false, ScamShield.isOfficialHost("pmkisan.gov.in.evil.com"));
        assertEquals(true, ScamShield.isOfficialHost("pmkisan.gov.in"));
    }
    @Test void userInfoTrickIsNotOfficial() {
        var r = ScamShield.check("Open http://pmkisan.gov.in@evil.com/claim");
        assertEquals(false, r.links().get(0).official());
    }
    @Test void plainTextWithoutFlagsIsLow() {
        assertEquals("LOW", ScamShield.check("Please carry your land record to the office on Monday.").level());
    }
}
