package com.devlog.backend.config

import com.devlog.backend.auth.JwtAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
class SecurityConfig(
    private val jwtAuthenticationFilter: JwtAuthenticationFilter
) {

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun securityFilterChain(
        http: HttpSecurity
    ): SecurityFilterChain {

        http
            .csrf { it.disable() }
            .cors { }
            .authorizeHttpRequests {
                it
                    // CORS preflight
                    .requestMatchers(HttpMethod.OPTIONS, "/**")
                    .permitAll()

                    // 로그인
                    .requestMatchers(
                        HttpMethod.POST,
                        "/api/auth/login"
                    )
                    .permitAll()

                    // Todo 조회
                    .requestMatchers(
                        HttpMethod.GET,
                        "/api/todos/**"
                    )
                    .permitAll()

                    // Study Log 조회
                    .requestMatchers(
                        HttpMethod.GET,
                        "/api/study-logs/**"
                    )
                    .permitAll()

                    // 에러 페이지
                    .requestMatchers("/error")
                    .permitAll()

                    // 그 외 요청은 인증 필요
                    .anyRequest()
                    .authenticated()
            }
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter::class.java
            )

        return http.build()
    }
}
