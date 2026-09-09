package com.devlog.backend.studylog

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/study-logs")
class StudyLogController(
    private val studyLogService: StudyLogService
) {

    @GetMapping
    fun getStudyLogs(): List<StudyLog> {
        return studyLogService.getStudyLogs()
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createStudyLog(
        @RequestBody request: CreateStudyLogRequest
    ): StudyLog {
        return studyLogService.createStudyLog(
            date = request.date,
            content = request.content
        )
    }
}

data class CreateStudyLogRequest(
    val date: String,
    val content: String
)