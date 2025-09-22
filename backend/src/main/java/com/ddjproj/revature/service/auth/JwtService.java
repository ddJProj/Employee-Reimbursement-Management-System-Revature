package com.ddjproj.revature.service.auth;


import java.util.function.Function;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


/*
 * References for setup : 
 * 1: https://medium.com/@tericcabrel/implement-jwt-authentication-in-a-spring-boot-3-application-5839e4fd8fac
 * 
 * 2ish: https://medium.com/@HereAndBeyond/spring-boot-3-jwt-authorization-based-on-a-secret-key-ababbb3a3350
 * 
*/


// TODO : implement method documentation, change userName to email?

@Service
public class JwtService {

    @Value("${security.jwt.secret}")
    private String secretKey;


    @Value("${security.jwt.expiration}")
    private long jwtExpiration;

    /**
     * 
     * @param token
     * @return
     */
    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * 
     * @param <T>
     * @param token
     * @param claimsResolver
     * @return
     */
    public <T> T extractClaim(String token,Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);

    }

    /**
     * 
     * @param userDetails
     * @return
     */
    public String generateToken(UserDetails userDetails){
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * 
     * @param extraClaims
     * @param userDetails
     * @return
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails){
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    /**
     * 
     * @return
     */
    public long getExpirationTime(){
        return jwtExpiration;
    }

    /**
     * 
     * @param extraClaims
     * @param userDetails
     * @param expiration
     * @return
     */
    private String buildToken(
        Map<String, Object> extraClaims, UserDetails userDetails, long expiration
    ){
        return Jwts.builder().setClaims(extraClaims).setSubject(userDetails.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(getSignInKey(), SignatureAlgorithm.HS256)
        .compact();
    }

    /**
     * 
     * @param token
     * @param userDetails
     * @return
     */
    public boolean isTokenValid(String token, UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * 
     * @param token
     * @return
     */
    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    /**
     * 
     * @param token
     * @return
     */
    private Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }


    /**
     * 
     * @param token
     * @return
     */
    private Claims extractAllClaims(String token){
        return Jwts
        .parserBuilder().setSigningKey(getSignInKey())
        .build().parseClaimsJws(token).getBody();
    }

    /**
     * 
     * @return
     */
    private Key getSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

