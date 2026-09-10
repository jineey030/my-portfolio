package com.devlog.backend.todo

import org.springframework.stereotype.Service

@Service
class TodoService(
    private val todoRepository: TodoRepository
) {

    fun getTodos(): List<Todo> = todoRepository.findAllByOrderByIdDesc()

    fun createTodo(
        title: String,
        priority: String
    ): Todo {
        val todo = Todo(
            title = title,
            priority = priority
        )

        return todoRepository.save(todo)
    }

    fun updateTodo(
        id: Long,
        title: String,
        completed: Boolean,
        priority: String
    ): Todo {
        val todo = todoRepository.findById(id)
            .orElseThrow {
                IllegalArgumentException("Todo not found: $id")
            }

        todo.title = title
        todo.completed = completed
        todo.priority = priority

        return todoRepository.save(todo)
    }

    fun deleteTodo(id: Long) {
        if (!todoRepository.existsById(id)) {
            throw IllegalArgumentException("Todo not found: $id")
        }

        todoRepository.deleteById(id)
    }
}
