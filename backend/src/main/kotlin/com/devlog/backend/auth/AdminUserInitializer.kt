package com.devlog.backend.auth

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class AdminUserInitializer(

    @Value("\${admin.username}")
    private val adminUsername: String,

    @Value("\${admin.password}")
    private val adminPassword: String

) {

    @Bean
    fun initAdminUser(
        adminUserRepository: AdminUserRepository,
        passwordEncoder: PasswordEncoder
    ) = CommandLineRunner {

        if (
            adminUserRepository.findByUsername(
                adminUsername
            ) == null
        ) {

            val encodedPassword =
                passwordEncoder.encode(
                    adminPassword
                )
                    ?: error(
                        "비밀번호 암호화에 실패했습니다."
                    )

            val adminUser = AdminUser(
                username = adminUsername,
                password = encodedPassword
            )

            adminUserRepository.save(adminUser)
        }
    }
}
