CREATE TABLE employee (
	id INT NOT NULL PRIMARY KEY,
	first_name NVARCHAR(50) NOT NULL,
	username NVARCHAR(50) NOT NULL UNIQUE,
	section NVARCHAR(50),
	shift CHAR(4),
	gjs CHAR(2),
	status NVARCHAR(50) NOT NULL,
	permission NVARCHAR(50),
	manager_id INT FOREIGN KEY REFERENCES employee(id)
);