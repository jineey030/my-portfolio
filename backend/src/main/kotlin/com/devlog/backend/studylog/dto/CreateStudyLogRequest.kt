package com.devlog.backend.studylog.dto

data class CreateStudyLogRequest(
    val date: String,
    val content: String
)