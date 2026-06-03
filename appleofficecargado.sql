-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.4.3 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para apple_office
CREATE DATABASE IF NOT EXISTS `apple_office` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `apple_office`;

-- Volcando estructura para tabla apple_office.accessory
CREATE TABLE IF NOT EXISTS `accessory` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_usd` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.accessory: ~4 rows (aproximadamente)
DELETE FROM `accessory`;
INSERT INTO `accessory` (`id`, `name`, `price_usd`) VALUES
	('521e5696-eab1-4926-b8bf-1bb5d21afd63', 'Funda MagSafe Clear', 50),
	('57e42697-3fc1-46b7-b466-9a6a2f63cad0', 'AirPods Pro 2', 250),
	('894b1962-2419-4d31-a36d-cbd4a2c5565f', 'Cargador USB-C 20W', 30),
	('c29de5ac-6fda-4366-a97a-9f8237285e2a', 'Vidrio Templado Premium', 15);

-- Volcando estructura para tabla apple_office.basebattery
CREATE TABLE IF NOT EXISTS `basebattery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `basebattery_status_key` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.basebattery: ~9 rows (aproximadamente)
DELETE FROM `basebattery`;
INSERT INTO `basebattery` (`id`, `status`) VALUES
	(9, '100%'),
	(4, '70-79%'),
	(3, '80-89%'),
	(8, '82% - 84%'),
	(6, '85% - 89%'),
	(2, '90-100%'),
	(7, '90% - 100%'),
	(5, 'Menor a 70%'),
	(1, 'Nuevo (Sellado)');

-- Volcando estructura para tabla apple_office.basecapacity
CREATE TABLE IF NOT EXISTS `basecapacity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `size` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `basecapacity_size_key` (`size`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.basecapacity: ~5 rows (aproximadamente)
DELETE FROM `basecapacity`;
INSERT INTO `basecapacity` (`id`, `size`) VALUES
	(1, 64),
	(2, 128),
	(3, 256),
	(4, 512),
	(5, 1024);

-- Volcando estructura para tabla apple_office.basemodel
CREATE TABLE IF NOT EXISTS `basemodel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `basemodel_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.basemodel: ~30 rows (aproximadamente)
DELETE FROM `basemodel`;
INSERT INTO `basemodel` (`id`, `name`) VALUES
	(9, 'iPhone 11'),
	(13, 'iPhone 11 Pro'),
	(14, 'iPhone 11 Pro Max'),
	(8, 'iPhone 12'),
	(16, 'iPhone 12 mini'),
	(17, 'iPhone 12 Pro'),
	(18, 'iPhone 12 Pro Max'),
	(7, 'iPhone 13'),
	(19, 'iPhone 13 mini'),
	(6, 'iPhone 13 Pro'),
	(20, 'iPhone 13 Pro Max'),
	(5, 'iPhone 14'),
	(22, 'iPhone 14 Plus'),
	(4, 'iPhone 14 Pro'),
	(23, 'iPhone 14 Pro Max'),
	(3, 'iPhone 15'),
	(24, 'iPhone 15 Plus'),
	(2, 'iPhone 15 Pro'),
	(1, 'iPhone 15 Pro Max'),
	(25, 'iPhone 16'),
	(26, 'iPhone 16 Plus'),
	(27, 'iPhone 16 Pro'),
	(28, 'iPhone 16 Pro Max'),
	(29, 'iPhone 17 Pro'),
	(30, 'iPhone 17 Pro Max'),
	(15, 'iPhone SE (2020)'),
	(21, 'iPhone SE (2022)'),
	(10, 'iPhone XR'),
	(11, 'iPhone XS'),
	(12, 'iPhone XS Max');

-- Volcando estructura para tabla apple_office.clientgallery
CREATE TABLE IF NOT EXISTS `clientgallery` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.clientgallery: ~4 rows (aproximadamente)
DELETE FROM `clientgallery`;
INSERT INTO `clientgallery` (`id`, `image_url`, `description`, `created_at`) VALUES
	('1bcbaf0c-2bfe-46e3-ab4f-07c1631c7015', '/uploads/1776108500534-clientes-felices-2.png', 'se llevo su iphone!', '2026-04-13 19:28:20.539'),
	('6feb85ff-0227-46d1-b935-2573bc838515', '/uploads/1776108812592-clientes-felices-3.png', 'se llevo su telefono soñado', '2026-04-13 19:33:32.599'),
	('9c526726-325b-4262-9df4-19f2b7f541b2', '/uploads/1776108476445-clientes-felices-4.png', 'Se llevo su iPhone con canje y esta feliz!', '2026-04-13 19:27:56.451'),
	('bdc9f626-30c2-40ec-b122-c111c78709cf', '/uploads/1776108840082-clientes-felices-1.png', 'gran compra!', '2026-04-13 19:34:00.085');

-- Volcando estructura para tabla apple_office.config
CREATE TABLE IF NOT EXISTS `config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `config_key_key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.config: ~1 rows (aproximadamente)
DELETE FROM `config`;
INSERT INTO `config` (`id`, `key`, `value`) VALUES
	(1, 'dollar_value', '1450');

-- Volcando estructura para tabla apple_office.faq
CREATE TABLE IF NOT EXISTS `faq` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.faq: ~1 rows (aproximadamente)
DELETE FROM `faq`;
INSERT INTO `faq` (`id`, `question`, `answer`, `order`, `createdAt`) VALUES
	('eee3bf5b-bfff-4296-92f5-905d827829fc', 'Cual es la garantia?', 'La garantia es de 12 meses.', 1, '2026-04-20 15:43:50.722');

-- Volcando estructura para tabla apple_office.financingcard
CREATE TABLE IF NOT EXISTS `financingcard` (
  `card_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `base_factor` double NOT NULL,
  PRIMARY KEY (`card_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.financingcard: ~5 rows (aproximadamente)
DELETE FROM `financingcard`;
INSERT INTO `financingcard` (`card_name`, `base_factor`) VALUES
	('Master Card', 1.12),
	('Naranja', 1),
	('Sol', 1.12),
	('Su Credito', 1.18),
	('Visa', 1.12);

-- Volcando estructura para tabla apple_office.financingplan
CREATE TABLE IF NOT EXISTS `financingplan` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `card_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `installments` int NOT NULL,
  `surcharge_coefficient` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `financingplan_card_name_fkey` (`card_name`),
  CONSTRAINT `financingplan_card_name_fkey` FOREIGN KEY (`card_name`) REFERENCES `financingcard` (`card_name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.financingplan: ~21 rows (aproximadamente)
DELETE FROM `financingplan`;
INSERT INTO `financingplan` (`id`, `card_name`, `installments`, `surcharge_coefficient`) VALUES
	('0fee1a49-0510-4c3b-8146-84369598ee9d', 'Naranja', 6, 1.422),
	('1b9cf96c-e384-4e90-b091-be06d3ac5e23', 'Su Credito', 3, 1.259),
	('2b968a7c-4698-4128-b1f2-c4b0cc42cb71', 'Master Card', 9, 1.489),
	('2dd857bd-a90f-4825-99b4-4641f324abd3', 'Sol', 9, 1.4),
	('314ebbe2-384d-4928-80e8-16a14c5d4052', 'Naranja', 1, 1.15),
	('412d64c1-0d13-46d7-8520-0c3bb13c14d9', 'Naranja', 9, 1.657),
	('486653c8-99aa-4e9d-9b31-5cec2614bb5d', 'Naranja', 5, 1.362),
	('69399a51-cef3-4212-95b0-d235a0a10994', 'Visa', 9, 1.429),
	('6ac89111-910c-41ea-bdae-5eb3d3899ce4', 'Master Card', 3, 1.16),
	('70b9bef2-f4cd-409e-aaf4-4a5a074ddde2', 'Visa', 1, 1.05),
	('7da6f2af-4820-4360-bc4f-76631de217dd', 'Naranja', 10, 1.734),
	('8b000361-c251-4536-9b9b-3181cdbcf7b5', 'Sol', 6, 1.32),
	('96464b75-6fa1-473a-b281-b41de109578f', 'Master Card', 12, 1.677),
	('975dc13c-9a6c-471e-9f14-7e7a7b462e3c', 'Visa', 3, 1.145),
	('9a5580a2-c639-4e5d-b8a7-9cd70a5b31ac', 'Sol', 3, 1.25),
	('a25a80a1-9db6-4bfa-8ac7-f351005404d9', 'Visa', 12, 1.584),
	('bc2db505-4f87-471c-b25d-55b523513cd6', 'Naranja', 12, 1.923),
	('cf822ff4-317d-4627-818b-90328fcd5b7c', 'Master Card', 6, 1.3),
	('dbc06eb0-5684-4846-a147-b95a70f68aef', 'Sol', 12, 1.5),
	('e39eef5a-c0f0-4ada-986b-2af2407f8d2a', 'Visa', 6, 1.267),
	('fb060c94-4905-4a65-92e0-06d041f8410e', 'Naranja', 3, 1.25);

-- Volcando estructura para tabla apple_office.iphone_stock
CREATE TABLE IF NOT EXISTS `iphone_stock` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity_gb` int NOT NULL,
  `battery_status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_usd` double NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.iphone_stock: ~30 rows (aproximadamente)
DELETE FROM `iphone_stock`;
INSERT INTO `iphone_stock` (`id`, `model`, `capacity_gb`, `battery_status`, `price_usd`, `created_at`) VALUES
	('2138c5b9-ab99-430d-8857-931b26a516ec', 'iPhone 12 Pro', 128, '90% - 100%', 350, '2026-05-21 17:40:15.824'),
	('2a9762a8-ad0e-443a-9c2d-767c4ca2c12a', 'iPhone 13 Pro', 128, '85% - 89%', 475, '2026-05-21 17:40:15.855'),
	('314929c8-cb5c-4fb0-88f6-2ade0427e65a', 'iPhone 14 Pro Max', 128, '82% - 84%', 660, '2026-05-21 17:40:15.914'),
	('36a45959-5d6a-4953-a79a-793cceac687a', 'iPhone 14 Pro', 128, '85% - 89%', 550, '2026-05-21 17:40:15.890'),
	('446e3016-edfe-4a39-bf81-45205b25b550', 'iPhone 13', 128, '90% - 100%', 390, '2026-05-21 17:40:15.829'),
	('4f17c061-04f5-46fd-97e5-b9a54376fa76', 'iPhone 13', 128, '85% - 89%', 375, '2026-05-21 17:40:15.835'),
	('517da0c5-2db2-479c-be30-7fabe3ac1f14', 'iPhone 16 Pro', 128, '90% - 100%', 820, '2026-05-21 17:40:15.949'),
	('53082c45-adf9-41bf-8875-3c5bdd2924d9', 'iPhone 14 Pro Max', 128, '85% - 89%', 675, '2026-05-21 17:40:15.909'),
	('5a770015-8c18-4136-a632-50700668d71b', 'iPhone 15 Pro', 256, '85% - 89%', 730, '2026-05-21 17:40:15.926'),
	('6c0d8321-1112-41a4-afce-0db57dbc1699', 'iPhone 11', 64, '90% - 100%', 230, '2026-05-21 17:40:15.793'),
	('73e56bc1-9d6a-43a0-a820-a42ad85eb9ee', 'iPhone 14 Pro Max', 128, '90% - 100%', 690, '2026-05-21 17:40:15.903'),
	('77a50000-0532-47e0-8275-c9e325277fd9', 'iPhone XR', 64, '85% - 89%', 170, '2026-05-21 17:40:15.779'),
	('81e45696-b045-4b13-9e1e-8b73d8562c52', 'iPhone 11 Pro Max', 64, '90% - 100%', 290, '2026-05-21 17:40:15.810'),
	('91abb2e2-87ea-4584-97ee-c9515d6dff96', 'iPhone 16 Pro Max', 256, '90% - 100%', 1020, '2026-05-21 17:40:15.954'),
	('9d6ac3f2-cff1-4589-84fe-62e5de744f11', 'iPhone 14', 128, '90% - 100%', 410, '2026-05-21 17:40:15.873'),
	('aacef811-7fc0-4e8c-8863-3644eb79973c', 'iPhone 15 Pro Max', 256, '82% - 84%', 820, '2026-05-21 17:40:15.938'),
	('abf56608-7008-4998-b510-18679c840ea1', 'iPhone 14 Pro', 128, '90% - 100%', 560, '2026-05-21 17:40:15.885'),
	('b39a54c4-9fa7-4db1-a1af-3e2e383241ea', 'iPhone 14 Pro', 128, '82% - 84%', 535, '2026-05-21 17:40:15.897'),
	('b9f3ff5c-c675-4a8e-b313-fd76d3e0c827', 'iPhone 14', 128, '85% - 89%', 400, '2026-05-21 17:40:15.879'),
	('bc05bd88-f265-4865-866a-1c5bbf8e156b', 'iPhone 17 Pro Max', 256, '100%', 1490, '2026-05-21 17:40:15.973'),
	('be5c0716-bb54-4a08-be01-5a59e3a2b156', 'iPhone 13 Pro', 128, '90% - 100%', 485, '2026-05-21 17:40:15.849'),
	('c4d7c87f-7e2b-419e-8a6f-07762350a8a8', 'iPhone 13 Pro', 128, '82% - 84%', 460, '2026-05-21 17:40:15.861'),
	('c698bb65-6b3d-4342-abc5-7f7277566a55', 'iPhone 15', 128, '85% - 89%', 520, '2026-05-21 17:40:15.920'),
	('c937a7b9-8bba-447f-912d-13d9a75a9a5f', 'iPhone 13', 128, '82% - 84%', 355, '2026-05-21 17:40:15.841'),
	('db00443d-1ece-42f3-b3c4-46683c60e6c0', 'iPhone 12', 128, '90% - 100%', 310, '2026-05-21 17:40:15.817'),
	('eb420265-6254-4552-9b7a-d40a563a29d2', 'iPhone 11', 128, '90% - 100%', 250, '2026-05-21 17:40:15.803'),
	('f065d5b9-166f-48a1-8bfe-50d95c8da975', 'iPhone 13 Pro Max', 128, '85% - 89%', 570, '2026-05-21 17:40:15.867'),
	('f2a12041-071f-4403-8f98-ea8dcdcfcf90', 'iPhone 17 Pro', 256, '100%', 1320, '2026-05-21 17:40:15.961'),
	('fa300402-3165-43dc-aaff-37e9d6a56410', 'iPhone 16', 128, '90% - 100%', 700, '2026-05-21 17:40:15.943'),
	('fe8976c5-afa9-4884-b22d-ed71f4cd5f9b', 'iPhone 15 Pro Max', 256, '85% - 89%', 835, '2026-05-21 17:40:15.931');

-- Volcando estructura para tabla apple_office.landing_accessories
CREATE TABLE IF NOT EXISTS `landing_accessories` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_string` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_index` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.landing_accessories: ~1 rows (aproximadamente)
DELETE FROM `landing_accessories`;
INSERT INTO `landing_accessories` (`id`, `name`, `price_string`, `image_url`, `order_index`, `created_at`) VALUES
	('aaa1ebe3-e457-4c61-8b0b-a41d97b02a8e', 'AirPods Pro 2', '$30.000', '/uploads/1776464829411-clientes-felices-4.png', 0, '2026-04-17 22:27:09.418');

-- Volcando estructura para tabla apple_office.landing_iphones
CREATE TABLE IF NOT EXISTS `landing_iphones` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_string` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_index` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.landing_iphones: ~5 rows (aproximadamente)
DELETE FROM `landing_iphones`;
INSERT INTO `landing_iphones` (`id`, `name`, `price_string`, `image_url`, `order_index`, `created_at`) VALUES
	('6d5c0868-562e-4c63-be64-b753418524e6', 'asda', 'asdasd', '/uploads/1776466448984-Gemini_Generated_Image_f7o30sf7o30sf7o3-removebg-preview.png', 0, '2026-04-17 22:54:08.987'),
	('a3e1be09-33fd-45ac-811c-afd2cc171fd2', 'adssada', 'asdada', '/uploads/1776466460981-logo-apple-office_page-0001.jpg', 0, '2026-04-17 22:54:20.986'),
	('a8f321a1-ac1d-45d7-be31-979e555af5cd', 'g', 'gffg', '/uploads/1776440512247-clientes-felices-2.png', 0, '2026-04-17 15:41:52.252'),
	('af6ffeca-6ef1-44e7-b17c-c303dcb099ae', 'sada', 'asda', '/uploads/1776440461235-Captura-de-pantalla-2026-04-17-124014.png', 1, '2026-04-17 15:41:01.239'),
	('ca92b3dc-73c5-4982-af7a-227766ebaac2', 'asdasda', 'dasdas', '/uploads/1776466453713-unnamed.webp', 0, '2026-04-17 22:54:13.716');

-- Volcando estructura para tabla apple_office.storegallery
CREATE TABLE IF NOT EXISTS `storegallery` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.storegallery: ~2 rows (aproximadamente)
DELETE FROM `storegallery`;
INSERT INTO `storegallery` (`id`, `image_url`, `description`, `created_at`) VALUES
	('6d311bf5-753a-4f0c-b10b-cfcaf976334a', '/uploads/1776122902533-unnamed-(1).webp', NULL, '2026-04-13 23:28:22.536'),
	('9b2e377a-5984-497f-bc68-82eedf52e7fe', '/uploads/1776122910793-unnamed.webp', NULL, '2026-04-13 23:28:30.795');

-- Volcando estructura para tabla apple_office.tradeinprice
CREATE TABLE IF NOT EXISTS `tradeinprice` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity_gb` int NOT NULL,
  `battery_range` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_usd` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.tradeinprice: ~39 rows (aproximadamente)
DELETE FROM `tradeinprice`;
INSERT INTO `tradeinprice` (`id`, `model`, `capacity_gb`, `battery_range`, `price_usd`) VALUES
	('07181f28-ccde-4865-832c-801c51de1d98', 'iPhone 12 Pro', 128, 'Indistinto', 240),
	('0955d89a-a458-4c95-8c2b-7c61f33b7ed9', 'iPhone 15', 128, '85% - 89%', 410),
	('0b568216-b179-43aa-8b72-602e77edd3d6', 'iPhone 13 Pro', 128, 'Indistinto', 350),
	('1a863641-9dba-463e-9f3c-c78e53e19dbb', 'iPhone 12 Pro Max', 256, 'Indistinto', 290),
	('27dbd7aa-ddc9-43f5-a6c8-e7b1f66d5f92', 'iPhone 15', 128, '+90%', 420),
	('2e04c94e-1282-4b37-a114-348f4d4d0a4e', 'iPhone 11', 64, 'Indistinto', 90),
	('2e863dae-93f6-441e-8295-b4b52e9d0930', 'iPhone 14 Pro Max', 256, 'Indistinto', 520),
	('2f310e58-1660-46c5-b23c-483dbdf7d2a9', 'iPhone 11 Pro', 256, 'Indistinto', 160),
	('30f30f2e-9544-4418-9ba0-a2c929a02727', 'iPhone 11', 128, 'Indistinto', 100),
	('3318b7a6-4cd9-4f87-9ddc-a548eda8a435', 'iPhone 15 Pro', 128, '85% - 89%', 520),
	('37455502-098d-4c70-b50a-508aee8b0fc0', 'iPhone 14 Pro', 128, 'Indistinto', 410),
	('4a6fac70-9299-4c71-ad48-f9393511e87f', 'iPhone 13', 128, 'Indistinto', 260),
	('4dc71ce5-a837-454b-99e8-63ee82439e0f', 'iPhone 11', 256, 'Indistinto', 110),
	('50cdfef6-ea1b-4dd4-bfa4-d87fa0824c0f', 'iPhone 11 Pro Max', 64, 'Indistinto', 185),
	('54d3e4f0-5474-4b37-8232-49776a8a9e38', 'iPhone 14', 256, 'Indistinto', 315),
	('56a96ac0-4425-452d-aed5-d81743d70f13', 'iPhone 12', 64, 'Indistinto', 170),
	('5839567f-0614-47fd-958b-018b6e21f7bb', 'iPhone 11 Pro Max', 256, 'Indistinto', 200),
	('5df420d7-4404-48e4-80d6-8fe9ab4a4956', 'iPhone 13 Pro', 256, 'Indistinto', 360),
	('5e5586ff-2163-4a2a-b07f-30f5e43f523a', 'iPhone 14 Pro', 256, 'Indistinto', 425),
	('5f25410e-bdab-4d8c-8b15-dc5f71d1731d', 'iPhone 15 Pro', 256, '+90%', 540),
	('626661d3-7cd8-46b6-bd0f-7f137fd27faf', 'iPhone 14', 128, 'Indistinto', 300),
	('7cbca910-64e4-43ee-b0df-1f11e982fd23', 'iPhone 15 Pro Max', 256, '85% - 89%', 630),
	('843a2f7c-4b92-44b2-8b7f-9d6f2b364e63', 'iPhone 13', 256, 'Indistinto', 270),
	('8a0956d0-1919-4e2f-be6b-8d990634a346', 'iPhone 12', 128, 'Indistinto', 180),
	('953e4e9c-59d4-4584-8adb-8adc12ba506f', 'iPhone 13 mini', 128, 'Indistinto', 200),
	('998b3b22-bb9b-4599-aba6-6350ba1de5b5', 'iPhone 15', 128, '82% - 84%', 400),
	('9c9a87d7-3a09-413c-9068-df3dd4a7ce06', 'iPhone 12 mini', 128, 'Indistinto', 110),
	('a7c34567-7057-4655-a710-bb8b550a90a0', 'iPhone 11 Pro', 64, 'Indistinto', 150),
	('b692bf37-6436-4f40-8656-a7fdb4fbeda1', 'iPhone 14 Plus', 128, 'Indistinto', 315),
	('c460707a-a7c0-4a5d-be6f-c4a21d41ac9c', 'iPhone 15 Plus', 256, 'Indistinto', 440),
	('ca22e447-9799-4481-8b45-92412f891810', 'iPhone 15 Pro', 128, '+90%', 520),
	('d115486f-b097-40be-87e2-d8db38ef4bed', 'iPhone 15 Pro', 256, '85% - 89%', 540),
	('db017dd7-fab1-457b-90d1-28492ca471f4', 'iPhone 12 Pro', 256, 'Indistinto', 250),
	('e4547b2c-f11c-4fcd-9a09-923c65635810', 'iPhone 13 Pro Max', 256, 'Indistinto', 430),
	('ea51e1c7-55bc-4e8b-aebb-b3ceda0535cf', 'iPhone 12 Pro Max', 128, 'Indistinto', 280),
	('ee5366c4-7ee2-4fd0-9371-1c12ca53cc74', 'iPhone 15 Plus', 128, 'Indistinto', 430),
	('ef62a7be-e07b-4c9d-a245-000b5ddd142f', 'iPhone 12 mini', 64, 'Indistinto', 100),
	('f369c508-33a9-4a3c-b826-1ae313d7d741', 'iPhone 14 Pro Max', 128, 'Indistinto', 500),
	('f5a751df-97d4-40da-9e6a-6588077e6cca', 'iPhone 13 Pro Max', 128, 'Indistinto', 410);

-- Volcando estructura para tabla apple_office.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_username_key` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla apple_office.user: ~2 rows (aproximadamente)
DELETE FROM `user`;
INSERT INTO `user` (`id`, `username`, `password`) VALUES
	('52605b50-ac5d-4a91-b6ee-0d6e709b6aca', 'DamianJuarez', '$2b$10$YyEsWe39dI3AFF14CaYhh.dnU6l/G16nVN2vhcDTRmbtTjbWEMCwm'),
	('6bdc44e2-0c17-41fe-9b51-35ac41b2b104', 'FedeOieni', '$2b$10$Lbul0Fot6LzUAHdz7OWdwuzlbiemKrtmtKyEAK2QD68GZGgCl.QJ6');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
