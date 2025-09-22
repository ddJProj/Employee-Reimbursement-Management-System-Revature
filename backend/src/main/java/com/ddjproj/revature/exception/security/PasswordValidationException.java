package com.ddjproj.revature.exception.security;

import com.ddjproj.revature.exception.ApplicationException;

public class PasswordValidationException extends ApplicationException {
    public PasswordValidationException(String message) {
        super(message);
    }
}
