package com.adhikarsetu.rules;

import java.util.List;

public record Evaluation(Status status, List<Reason> reasons) {}
