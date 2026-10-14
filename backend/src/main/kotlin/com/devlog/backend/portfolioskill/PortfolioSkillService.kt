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
            .map { skill ->
                PortfolioSkillResponse(
                    id = requireNotNull(skill.id),
                    category = skill.category.trim().ifBlank { "Etc" },
                    name = skill.name
                )
            }
            .sortedWith(
                compareBy(
                    { categoryOrder(it.category) },
                    { it.category },
                    { it.name.lowercase() }
                )
            )
    }

    private fun categoryOrder(category: String): Int {
        val index = CATEGORY_ORDER.indexOf(category)
        return if (index >= 0) index else CATEGORY_ORDER.size
    }

    companion object {
        private val CATEGORY_ORDER = listOf("Frontend", "Backend", "DB", "Infra")
    }
}
