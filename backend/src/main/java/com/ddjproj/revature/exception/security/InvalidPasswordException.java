package com.ddjproj.revature.exception.security;

import com.ddjproj.revature.exception.ApplicationException;

public class InvalidPasswordException extends ApplicationException {
    public InvalidPasswordException(String message) {
        super(message);
    }
}