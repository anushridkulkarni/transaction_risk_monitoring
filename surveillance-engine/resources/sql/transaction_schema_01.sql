CREATE DATABASE `surveillance_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
CREATE TABLE `transactions` (
                                `id` bigint NOT NULL AUTO_INCREMENT,
                                `from_account` varchar(255) DEFAULT NULL,
                                `to_account` varchar(255) DEFAULT NULL,
                                `amount` double NOT NULL,
                                `transaction_type` varchar(255) DEFAULT NULL,
                                `risk_score` int DEFAULT '0',
                                `status` varchar(255) DEFAULT NULL,
                                `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                                PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
