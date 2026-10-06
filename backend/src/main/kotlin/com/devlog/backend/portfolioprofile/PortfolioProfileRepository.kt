package com.devlog.backend.portfolioprofile

import org.springframework.data.jpa.repository.JpaRepository

interface PortfolioProfileRepository :
    JpaRepository<PortfolioProfile, Long>