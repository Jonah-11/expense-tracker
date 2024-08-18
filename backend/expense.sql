-- Create the database
-- CREATE DATABASE expense_tracker_uno;

-- Use the created database
USE expense_tracker_uno;

-- Create the users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the expenses table
CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  amount DECIMAL(10, 2),
  date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Log in to MySQL
-- mysql -u root -p

-- Grant all privileges to the root user (adjust as needed)
GRANT ALL PRIVILEGES ON expense_tracker_uno.* TO 'root'@'localhost' IDENTIFIED BY 'derniermetro000.' WITH GRANT OPTION;

-- Flush privileges to apply changes
FLUSH PRIVILEGES;
