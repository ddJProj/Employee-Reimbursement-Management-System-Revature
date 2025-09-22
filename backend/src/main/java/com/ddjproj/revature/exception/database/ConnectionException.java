package com.ddjproj.revature.exception.database;
import com.ddjproj.revature.exception.DatabaseException;

public class ConnectionException extends DatabaseException {
    public ConnectionException(String message) {
        super(message);
    }
}
