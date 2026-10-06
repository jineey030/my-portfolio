package com.devlog.backend.project

import com.devlog.backend.skill.Skill
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne

@Entity
class ProjectSkill(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne
    @JoinColumn(name = "project_id")
    val project: Project,

    @ManyToOne
    @JoinColumn(name = "skill_id")
    val skill: Skill
)