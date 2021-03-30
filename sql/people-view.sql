SELECT p.[id]
      ,p.[first_name]
      ,p.[username]
      ,p.[section]
      ,p.[shift]
      ,p.[gjs]
      ,p.[status]
      ,p.[permission]
      ,p.[manager_id]
      ,m.[first_name] AS manager_first_name
  FROM [RDA_IMP_INFO].[dbo].[people] p
  LEFT JOIN [RDA_IMP_INFO].[dbo].[people] m
    ON p.manager_id = m.id
  ###PERMISSION_FILTER_HERE###
  ORDER BY p.section, p.manager_id