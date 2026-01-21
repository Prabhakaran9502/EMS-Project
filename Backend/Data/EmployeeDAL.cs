using Backend.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Backend.Data
{
    public class EmployeeDAL
    {
        private readonly string conStr =
           ConfigurationManager.ConnectionStrings["EMSConnection"].ConnectionString;

        public DataSet GetEmployeeMasterData()
        {
            DataSet ds = new DataSet();

            using (SqlConnection con = new SqlConnection(conStr))
            {
                using (SqlCommand cmd = new SqlCommand("GetEmployeeMasterData", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds);
                    }
                }
            }

            return ds;
        }

        // GET ALL
        public List<Employee> GetEmployees()
        {
            List<Employee> list = new List<Employee>();

            using (SqlConnection con = new SqlConnection(conStr))
            {

                SqlCommand cmd = new SqlCommand("GetEmployees", con);
                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();


                while (dr.Read())
                {
                    list.Add(new Employee
                    {
                        id = Convert.ToInt32(dr["id"]),
                        name = dr["name"].ToString(),
                        email = dr["email"].ToString(),
                        phone = dr["phone"].ToString(),
                        gender = dr["gender"].ToString(),
                        salary = Convert.ToDecimal(dr["salary"]),
                        status = Convert.ToBoolean(dr["Emp_Status"]),
                        location = dr["location"].ToString(),
                        address = dr["address"].ToString(),
                        designation = dr["designation"].ToString(),
                        department = dr["department"].ToString(),
                        employmentType = dr["employmenttype"].ToString()
                    });
                }
            }
            return list;

        }

        // GET BY ID
        public Employee GetEmployee(int id)
        {
            Employee emp = null;

            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("GetEmployeeById", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Id", id);

                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();

                if (dr.Read())
                {
                    emp = new Employee
                    {
                        id = (int)dr["Emp_Id"],
                        name = dr["Emp_Name"].ToString(),
                        email = dr["Emp_Mail"].ToString(),
                        phone = dr["Emp_Phone"].ToString(),
                        gender = dr["Emp_Gender"].ToString(),

                        department = dr["Department_Name"].ToString(),
                        department_id = (int)dr["Department_Id"],

                        designation = dr["Designation_Name"].ToString(),
                        designation_id = (int)dr["Designation_Id"],

                        salary = (decimal)dr["Emp_Salary"],

                        employmentType = dr["EmploymentType_Name"].ToString(),
                        employmentType_id = (int)dr["EmploymentType_Id"],

                        status = Convert.ToBoolean(dr["Emp_Status"]),
                        location = dr["Emp_Location"].ToString(),
                        address = dr["Emp_Address"].ToString(),

                        photo = dr["Emp_Photo"] != DBNull.Value
                        ? (byte[])dr["Emp_Photo"]
                        : null
                    };
                }
            }
            return emp;
        }

        // INSERT
        public void AddEmployee(Employee emp)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("AddEmployee", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Emp_Name", emp.name);
                cmd.Parameters.AddWithValue("@Emp_Mail", emp.email);
                cmd.Parameters.AddWithValue("@Emp_Phone", emp.phone);
                cmd.Parameters.AddWithValue("@Emp_Gender", emp.gender);
                cmd.Parameters.AddWithValue("@Emp_Department_Id", emp.department_id);
                cmd.Parameters.AddWithValue("@Emp_Designation_Id", emp.designation_id);
                cmd.Parameters.AddWithValue("@Emp_Salary", emp.salary);
                cmd.Parameters.AddWithValue("@EmploymentType_Id", emp.employmentType_id);
                cmd.Parameters.AddWithValue("@Emp_Status", emp.status); 
                cmd.Parameters.AddWithValue("@Emp_Location", emp.location);
                cmd.Parameters.AddWithValue("@Emp_Address", emp.address);

                cmd.Parameters.Add("@Emp_Photo", SqlDbType.VarBinary).Value = (object)emp.photo ?? DBNull.Value;

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }
        
        
        // UPDATE
        public void UpdateEmployee(int id, Employee emp)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("UpdateEmployee", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Emp_Id",id);
                cmd.Parameters.AddWithValue("@Emp_Name", emp.name);
                cmd.Parameters.AddWithValue("@Emp_Mail", emp.email);
                cmd.Parameters.AddWithValue("@Emp_Phone", emp.phone);
                cmd.Parameters.AddWithValue("@Emp_Gender", emp.gender);
                cmd.Parameters.AddWithValue("@Emp_Department_Id", emp.department_id);
                cmd.Parameters.AddWithValue("@Emp_Designation_Id", emp.designation_id);
                cmd.Parameters.AddWithValue("@Emp_Salary", emp.salary);
                cmd.Parameters.AddWithValue("@EmploymentType_Id", emp.employmentType_id);
                cmd.Parameters.AddWithValue("@Emp_Status", emp.status);
                cmd.Parameters.AddWithValue("@Emp_Location", emp.location);
                cmd.Parameters.AddWithValue("@Emp_Address", emp.address);

                cmd.Parameters.Add("@Emp_Photo", SqlDbType.VarBinary).Value = (object)emp.photo ?? DBNull.Value;

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // DELETE
        public void DeleteEmployee(int id)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("DeleteEmployee", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Id", id);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }
    }
}