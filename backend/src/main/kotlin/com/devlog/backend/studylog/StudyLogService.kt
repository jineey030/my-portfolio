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

    fun deleteStudyLog(id: Long) {
        if (!studyLogRepository.existsById(id)) {
            throw IllegalArgumentException("Study Log not found: $id")
        }

        studyLogRepository.deleteById(id)
    }

    fun updateStudyLog(
        id: Long,
        date: String,
        content: String
    ): StudyLog {
        val studyLog = studyLogRepository.findById(id)
            .orElseThrow {
                IllegalArgumentException("Study Log not found: $id")
            }

        val updatedStudyLog = StudyLog(
            id = studyLog.id,
            date = date,
            content = content
        )

        return studyLogRepository.save(updatedStudyLog)
    }
}
