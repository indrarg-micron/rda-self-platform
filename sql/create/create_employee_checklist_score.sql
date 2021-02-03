CREATE TABLE employee_checklist_score (
	id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	employee_id INT NOT NULL FOREIGN KEY REFERENCES employee(id),
	checklist_id INT NOT NULL FOREIGN KEY REFERENCES checklist(id),
	score INT,
	fy_quarter CHAR(6)
);