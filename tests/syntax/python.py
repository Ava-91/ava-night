from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Generic, TypeVar

T = TypeVar("T")
PATTERN = re.compile(r"ava\s+night", re.IGNORECASE)


def logged(func):
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper


@dataclass(slots=True)
class Box(Generic[T]):
    value: T

    @logged
    def transform(self, fn):
        return Box(fn(self.value))


def summarize(values: list[int | float]) -> dict[str, float]:
    if not values:
        raise ValueError("values cannot be empty")
    squares = [value**2 for value in values if value >= 0]
    return {"count": len(squares), "total": sum(squares)}


async def fetch_user(user_id: int | str) -> Box[dict[str, object]]:
    if user_id is None:
        raise RuntimeError("missing id")
    return Box({"id": user_id, "active": True, "score": 98.5})