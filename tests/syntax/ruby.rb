module AvaNight
  User = Data.define(:name, :active)

  def self.greet(user)
    message = "Hello, #{user.name}"
    user.active ? message : "Inactive"
  end
end
