DECLARE 
    @columns NVARCHAR(MAX) = '', 
    @sql     NVARCHAR(MAX) = '',
    @currQ	 NVARCHAR(MAX) = '###CURRENT_QUARTER_HERE###',
    @section NVARCHAR(MAX) = '###YOUR_SECTION_HERE###'

-- select the category names
SELECT 
    @columns+=QUOTENAME(username) + ','
FROM 
    [RDA_IMP_INFO].[dbo].[employee] e
	WHERE e.[section] = @section
	AND e.[gjs] LIKE 'T%'
	AND e.[status] = 'active'
ORDER BY 
    RIGHT([shift], 1), [username]

-- remove the last comma
SET @columns = LEFT(@columns, LEN(@columns) - 1)

-- construct dynamic SQL
SET @sql ='
SELECT * FROM (
	SELECT e.[username]
		  ,c.[level]
		  ,c.[category]
		  ,c.[item]
		  ,s.[score]
	  FROM [RDA_IMP_INFO].[dbo].[employee_checklist_score] s
	  JOIN [RDA_IMP_INFO].[dbo].[employee] e
	  ON s.[employee_id] = e.[id]
	  JOIN [RDA_IMP_INFO].[dbo].[checklist] c
	  ON s.[checklist_id] = c.[id]
	  WHERE c.section = '''+ @section +'''
	  AND s.fy_quarter = '''+ @currQ +'''
	  AND e.[status] = ''active''
) t
PIVOT (
	SUM(t.score)
	FOR t.username IN ('+ @columns +')
) AS pivot_table
ORDER BY [level], [category]'

-- execute the dynamic SQL
EXECUTE sp_executesql @sql