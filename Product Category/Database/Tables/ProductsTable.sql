CREATE TABLE Products (
Id VARCHAR(255) PRIMARY KEY,
Name VARCHAR(255),
CategoryId VARCHAR(255) FOREIGN KEY REFERENCES Category(Id) NOT NULL
)