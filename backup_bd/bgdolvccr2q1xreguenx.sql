-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: bgdolvccr2q1xreguenx-mysql.services.clever-cloud.com:3306
-- Generation Time: Jun 16, 2021 at 06:51 PM
-- Server version: 8.0.22-13
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bgdolvccr2q1xreguenx`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `clienteElimina` (IN `usuario` VARCHAR(50))  BEGIN

DELETE FROM AccountMove
	WHERE AccountID IN
	(SELECT AccountID FROM Account 
     WHERE PersonID IN
     (SELECT PersonID FROM Customer WHERE username = usuario)); 
     
DELETE FROM Services	 
     WHERE PersonID IN
     (SELECT PersonID FROM Customer WHERE username = usuario); 
     
DELETE FROM Account 
    WHERE PersonID IN
    (SELECT PersonID FROM Customer WHERE username = usuario);

DELETE FROM Customer WHERE username = usuario;

END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `clienteInserta` (IN `username` VARCHAR(50), IN `documento` VARCHAR(50), IN `firstname` VARCHAR(250), IN `lastname` VARCHAR(250), IN `clave` VARCHAR(50))  BEGIN
   INSERT INTO Customer VALUES (NULL, username, documento, firstname, lastname, clave);
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `clienteReporte` (IN `usuario` VARCHAR(50))  READS SQL DATA
BEGIN
SELECT
   	Customer.Username,
	Customer.Documento,
	Customer.Firstname as Nombre,
	Customer.Lastname as Apellido,
	Customer.Password
FROM Customer
WHERE Customer.Username = usuario 
ORDER BY Customer.Username;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `clienteSelecciona` ()  READS SQL DATA
BEGIN
   SELECT CONCAT(username," - ",documento, " | ", firstname," ",lastname) as Cliente FROM Customer ORDER BY username ASC;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `clienteSeleccionaArbolCompleto2` (IN `DNI` VARCHAR(50), IN `Banco` VARCHAR(50), IN `TipoCuenta` VARCHAR(50), IN `NumeroCuenta` VARCHAR(50), IN `Servicio` VARCHAR(50))  READS SQL DATA
BEGIN
select * 
from Customer c 
     inner join Account a on c.PersonID = a.PersonID 
     inner join Services s on a.accountid = s.accountid 
Where 1=1 
	AND c.Documento = DNI 
    OR (a.BankName = Banco 
    	and a.accountType = TipoCuenta 
    	and a.accountNumber = NumeroCuenta) 
    OR ServiceName = Servicio
ORDER BY c.Username, a.BankName, a.AccountType, a.AccountNumber, s.Servicename;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `clienteSeleccionaPorDNIoUsername` (IN `usuario` VARCHAR(50), IN `DNI` VARCHAR(50))  READS SQL DATA
BEGIN
SELECT PersonID, Username, Documento, Firstname, Lastname 
FROM Customer 
WHERE 1=1
AND Username = usuario
 OR Documento = DNI;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `clienteValidaDocExistente` (IN `documento` VARCHAR(50), OUT `salida` INT)  BEGIN
DECLARE VarInter INT;
SET VarInter = 0;
SELECT DISTINCT COUNT(username) as Qty INTO VarInter FROM Customer WHERE Customer.Documento = documento;
SET @salida = VarInter;
SELECT @salida AS Salida FROM DUAL;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `clienteValidaUserExistente` (IN `username` VARCHAR(50), OUT `salida` INT)  BEGIN
DECLARE VarInter INT;
SET VarInter = 0;
SELECT DISTINCT COUNT(username) as Qty INTO VarInter FROM Customer WHERE Customer.username = username;
SET @salida = VarInter;
SELECT @salida AS Salida FROM DUAL;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `cuentaElimina` (IN `banco` VARCHAR(50), IN `tipo_cuenta` VARCHAR(50), IN `numero_cuenta` VARCHAR(50))  BEGIN

DELETE FROM AccountMove
	WHERE AccountID IN
	(SELECT AccountID FROM Account 
     WHERE BankName = banco AND AccountType = tipo_cuenta AND AccountNumber = numero_cuenta); 
   
   DELETE FROM Account WHERE BankName = banco AND AccountType = tipo_cuenta AND AccountNumber = numero_cuenta;
   
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `cuentaInserta` (IN `cliente` VARCHAR(50), IN `banco` VARCHAR(50), IN `tipo_cuenta` VARCHAR(50), IN `numero_cuenta` VARCHAR(50))  BEGIN
DECLARE IDCliente INT;
DECLARE UltimoID INT;
   SELECT PersonID INTO IDCliente FROM Customer WHERE Customer.username = cliente; 
   INSERT INTO Account VALUES (IDCliente, NULL, numero_cuenta, banco, tipo_cuenta);
   SELECT LAST_INSERT_ID() INTO UltimoID;
   INSERT INTO AccountMove VALUES(UltimoID, 0, 0, CURRENT_TIMESTAMP());
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `cuentaReporte` (IN `usuario` VARCHAR(50))  READS SQL DATA
BEGIN
SELECT
	Account.BankName as Banco,
    Account.AccountType as Tipo_Cuenta,
   	Account.AccountNumber as Numero_Cuenta,
    AccountMove.AccountBalance as Saldo
FROM Customer
	INNER JOIN Account ON Customer.PersonID = Account.PersonID
    INNER JOIN AccountMove ON Account.AccountID = AccountMove.AccountID
WHERE Customer.Username = usuario 
ORDER BY Account.BankName,
    	 Account.AccountType,
   		 Account.AccountNumber;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `cuentaSaldo` (IN `numero_cuenta` VARCHAR(50), IN `banco` VARCHAR(50), IN `tipo_cuenta` VARCHAR(50), OUT `salida` DECIMAL(10,2))  BEGIN
DECLARE VarInter DECIMAL(10,2);
SET VarInter = 0;
SELECT am.AccountBalance INTO VarInter 
FROM Account a INNER JOIN AccountMove am ON a.AccountID = am.AccountID 
WHERE numero_cuenta = AccountNumber AND banco = BankName AND tipo_cuenta = AccountType;
SET @salida = VarInter;
SELECT @salida AS Salida FROM DUAL;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `cuentaSelecciona` ()  READS SQL DATA
BEGIN
   SELECT CONCAT(BankName," | ",AccountType," | ",AccountNumber) as Cuenta FROM Account ORDER BY BankName, AccountType ASC;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `cuentaSeleccionaPorCliente` (IN `username` VARCHAR(50))  READS SQL DATA
BEGIN
   SELECT CONCAT(BankName," | ",AccountType," | ",AccountNumber) as Cuenta 
   FROM Customer INNER JOIN Account
        ON Customer.PersonID = Account.PersonID
   WHERE Customer.Username = username 
   ORDER BY BankName, AccountType ASC;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `cuentaSeleccionaPorPersonIDTipoCuentaBanco` (IN `IdPersona` VARCHAR(50), IN `TipoCuenta` VARCHAR(50), IN `Banco` VARCHAR(50))  READS SQL DATA
BEGIN
select AccountID, AccountNumber, AccountType, BankName
from Account a inner join Customer c on a.PersonID = c.PersonID  
Where 1=1 
and c.PersonId = IdPersona
and a.AccountType = TipoCuenta 
and a.BankName = Banco ;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `cuentaValidaExistente` (IN `numero_cuenta` VARCHAR(50), IN `banco` VARCHAR(50), IN `tipo_cuenta` VARCHAR(50), OUT `salida` INT)  BEGIN
DECLARE VarInter INT;
SET VarInter = 0;
SELECT DISTINCT COUNT(*) as Qty INTO VarInter FROM Account WHERE numero_cuenta = AccountNumber AND banco = BankName AND tipo_cuenta = AccountType;
SET @salida = VarInter;
SELECT @salida AS Salida FROM DUAL;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `movimientoInserta` (IN `banco` VARCHAR(50), IN `tipo_cuenta` VARCHAR(50), IN `numero_cuenta` VARCHAR(50), IN `importe` DECIMAL(10,2))  BEGIN

    UPDATE AccountMove
    SET PreviousBalance = AccountBalance
    WHERE AccountID IN
    (SELECT AccountID FROM Account WHERE 1=1
    AND Account.BankName = banco
    AND Account.AccountType = tipo_cuenta
    AND Account.AccountNumber = numero_cuenta);
    
    UPDATE AccountMove
    SET AccountBalance = AccountBalance + importe
    WHERE AccountID IN
    (SELECT AccountID FROM Account WHERE 1=1
    AND Account.BankName = banco
    AND Account.AccountType = tipo_cuenta
    AND Account.AccountNumber = numero_cuenta);    
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `movimientoSeleccionaPorCuenta` (IN `Banco` VARCHAR(50), IN `TipoCuenta` VARCHAR(50), IN `NumeroCUenta` VARCHAR(50))  READS SQL DATA
BEGIN
select am.AccountID, am.AccountBalance, am.PreviousBalance, am.LastDate
from Account a inner join AccountMove am on a.AccountID = am.AccountID 
Where 1=1
and a.AccountNumber = NumeroCuenta 
and a.BankName = Banco 
and a.AccountType = TipoCuenta;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `servicioElimina` (IN `servicio` VARCHAR(250), IN `usuario` VARCHAR(50))  BEGIN
   DELETE FROM Services 
   WHERE 1=1
   AND Services.ServiceName = servicio
   AND Services.PersonID IN
       (SELECT PersonID FROM Customer 
   		WHERE Customer.Username = usuario);
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `servicioInserta` (IN `servicio` VARCHAR(50), IN `cuenta` VARCHAR(50), IN `usuario` VARCHAR(50), IN `importe` DECIMAL(10,2))  BEGIN
DECLARE IDPersona INT;
   SELECT PersonID INTO IDPersona FROM Customer WHERE Customer.Username = usuario; 
   INSERT INTO Services VALUES (IDPersona, NULL, cuenta, servicio, importe, CURRENT_TIMESTAMP());
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `servicioReporte` (IN `usuario` VARCHAR(50))  READS SQL DATA
BEGIN
SELECT
	Services.ServiceName AS Servicio,
    Services.AccountServices AS Cuenta_Servicio,
    Services.PayAccount AS Imp_Servicio
FROM Customer
	INNER JOIN Services ON Customer.PersonID = Services.PersonID    
WHERE Customer.Username = usuario 
ORDER BY Services.ServiceName;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `servicioSeleccionaPorCliente` (IN `usuario` VARCHAR(50))  READS SQL DATA
BEGIN
   SELECT CONCAT(ServiceName," | ",PayAccount) as Servicio 
   FROM Services INNER JOIN Customer
        ON Services.PersonID = Customer.PersonID
   WHERE Customer.Username = usuario
   ORDER BY ServiceName, PayAccount ASC;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `servicioValidaCodigoExistente` (IN `codigo` VARCHAR(250), OUT `salida` INT)  BEGIN
DECLARE VarInter INT;
SET VarInter = 0;
SELECT DISTINCT COUNT(*) as Qty INTO VarInter 
FROM Services 
WHERE codigo = Services.AccountServices;
SET @salida = VarInter;
SELECT @salida AS Salida FROM DUAL;
END$$

CREATE DEFINER=`udkuqopqwafai3il`@`%` PROCEDURE `servicioValidaExistente` (IN `servicio` VARCHAR(250), IN `usuario` VARCHAR(50), OUT `salida` INT)  BEGIN
DECLARE VarInter INT;
SET VarInter = 0;
SELECT DISTINCT COUNT(*) as Qty INTO VarInter 
FROM Services INNER JOIN Customer ON Services.PersonID = Customer.PersonID
WHERE servicio = Services.ServiceName AND usuario = Customer.Username;
SET @salida = VarInter;
SELECT @salida AS Salida FROM DUAL;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `Account`
--

CREATE TABLE `Account` (
  `PersonID` int NOT NULL,
  `AccountID` int NOT NULL,
  `AccountNumber` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `BankName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `AccountType` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Account`
--

INSERT INTO `Account` (`PersonID`, `AccountID`, `AccountNumber`, `BankName`, `AccountType`) VALUES
(193, 53, '1234567891011121314', 'Macro', 'Caja Ahorro');

-- --------------------------------------------------------

--
-- Table structure for table `AccountMove`
--

CREATE TABLE `AccountMove` (
  `AccountID` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `AccountBalance` decimal(10,2) NOT NULL,
  `PreviousBalance` decimal(10,2) NOT NULL,
  `LastDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `AccountMove`
--

INSERT INTO `AccountMove` (`AccountID`, `AccountBalance`, `PreviousBalance`, `LastDate`) VALUES
('53', '20000.00', '0.00', '2021-06-16 16:03:43');

-- --------------------------------------------------------

--
-- Table structure for table `Customer`
--

CREATE TABLE `Customer` (
  `PersonID` int NOT NULL,
  `Username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `Documento` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `Firstname` varchar(250) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `Lastname` varchar(250) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Customer`
--

INSERT INTO `Customer` (`PersonID`, `Username`, `Documento`, `Firstname`, `Lastname`, `Password`) VALUES
(192, 'testhoy', '1122336677', 'Test', 'hoy', 'clavehoy'),
(193, 'eosuna', '95889904', 'Ervin', 'Osuna', '1234');

-- --------------------------------------------------------

--
-- Table structure for table `Services`
--

CREATE TABLE `Services` (
  `PersonID` int NOT NULL,
  `ServicesID` int NOT NULL,
  `AccountServices` varchar(50) NOT NULL,
  `ServiceName` varchar(250) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `PayAccount` decimal(10,2) NOT NULL,
  `LastDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Services`
--

INSERT INTO `Services` (`PersonID`, `ServicesID`, `AccountServices`, `ServiceName`, `PayAccount`, `LastDate`) VALUES
(193, 39, '', 'SUBE', '100.00', '2021-06-16 16:04:11'),
(192, 40, '123456', 'ETB', '1231.00', '2021-06-16 18:32:14'),
(192, 41, '1234567', 'ETBA', '1234.00', '2021-06-16 18:46:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Account`
--
ALTER TABLE `Account`
  ADD PRIMARY KEY (`AccountID`),
  ADD UNIQUE KEY `Llave-Logica-Cuentas` (`AccountNumber`,`BankName`,`AccountType`),
  ADD KEY `PersonID` (`PersonID`);

--
-- Indexes for table `Customer`
--
ALTER TABLE `Customer`
  ADD PRIMARY KEY (`PersonID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `Clave-Documento` (`Documento`);

--
-- Indexes for table `Services`
--
ALTER TABLE `Services`
  ADD PRIMARY KEY (`ServicesID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Account`
--
ALTER TABLE `Account`
  MODIFY `AccountID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `Customer`
--
ALTER TABLE `Customer`
  MODIFY `PersonID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=194;

--
-- AUTO_INCREMENT for table `Services`
--
ALTER TABLE `Services`
  MODIFY `ServicesID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Account`
--
ALTER TABLE `Account`
  ADD CONSTRAINT `Account_ibfk_1` FOREIGN KEY (`PersonID`) REFERENCES `Customer` (`PersonID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
