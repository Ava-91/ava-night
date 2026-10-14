class User {
    String name
    boolean active = true
}
def greet(User user) {
    def message = "Hello, ${user.name}"
    user.active ? message : 'Inactive'
}
