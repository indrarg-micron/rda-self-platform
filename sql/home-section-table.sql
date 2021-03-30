DECLARE 
    @columns NVARCHAR(MAX) = '', 
    @sql     NVARCHAR(MAX) = '',
    @currQ   NVARCHAR(MAX) = '###CURRENT_QUARTER_HERE###',
    @section NVARCHAR(MAX) = '###YOUR_SECTION_HERE###'

-- select the category names
SELECT 
    @columns+=QUOTENAME(username) + ','
FROM 
    [RDA_IMP_INFO].[dbo].[people] p
    WHERE p.[section] = @section
      AND p.[gjs] LIKE 'T%'
      AND p.[status] = 'active'
ORDER BY 
    /*RIGHT([shift], 1), */[username]

-- remove the last comma
SET @columns = LEFT(@columns, LEN(@columns) - 1)

-- construct dynamic SQL
SET @sql ='
SELECT * FROM (
  SELECT p.[username]
      ,c.[level]
      ,c.[category]
      ,c.[item]
      ,c.[link]
      ,s.[score]
    FROM [RDA_IMP_INFO].[dbo].[score] s
    JOIN [RDA_IMP_INFO].[dbo].[people] p
      ON s.[people_id] = p.[id]
    JOIN [RDA_IMP_INFO].[dbo].[checklist] c
      ON s.[checklist_id] = c.[id]
    WHERE c.section = '''+ @section +'''
      AND s.fy_quarter = '''+ @currQ +'''
      AND p.[status] = ''active''
      AND c.[status] = ''active''
) t
PIVOT (
  SUM(t.score)
  FOR t.username IN ('+ @columns +')
) AS pivot_table
ORDER BY [level], [category]'

-- execute the dynamic SQL
EXECUTE sp_executesql @sql