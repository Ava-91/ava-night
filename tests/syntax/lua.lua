local User = { name = "Ava", active = true }

local function greet(user)
  local message = "Hello, " .. user.name
  if user.active then
    return message
  end
  return "Inactive"
end

print(greet(User))
