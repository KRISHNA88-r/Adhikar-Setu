package com.adhikarsetu.rules;

import java.util.Map;

/** A language-neutral reason. The frontend turns code + state + params into a sentence in the user's language. */
public record Reason(String code, String state, Map<String, String> params) {}
