
CREATE DATABASE IF NOT EXISTS studenthub;

USE studenthub;

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    course VARCHAR(100) NOT NULL
);

CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(150) NOT NULL,
    event_date DATE NOT NULL,
    venue VARCHAR(150) NOT NULL,
    description TEXT
);

CREATE TABLE registrations (
    student_id INT NOT NULL,
    event_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (student_id, event_id),

    FOREIGN KEY (student_id)
        REFERENCES students(student_id)
        ON DELETE CASCADE,

    FOREIGN KEY (event_id)
        REFERENCES events(event_id)
        ON DELETE CASCADE
);

-- Insert sample students
INSERT INTO students (name, email, course) VALUES
('Aarav Patel', 'aarav@example.com', 'BTech CSE'),
('Riya Shah', 'riya@example.com', 'BTech IT');

-- Insert sample events
INSERT INTO events
(event_name, event_date, venue, description) VALUES
('Tech Fest', '2026-11-15', 'Main Auditorium',
 'Annual technical festival'),
('Coding Competition', '2026-11-20', 'Computer Lab 1',
 'Programming competition for students');

-- Insert sample registrations
INSERT INTO registrations (student_id, event_id) VALUES
(1, 1),
(1, 2),
(2, 1);
