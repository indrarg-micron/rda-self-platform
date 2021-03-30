SELECT [username]
      ,[section]
      ,[gjs]
      ,[permission]
  FROM [RDA_IMP_INFO].[dbo].[people]
  WHERE username = ###WHO_ARE_YOU###
    AND [status] = 'active'