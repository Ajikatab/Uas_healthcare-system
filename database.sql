-- Create the database
CREATE DATABASE IF NOT EXISTS healthcare_system;
USE healthcare_system;

-- Users table
CREATE TABLE users (
    id VARCHAR(191) PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(191) NOT NULL,
    role ENUM('ADMIN', 'DOCTOR', 'PATIENT') DEFAULT 'PATIENT',
    name VARCHAR(191) NOT NULL,
    createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3),
    INDEX email_idx(email)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Patients table
CREATE TABLE patients (
    id VARCHAR(191) PRIMARY KEY,
    userId VARCHAR(191) NOT NULL,
    dateOfBirth DATETIME(3) NOT NULL,
    address TEXT NOT NULL,
    createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX userId_idx(userId)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Medical Records table
CREATE TABLE medical_records (
    id VARCHAR(191) PRIMARY KEY,
    patientId VARCHAR(191) NOT NULL,
    diagnosis TEXT NOT NULL,
    prescription TEXT,
    notes TEXT,
    createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3),
    FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX patientId_idx(patientId)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Appointments table
CREATE TABLE appointments (
    id VARCHAR(191) PRIMARY KEY,
    patientId VARCHAR(191) NOT NULL,
    doctorId VARCHAR(191) NOT NULL,
    dateTime DATETIME(3) NOT NULL,
    status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
    notes TEXT,
    createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3),
    FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctorId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX patientId_idx(patientId),
    INDEX doctorId_idx(doctorId)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create an admin user (password: admin123)
INSERT INTO users (id, email, password, role, name, createdAt, updatedAt)
VALUES (
    'clhqwdb0m0000qwzx9p8y1d1x',
    'admin@healthcare.com',
    '$2a$12$k8Y36DeQ2wNYJA.HgxSIW.ErLGyfF.abWjl9PFJUxgN4GJO7eKHfi',
    'ADMIN',
    'System Admin',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
);

-- Create a sample doctor
INSERT INTO users (id, email, password, role, name, createdAt, updatedAt)
VALUES (
    'clhqwdb0m0001qwzx7m1y1d1x',
    'doctor@healthcare.com',
    '$2a$12$k8Y36DeQ2wNYJA.HgxSIW.ErLGyfF.abWjl9PFJUxgN4GJO7eKHfi',
    'DOCTOR',
    'Dr. John Smith',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
);
