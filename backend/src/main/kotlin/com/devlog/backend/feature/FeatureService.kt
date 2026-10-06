package com.devlog.backend.feature

import org.springframework.stereotype.Service

@Service
class FeatureService(
    private val featureRepository: FeatureRepository
) {

    fun findByProjectId(projectId: Long): List<Feature> {
        return featureRepository.findAllByProjectId(projectId)
    }

    fun findById(id: Long): Feature {
        return featureRepository.findById(id)
            .orElseThrow {
                IllegalArgumentException("Feature not found: $id")
            }
    }

    fun create(feature: Feature): Feature {
        return featureRepository.save(feature)
    }

    fun delete(id: Long) {
        featureRepository.deleteById(id)
    }
}