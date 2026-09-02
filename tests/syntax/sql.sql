WITH recent_users AS (
  SELECT
    id,
    name,
    created_at,
    CASE WHEN active = TRUE THEN 'active' ELSE 'inactive' END AS state
  FROM users
  WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
), ranked AS (
  SELECT
    id,
    name,
    state,
    ROW_NUMBER() OVER (PARTITION BY state ORDER BY created_at DESC) AS rank
  FROM recent_users
)
SELECT r.id, r.name, r.state, p.total
FROM ranked AS r
LEFT JOIN (
  SELECT user_id, SUM(amount) AS total
  FROM payments
  GROUP BY user_id
) AS p ON p.user_id = r.id
WHERE r.rank <= 10
ORDER BY p.total DESC NULLS LAST;