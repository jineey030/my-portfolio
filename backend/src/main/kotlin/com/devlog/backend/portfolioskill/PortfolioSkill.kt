package com.devlog.backend.portfolioskill

import jakarta.persistence.*

@Entity
@Table(name = "portfolio_skills")
class PortfolioSkill(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var category: String,

    @Column(nullable = false)
    var name: String
)