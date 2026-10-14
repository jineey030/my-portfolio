package com.devlog.backend.project

import com.devlog.backend.challenge.ChallengeRepository
import com.devlog.backend.feature.FeatureRepository
import com.devlog.backend.technicalhighlight.TechnicalHighlightRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProjectService(
    private val projectRepository: ProjectRepository,
    private val challengeRepository: ChallengeRepository,
    private val featureRepository: FeatureRepository,
    private val technicalHighlightRepository: TechnicalHighlightRepository
) {

    fun getProjects(): List<Project> {
        return projectRepository.findAllByOrderByIdDesc()
    }

    fun getProjectBySlug(slug: String): Project {
        return projectRepository.findBySlug(slug)
            ?: throw IllegalArgumentException("Project not found: $slug")
    }

    fun getProject(id: Long): Project {
        return projectRepository.findById(id)
            .orElseThrow {
                IllegalArgumentException("Project not found: $id")
            }
    }

    fun createProject(
        name: String,
        slug: String,
        description: String,
        githubUrl: String?,
        deployUrl: String?,
        imageUrl: String?,
        role: String?
    ): Project {
        val project = Project(
            name = name,
            slug = slug,
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
        slug: String,
        description: String,
        githubUrl: String?,
        deployUrl: String?,
        imageUrl: String?,
        role: String?
    ): Project {
        val project = projectRepository.findById(id)
            .orElseThrow {
                IllegalArgumentException("Project not found: $id")
            }

        project.name = name
        project.slug = slug
        project.description = description
        project.githubUrl = githubUrl
        project.deployUrl = deployUrl
        project.imageUrl = imageUrl
        project.role = role

        return projectRepository.save(project)
    }

    @Transactional
    fun deleteProject(id: Long) {
        val project = projectRepository.findById(id)
            .orElseThrow {
                IllegalArgumentException("Project not found: $id")
            }

        challengeRepository.deleteAllByProjectId(id)
        featureRepository.deleteAllByProjectId(id)
        technicalHighlightRepository.deleteAllByProjectId(id)
        
        projectRepository.delete(project)
    }
}
