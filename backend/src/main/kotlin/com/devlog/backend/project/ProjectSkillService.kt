
package com.devlog.backend.project

import com.devlog.backend.skill.Skill
import com.devlog.backend.skill.SkillRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProjectSkillService(
    private val projectSkillRepository: ProjectSkillRepository,
    private val projectRepository: ProjectRepository,
    private val skillRepository: SkillRepository
) {
    @Transactional(readOnly = true)
    fun getSkillsByProject(projectId: Long): List<ProjectSkill> {
        if (!projectRepository.existsById(projectId)) {
            throw IllegalArgumentException("Project not found: $projectId")
        }

        return projectSkillRepository.findAllByProjectId(projectId)
    }

    @Transactional
    fun addSkillToProject(
        projectId: Long,
        skillId: Long
    ): ProjectSkill {
        val project = projectRepository.findById(projectId).orElseThrow {
            IllegalArgumentException("Project not found: $projectId")
        }

        val skill = skillRepository.findById(skillId).orElseThrow {
            IllegalArgumentException("Skill not found: $skillId")
        }

        if (projectSkillRepository.existsByProjectIdAndSkillId(projectId, skillId)) {
            throw IllegalArgumentException(
                "Skill is already connected to this project."
            )
        }

        return projectSkillRepository.save(
            ProjectSkill(
                project = project,
                skill = skill
            )
        )
    }

    @Transactional
    fun createAndAddSkillToProject(
        projectId: Long,
        name: String,
        category: String
    ): ProjectSkill {
        val project = projectRepository.findById(projectId).orElseThrow {
            IllegalArgumentException("Project not found: $projectId")
        }

        val trimmedName = name.trim()
        val trimmedCategory = category.trim()

        require(trimmedName.isNotBlank()) {
            "Skill name cannot be blank."
        }

        require(trimmedCategory.isNotBlank()) {
            "Skill category cannot be blank."
        }

        val skill = skillRepository.findByName(trimmedName)
            ?: skillRepository.save(
                Skill(
                    name = trimmedName,
                    category = trimmedCategory
                )
            )

        val skillId = requireNotNull(skill.id) {
            "Saved skill has no ID."
        }

        if (projectSkillRepository.existsByProjectIdAndSkillId(projectId, skillId)) {
            throw IllegalArgumentException(
                "Skill is already connected to this project."
            )
        }

        return projectSkillRepository.save(
            ProjectSkill(
                project = project,
                skill = skill
            )
        )
    }

    @Transactional
    fun removeSkillFromProject(
        projectId: Long,
        skillId: Long
    ) {
        val projectSkill = projectSkillRepository
            .findAllByProjectId(projectId)
            .find { it.skill.id == skillId }
            ?: throw IllegalArgumentException(
                "Project skill connection not found."
            )

        projectSkillRepository.delete(projectSkill)
    }
}
