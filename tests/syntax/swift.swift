import Foundation

struct User {
    let name: String
    var active: Bool
}

func greet(_ user: User) -> String {
    let message = "Hello, \(user.name)"
    return user.active ? message : "Inactive"
}
