package com.devlog.backend.project

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
class Project(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    var name: String,

    var description: String,

    var githubUrl: String? = null,

    var deployUrl: String? = null,

    var imageUrl: String? = null,

    var role: String? = null
)
