package com.devlog.backend.project

import com.devlog.backend.project.dto.CreateProjectRequest
import com.devlog.backend.project.dto.UpdateProjectRequest
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
            imageUrl = request.imageUrl,
            role = request.role
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
            imageUrl = request.imageUrl,
            role = request.role
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
