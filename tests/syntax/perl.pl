use strict;
use warnings;

sub greet {
    my ($user) = @_;
    my $message = "Hello, $user->{name}";
    return $user->{active} ? $message : "Inactive";
}

print greet({ name => "Ava", active => 1 });
