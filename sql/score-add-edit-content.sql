BEGIN TRANSACTION

-- Temporary table with edited/new data
CREATE TABLE #temp_score (
	id INT,
	username NVARCHAR(50),
	section NVARCHAR(50),
	level INT,
	category NVARCHAR(50),
	item NVARCHAR(255),
	score INT,
  fy_quarter CHAR(6)
);

-- Insert edited/new data into temp table
INSERT INTO #temp_score
VALUES ###INSERT_VALUE_STRING_HERE### 

-- Join with employee and checklist to get respective IDs 
SELECT s.[id],
	s.[username],
	s.[section],
	s.[level],
	s.[category],
	s.[item],
	s.[score],
  s.[fy_quarter],
	e.[id] as [employee_id],
	c.[id] as [checklist_id]
INTO #temp_score_final
FROM #temp_score s
LEFT JOIN [RDA_IMP_INFO].[dbo].[employee] e
ON s.username = e.username
LEFT JOIN [RDA_IMP_INFO].[dbo].[checklist] c
ON s.section = c.section
AND s.level = c.level
AND s.category = c.category
AND s.item = c.item

-- Update existing and add missing
MERGE INTO [RDA_IMP_INFO].[dbo].[employee_checklist_score] AS t1    -- Target
USING #temp_score_final AS t2					                 -- Source
   ON t1.id = t2.id

WHEN MATCHED THEN									                  -- On match update
     UPDATE SET t1.[employee_id] = t2.[employee_id]
           ,t1.[checklist_id] = t2.[checklist_id]
           ,t1.[score] = t2.[score]
           ,t1.[fy_quarter] = t2.[fy_quarter]

WHEN NOT MATCHED THEN								                 -- Add missing
     INSERT ([employee_id]
           ,[checklist_id]
           ,[score]
           ,[fy_quarter])
     VALUES (t2.[employee_id]
           ,t2.[checklist_id]
           ,t2.[score]
           ,t2.[fy_quarter]);

DROP TABLE #temp_score, #temp_score_final

COMMIT TRANSACTION