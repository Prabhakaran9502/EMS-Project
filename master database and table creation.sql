/* Creating Database */
create database EMS;

/* Using the Database EMS */
use EMS;

/* Creating Employee Table */
create table Employee (
Emp_ID int identity(1,1) primary key,
Emp_Name varchar(50),
Emp_Mail varchar(50),
Emp_Phone varchar(15),
Emp_Gender varchar(15),
Emp_Department_Id int,
Emp_Designation_Id int,
Emp_Salary decimal(8,2),
EmploymentType_Id int,
Emp_Status bit, 
Emp_Location varchar(50),
Emp_Address varchar(150),
Emp_Photo varchar(500)
);

/*
Sample data load into Employee table 
====================================

select * from employee;

truncate table Employee; 

drop table employee

insert into Employee 
(
Emp_Name,
Emp_Mail,
Emp_Phone,
Emp_Gender,
Emp_Department_Id,
Emp_Designation_Id,
Emp_Salary,
EmploymentType_Id,
Emp_Status, 
Emp_Location,
Emp_Address,
Emp_Photo
)
values
(
'Prabhakaran',
'prabha@gmail.com',
'1234567890',
'Male',
1,
1,
45000,
1,
1, 
'Chennai',
'Anna Street, Sholinganallur, Chennai - 600119',
'photo.jpg'
);
*/

/* Creating Department Table */

Create table Department 
(
Department_Id int identity(1,1) Primary key,
Department_Name varchar(50),
Department_Desc varchar(150),
IsActive bit
);

/*
Master data load into Department table 
====================================

select * from Department;

truncate table Department; 

drop table Department; 

insert into Department
( Department_Name, Department_Desc, IsActive )
values
('HR & A','Human Resource department - Manages employees, operations, and general admin',1),
('SDE','Software Development/Engineering - Builds the actual software products or platforms',1),
('QA & T','Quality Assurance (QA) & Testing: Ensures software quality and functionality',1);
*/


/* Creating Designation Table */

Create table Designation
(
Designation_Id int identity(1,1) primary key,
Designation_Name varchar(50),
Designation_Desc varchar(150),
Department_Id int,
IsActive bit
);

/*
Master data load into Designation table 
====================================

select * from Designation;

truncate table Designation; 

drop table Designation;

insert into Designation
( Designation_Name, Designation_Desc, Department_Id, IsActive )
values
('HR Assistant','Entry-level / Support',1,1),
('HR Specialist','Mid-level / Functional Expert',1,1),
('HR Manager','Management / Leadership',1,1),
('HR Director','Senior Leadership / Strategic',1,1),
('SDE-1','Junior Software Engineer',2,1),
('SDE-2','Software Engineer / Mid-Level',2,1),
('Senior SDE','SDE-3 / Senior Software Engineer',2,1),
('Lead Software Engineer','Technical Lead',2,1),
('Engineering Manager','Management level',2,1),
('STE','QA Engineer / Software Test Engineer',3,1),
('Senior Test Engineer','Senior QA Engineer / Senior Test Engineer',3,1),
('Test Lead','QA Lead / Test Lead',3,1),
('Test Manager','QA Manager / Test Manager',3,1);
*/

/* Creating Role table */

Create table Role (
Role_Id int identity(1,1) primary key,
Role_Name varchar(50),
Role_Desc varchar(150),
IsActive bit
);

/*
Master data load into Role table 
====================================

select * from Role;

truncate table Role; 

drop table Role;

insert into Role
(Role_Name, Role_Desc, IsActive)
values
('Software Developer','Software Developer',1),
('Software Tester','Software Tester',1),
('HRA','HRA',1),
('Manager','Manager',1);
*/


/* Creating Role table */

Create table Employment_Type (
Employment_Type_Id int identity(1,1) primary key,
Employment_Type_Name varchar(50),
Employment_Type_Desc varchar(150),
IsActive bit
);

/*
Master data load into Employment_Type table 
====================================

select * from Employment_Type;

truncate table Employment_Type; 

drop table Employment_Type;

insert into Employment_Type
(Employment_Type_Name, Employment_Type_Desc, IsActive)
values
('Permanent','Permanent',1),
('Contract','Contract',1),
('Intern','Intern',1);
*/