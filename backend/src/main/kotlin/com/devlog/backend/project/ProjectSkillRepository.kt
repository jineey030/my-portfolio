package com.devlog.backend.project

import org.springframework.data.jpa.repository.JpaRepository

interface ProjectSkillRepository : JpaRepository<ProjectSkill, Long> {

    fun findAllByProjectId(projectId: Long): List<ProjectSkill>

    fun deleteAllByProjectId(projectId: Long)

    fun existsByProjectIdAndSkillId(
        projectId: Long,
        skillId: Long
    ): Boolean
}
