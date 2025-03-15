CREATE DATABASE FaceTrack;

USE FaceTrack;
CREATE TABLE user_details (
	id INT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    designation VARCHAR(50),
    department VARCHAR(50),
    image BLOB NOT NULL
);

CREATE TABLE user_attendance (
	user_id INT NOT NULL,
    time_in TIME NOT NULL,
    time_out TIME NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_details(id) ON DELETE CASCADE
);

CREATE TABLE login_details (
	user_id INT PRIMARY KEY,
	password_hash VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_details(id) ON DELETE CASCADE
);

CREATE TABLE camera (
	camera_name VARCHAR(20),
    IP VARCHAR(20),
    camera_type VARCHAR(10)
);
