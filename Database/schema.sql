CREATE DATABASE testDB2;

USE testDB2;

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
    id INT AUTO_INCREMENT PRIMARY KEY,
	user_id VARCHAR(50) NOT NULL,
    time_in TIME NOT NULL,
    time_out TIME NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Registration_user(userId) ON DELETE CASCADE
);

CREATE TABLE camera (
	camera_name VARCHAR(20),
    IP VARCHAR(20),
    camera_type VARCHAR(10)
);

CREATE TABLE admin_credentials (
	id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id VARCHAR(50) NOT NULL,
    hashed_password VARCHAR(128) NOT NULL
);

CREATE TABLE Attendance_Request (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UserId VARCHAR(50),
    Name VARCHAR(100),
    Email VARCHAR(100),
    Date VARCHAR(100),
    Type VARCHAR(100),
    Reason VARCHAR(250)
);

CREATE TABLE Past_Attendance_Request (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UserId VARCHAR(50),
    Name VARCHAR(100),
    Email VARCHAR(100),
	Date VARCHAR(100),
    Type VARCHAR(100),
    Reason VARCHAR(250),
    Status VARCHAR(50) NOT NULL
);