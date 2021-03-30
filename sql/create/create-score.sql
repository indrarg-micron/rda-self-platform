CREATE TABLE score (
  id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  people_id INT NOT NULL FOREIGN KEY REFERENCES people(id),
  checklist_id INT NOT NULL FOREIGN KEY REFERENCES checklist(id),
  score INT,
  fy_quarter CHAR(6),
  CONSTRAINT unique_PeopleChecklistQuarter UNIQUE([people_id], [checklist_id], [fy_quarter])
);