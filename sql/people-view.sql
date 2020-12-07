SELECT e.[id]
      ,e.[first_name]
      ,e.[username]
      ,e.[area]
      ,e.[section]
      ,e.[shift]
      ,e.[gjs]
      ,e.[status]
      ,e.[permission]
	  ,e.[manager_id]
	  ,m.[first_name] as manager_first_name
  FROM [RDA_IMP_INFO].[dbo].[employee] e
  LEFT JOIN [RDA_IMP_INFO].[dbo].[employee] m
  ON e.manager_id = m.id
  ORDER BY e.section, e.manager_id