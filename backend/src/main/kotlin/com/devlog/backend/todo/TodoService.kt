package com.devlog.backend.todo

import org.springframework.stereotype.Service

@Service
class TodoService(
    private val todoRepository: TodoRepository
) {

    fun getTodos(): List<Todo> {
        return todoRepository.findAll()
    }

    fun createTodo(title: String): Todo {
        val todo = Todo(
            title = title
        )

        return todoRepository.save(todo)
    }

    fun updateTodo(
        id: Long,
        title: String,
        completed: Boolean
    ): Todo {
        val todo = todoRepository.findById(id)
            .orElseThrow {
                IllegalArgumentException("Todo not found: $id")
            }

        todo.title = title
        todo.completed = completed

        return todoRepository.save(todo)
    }

    fun deleteTodo(id: Long) {
        if (!todoRepository.existsById(id)) {
            throw IllegalArgumentException("Todo not found: $id")
        }

        todoRepository.deleteById(id)
    }
}