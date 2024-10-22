CREATE TABLE store (
    ifc_name TEXT,
    obj_name TEXT,
    user_id INTEGER NOT NULL,
    CONSTRAINT ifc_Type UNIQUE (ifc_name, user_id),
    CONSTRAINT obj_Type UNIQUE (obj_name, user_id)
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username TEXT NOT NULL,
    hash TEXT NOT NULL
);

CREATE TABLE ifc (
    ifc_name TEXT,
    user_id INTEGER NOT NULL,
    CONSTRAINT ifc_Type UNIQUE (ifc_name, user_id)
);

CREATE TABLE obj (
    obj_name TEXT,
    user_id INTEGER NOT NULL,
    CONSTRAINT obj_Type UNIQUE (obj_name, user_id)
);

CREATE TABLE ifcobj (
    ifc_name TEXT,
    obj_name TEXT,
    user_id INTEGER NOT NULL,
    CONSTRAINT ifc_Type UNIQUE (ifc_name, user_id),
    CONSTRAINT obj_Type UNIQUE (obj_name, user_id)
);