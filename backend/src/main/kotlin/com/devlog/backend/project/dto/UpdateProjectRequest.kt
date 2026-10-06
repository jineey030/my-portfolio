package com.devlog.backend.project.dto

data class UpdateProjectRequest(
    val name: String,
    val description: String,
    val githubUrl: String? = null,
    val deployUrl: String? = null,
    val imageUrl: String? = null,
    val role: String? = null
)