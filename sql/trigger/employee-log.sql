CREATE TRIGGER people_log
ON [RDA_IMP_INFO].[dbo].[people]
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
  SET NOCOUNT ON;

  -- get username from session CONTEXT_INFO()
  DECLARE @username NVARCHAR(64)
  SET @username = CONVERT(NVARCHAR(64), CONTEXT_INFO())

  IF EXISTS(SELECT 1 FROM deleted)
  OR EXISTS(SELECT 1 FROM inserted)
  BEGIN
  INSERT INTO [RDA_IMP_INFO].[dbo].[log](
    [tablename]
    ,[before]
    ,[after]
    ,[timestamp]
    ,[username]
  )
  SELECT
    'people'
    ,( SELECT * FROM deleted FOR XML AUTO )
    ,( SELECT * FROM inserted FOR XML AUTO )
    ,GETDATE()
    ,@username
  END

END