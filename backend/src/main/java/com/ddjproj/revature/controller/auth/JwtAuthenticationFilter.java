package com.ddjproj.revature.controller.auth;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ddjproj.revature.service.UserDetailService;
import com.ddjproj.revature.service.auth.JwtService;
import com.ddjproj.revature.service.auth.TokenBlacklistService;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/* TODO: UPDATE IMPORTS AND PACKAGE LOCATION
    UPDATE to use email in place of username?
*/



@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    private final TokenBlacklistService tokenBlacklistService;

    private final JwtService jwtService;
    private final UserDetailService userDetailService;


    public JwtAuthenticationFilter(JwtService jwtService, UserDetailService userDetailService, TokenBlacklistService tokenBlacklist, TokenBlacklistService tokenBlacklistService){
        this.jwtService = jwtService;
        this.userDetailService = userDetailService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // add console logging step to debug auth / dev
        System.out.println("Working on request: "+ request.getMethod() + " " + request.getRequestURI());

        System.out.println ("Processing a request: "+ request.getMethod()+ " " + request.getRequestURI());
        System.out.println("Authorization header: " + (request.getHeader("Authorization") != null ? "Present" : "Missing"));



        final String path = request.getRequestURI();
        // skipping token validation for auth endpoints
        if (path.contains("/api/auth/")){
            filterChain.doFilter(request, response);
            return;
        }
                    

        final String authHeader = request.getHeader("Authorization");
        final String userEmail;

        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        try{

        String jwt = authHeader.substring(7);

        // checking if token is no longer valid / user logged out, etc.
        if(tokenBlacklistService.isTokenBlackListed(jwt)){
            System.out.println("Token is blacklisted.");
            filterChain.doFilter(request, response);
            return;
        }
        

        userEmail = jwtService.extractUsername(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = this.userDetailService.loadUserByUsername(userEmail);

            if (jwtService.isTokenValid(jwt, userDetails)){
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userEmail, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            }
        }

    }catch(Exception e){
        logger.error("JWT related authentication error occurred: ", e);

    }
        filterChain.doFilter(request, response);
    
    }

}
