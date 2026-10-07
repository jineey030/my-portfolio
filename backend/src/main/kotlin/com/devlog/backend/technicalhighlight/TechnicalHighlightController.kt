package com.devlog.backend.technicalhighlight

import com.devlog.backend.project.ProjectRepository
import org.springframework.web.bind.annotation.*
import org.springframework.http.HttpStatus

@RestController
@RequestMapping(
    "/api/projects/{projectId}/technical-highlights"
)
class TechnicalHighlightController(
    private val technicalHighlightService: TechnicalHighlightService,
    private val projectRepository: ProjectRepository
) {

    @GetMapping
    fun getTechnicalHighlights(
        @PathVariable projectId: Long
    ): List<TechnicalHighlightResponse> {

        return technicalHighlightService
            .findByProjectId(projectId)
            .map {
                TechnicalHighlightResponse(
                    id = it.id,
                    title = it.title,
                    description = it.description
                )
            }
    }

    @PostMapping
    fun createTechnicalHighlight(
        @PathVariable projectId: Long,
        @RequestBody request: TechnicalHighlightRequest
    ): TechnicalHighlightResponse {

        val project = projectRepository.findById(projectId)
            .orElseThrow {
                IllegalArgumentException(
                    "Project not found: $projectId"
                )
            }

        val technicalHighlight = TechnicalHighlight(
            title = request.title,
            description = request.description,
            project = project
        )

        val saved = technicalHighlightService.create(
            technicalHighlight
        )

        return TechnicalHighlightResponse(
            id = saved.id,
            title = saved.title,
            description = saved.description
        )
    }

    @DeleteMapping("/{technicalHighlightId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteTechnicalHighlight(
        @PathVariable projectId: Long,
        @PathVariable technicalHighlightId: Long
    ) {
        technicalHighlightService.delete(
            technicalHighlightId
        )
    }
}
