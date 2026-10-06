package com.devlog.backend.project

import org.springframework.data.jpa.repository.JpaRepository

interface ProjectRepository : JpaRepository<Project, Long> {

    fun findAllByOrderByIdDesc(): List<Project>
}