/* @name FindRefreshTokenByTokenHash */
SELECT *
FROM refresh_tokens
WHERE token_hash = :tokenHash;

/* @name CreateRefreshToken */
INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
VALUES (:userId, :tokenHash, :expiresAt)
RETURNING *;

/* @name RevokeRefreshToken */
UPDATE refresh_tokens
SET is_revoked = true, updated_at = now()
WHERE token_hash = :tokenHash;
