-- Dumping database structure for task_management
CREATE DATABASE IF NOT EXISTS `task_management`;
USE `task_management`;

-- Dumping structure for table task_management.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Dumping structure for table task_management.posts
CREATE TABLE IF NOT EXISTS `posts` (
  `id` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `priority` ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  `user_id` VARCHAR(255),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB;

-- Dumping data for table task_management.users
INSERT INTO `users` (`id`, `email`, `password`) VALUES
('1f2a5239-d5dc-4e56-aad5-47dad3f4b9b3', 'natiddd5@gmail.com', '$2b$10$...'),
('d0f35d45-2dcf-40f6-bc17-dff5d689af9a', 'dudi@gmail.com', '$2b$10$...');

-- Dumping data for table task_management.posts
INSERT INTO `posts` (`id`, `title`, `content`, `priority`, `user_id`) VALUES
('1', 'First Post', 'This is the content of the first post', 'Medium', '1f2a5239-d5dc-4e56-aad5-47dad3f4b9b3'),
('2', 'Second Post', 'This is the content of the second post', 'High', 'd0f35d45-2dcf-40f6-bc17-dff5d689af9a');

-- If you have more tables, include their structure and data as well
