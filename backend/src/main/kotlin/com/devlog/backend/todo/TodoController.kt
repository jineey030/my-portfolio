package com.devlog.backend.todo

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/todos")
class TodoController(
    private val todoService: TodoService
) {

    @GetMapping
    fun getTodos(): List<Todo> {
        return todoService.getTodos()
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createTodo(
        @RequestBody request: CreateTodoRequest
    ): Todo {
        return todoService.createTodo(request.title)
    }

    @PutMapping("/{id}")
    fun updateTodo(
        @PathVariable id: Long,
        @RequestBody request: UpdateTodoRequest
    ): Todo {
        return todoService.updateTodo(
            id = id,
            title = request.title,
            completed = request.completed
        )
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteTodo(
        @PathVariable id: Long
    ) {
        todoService.deleteTodo(id)
    }
}

data class CreateTodoRequest(
    val title: String
)

data class UpdateTodoRequest(
    val title: String,
    val completed: Boolean
)