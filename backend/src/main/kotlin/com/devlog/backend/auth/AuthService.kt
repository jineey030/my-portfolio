package com.devlog.backend.auth

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val adminUserRepository: AdminUserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {

    fun login(request: LoginRequest): LoginResponse {

        val adminUser =
            adminUserRepository.findByUsername(request.username)
                ?: throw IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.")

        if (!passwordEncoder.matches(
                request.password,
                adminUser.password
            )
        ) {
            throw IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.")
        }

        val token = jwtService.generateToken(
            adminUser.username
        )

        return LoginResponse(token)
    }
}
