variable "environment" {
  type    = string
  default = "production"
}

resource "example_service" "app" {
  name    = "ava-night-${var.environment}"
  enabled = true
}
