package com.devlog.backend.portfolioprofile

data class PortfolioProfileRequest(
    val name: String,
    val tagline: String,
    val email: String,
    val github: String,
    val velog: String,
    val aboutText: String
)