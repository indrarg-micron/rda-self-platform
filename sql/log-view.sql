SELECT [id]
      ,[tablename]
      ,[before]
      ,[after]
      ,[timestamp]
      ,[username]
  FROM [RDA_IMP_INFO].[dbo].[log]
  WHERE [timestamp] >=  '###FROM_WHEN###' AND
        [timestamp] < DATEADD(DAY, 1, '###TO_WHEN###')
  ORDER BY [timestamp]