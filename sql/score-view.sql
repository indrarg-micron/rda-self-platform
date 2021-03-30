SELECT s.[id]
      ,p.[id] as 'user_id'
      ,c.[id] as 'checklist_id'
      ,p.[username]
      ,c.[section]
      ,c.[level]
      ,c.[category]
      ,c.[item]
      ,s.[score]
      ,s.[fy_quarter]
  FROM [RDA_IMP_INFO].[dbo].[score] s
  JOIN [RDA_IMP_INFO].[dbo].[people] p
    ON s.[people_id] = p.[id]
  JOIN [RDA_IMP_INFO].[dbo].[checklist] c
    ON s.[checklist_id] = c.[id]
  WHERE s.[fy_quarter] = '###QUARTER_TO_LOOK_FOR###'
    ###PERMISSION_FILTER_HERE###
  ORDER BY s.[fy_quarter] DESC, p.[section], p.[username]