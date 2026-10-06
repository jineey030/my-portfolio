package com.devlog.backend.technicalhighlight

import org.springframework.stereotype.Service

@Service
class TechnicalHighlightService(
    private val technicalHighlightRepository: TechnicalHighlightRepository
) {

    fun findByProjectId(
        projectId: Long
    ): List<TechnicalHighlight> {
        return technicalHighlightRepository
            .findAllByProjectId(projectId)
    }

    fun findById(id: Long): TechnicalHighlight {
        return technicalHighlightRepository.findById(id)
            .orElseThrow {
                IllegalArgumentException(
                    "Technical highlight not found: $id"
                )
            }
    }

    fun create(
        technicalHighlight: TechnicalHighlight
    ): TechnicalHighlight {
        return technicalHighlightRepository.save(
            technicalHighlight
        )
    }

    fun delete(id: Long) {
        technicalHighlightRepository.deleteById(id)
    }
}