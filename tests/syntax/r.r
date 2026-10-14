user <- list(name = "Ava", active = TRUE)

greet <- function(user) {
  message <- sprintf("Hello, %s", user$name)
  if (user$active) message else "Inactive"
}

print(greet(user))
