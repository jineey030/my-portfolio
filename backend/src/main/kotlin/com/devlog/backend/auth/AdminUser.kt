package com.devlog.backend.auth

import jakarta.persistence.*

@Entity
@Table(name = "admin_users")
class AdminUser(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true)
    val username: String,

    @Column(nullable = false)
    val password: String,

    @Column(nullable = false)
    val role: String = "ADMIN"
)
