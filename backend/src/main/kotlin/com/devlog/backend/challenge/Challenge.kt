package com.devlog.backend.challenge

import com.devlog.backend.project.Project
import jakarta.persistence.*

@Entity
@Table(name = "challenges")
class Challenge(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var name: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    var project: Project
)