package com.devlog.backend.portfolioprofile

import org.springframework.stereotype.Service

@Service
class PortfolioProfileService(
    private val portfolioProfileRepository: PortfolioProfileRepository
) {

    fun getProfile(): PortfolioProfile {
        return portfolioProfileRepository.findById(1L)
            .orElseThrow {
                IllegalArgumentException("Portfolio profile not found")
            }
    }

    fun updateProfile(
        request: PortfolioProfileRequest
    ): PortfolioProfile {

        val profile = getProfile()

        profile.name = request.name
        profile.tagline = request.tagline
        profile.email = request.email
        profile.github = request.github
        profile.velog = request.velog
        profile.aboutText = request.aboutText

        return portfolioProfileRepository.save(profile)
    }
}