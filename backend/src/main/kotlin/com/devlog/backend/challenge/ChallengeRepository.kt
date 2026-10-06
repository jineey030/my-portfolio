package com.devlog.backend.challenge

import org.springframework.data.jpa.repository.JpaRepository

interface ChallengeRepository : JpaRepository<Challenge, Long> {

    fun findAllByProjectId(projectId: Long): List<Challenge>
}