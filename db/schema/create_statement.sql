-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema MonzoMappedDB
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema MonzoMappedDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `MonzoMappedDB` DEFAULT CHARACTER SET utf8 ;
USE `MonzoMappedDB` ;

-- -----------------------------------------------------
-- Table `MonzoMappedDB`.`Users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `MonzoMappedDB`.`Users` ;

CREATE TABLE IF NOT EXISTS `MonzoMappedDB`.`Users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` CHAR(60) NOT NULL,
  `created_date` DATETIME NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `userID_UNIQUE` (`user_id` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 1000;


-- -----------------------------------------------------
-- Table `MonzoMappedDB`.`MonzoLink`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `MonzoMappedDB`.`MonzoLink` ;

CREATE TABLE IF NOT EXISTS `MonzoMappedDB`.`MonzoLink` (
  `link_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `access_token` VARCHAR(45) NULL,
  `refresh_token` VARCHAR(45) NULL,
  PRIMARY KEY (`link_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `MonzoMappedDB`.`Users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MonzoMappedDB`.`Transaction`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `MonzoMappedDB`.`Transaction` ;

CREATE TABLE IF NOT EXISTS `MonzoMappedDB`.`Transaction` (
  `transaction_id` INT NOT NULL AUTO_INCREMENT,
  `link_id` INT NOT NULL,
  `cost` BIGINT(8) NOT NULL,
  `time` DATETIME NOT NULL,
  `latitude` VARCHAR(45) NULL,
  `longitude` VARCHAR(45) NULL,
  `business` VARCHAR(255) NOT NULL,
  `logo` VARCHAR(255) NOT NULL DEFAULT 'no-logo.png',
  `what3words` VARCHAR(80) NULL,
  PRIMARY KEY (`transaction_id`),
  UNIQUE INDEX `transaction_id_UNIQUE` (`transaction_id` ASC),
  UNIQUE INDEX `link_id_UNIQUE` (`link_id` ASC),
  CONSTRAINT `link_id`
    FOREIGN KEY (`link_id`)
    REFERENCES `MonzoMappedDB`.`MonzoLink` (`link_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
