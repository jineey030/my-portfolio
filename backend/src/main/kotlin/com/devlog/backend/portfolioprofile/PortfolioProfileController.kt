package com.devlog.backend.portfolioprofile

import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/portfolio-profile")
class PortfolioProfileController(
    private val portfolioProfileService: PortfolioProfileService
) {

    @GetMapping
    fun getProfile(): PortfolioProfileResponse {
        val profile = portfolioProfileService.getProfile()

        return PortfolioProfileResponse(
            id = profile.id,
            name = profile.name,
            tagline = profile.tagline,
            email = profile.email,
            github = profile.github,
            velog = profile.velog,
            aboutText = profile.aboutText
        )
    }

    @PutMapping
    fun updateProfile(
        @RequestBody request: PortfolioProfileRequest
    ): PortfolioProfileResponse {

        val profile = portfolioProfileService.updateProfile(request)

        return PortfolioProfileResponse(
            id = profile.id,
            name = profile.name,
            tagline = profile.tagline,
            email = profile.email,
            github = profile.github,
            velog = profile.velog,
            aboutText = profile.aboutText
        )
    }
}