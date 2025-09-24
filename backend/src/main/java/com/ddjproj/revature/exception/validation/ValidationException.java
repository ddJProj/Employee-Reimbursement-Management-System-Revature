package com.ddjproj.revature.exception.validation;


import com.ddjproj.revature.exception.ApplicationException;

public class ValidationException extends ApplicationException {
    public ValidationException(String message) {
        super(message);
    }
}
