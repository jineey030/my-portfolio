package com.devlog.backend.portfolioprofile

import jakarta.persistence.*

@Entity
@Table(name = "portfolio_profile")
class PortfolioProfile(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var tagline: String,

    @Column(nullable = false)
    var email: String,

    @Column(nullable = false)
    var github: String,

    @Column(nullable = false)
    var velog: String,

    @Column(nullable = false, columnDefinition = "TEXT")
    var aboutText: String
)