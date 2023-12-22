CREATE TABLE groups (
    id serial NOT NULL,
    name varchar(255) NOT NULL,
    is_enabled boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    UNIQUE (name),
    PRIMARY KEY (id)
);

CREATE TABLE users (
    id serial NOT NULL,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL,
    primary_group_id int NOT NULL,
    is_enabled boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    PRIMARY KEY (id),
    UNIQUE (email),
    FOREIGN KEY (primary_group_id) REFERENCES groups(id)
);

CREATE TABLE user_group (
    user_id int NOT NULL,
    group_id int NOT NULL,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE client (
    id serial NOT NULL,
    name varchar(255) NOT NULL,
    is_enabled boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    UNIQUE (name),
    PRIMARY KEY (id)
);