BEGIN TRANSACTION

-- Temporary table with edited/new data
CREATE TABLE #temp_checklist (
	id INT,
	area NVARCHAR(50),
	section NVARCHAR(50),
	level INT,
	category NVARCHAR(50),
	item NVARCHAR(255),
	status NVARCHAR(50) NOT NULL,
);

-- Insert edited/new data into temp table
INSERT INTO #temp_checklist
VALUES ###INSERT_VALUE_STRING_HERE### 


-- Update existing and add missing
MERGE INTO [RDA_IMP_INFO].[dbo].[checklist] AS t1    -- Target
USING #temp_checklist AS t2					                 -- Source
   ON t1.id = t2.id

WHEN MATCHED THEN									                  -- On match update
     UPDATE SET t1.[area] = t2.[area]
           ,t1.[section] = t2.[section]
           ,t1.[level] = t2.[level]
           ,t1.[category] = t2.[category]
           ,t1.[item] = t2.[item]
		   ,t1.[status] = t2.[status]

WHEN NOT MATCHED THEN								                 -- Add missing
     INSERT ([area]
           ,[section]
           ,[level]
           ,[category]
           ,[item]
           ,[status])
     VALUES (t2.[area]
           ,t2.[section]
           ,t2.[level]
           ,t2.[category]
           ,t2.[item]
           ,t2.[status]);

DROP TABLE #temp_checklist

COMMIT TRANSACTION