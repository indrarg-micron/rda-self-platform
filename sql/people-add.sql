BEGIN TRANSACTION

INSERT INTO [dbo].[employee]
           ([id]
           ,[first_name]
           ,[username]
           ,[area]
           ,[section]
           ,[shift]
           ,[gjs]
           ,[status]
           ,[permission]
           ,[manager_id])
     VALUES
           ###INSERT_VALUE_STRING_HERE###

COMMIT TRANSACTION