DECLARE 
    @workerno INT,
    @section NVARCHAR(MAX)

-- find out the worker no, section
SELECT 
    @workerno = [id],
    @section = [section]
FROM 
    [RDA_IMP_INFO].[dbo].[people] p
WHERE p.[username] = ###YOUR_USERNAME_HERE###
AND p.[status] = 'active'

SELECT * FROM (
  -- generate indiv list (indiv list w/ score + section list w/o score)
  SELECT u.[section]
      ,u.[level]
      ,u.[category]
      ,u.[item]
      ,u.[link]
      ,s.[score]
      ,s.[fy_quarter]
  FROM (
    SELECT s.[people_id] 
        ,c.[id]
        ,c.[section]
        ,c.[level]
        ,c.[category]
        ,c.[item]
        ,c.[link]
      FROM [RDA_IMP_INFO].[dbo].[score] s
      JOIN [RDA_IMP_INFO].[dbo].[checklist] c
        ON s.[checklist_id] = c.[id]
      WHERE s.[people_id] = @workerno
        AND s.[fy_quarter] IN ###FY_QUARTER_LIST_HERE###
        AND c.[status] = 'active'

    UNION

    SELECT @workerno as [people_id]
        ,c.[id]
        ,c.[section]
        ,c.[level]
        ,c.[category]
        ,c.[item]
        ,c.[link]
      FROM [RDA_IMP_INFO].[dbo].[checklist] c
      WHERE c.[section] = @section
      AND c.[status] = 'active'
  ) u
  LEFT JOIN [RDA_IMP_INFO].[dbo].[score] s
    ON u.[people_id] = s.[people_id]
    AND u.[id] = s.[checklist_id]
) t
PIVOT (
  SUM(t.score)
  FOR t.fy_quarter IN ###FY_QUARTER_COLUMN_HERE###
) AS pivot_table
ORDER BY [section], [level], [category]

