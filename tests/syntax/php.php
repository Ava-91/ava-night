<?php
declare(strict_types=1);

final class User {
    public function __construct(
        public readonly string $name,
        public bool $active = true,
    ) {}
}

function greet(User $user): string {
    $message = "Hello, {$user->name}";
    return $user->active ? $message : 'Inactive';
}
