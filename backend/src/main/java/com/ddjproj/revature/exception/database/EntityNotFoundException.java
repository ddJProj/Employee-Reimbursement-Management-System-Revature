package com.ddjproj.revature.exception.database;


import com.ddjproj.revature.exception.DatabaseException;

public class EntityNotFoundException extends DatabaseException {
    public EntityNotFoundException(String message) {
        super(message);
    }
}
