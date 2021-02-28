BEGIN TRANSACTION

-- Declare username for Trigger usage
DECLARE @username VARBINARY(128)
SET @username = CAST(N'###YOUR_USERNAME_HERE###' AS VARBINARY(128))
SET CONTEXT_INFO @username

-- Temporary table with edited/new data
CREATE TABLE #temp_employee (
	id INT NOT NULL UNIQUE,
	first_name NVARCHAR(50) NOT NULL,
	username NVARCHAR(50) NOT NULL UNIQUE,
	section NVARCHAR(50),
	shift CHAR(4),
	gjs CHAR(2),
	status NVARCHAR(50) NOT NULL,
	permission NVARCHAR(50),
	manager_id INT
);

-- Insert edited/new data into temp table
INSERT INTO #temp_employee
VALUES ###INSERT_VALUE_STRING_HERE### 


-- Update existing and add missing
MERGE INTO [RDA_IMP_INFO].[dbo].[employee] AS t1    -- Target
USING #temp_employee AS t2					                -- Source
   ON t1.id = t2.id

WHEN MATCHED THEN									                  -- On match update
     UPDATE SET t1.[first_name] = t2.[first_name]
           ,t1.[username] = t2.[username]
           ,t1.[section] = t2.[section]
           ,t1.[shift] = t2.[shift]
           ,t1.[gjs] = t2.[gjs]
           ,t1.[status] = t2.[status]
           ,t1.[permission] = t2.[permission]
           ,t1.[manager_id] = t2.[manager_id]

WHEN NOT MATCHED THEN								                 -- Add missing
     INSERT ([id]
           ,[first_name]
           ,[username]
           ,[section]
           ,[shift]
           ,[gjs]
           ,[status]
           ,[permission]
           ,[manager_id])
     VALUES (t2.[id]
           ,t2.[first_name]
           ,t2.[username]
           ,t2.[section]
           ,t2.[shift]
           ,t2.[gjs]
           ,t2.[status]
           ,t2.[permission]
           ,t2.[manager_id]);

DROP TABLE #temp_employee

COMMIT TRANSACTION