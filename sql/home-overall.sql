SELECT p.[username]
      ,p.[gjs]
      ,SUM(s.[score])
  FROM [RDA_IMP_INFO].[dbo].[score] s
  JOIN [RDA_IMP_INFO].[dbo].[people] p
    ON s.[people_id] = p.[id]
  JOIN [RDA_IMP_INFO].[dbo].[checklist] c
    ON s.[checklist_id] = c.[id]
  WHERE p.[section] = '###YOUR_SECTION_HERE###'
    AND s.[fy_quarter] = '###DESIRED_FQ_HERE###'
    AND p.[status] = 'active'
    AND c.[status] = 'active'
  GROUP BY p.[username], p.[gjs]
  ORDER BY p.[username]