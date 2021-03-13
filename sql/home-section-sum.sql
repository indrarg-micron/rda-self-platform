SELECT * FROM (
	SELECT e.[username]
		  ,RIGHT(e.[shift], 1) AS shift
		  ,s.[fy_quarter]
		  ,SUM(s.[score]) total_score
		FROM [RDA_IMP_INFO].[dbo].[employee_checklist_score] s
		JOIN [RDA_IMP_INFO].[dbo].[employee] e
		ON s.[employee_id] = e.[id]
		JOIN [RDA_IMP_INFO].[dbo].[checklist] c
		ON s.[checklist_id] = c.[id]
		WHERE e.[status] = 'active'
		AND e.[section] = '###YOUR_SECTION_HERE###'
		AND s.[fy_quarter] IN ###FY_QUARTER_LIST_HERE###
		GROUP BY s.[fy_quarter], RIGHT(e.[shift], 1), e.[username]
) t
PIVOT (
	SUM(t.total_score)
	FOR t.fy_quarter IN ###FY_QUARTER_COLUMN_HERE###
) AS pivot_table
 ORDER BY username