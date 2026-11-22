package com.adhikarsetu.util;

public final class Languages {
    private Languages() {}
    public static String name(String code) {
        if (code == null) return "English";
        return switch (code.toLowerCase()) {
            case "hi" -> "Hindi";
            case "te" -> "Telugu";
            case "ta" -> "Tamil";
            case "kn" -> "Kannada";
            case "ml" -> "Malayalam";
            case "mr" -> "Marathi";
            case "bn" -> "Bengali";
            case "gu" -> "Gujarati";
            case "pa" -> "Punjabi";
            case "or" -> "Odia";
            case "ur" -> "Urdu";
            default -> "English";
        };
    }
}
