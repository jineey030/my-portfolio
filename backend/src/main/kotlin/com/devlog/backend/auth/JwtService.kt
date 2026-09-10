package com.devlog.backend.auth

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets
import java.util.Date
import javax.crypto.SecretKey

@Service
class JwtService {

    private val secret = "devlog-admin-jwt-secret-key-change-this-later"

    private val secretKey: SecretKey =
        Keys.hmacShaKeyFor(
            secret.toByteArray(StandardCharsets.UTF_8)
        )

    private val expiration = 1000L * 60 * 60 * 24

    fun generateToken(username: String): String {
        val now = Date()

        return Jwts.builder()
            .subject(username)
            .issuedAt(now)
            .expiration(
                Date(now.time + expiration)
            )
            .signWith(secretKey)
            .compact()
    }
}
