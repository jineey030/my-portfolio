package com.devlog.backend.project.dto

import com.devlog.backend.project.ProjectSkill

data class ProjectSkillResponse(
    val id: Long,
    val name: String,
    val category: String
) {
    companion object {
        fun from(projectSkill: ProjectSkill): ProjectSkillResponse =
            ProjectSkillResponse(
                id = requireNotNull(projectSkill.skill.id),
                name = projectSkill.skill.name,
                category = projectSkill.skill.category
            )
    }
}
