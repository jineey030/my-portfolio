package com.devlog.backend.studylog.dto

data class UpdateStudyLogRequest(
    val date: String,
    val content: String
)