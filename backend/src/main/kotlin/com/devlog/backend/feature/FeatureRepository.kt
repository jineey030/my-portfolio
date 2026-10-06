package com.devlog.backend.feature

import org.springframework.data.jpa.repository.JpaRepository

interface FeatureRepository : JpaRepository<Feature, Long> {

    fun findAllByProjectId(projectId: Long): List<Feature>
}