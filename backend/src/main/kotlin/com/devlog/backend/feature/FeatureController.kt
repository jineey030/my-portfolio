package com.devlog.backend.feature

import com.devlog.backend.project.ProjectRepository
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/projects/{projectId}/features")
class FeatureController(
    private val featureService: FeatureService,
    private val projectRepository: ProjectRepository
) {

    @GetMapping
    fun getFeatures(
        @PathVariable projectId: Long
    ): List<FeatureResponse> {
        return featureService.findByProjectId(projectId)
            .map {
                FeatureResponse(
                    id = it.id,
                    name = it.name
                )
            }
    }

    @PostMapping
    fun createFeature(
        @PathVariable projectId: Long,
        @RequestBody request: FeatureRequest
    ): FeatureResponse {

        val project = projectRepository.findById(projectId)
            .orElseThrow {
                IllegalArgumentException(
                    "Project not found: $projectId"
                )
            }

        val feature = Feature(
            name = request.name,
            project = project
        )

        val savedFeature =
            featureService.create(feature)

        return FeatureResponse(
            id = savedFeature.id,
            name = savedFeature.name
        )
    }

    @DeleteMapping("/{featureId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteFeature(
        @PathVariable projectId: Long,
        @PathVariable featureId: Long
    ) {
        featureService.delete(featureId)
    }
}
