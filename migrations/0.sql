CREATE TABLE groups (
    id serial NOT NULL,
    name varchar(255) NOT NULL,
    is_enabled boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    created_by int NOT NULL,
    updated_by int NOT NULL,
    deleted_by int,
    UNIQUE (name),
    PRIMARY KEY (id)
);

CREATE TABLE users (
    id serial NOT NULL,
    name varchar(255) NOT NULL,
    email_address varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL,
    is_enabled boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    created_by int,
    updated_by int,
    deleted_by int,
    PRIMARY KEY (id),
    UNIQUE (email_address)
);

-- ALTER TABLE groups
-- ADD FOREIGN KEY (created_by) REFERENCES users(id);
-- ADD FOREIGN KEY (updated_by) REFERENCES users(id);
-- ADD FOREIGN KEY (deleted_by) REFERENCES users(id);

-- ALTER TABLE users
-- ADD FOREIGN KEY (created_by) REFERENCES users(id);
-- ADD FOREIGN KEY (updated_by) REFERENCES users(id);
-- ADD FOREIGN KEY (deleted_by) REFERENCES users(id);

CREATE TABLE user_group (
    user_id int NOT NULL,
    group_id int NOT NULL,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE note (
  id serial PRIMARY KEY,
  entity_type varchar(255) NOT NULL,
  entity_id int NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by int NOT NULL,
  updated_by int,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE TABLE client (
    id serial NOT NULL,
    name varchar(255) NOT NULL,
    is_enabled boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    created_by int NOT NULL,
    updated_by int NOT NULL,
    deleted_by int,
    UNIQUE (name),
    PRIMARY KEY (id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    FOREIGN KEY (deleted_by) REFERENCES users(id)
);

CREATE TABLE contact (
    id serial NOT NULL,
    name varchar(255) NOT NULL,
    email_address varchar(255) NOT NULL,
    job_title varchar(255) NOT NULL,
    client_id int NOT NULL,
    is_enabled boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    created_by int NOT NULL,
    updated_by int NOT NULL,
    deleted_by int,
    UNIQUE (email_address),
    PRIMARY KEY (id),
    FOREIGN KEY (client_id) REFERENCES client(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    FOREIGN KEY (deleted_by) REFERENCES users(id)
);

CREATE TABLE note (
    id serial PRIMARY KEY,
    entity_type varchar(255) NOT NULL,
    entity_id int NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    created_by int NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);


CREATE TABLE project (
    id serial NOT NULL,
    name varchar(255) NOT NULL,
    is_enabled boolean NOT NULL DEFAULT true,
    client_id int NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    created_by int NOT NULL,
    updated_by int NOT NULL,
    deleted_by int,
    PRIMARY KEY (id),
    FOREIGN KEY (client_id) REFERENCES client(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    FOREIGN KEY (deleted_by) REFERENCES users(id)
);

CREATE TABLE task (
    id serial NOT NULL,
    name varchar(255) NOT NULL,
    is_enabled boolean NOT NULL DEFAULT true,
    project_id int NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    created_by int NOT NULL,
    updated_by int NOT NULL,
    deleted_by int,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES project(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    FOREIGN KEY (deleted_by) REFERENCES users(id)
);

