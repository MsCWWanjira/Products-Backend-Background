USE Inventory
GO
CREATE OR ALTER PROCEDURE addProduct(@Id VARCHAR(255), @Name VARCHAR(255), @CategoryId VARCHAR(255))
AS
BEGIN
INSERT INTO Products (Id, Name, CategoryId) VALUES(@Id, @Name, @CategoryId)
END
GO