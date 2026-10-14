defmodule AvaNight do
  def greet(%{name: name, active: true}) do
    "Hello, #{name}"
  end

  def greet(_user), do: "Inactive"
end
