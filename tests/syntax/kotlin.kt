package dev.avanight

data class User(val name: String, val active: Boolean = true)

fun greet(user: User): String {
    val message = "Hello, ${user.name}"
    return if (user.active) message else "Inactive"
}
