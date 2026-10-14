type user = { name : string; active : bool }
let greet user =
  let message = "Hello, " ^ user.name in
  if user.active then message else "Inactive"
