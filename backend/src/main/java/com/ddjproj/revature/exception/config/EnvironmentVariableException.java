package com.ddjproj.revature.exception.config;

import com.ddjproj.revature.exception.ApplicationException;

public class EnvironmentVariableException extends ApplicationException {
    public EnvironmentVariableException(String message) {
        super(message);
    }
}

