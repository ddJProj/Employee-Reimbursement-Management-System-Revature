package com.ddjproj.revature.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ddjproj.revature.controller.auth.JwtAuthenticationFilter;


/*
 * https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html
 * https://www.danvega.dev/blog/spring-security-cors
 * https://medium.tuanh.net/cors-with-spring-security-6-6b765f23ca5f
 * https://spring.io/blog/2015/06/08/cors-support-in-spring-framework
 * 
 */

 // TODO: UPDATE ENDPOINTS!!! UPDATE THE FILE LOCATION AS WELL AND IMPORTS

import com.ddjproj.revature.service.UserDetailService;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityBeansConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailService userDetailService;


    public SecurityBeansConfig(JwtAuthenticationFilter jwtAuthenticationFilter, UserDetailService userDetailService){
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailService = userDetailService;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                    .requestMatchers("/h2-console/**").permitAll() // FIXME: allow h2 console for development. remove after
                .anyRequest().authenticated())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            // add to allow h2 frames. FIXME: remove after development
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()))
            .build();
    }


    @Bean
    AuthenticationManager authenticationManager( AuthenticationConfiguration config) throws Exception{
        return config.getAuthenticationManager();
    }


    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;

    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173",
                "http://revp1-ers-frontend.s3-website.us-east-2.amazonaws.com"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        //configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
