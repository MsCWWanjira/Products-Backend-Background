USE SALES
GO
CREATE OR ALTER PROCEDURE addNewUser (
    @UserId VARCHAR(255),
    @UserName VARCHAR(255),
    @Email VARCHAR(255),
    @Password VARCHAR(255)
)

AS
BEGIN


INSERT INTO Users(UserId,UserName,Email,Password)
VALUES(@UserId,@UserName,@Email,@Password)

END