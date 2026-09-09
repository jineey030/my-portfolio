package com.devlog.backend.studylog

import org.springframework.stereotype.Service

@Service
class StudyLogService(
    private val studyLogRepository: StudyLogRepository
) {

    fun getStudyLogs(): List<StudyLog> {
        return studyLogRepository.findAll()
    }

    fun createStudyLog(
        date: String,
        content: String
    ): StudyLog {
        val studyLog = StudyLog(
            date = date,
            content = content
        )

        return studyLogRepository.save(studyLog)
    }
}