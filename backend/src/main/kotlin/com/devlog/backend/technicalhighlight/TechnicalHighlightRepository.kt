package com.devlog.backend.technicalhighlight

import org.springframework.data.jpa.repository.JpaRepository

interface TechnicalHighlightRepository :
    JpaRepository<TechnicalHighlight, Long> {

    fun findAllByProjectId(projectId: Long): List<TechnicalHighlight>
}