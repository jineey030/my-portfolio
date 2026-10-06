package com.devlog.backend.project

import org.springframework.stereotype.Service

@Service
class ProjectService(
    private val projectRepository: ProjectRepository
) {

    fun getProjects(): List<Project> {
        return projectRepository.findAllByOrderByIdDesc()
    }

    fun getProject(id: Long): Project {
        return projectRepository.findById(id)
            .orElseThrow {
                IllegalArgumentException("Project not found: $id")
            }
    }

    fun createProject(
        name: String,
        description: String,
        githubUrl: String?,
        deployUrl: String?,
        imageUrl: String?,
        role: String?
    ): Project {
        val project = Project(
            name = name,
            description = description,
            githubUrl = githubUrl,
            deployUrl = deployUrl,
            imageUrl = imageUrl,
            role = role
        )

        return projectRepository.save(project)
    }

    fun updateProject(
        id: Long,
        name: String,
        description: String,
        githubUrl: String?,
        deployUrl: String?,
        imageUrl: String?,
        role : String?
    ): Project {
        val project = projectRepository.findById(id)
            .orElseThrow {
                IllegalArgumentException("Project not found: $id")
            }

        project.name = name
        project.description = description
        project.githubUrl = githubUrl
        project.deployUrl = deployUrl
        project.imageUrl = imageUrl
        project.role = role

        return projectRepository.save(project)
    }

    fun deleteProject(id: Long) {
        if (!projectRepository.existsById(id)) {
            throw IllegalArgumentException("Project not found: $id")
        }

        projectRepository.deleteById(id)
    }
}
