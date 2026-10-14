module AvaNight where

data User = User { name :: String, active :: Bool }

greet :: User -> String
greet (User userName isActive) =
  let message = "Hello, " ++ userName
  in if isActive then message else "Inactive"
