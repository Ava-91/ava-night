import React, { useMemo, useState } from "react";

const DEFAULT_LABEL = "Ava Night";

export function ProfileCard({ user, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const displayName = user?.displayName ?? DEFAULT_LABEL;
  const className = expanded ? "profile profile--expanded" : "profile";
  const summary = useMemo(() => ({ id: user.id, displayName }), [user.id, displayName]);

  function handleClick(event) {
    event.preventDefault();
    setExpanded((previous) => !previous);
    onSelect?.(summary);
  }

  return (
    <article className={className} data-user-id={user.id}>
      <h2>{displayName}</h2>
      <p>{user.email ?? "No email supplied"}</p>
      <button type="button" aria-expanded={expanded} onClick={handleClick}>
        {expanded ? "Show less" : "Show more"}
      </button>
    </article>
  );
}
