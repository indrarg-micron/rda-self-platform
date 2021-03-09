BEGIN TRANSACTION

-- Declare username for Trigger usage
DECLARE @username VARBINARY(128)
SET @username = CAST(N'###YOUR_USERNAME_HERE###' AS VARBINARY(128))
SET CONTEXT_INFO @username

-- Temporary table with edited/new data
CREATE TABLE #temp_checklist (
	id INT,
	section NVARCHAR(50),
	level INT,
	category NVARCHAR(50),
	item NVARCHAR(255),
	status NVARCHAR(50) NOT NULL,
  link NVARCHAR(MAX)
);

-- Insert edited/new data into temp table
INSERT INTO #temp_checklist
VALUES ###INSERT_VALUE_STRING_HERE### 


-- Update existing and add missing
MERGE INTO [RDA_IMP_INFO].[dbo].[checklist] AS t1    -- Target
USING #temp_checklist AS t2					                 -- Source
   ON t1.id = t2.id

WHEN MATCHED THEN									                  -- On match update
     UPDATE SET t1.[section] = t2.[section]
           ,t1.[level] = t2.[level]
           ,t1.[category] = t2.[category]
           ,t1.[item] = t2.[item]
		       ,t1.[status] = t2.[status]
		       ,t1.[link] = t2.[link]

WHEN NOT MATCHED THEN								                 -- Add missing
     INSERT ([section]
           ,[level]
           ,[category]
           ,[item]
           ,[status]
           ,[link])
     VALUES (t2.[section]
           ,t2.[level]
           ,t2.[category]
           ,t2.[item]
           ,t2.[status]
           ,t2.[link]);

DROP TABLE #temp_checklist

COMMIT TRANSACTION