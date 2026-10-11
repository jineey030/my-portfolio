package com.devlog.backend.auth

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/profile")
class AdminProfileController(
    private val adminUserRepository: AdminUserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {

    private fun getAdmin(
        authorization: String?
    ): AdminUser? {
        if (authorization.isNullOrBlank()) {
            return null
        }

        if (!authorization.startsWith("Bearer ")) {
            return null
        }

        val token = authorization.removePrefix("Bearer ").trim()
        val username = jwtService.extractUsername(token)
            ?: return null

        if (!jwtService.isTokenValid(token, username)) {
            return null
        }

        return adminUserRepository.findByUsername(username)
    }

    @GetMapping
    fun getProfile(
        @RequestHeader("Authorization", required = false)
        authorization: String?
    ): ResponseEntity<Any> {
        val admin = getAdmin(authorization)
            ?: return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("message" to "인증이 필요합니다."))

        return ResponseEntity.ok(
            AdminProfileResponse(
                username = admin.username,
                role = admin.role
            )
        )
    }

    @PutMapping
    fun updateUsername(
        @RequestHeader("Authorization", required = false)
        authorization: String?,
        @RequestBody request: UpdateAdminUsernameRequest
    ): ResponseEntity<Any> {
        val admin = getAdmin(authorization)
            ?: return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("message" to "인증이 필요합니다."))

        val newUsername = request.username.trim()

        if (newUsername.isBlank()) {
            return ResponseEntity.badRequest()
                .body(mapOf("message" to "Username을 입력해주세요."))
        }

        if (newUsername == admin.username) {
            return ResponseEntity.badRequest()
                .body(mapOf("message" to "현재 Username과 동일합니다."))
        }

        if (adminUserRepository.findByUsername(newUsername) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(mapOf("message" to "이미 사용 중인 Username입니다."))
        }

        admin.username = newUsername
        val savedAdmin = adminUserRepository.save(admin)

        val newToken = jwtService.generateToken(savedAdmin.username)

        return ResponseEntity.ok(
            UpdateAdminUsernameResponse(
                username = savedAdmin.username,
                role = savedAdmin.role,
                token = newToken
            )
        )
    }

    @PutMapping("/password")
    fun updatePassword(
        @RequestHeader("Authorization", required = false)
        authorization: String?,
        @RequestBody request: UpdateAdminPasswordRequest
    ): ResponseEntity<Any> {
        val admin = getAdmin(authorization)
            ?: return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("message" to "인증이 필요합니다."))

        if (!passwordEncoder.matches(
                request.currentPassword,
                admin.password
            )
        ) {
            return ResponseEntity.badRequest()
                .body(mapOf("message" to "현재 비밀번호가 올바르지 않습니다."))
        }

        if (request.newPassword.length < 8) {
            return ResponseEntity.badRequest()
                .body(mapOf("message" to "새 비밀번호는 8자 이상이어야 합니다."))
        }

        if (request.currentPassword == request.newPassword) {
            return ResponseEntity.badRequest()
                .body(mapOf("message" to "현재 비밀번호와 다른 비밀번호를 입력해주세요."))
        }

        admin.password = passwordEncoder.encode(request.newPassword)
        adminUserRepository.save(admin)

        return ResponseEntity.ok(
            mapOf("message" to "비밀번호가 변경되었습니다.")
        )
    }
}
