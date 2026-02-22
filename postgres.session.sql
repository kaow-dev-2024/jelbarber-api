WITH dupes AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY name ORDER BY id ASC) AS rn
  FROM users
)
DELETE FROM users
WHERE id IN (
  SELECT id FROM dupes WHERE rn > 1
);
