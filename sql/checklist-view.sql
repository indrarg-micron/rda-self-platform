SELECT c.[id]
      ,c.[area]
      ,c.[section]
      ,c.[level]
      ,c.[category]
      ,c.[item]
      ,c.[status]
  FROM [RDA_IMP_INFO].[dbo].[checklist] c
  ORDER BY c.section, c.level, c.category