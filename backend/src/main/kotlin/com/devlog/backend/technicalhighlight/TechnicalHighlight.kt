package com.devlog.backend.technicalhighlight

import com.devlog.backend.project.Project
import jakarta.persistence.*

@Entity
@Table(name = "technical_highlights")
class TechnicalHighlight(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var title: String,

    @Column(nullable = false, columnDefinition = "TEXT")
    var description: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    var project: Project
)