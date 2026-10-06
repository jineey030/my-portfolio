package com.devlog.backend.challenge

import org.springframework.stereotype.Service

@Service
class ChallengeService(
    private val challengeRepository: ChallengeRepository
) {

    fun findByProjectId(projectId: Long): List<Challenge> {
        return challengeRepository.findAllByProjectId(projectId)
    }

    fun findById(id: Long): Challenge {
        return challengeRepository.findById(id)
            .orElseThrow {
                IllegalArgumentException("Challenge not found: $id")
            }
    }

    fun create(challenge: Challenge): Challenge {
        return challengeRepository.save(challenge)
    }

    fun delete(id: Long) {
        challengeRepository.deleteById(id)
    }
}