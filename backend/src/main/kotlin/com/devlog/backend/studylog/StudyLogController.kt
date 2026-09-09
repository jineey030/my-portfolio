package com.devlog.backend.studylog

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

import com.devlog.backend.studylog.dto.CreateStudyLogRequest
import com.devlog.backend.studylog.dto.UpdateStudyLogRequest

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

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteStudyLog(
        @PathVariable id: Long
    ) {
        studyLogService.deleteStudyLog(id)
    }

    @PutMapping("/{id}")
    fun updateStudyLog(
        @PathVariable id: Long,
        @RequestBody request: UpdateStudyLogRequest
    ): StudyLog {
        return studyLogService.updateStudyLog(
            id = id,
            date = request.date,
            content = request.content
        )
    }
}
