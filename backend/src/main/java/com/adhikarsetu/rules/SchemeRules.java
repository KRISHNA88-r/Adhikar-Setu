package com.adhikarsetu.rules;

import java.util.List;

/** The machine-checkable part of a scheme's eligibility. Null / empty means "no such criterion". */
public record SchemeRules(Integer minAge, Integer maxAge, Integer maxIncome, List<String> occupations,
                          String gender, String area, boolean requiresLand, boolean requiresDisability) {}
