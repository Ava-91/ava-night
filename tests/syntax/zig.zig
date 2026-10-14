const std = @import("std");
pub fn main() !void {
    const name = "Ava Night";
    std.debug.print("Hello, {s}!\n", .{name});
}
