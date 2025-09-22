package com.ddjproj.revature.exception.database;

import com.ddjproj.revature.exception.DatabaseException;

public class TransactionException extends DatabaseException {
    public TransactionException(String message) {
        super(message);
    }
}
