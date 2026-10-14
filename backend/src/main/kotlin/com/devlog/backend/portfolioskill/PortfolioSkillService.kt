
package com.devlog.backend.portfolioskill

import com.devlog.backend.project.ProjectSkillRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PortfolioSkillService(
    private val projectSkillRepository: ProjectSkillRepository
) {
    @Transactional(readOnly = true)
    fun getSkills(): List<PortfolioSkillResponse> {
        return projectSkillRepository.findAll()
            .map { it.skill }
            .distinctBy { it.id }
            .sortedWith(
                compareBy(
                    { it.category },
                    { it.name.lowercase() }
                )
            )
            .map { skill ->
                PortfolioSkillResponse(
                    id = requireNotNull(skill.id),
                    category = skill.category,
                    name = skill.name
                )
            }
    }
}
