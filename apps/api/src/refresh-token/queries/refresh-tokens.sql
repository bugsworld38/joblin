/* @name FindRefreshTokenByTokenHash */
SELECT
  id,
  user_id AS "userId",
  token_hash AS "tokenHash",
  is_revoked AS "isRevoked",
  expires_at AS "expiresAt",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM refresh_tokens
WHERE token_hash = :tokenHash;

/* @name CreateRefreshToken */
INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
VALUES (:userId, :tokenHash, :expiresAt)
RETURNING
  id,
  user_id AS "userId",
  token_hash AS "tokenHash",
  is_revoked AS "isRevoked",
  expires_at AS "expiresAt",
  created_at AS "createdAt",
  updated_at AS "updatedAt";

/* @name RevokeRefreshToken */
UPDATE refresh_tokens
SET is_revoked = true, updated_at = now()
WHERE token_hash = :tokenHash;
