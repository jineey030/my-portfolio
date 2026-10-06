package com.devlog.backend.portfolioskill

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/portfolio-skills")
class PortfolioSkillController(
    private val portfolioSkillService: PortfolioSkillService
) {

    @GetMapping
    fun getSkills(): List<PortfolioSkillResponse> {
        return portfolioSkillService.getSkills()
            .map {
                PortfolioSkillResponse(
                    id = it.id,
                    category = it.category,
                    name = it.name
                )
            }
    }
}