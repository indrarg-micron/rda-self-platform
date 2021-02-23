DECLARE 
    @workerno INT,
	@section NVARCHAR(MAX)

-- find out the worker no, section
SELECT 
    @workerno = [id],
	  @section = [section]
FROM 
    [RDA_IMP_INFO].[dbo].[employee] e
WHERE e.[username] = ###YOUR_USERNAME_HERE###
AND e.[status] = 'active'

SELECT * FROM (
	-- generate indiv list (indiv list w/ score + section list w/o score)
	SELECT u.[section]
		  ,u.[level]
		  ,u.[category]
		  ,u.[item]
		  ,s.[score]
		  ,s.[fy_quarter]
	FROM (
		SELECT s.[employee_id] 
			  ,c.[id]
			  ,c.[section]
			  ,c.[level]
			  ,c.[category]
			  ,c.[item]
		  FROM [RDA_IMP_INFO].[dbo].[employee_checklist_score] s
		  JOIN [RDA_IMP_INFO].[dbo].[checklist] c
		  ON s.[checklist_id] = c.[id]
		  WHERE s.[employee_id] = @workerno
		  AND s.[fy_quarter] IN ###FY_QUARTER_LIST_HERE###
		  AND c.[status] = 'active'

		UNION

		SELECT @workerno as [employee_id]
			  ,c.[id]
			  ,c.[section]
			  ,c.[level]
			  ,c.[category]
			  ,c.[item]
		  FROM [RDA_IMP_INFO].[dbo].[checklist] c
		  WHERE c.[section] = @section
		  AND c.[status] = 'active'
	) u
	LEFT JOIN [RDA_IMP_INFO].[dbo].[employee_checklist_score] s
	ON u.[employee_id] = s.[employee_id]
	AND u.[id] = s.[checklist_id]
) t
PIVOT (
	SUM(t.score)
	FOR t.fy_quarter IN ###FY_QUARTER_COLUMN_HERE###
) AS pivot_table
ORDER BY [section], [level], [category]

