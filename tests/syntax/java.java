package dev.avanight;

import java.util.List;

public final class LanguageFixture {
    private final String name = "Ava Night";

    public String greet(String user, int count) {
        var values = List.of(user, name);
        if (count > 0) {
            return values.get(0) + " ✨";
        }
        return null;
    }
}
