package com.devlog.backend.skill

import org.springframework.stereotype.Service

@Service
class SkillService(
    private val skillRepository: SkillRepository
) {

    fun getSkills(): List<Skill> {
        return skillRepository.findAllByOrderByIdDesc()
    }

    fun getSkill(id: Long): Skill {
        return skillRepository.findById(id)
            .orElseThrow {
                IllegalArgumentException("Skill not found: $id")
            }
    }

    fun createSkill(name: String): Skill {
        val skill = Skill(
            name = name
        )

        return skillRepository.save(skill)
    }

    fun updateSkill(
        id: Long,
        name: String
    ): Skill {
        val skill = skillRepository.findById(id)
            .orElseThrow {
                IllegalArgumentException("Skill not found: $id")
            }

        skill.name = name

        return skillRepository.save(skill)
    }

    fun deleteSkill(id: Long) {
        if (!skillRepository.existsById(id)) {
            throw IllegalArgumentException("Skill not found: $id")
        }

        skillRepository.deleteById(id)
    }
}