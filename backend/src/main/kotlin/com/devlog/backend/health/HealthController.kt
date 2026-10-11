
package com.devlog.backend.health

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.sql.DataSource

@RestController
@RequestMapping("/api/health")
class HealthController(
    private val dataSource: DataSource
) {

    @GetMapping
    fun checkHealth(): ResponseEntity<Map<String, String>> {
        val databaseConnected = try {
            dataSource.connection.use { connection ->
                connection.isValid(2)
            }
        } catch (exception: Exception) {
            false
        }

        val databaseStatus =
            if (databaseConnected) "UP" else "DOWN"

        val applicationStatus =
            if (databaseConnected) "UP" else "DB_DOWN"

        return ResponseEntity.ok(
            mapOf(
                "status" to applicationStatus,
                "database" to databaseStatus
            )
        )
    }
}
