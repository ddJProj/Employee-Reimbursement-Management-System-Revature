package com.ddjproj.revature.service.auth;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;


/**
 * For handling system log out, etc. 
 * TODO: finish documentation + tests
 */
@Service
public class TokenBlacklistService {


    private final Set<String> blackListedTokens = new HashSet<>();

    /**
     * 
     * @param token
     */
    public void blacklistToken(String token){
        blackListedTokens.add(token);
    }

    /**
     * 
     * @param token
     * @return
     */
    public boolean isTokenBlackListed(String token){
        return blackListedTokens.contains(token);
    }
}
