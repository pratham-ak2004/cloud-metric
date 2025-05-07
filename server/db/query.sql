-- name: ListUsers :many
SELECT * FROM user LIMIT 10;

-- name: GetUserByEmail :one
SELECT * FROM "User" WHERE email = $1;

-- name: GetUserById :one
SELECT * FROM "User" WHERE id = $1;

-- name: AddUser :one
INSERT INTO "User" (email, name, password) VALUES ($1, $2, $3)
RETURNING *;