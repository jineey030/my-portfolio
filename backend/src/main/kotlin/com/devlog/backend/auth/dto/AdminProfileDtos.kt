package com.devlog.backend.auth

data class AdminProfileResponse(
    val username: String,
    val role: String
)

data class UpdateAdminUsernameRequest(
    val username: String
)

data class UpdateAdminUsernameResponse(
    val username: String,
    val role: String,
    val token: String
)

data class UpdateAdminPasswordRequest(
    val currentPassword: String,
    val newPassword: String
)
