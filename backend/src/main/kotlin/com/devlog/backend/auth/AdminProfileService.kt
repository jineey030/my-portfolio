package com.devlog.backend.auth

import com.devlog.backend.auth.dto.AdminProfileResponse
import com.devlog.backend.auth.dto.ChangeAdminPasswordRequest
import com.devlog.backend.auth.dto.UpdateAdminProfileRequest
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AdminProfileService(
    private val adminUserRepository: AdminUserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun getProfile(
        username: String
    ): AdminProfileResponse {

        val adminUser =
            adminUserRepository.findByUsername(username)
                ?: throw IllegalArgumentException(
                    "관리자 정보를 찾을 수 없습니다."
                )

        return AdminProfileResponse(
            username = adminUser.username,
            role = adminUser.role
        )
    }

    fun updateProfile(
        currentUsername: String,
        request: UpdateAdminProfileRequest
    ): AdminProfileResponse {

        val adminUser =
            adminUserRepository.findByUsername(currentUsername)
                ?: throw IllegalArgumentException(
                    "관리자 정보를 찾을 수 없습니다."
                )

        val existingUser =
            adminUserRepository.findByUsername(request.username)

        if (
            existingUser != null &&
            existingUser.id != adminUser.id
        ) {
            throw IllegalArgumentException(
                "이미 사용 중인 아이디입니다."
            )
        }

        val updatedUser = AdminUser(
            id = adminUser.id,
            username = request.username,
            password = adminUser.password,
            role = adminUser.role
        )

        val savedUser =
            adminUserRepository.save(updatedUser)

        return AdminProfileResponse(
            username = savedUser.username,
            role = savedUser.role
        )
    }

    fun changePassword(
        username: String,
        request: ChangeAdminPasswordRequest
    ) {

        val adminUser =
            adminUserRepository.findByUsername(username)
                ?: throw IllegalArgumentException(
                    "관리자 정보를 찾을 수 없습니다."
                )

        if (
            !passwordEncoder.matches(
                request.currentPassword,
                adminUser.password
            )
        ) {
            throw IllegalArgumentException(
                "현재 비밀번호가 올바르지 않습니다."
            )
        }

        if (request.newPassword.length < 8) {
            throw IllegalArgumentException(
                "새 비밀번호는 8자 이상이어야 합니다."
            )
        }

        val encodedPassword = passwordEncoder.encode(request.newPassword)

        if (encodedPassword == null) {
            throw IllegalStateException("비밀번호 암호화에 실패했습니다.")
        }

        val updatedUser = AdminUser(
            id = adminUser.id,
            username = adminUser.username,
            password = encodedPassword,
            role = adminUser.role
        )

        adminUserRepository.save(updatedUser)
    }
}