package com.devlog.backend.challenge

import com.devlog.backend.project.ProjectRepository
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/projects/{projectId}/challenges")
class ChallengeController(
    private val challengeService: ChallengeService,
    private val projectRepository: ProjectRepository
) {

    @GetMapping
    fun getChallenges(
        @PathVariable projectId: Long
    ): List<ChallengeResponse> {

        return challengeService.findByProjectId(projectId)
            .map {
                ChallengeResponse(
                    id = it.id,
                    name = it.name
                )
            }
    }

    @PostMapping
    fun createChallenge(
        @PathVariable projectId: Long,
        @RequestBody request: ChallengeRequest
    ): ChallengeResponse {

        val project = projectRepository.findById(projectId)
            .orElseThrow {
                IllegalArgumentException(
                    "Project not found: $projectId"
                )
            }

        val challenge = Challenge(
            name = request.name,
            project = project
        )

        val savedChallenge = challengeService.create(challenge)

        return ChallengeResponse(
            id = savedChallenge.id,
            name = savedChallenge.name
        )
    }
}