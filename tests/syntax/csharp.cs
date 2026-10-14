using System;
using System.Collections.Generic;

namespace AvaNight;

public sealed class LanguageFixture(string name)
{
    public string Name { get; } = name;

    public string Greet(string user, int count) =>
        count > 0 ? $"Hello, {user} — {Name}" : string.Empty;
}
