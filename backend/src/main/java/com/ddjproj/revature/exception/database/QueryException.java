package com.ddjproj.revature.exception.database;

import com.ddjproj.revature.exception.DatabaseException;

public class QueryException extends DatabaseException {
    public QueryException(String message) {
        super(message);
    }
}
