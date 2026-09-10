package com.devlog.backend.auth

import org.springframework.data.jpa.repository.JpaRepository

interface AdminUserRepository : JpaRepository<AdminUser, Long> {

    fun findByUsername(username: String): AdminUser?
}
