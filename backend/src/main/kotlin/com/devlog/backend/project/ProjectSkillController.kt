package com.devlog.backend.project

import com.devlog.backend.project.dto.CreateProjectSkillRequest
import com.devlog.backend.project.dto.ProjectSkillResponse
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/projects/{projectId}/skills")
class ProjectSkillController(
    private val projectSkillService: ProjectSkillService
) {

    @GetMapping
    fun getProjectSkills(
        @PathVariable projectId: Long
    ): List<ProjectSkillResponse> {

        return projectSkillService
            .getSkillsByProject(projectId)
            .map { projectSkill ->

                ProjectSkillResponse(
                    id = projectSkill.skill.id!!,
                    name = projectSkill.skill.name
                )
            }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createAndAddSkill(
        @PathVariable projectId: Long,
        @RequestBody request: CreateProjectSkillRequest
    ): ProjectSkillResponse {

        val projectSkill =
            projectSkillService.createAndAddSkillToProject(
                projectId = projectId,
                name = request.name
            )

        return ProjectSkillResponse(
            id = projectSkill.skill.id!!,
            name = projectSkill.skill.name
        )
    }

    @PostMapping("/{skillId}")
    @ResponseStatus(HttpStatus.CREATED)
    fun addSkillToProject(
        @PathVariable projectId: Long,
        @PathVariable skillId: Long
    ): ProjectSkillResponse {

        val projectSkill =
            projectSkillService.addSkillToProject(
                projectId = projectId,
                skillId = skillId
            )

        return ProjectSkillResponse(
            id = projectSkill.skill.id!!,
            name = projectSkill.skill.name
        )
    }

    @DeleteMapping("/{skillId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun removeSkillFromProject(
        @PathVariable projectId: Long,
        @PathVariable skillId: Long
    ) {

        projectSkillService.removeSkillFromProject(
            projectId = projectId,
            skillId = skillId
        )
    }
}