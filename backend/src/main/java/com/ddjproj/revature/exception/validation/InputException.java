package com.ddjproj.revature.exception.validation;

import com.ddjproj.revature.exception.ApplicationException;

public class InputException extends ApplicationException {
    public InputException(String message) {
        super(message);
    }
}
