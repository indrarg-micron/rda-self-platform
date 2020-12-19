BEGIN TRANSACTION

-- Temporary table with edited/new data
CREATE TABLE #temp_employee (
	id INT NOT NULL UNIQUE,
	first_name NVARCHAR(50) NOT NULL,
	username NVARCHAR(50) NOT NULL UNIQUE,
	area NVARCHAR(50),
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
MERGE INTO [RDA_IMP_INFO].[dbo].[employee] AS T1    -- Target
USING #temp_employee AS T2					                -- Source
   ON T1.id = T2.id

WHEN MATCHED THEN									                  -- On match update
     UPDATE SET T1.[id] = T2.[id]
           ,T1.[first_name] = T2.[first_name]
           ,T1.[username] = T2.[username]
           ,T1.[area] = T2.[area]
           ,T1.[section] = T2.[section]
           ,T1.[shift] = T2.[shift]
           ,T1.[gjs] = T2.[gjs]
           ,T1.[status] = T2.[status]
           ,T1.[permission] = T2.[permission]
           ,T1.[manager_id] = T2.[manager_id]

WHEN NOT MATCHED THEN								                 -- Add missing
     INSERT ([id]
           ,[first_name]
           ,[username]
           ,[area]
           ,[section]
           ,[shift]
           ,[gjs]
           ,[status]
           ,[permission]
           ,[manager_id])
     VALUES (T2.[id]
           ,T2.[first_name]
           ,T2.[username]
           ,T2.[area]
           ,T2.[section]
           ,T2.[shift]
           ,T2.[gjs]
           ,T2.[status]
           ,T2.[permission]
           ,T2.[manager_id]);

DROP TABLE #temp_employee

COMMIT TRANSACTION