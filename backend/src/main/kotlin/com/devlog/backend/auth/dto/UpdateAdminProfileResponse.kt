package com.devlog.backend.auth.dto

data class UpdateAdminProfileResponse(
    val username: String,
    val role: String,
    val token: String
)