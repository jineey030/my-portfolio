package com.devlog.backend.skill

import org.springframework.data.jpa.repository.JpaRepository

interface SkillRepository : JpaRepository<Skill, Long> {

    fun findAllByOrderByIdDesc(): List<Skill>
}