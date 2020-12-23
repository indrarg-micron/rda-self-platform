SELECT s.[id]
	    ,e.[id] as 'user_id'
	    ,c.[id] as 'checklist_id'
      ,e.[username]
      ,c.[section]
	    ,c.[level]
	    ,c.[category]
	    ,c.[item]
      ,s.[score]
  FROM [RDA_IMP_INFO].[dbo].[employee_checklist_score] s
  JOIN [RDA_IMP_INFO].[dbo].[employee] e
  ON s.[employee_id] = e.[id]
  JOIN [RDA_IMP_INFO].[dbo].[checklist] c
  ON s.[checklist_id] = c.[id]
  ORDER BY e.[username]