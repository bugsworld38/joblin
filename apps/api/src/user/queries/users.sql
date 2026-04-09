/* @name FindUserById */
SELECT * FROM users WHERE id = :id;

/* @name FindUserByEmail */
SELECT * FROM users WHERE email = :email;

/* @name CreateUser */
INSERT INTO users (email, password_hash)
VALUES (:email, :passwordHash)
RETURNING *;
