package com.devlog.backend.auth

data class LoginRequest(
    val username: String,
    val password: String
)
