CREATE DATABASE FaceTrack;

USE FaceTrack;
CREATE TABLE user_details (
	id INT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    designation VARCHAR(50),
    department VARCHAR(50),
    image BLOB NOT NULL
);

CREATE TABLE Registration_user (
    userId VARCHAR(50) PRIMARY KEY,
    userName VARCHAR(100) NOT NULL,
    userEmail VARCHAR(100) NOT NULL,
    userDepartment VARCHAR(50) NOT NULL,
    userDesignation VARCHAR(50) NOT NULL,
    userPhoto VARCHAR(255) NOT NULL
);

CREATE TABLE Registration_logindetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    hashed_password VARCHAR(128) DEFAULT 'default_password',
    FOREIGN KEY (user_id) REFERENCES Registration_user(userId) ON DELETE CASCADE
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
