SELECT p.[username]
      ,p.[section]
      ,p.[gjs]
      ,s.[fy_quarter]
      ,SUM(s.[score]) total_score
  FROM [RDA_IMP_INFO].[dbo].[score] s
  JOIN [RDA_IMP_INFO].[dbo].[people] p
    ON s.[people_id] = p.[id]
  JOIN [RDA_IMP_INFO].[dbo].[checklist] c
    ON s.[checklist_id] = c.[id]
  WHERE p.[status] = 'active'
    AND c.[status] = 'active'
  ###ADDITIONAL_FILTER_HERE###
  GROUP BY p.[username], p.[section], p.[gjs], s.[fy_quarter]
  ORDER BY p.[gjs], p.[username], s.[fy_quarter]