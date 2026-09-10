package com.devlog.backend.auth

import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class AdminUserInitializer {

    @Bean
    fun initAdminUser(
        adminUserRepository: AdminUserRepository,
        passwordEncoder: PasswordEncoder
    ) = CommandLineRunner {

        val username = "admin"

        if (adminUserRepository.findByUsername(username) == null) {

            val encodedPassword =
                passwordEncoder.encode("admin1234")
                    ?: error("비밀번호 암호화에 실패했습니다.")

            val adminUser = AdminUser(
                username = username,
                password = encodedPassword
            )

            adminUserRepository.save(adminUser)
        }
    }
}
