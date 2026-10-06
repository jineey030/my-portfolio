package com.devlog.backend.portfolioskill

import org.springframework.stereotype.Service

@Service
class PortfolioSkillService(
    private val portfolioSkillRepository: PortfolioSkillRepository
) {

    fun getSkills(): List<PortfolioSkill> {
        return portfolioSkillRepository.findAllByOrderByIdAsc()
    }
}