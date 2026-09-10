package com.devlog.backend.todo

import org.springframework.data.jpa.repository.JpaRepository

interface TodoRepository : JpaRepository<Todo, Long> {

    fun findAllByOrderByIdDesc(): List<Todo>
}
