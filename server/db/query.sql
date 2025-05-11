-- name: ListUsers :many
SELECT * FROM user LIMIT 10;

-- name: GetUserByEmail :one
SELECT * FROM "User" WHERE email = $1;

-- name: GetUserById :one
SELECT * FROM "User" WHERE id = $1;

-- name: AddUser :one
INSERT INTO "User" (email, name, password) VALUES ($1, $2, $3)
RETURNING *;

-- name: CreateSession :one
INSERT INTO "Session" (sessionToken, refreshtoken, expires_at, user_id) VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: DeleteSession :one
DELETE FROM "Session" WHERE sessiontoken = $1
RETURNING *;

-- name: GetSessionUser :one
SELECT * FROM "User" WHERE id = (SELECT user_id FROM "Session" WHERE sessionToken = $1);

-- name: UpdateSession :one
UPDATE "Session" SET sessionToken = $1, refreshToken = $2, expires_at = $3 WHERE refreshtoken = $4
RETURNING *;