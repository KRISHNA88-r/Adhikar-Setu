# Scheme verification checklist

For each scheme in `backend/src/main/resources/data/schemes.json`: open `officialUrl`, compare, fix the JSON, then set `"verified": true` and `"lastVerified": "YYYY-MM-DD"`.

| Field to compare | Why |
|---|---|
| benefit / annualValue | Amounts change; annualValue feeds the "yearly value" counter on the results page |
| minAge / maxAge / maxIncome | These drive the rules engine |
| occupations / gender / area / requiresLand | Same |
| documents / howToApply / deadline | Shown to the user and printed in the packet |

Schemes whose official eligibility comes from beneficiary lists (PM-JAY, PMAY-G, PM Ujjwala, NSAP pension) use an income value only as a screening proxy. Keep the `rulesNote` that says so.
