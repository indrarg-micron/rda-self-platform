CREATE TABLE checklist (
  id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  section NVARCHAR(50),
  level INT,
  category NVARCHAR(50),
  item NVARCHAR(255),
  status NVARCHAR(50) NOT NULL,
  link NVARCHAR(MAX)
);