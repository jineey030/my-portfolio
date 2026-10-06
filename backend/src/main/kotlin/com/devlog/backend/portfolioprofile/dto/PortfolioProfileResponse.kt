package com.devlog.backend.portfolioprofile

data class PortfolioProfileResponse(
    val id: Long,
    val name: String,
    val tagline: String,
    val email: String,
    val github: String,
    val velog: String,
    val aboutText: String
)