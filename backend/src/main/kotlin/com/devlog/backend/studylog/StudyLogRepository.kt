package com.devlog.backend.studylog

import org.springframework.data.jpa.repository.JpaRepository

interface StudyLogRepository : JpaRepository<StudyLog, Long>