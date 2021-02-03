SELECT e.[username]
      ,e.[section]
      ,e.[gjs]
	    ,s.[fy_quarter]
	    ,SUM(s.[score]) total_score
  FROM [RDA_IMP_INFO].[dbo].[employee_checklist_score] s
  JOIN [RDA_IMP_INFO].[dbo].[employee] e
  ON s.[employee_id] = e.[id]
  JOIN [RDA_IMP_INFO].[dbo].[checklist] c
  ON s.[checklist_id] = c.[id]
  WHERE e.[status] = 'active'
  ###ADDITIONAL_FILTER_HERE###
  GROUP BY e.[username], e.[section], e.[gjs], s.[fy_quarter]
  ORDER BY e.[gjs], e.[username], s.[fy_quarter]