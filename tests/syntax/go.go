package theme

import (
	"context"
	"fmt"
)

type User struct {
	ID       string
	Name     string
	Metadata map[string]any
}

type Repository[T any] interface {
	Find(context.Context, string) (T, error)
}

type Service[T any] struct {
	repo Repository[T]
}

func (s *Service[T]) Load(ctx context.Context, id string) (T, error) {
	var zero T
	if id == "" {
		return zero, fmt.Errorf("missing id")
	}
	return s.repo.Find(ctx, id)
}

func main() {
	ctx := context.Background()
	ch := make(chan string, 2)
	go func() { ch <- "Ava Night" }()
	go func() { ch <- "1.3.0" }()
	fmt.Println(ctx, <-ch, <-ch)
}