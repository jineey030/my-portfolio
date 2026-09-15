package com.devlog.backend.auth

import com.devlog.backend.auth.dto.AdminProfileResponse
import com.devlog.backend.auth.dto.ChangeAdminPasswordRequest
import com.devlog.backend.auth.dto.UpdateAdminProfileRequest
import com.devlog.backend.auth.dto.UpdateAdminProfileResponse
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/profile")
class AdminProfileController(
    private val adminProfileService: AdminProfileService
) {
    @GetMapping
    fun getProfile(
        authentication: Authentication
    ): ResponseEntity<AdminProfileResponse> {
        val username = authentication.name

        return ResponseEntity.ok(
            adminProfileService.getProfile(username)
        )
    }

    @PutMapping
    fun updateProfile(
        authentication: Authentication,
        @RequestBody request: UpdateAdminProfileRequest
    ): ResponseEntity<UpdateAdminProfileResponse> {
        val username = authentication.name

        return ResponseEntity.ok(
            adminProfileService.updateProfile(
                username,
                request
            )
        )
    }

    @PutMapping("/password")
    fun changePassword(
        authentication: Authentication,
        @RequestBody request: ChangeAdminPasswordRequest
    ): ResponseEntity<Void> {
        val username = authentication.name

        adminProfileService.changePassword(
            username,
            request
        )

        return ResponseEntity.noContent().build()
    }
}
