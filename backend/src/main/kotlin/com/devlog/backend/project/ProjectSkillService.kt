package com.devlog.backend.project

import com.devlog.backend.skill.SkillRepository
import org.springframework.stereotype.Service

@Service
class ProjectSkillService(
    private val projectSkillRepository: ProjectSkillRepository,
    private val projectRepository: ProjectRepository,
    private val skillRepository: SkillRepository
) {

    fun getSkillsByProject(
        projectId: Long
    ): List<ProjectSkill> {

        if (!projectRepository.existsById(projectId)) {
            throw IllegalArgumentException(
                "Project not found: $projectId"
            )
        }

        return projectSkillRepository
            .findAllByProjectId(projectId)
    }

    fun addSkillToProject(
        projectId: Long,
        skillId: Long
    ): ProjectSkill {

        val project = projectRepository.findById(projectId)
            .orElseThrow {
                IllegalArgumentException(
                    "Project not found: $projectId"
                )
            }

        val skill = skillRepository.findById(skillId)
            .orElseThrow {
                IllegalArgumentException(
                    "Skill not found: $skillId"
                )
            }

        if (
            projectSkillRepository.existsByProjectIdAndSkillId(
                projectId,
                skillId
            )
        ) {
            throw IllegalArgumentException(
                "Skill is already connected to this project."
            )
        }

        val projectSkill = ProjectSkill(
            project = project,
            skill = skill
        )

        return projectSkillRepository.save(projectSkill)
    }

    fun removeSkillFromProject(
        projectId: Long,
        skillId: Long
    ) {

        val projectSkills =
            projectSkillRepository.findAllByProjectId(projectId)

        val projectSkill = projectSkills.find {
            it.skill.id == skillId
        } ?: throw IllegalArgumentException(
            "Project skill connection not found."
        )

        projectSkillRepository.delete(projectSkill)
    }
}