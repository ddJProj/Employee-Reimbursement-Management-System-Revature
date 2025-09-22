package com.ddjproj.revature.exception.database;

import com.ddjproj.revature.exception.DatabaseException;

public class IllegalOperationException extends DatabaseException {
    public IllegalOperationException(String message) {
        super(message);
    }
}
