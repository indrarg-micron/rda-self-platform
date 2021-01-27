SELECT c.[id]
      ,c.[section]
      ,c.[level]
      ,c.[category]
      ,c.[item]
      ,c.[status]
  FROM [RDA_IMP_INFO].[dbo].[checklist] c
  --###PERMISSION_FILTER_HERE###
  ORDER BY c.section, c.level, c.category