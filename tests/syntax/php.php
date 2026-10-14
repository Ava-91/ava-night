<?php
declare(strict_types=1);

final class User {
    public function __construct(
        public readonly string $name,
        public bool $active = true,
    ) {}
}

function greet(User $user): string {
    return $user->active ? "Hello, {$user->name}" : 'Inactive';
}
