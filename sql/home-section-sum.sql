SELECT * FROM (
  SELECT p.[username]
      ,CASE
        WHEN RIGHT(p.[shift], 1) = 'Y' THEN 'N'
        ELSE RIGHT(p.[shift], 1) 
       END AS shift
      ,s.[fy_quarter]
      ,SUM(s.[score]) total_score
    FROM [RDA_IMP_INFO].[dbo].[score] s
    JOIN [RDA_IMP_INFO].[dbo].[people] p
      ON s.[people_id] = p.[id]
    JOIN [RDA_IMP_INFO].[dbo].[checklist] c
      ON s.[checklist_id] = c.[id]
    WHERE p.[status] = 'active'
      AND p.[section] = '###YOUR_SECTION_HERE###'
      AND s.[fy_quarter] IN ###FY_QUARTER_LIST_HERE###
    GROUP BY s.[fy_quarter], RIGHT(p.[shift], 1), p.[username]
) t
PIVOT (
  SUM(t.total_score)
  FOR t.fy_quarter IN ###FY_QUARTER_COLUMN_HERE###
) AS pivot_table
ORDER BY shift, username