-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Feb 11, 2020 at 06:20 PM
-- Server version: 5.7.25
-- PHP Version: 7.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `afthem-dashboard`
--

-- --------------------------------------------------------

--
-- Table structure for table `Clusters`
--

CREATE TABLE `Clusters` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `gitUrl` varchar(255) NOT NULL,
  `gitUsername` varchar(255) NOT NULL,
  `gitPassword` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `OrganizationId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Clusters`
--

INSERT INTO `Clusters` (`id`, `name`, `description`, `gitUrl`, `gitUsername`, `gitPassword`, `createdAt`, `updatedAt`, `OrganizationId`) VALUES
(1, 'Fagiana cluster', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor', 'https://git.toagne.com/fagiana', 'foo', 'bar', '2020-02-03 22:02:51', '2020-02-03 22:02:51', 1),
(2, 'Salame cluster', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor', 'https://git.toagne.com/fagiana', 'foo', 'bar', '2020-02-04 10:57:07', '2020-02-04 10:57:07', 1),
(5, 'Test Cluster 1', 'asdasdasd', 'http://tuna', 'foo', 'bar', '2020-02-05 15:33:31', '2020-02-05 15:33:31', 2),
(6, 'Another Cluster', 'This is a really fancy description', 'http://nope.com', 'noone', 'gimmemore', '2020-02-05 15:35:58', '2020-02-05 15:35:58', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Organizations`
--

CREATE TABLE `Organizations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `timezone` varchar(255) NOT NULL,
  `registrationDate` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Organizations`
--

INSERT INTO `Organizations` (`id`, `name`, `description`, `timezone`, `registrationDate`, `createdAt`, `updatedAt`) VALUES
(1, 'Wenking INC', 'It\'s all about wenking', '', NULL, '2020-01-31 15:46:33', '2020-01-31 15:46:33'),
(2, 'asdasdas INC', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', '', NULL, '2020-01-31 16:36:42', '2020-01-31 16:36:42');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `passwordReset` varchar(255) DEFAULT NULL,
  `passwordResetDate` datetime DEFAULT NULL,
  `registrationDate` varchar(255) DEFAULT NULL,
  `gitUsername` varchar(255) NOT NULL,
  `gitPassword` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `OrganizationId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `username`, `password`, `firstName`, `lastName`, `level`, `enabled`, `passwordReset`, `passwordResetDate`, `registrationDate`, `gitUsername`, `gitPassword`, `createdAt`, `updatedAt`, `OrganizationId`) VALUES
(12, 'gufoscuro@gmail.com', 'foobar', 'Lorenzo', 'Fontana', 0, 1, '', NULL, NULL, 'seghe', 'seghe', '2020-01-31 17:04:06', '2020-01-31 17:04:06', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Clusters`
--
ALTER TABLE `Clusters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrganizationId` (`OrganizationId`);

--
-- Indexes for table `Organizations`
--
ALTER TABLE `Organizations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `OrganizationId` (`OrganizationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Clusters`
--
ALTER TABLE `Clusters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Organizations`
--
ALTER TABLE `Organizations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Clusters`
--
ALTER TABLE `Clusters`
  ADD CONSTRAINT `clusters_ibfk_1` FOREIGN KEY (`OrganizationId`) REFERENCES `Organizations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Users`
--
ALTER TABLE `Users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`OrganizationId`) REFERENCES `Organizations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
