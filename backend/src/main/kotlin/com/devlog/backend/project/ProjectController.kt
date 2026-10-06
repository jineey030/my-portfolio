package com.devlog.backend.project

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/projects")
class ProjectController(
    private val projectService: ProjectService
) {

    @GetMapping
    fun getProjects(): List<Project> {
        return projectService.getProjects()
    }

    @GetMapping("/{id}")
    fun getProject(
        @PathVariable id: Long
    ): Project {
        return projectService.getProject(id)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createProject(
        @RequestBody request: CreateProjectRequest
    ): Project {
        return projectService.createProject(
            name = request.name,
            description = request.description,
            githubUrl = request.githubUrl,
            deployUrl = request.deployUrl,
            imageUrl = request.imageUrl
        )
    }

    @PutMapping("/{id}")
    fun updateProject(
        @PathVariable id: Long,
        @RequestBody request: UpdateProjectRequest
    ): Project {
        return projectService.updateProject(
            id = id,
            name = request.name,
            description = request.description,
            githubUrl = request.githubUrl,
            deployUrl = request.deployUrl,
            imageUrl = request.imageUrl
        )
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteProject(
        @PathVariable id: Long
    ) {
        projectService.deleteProject(id)
    }
}

data class CreateProjectRequest(
    val name: String,
    val description: String,
    val githubUrl: String? = null,
    val deployUrl: String? = null,
    val imageUrl: String? = null
)

data class UpdateProjectRequest(
    val name: String,
    val description: String,
    val githubUrl: String? = null,
    val deployUrl: String? = null,
    val imageUrl: String? = null
)