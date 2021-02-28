BEGIN TRANSACTION

-- Declare username for Trigger usage
DECLARE @username VARBINARY(128)
SET @username = CAST(N'###YOUR_USERNAME_HERE###' AS VARBINARY(128))
SET CONTEXT_INFO @username

-- Temporary table with list of items to delete
CREATE TABLE #temp_score (
	id INT NOT NULL UNIQUE,
);

-- Insert edited/new data into temp table
INSERT INTO #temp_score
VALUES ###INSERT_VALUE_STRING_HERE###

DELETE t1 
  FROM [RDA_IMP_INFO].[dbo].[employee_checklist_score] t1
  JOIN #temp_score t2 ON t1.id = t2.id;

DROP TABLE #temp_score

COMMIT TRANSACTION