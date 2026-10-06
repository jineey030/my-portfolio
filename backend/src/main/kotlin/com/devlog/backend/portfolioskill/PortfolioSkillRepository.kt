package com.devlog.backend.portfolioskill

import org.springframework.data.jpa.repository.JpaRepository

interface PortfolioSkillRepository :
    JpaRepository<PortfolioSkill, Long> {

    fun findAllByOrderByIdAsc(): List<PortfolioSkill>
}