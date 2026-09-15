package com.devlog.backend.auth.dto

data class ChangeAdminPasswordRequest(
    val currentPassword: String,
    val newPassword: String
)