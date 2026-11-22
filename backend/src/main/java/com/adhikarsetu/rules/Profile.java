package com.adhikarsetu.rules;

/** What the user told us. All fields optional: missing answers become "unknown", never a guess. */
public record Profile(Integer age, String gender, String area, String occupation,
                      Boolean ownsLand, Boolean hasDisability, Integer incomeMin, Integer incomeMax) {}
