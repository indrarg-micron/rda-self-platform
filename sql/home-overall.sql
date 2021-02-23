SELECT e.[username]
	    ,e.[gjs]
      ,SUM(s.[score])
  FROM [RDA_IMP_INFO].[dbo].[employee_checklist_score] s
  JOIN [RDA_IMP_INFO].[dbo].[employee] e
  ON s.[employee_id] = e.[id]
  JOIN [RDA_IMP_INFO].[dbo].[checklist] c
  ON s.[checklist_id] = c.[id]
  WHERE e.[section] = '###YOUR_SECTION_HERE###'
  AND s.[fy_quarter] = '###DESIRED_FQ_HERE###'
  AND e.[status] = 'active'
  AND c.[status] = 'active'
  GROUP BY e.[username], e.[gjs]
  ORDER BY e.[username]