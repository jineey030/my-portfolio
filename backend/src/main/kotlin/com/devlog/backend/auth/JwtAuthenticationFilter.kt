package com.devlog.backend.auth

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }

        val token = authHeader.substring(7)

        try {
            val username = jwtService.extractUsername(token)

            if (
                username != null &&
                SecurityContextHolder.getContext().authentication == null
            ) {
                if (jwtService.isTokenValid(token, username)) {

                    val authentication =
                        UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            emptyList()
                        )

                    authentication.details =
                        WebAuthenticationDetailsSource()
                            .buildDetails(request)

                    SecurityContextHolder
                        .getContext()
                        .authentication = authentication
                }
            }
        } catch (e: Exception) {
            // 유효하지 않은 JWT는 인증하지 않고 다음 필터로 넘긴다.
        }

        filterChain.doFilter(request, response)
    }
}
