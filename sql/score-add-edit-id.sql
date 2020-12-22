BEGIN TRANSACTION

-- Temporary table with edited/new data
CREATE TABLE #temp_score (
	id INT,
	employee_id INT,
	checklist_id INT,
	score INT,
);

-- Insert edited/new data into temp table
INSERT INTO #temp_score
VALUES ###INSERT_VALUE_STRING_HERE### 


-- Update existing and add missing
MERGE INTO [RDA_IMP_INFO].[dbo].[employee_checklist_score] AS t1    -- Target
USING #temp_score AS t2					                                    -- Source
   ON t1.id = t2.id

WHEN MATCHED THEN									                                  -- On match update
     UPDATE SET t1.[employee_id] = t2.[employee_id]
           ,t1.[checklist_id] = t2.[checklist_id]
           ,t1.[score] = t2.[score]

WHEN NOT MATCHED THEN								                                -- Add missing
     INSERT ([employee_id]
           ,[checklist_id]
           ,[score])
     VALUES (t2.[employee_id]
           ,t2.[checklist_id]
           ,t2.[score]);

DROP TABLE #temp_score

COMMIT TRANSACTION