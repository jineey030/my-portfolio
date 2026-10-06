package com.devlog.backend.skill

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/skills")
class SkillController(
    private val skillService: SkillService
) {

    @GetMapping
    fun getSkills(): List<Skill> {
        return skillService.getSkills()
    }

    @GetMapping("/{id}")
    fun getSkill(
        @PathVariable id: Long
    ): Skill {
        return skillService.getSkill(id)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createSkill(
        @RequestBody request: CreateSkillRequest
    ): Skill {
        return skillService.createSkill(
            name = request.name
        )
    }

    @PutMapping("/{id}")
    fun updateSkill(
        @PathVariable id: Long,
        @RequestBody request: UpdateSkillRequest
    ): Skill {
        return skillService.updateSkill(
            id = id,
            name = request.name
        )
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteSkill(
        @PathVariable id: Long
    ) {
        skillService.deleteSkill(id)
    }
}

data class CreateSkillRequest(
    val name: String
)

data class UpdateSkillRequest(
    val name: String
)