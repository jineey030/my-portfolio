package com.devlog.backend.project

import com.devlog.backend.project.dto.CreateProjectSkillRequest
import com.devlog.backend.project.dto.ProjectSkillResponse
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

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
                ProjectSkillResponse.from(projectSkill)
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
                name = request.name,
                category = request.category
            )

        return ProjectSkillResponse.from(projectSkill)
    }

    @PostMapping("/{skillId}")
    @ResponseStatus(HttpStatus.CREATED)
    fun addSkillToProject(
        @PathVariable projectId: Long,
        @PathVariable skillId: Long
    ): ProjectSkillResponse {
        val projectSkill =
            projectSkillService.addSkillToProject(projectId, skillId)

        return ProjectSkillResponse.from(projectSkill)
    }

    @DeleteMapping("/{skillId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun removeSkillFromProject(
        @PathVariable projectId: Long,
        @PathVariable skillId: Long
    ) {
        projectSkillService.removeSkillFromProject(projectId, skillId)
    }
}
