CREATE TABLE log(
    id INT IDENTITY PRIMARY KEY,
	tablename NVARCHAR(64) NOT NULL,
    before NVARCHAR(MAX),
    after NVARCHAR(MAX),
    timestamp DATETIME2 NOT NULL,
    username NVARCHAR(64)
);