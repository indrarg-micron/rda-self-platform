-- Declare username for Trigger usage
DECLARE @username VARBINARY(128)
SET @username = CAST(N'NODESERVER' AS VARBINARY(128))
SET CONTEXT_INFO @username

-- Port proper
INSERT INTO [RDA_IMP_INFO].[dbo].[employee_checklist_score]
SELECT s.[employee_id]
      ,s.[checklist_id]
      ,s.[score]
      ,'###NEXT_QUARTER###' AS 'fy_quarter'
  FROM [RDA_IMP_INFO].[dbo].[employee_checklist_score] s
  WHERE s.[fy_quarter] = '###CURRENT_QUARTER###'