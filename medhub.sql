-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 10, 2020 at 07:08 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medhub`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `email` text NOT NULL,
  `subject` text NOT NULL,
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `first_name`, `last_name`, `email`, `subject`, `message`) VALUES
(1, 'Ujjwal', 'Khadka', 'ujjwol99@gmail.com', 'Azithromycin not available.', 'One of the medicine that I require is not available. Can you please add it.');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `phone_number` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `status` enum('Pending','Approved','Declined','Dispatched','Delivered') NOT NULL DEFAULT 'Pending',
  `total` decimal(11,2) NOT NULL,
  `created_at` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `phone_number`, `location`, `image_url`, `status`, `total`, `created_at`) VALUES
(3, 3, '9842641628', 'Bhadrapur, Jhapa', '/uploads/e0e57949877de76a34eeb515fa59e387.png', 'Approved', '780.00', 1591759738467);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`) VALUES
(3, 3, 3, 1),
(4, 3, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `price` decimal(11,2) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `in_stock` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `title`, `description`, `price`, `image_url`, `in_stock`) VALUES
(1, 'Paracetamol (10 Pieces)', 'Paracetamol, also known as acetaminophen, is a medication used to treat pain and fever. It is typically used for mild to moderate pain relief. Evidence is mixed for its use to relieve fever in children. It is often sold in combination with other medications, such as in many cold medications.', '90.00', '/uploads/dc8d79a3f5f7eb231dbe69c8cab724e1.jpg', 1),
(2, 'Vicodin (1 Bottle)', 'Vicodin is a popular drug for treating acute or chronic moderate to moderately severe pain. Its most common side effects are lightheadedness, dizziness, sedation, nausea, and vomiting. Vicodin can reduce breathing, impair thinking, reduce physical abilities, and is habit forming.', '150.00', '/uploads/f4fca7887cb4942e2559bc1786a9f720.jpg', 0),
(3, 'Simvastatin', 'Simvastatin is one of the first \"statins\" (HMG-CoA reductase inhibitors) approved for treating high cholesterol and reducing the risk of stroke, death from heart disease, and risk of heart attacks. Its most common side effects are headache, nausea, vomiting, diarrhea, abdominal pain, and muscle pain. Like other statins it can cause muscle break down.', '300.00', '/uploads/1e51ace8baec0cf2246b50669f16105a.jpg', 1),
(4, 'Lisinopril', 'Lisinopril is an angiotensin converting enzyme (ACE) inhibitor used for treating high blood pressure, congestive heart failure, and for preventing kidney failure caused by high blood pressure and diabetes. Lisinopril side effects include dizziness, nausea, headaches, drowsiness, and sexual dysfunction. ACE inhibitors may cause a dry cough that resolves when the drug is discontinued.', '240.00', '/uploads/30fab7e3084b7bb491a9a12d9a9d8255.jpg', 1),
(5, 'Levothyroxine', 'Levothryoxine is a man-made version of thyroid hormone. It is used for treating hypothyroidism. Its side effects are usually result from high levels of thyroid hormone. Excessive thyroid hormone can cause chest pain, increased heart rate, excessive sweating, heat intolerance, nervousness, headache, and weight loss.', '480.00', '/uploads/4c46258b9aa6cc6824f8ca8fd9f9eb2c.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`) VALUES
(3, 'ujjwol99@gmail.com', '89411399171c0ea997c3962374d1367a170f3fce079a0ed988c7058f64bbd67c', 'Ujjwal Khadka');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `products` ADD FULLTEXT KEY `title` (`title`,`description`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
