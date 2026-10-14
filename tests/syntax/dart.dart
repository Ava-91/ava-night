class User {
  const User(this.name, {this.active = true});
  final String name;
  final bool active;
}

String greet(User user) {
  final message = 'Hello, ${user.name}';
  return user.active ? message : 'Inactive';
}
