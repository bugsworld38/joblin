/* @name FindUserById */
SELECT
  id,
  email,
  password_hash AS "passwordHash",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM users WHERE id = :id;

/* @name FindUserByEmail */
SELECT
  id,
  email,
  password_hash AS "passwordHash",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM users WHERE email = :email;

/* @name CreateUser */
INSERT INTO users (email, password_hash)
VALUES (:email, :passwordHash)
RETURNING
  id,
  email,
  password_hash AS "passwordHash",
  created_at AS "createdAt",
  updated_at AS "updatedAt";
