package com.ddjproj.revature.exception;

// DatabaseException.java
public class DatabaseException extends ApplicationException {

    public DatabaseException(String message) {
        super(message);
    }

    public DatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
