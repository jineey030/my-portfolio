package com.devlog.backend.project

import jakarta.persistence.*

@Entity
class Project(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    var name: String,

    @Column(nullable = false)
    var slug: String,

    var description: String,

    var githubUrl: String? = null,

    var deployUrl: String? = null,

    var imageUrl: String? = null,

    var role: String? = null
)