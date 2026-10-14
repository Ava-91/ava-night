struct User
    name::String
    active::Bool
end

function greet(user::User)
    message = "Hello, $(user.name)"
    return user.active ? message : "Inactive"
end
