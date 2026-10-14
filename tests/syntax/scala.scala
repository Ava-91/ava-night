final case class User(name: String, active: Boolean = true)

object AvaNight {
  def greet(user: User): String = {
    val message = s"Hello, ${user.name}"
    if (user.active) message else "Inactive"
  }
}
