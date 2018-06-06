PRAGMA foreign_keys = ON; -- SQLITE ONLY!

DROP TABLE IF EXISTS player; 
DROP TABLE IF EXISTS room; 

CREATE TABLE player (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(128) NOT NULL, -- It cannot be empty!
    room_id INTEGER REFERENCES room(id) -- FOREIGN KEY
);

CREATE TABLE object (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(128) NOT NULL
);

CREATE TABLE room (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(128) NOT NULL,
    description VARCHAR(1024),
    w_to INTEGER REFERENCES room(id),
    e_to INTEGER REFERENCES room(id),
    s_to INTEGER REFERENCES room(id),
    n_to INTEGER REFERENCES room(id)
);

CREATE TABLE room_object (
    room_id INTEGER REFERENCES room(id),
    object_id INTEGER REFERENCES object(id)
);

INSERT INTO room (name, description) VALUES ("Foyer", "This is where the adventure begins!");
INSERT INTO room (name, description) VALUES ("Hallway", "Between the foyer and the rest of the house!");

UPDATE room SET n_to=2 WHERE id=1;
UPDATE room SET n_to=1 WHERE id=2;

INSERT INTO player (name, room_id) values ("Beej", 1);

INSERT INTO object (name) VALUES ("Plastic shield");

INSERT INTO room_object (room_id, object_id) VALUES (1,1); --Sword in the foyer
INSERT INTO room_object (room_id, object_id) VALUES (2,1); --Sword in the Hallway
INSERT INTO room_object (room_id, object_id) VALUES (2,2); --Shield in the Hallway

SELECT name FROM player;
SELECT room_id FROM player;

SELECT player.name AS "Player Name", room.name, description FROM player, room
    WHERE player.room_id = room.id AND -- This is the joining part.
    player.id = 1;