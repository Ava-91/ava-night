param([string]$Name = "Ava")

$active = $true
$message = "Hello, $Name"

if ($active) {
    Write-Output $message
} else {
    Write-Output 'Inactive'
}
