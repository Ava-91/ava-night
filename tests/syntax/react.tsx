import { useMemo, useState } from "react";

type Props<T> = {
  items: readonly T[];
  render: (item: T, index: number) => React.ReactNode;
  onSelect?: (item: T) => void;
};

export function List<T extends { id: string }>({ items, render, onSelect }: Props<T>) {
  const [selected, setSelected] = useState<string | null>(null);
  const count = useMemo(() => items.length, [items]);

  return (
    <section aria-label={`Items (${count})`}>
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className={selected === item.id ? "selected" : ""}
          onClick={() => {
            setSelected(item.id);
            onSelect?.(item);
          }}
        >
          {render(item, index)}
        </button>
      ))}
    </section>
  );
}

export const App = () => <List items={[{ id: "ava" }]} render={(item) => <strong>{item.id}</strong>} />;