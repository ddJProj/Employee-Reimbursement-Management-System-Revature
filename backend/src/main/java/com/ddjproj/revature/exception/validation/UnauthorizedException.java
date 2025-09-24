package com.ddjproj.revature.exception.validation;

import com.ddjproj.revature.exception.ApplicationException;

public class UnauthorizedException  extends ApplicationException {
    public UnauthorizedException(String message) {
        super(message);
    }
}