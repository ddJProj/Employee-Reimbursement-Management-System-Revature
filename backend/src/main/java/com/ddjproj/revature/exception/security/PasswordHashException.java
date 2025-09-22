package com.ddjproj.revature.exception.security;

import com.ddjproj.revature.exception.ApplicationException;

public class PasswordHashException extends ApplicationException {
    public PasswordHashException(String message) {
        super(message);
    }
}

