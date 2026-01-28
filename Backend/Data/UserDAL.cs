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
    public class UserDAL
    {
        private readonly string conStr =
           ConfigurationManager.ConnectionStrings["EMSConnection"].ConnectionString;

        public bool IsEmailExists(string email)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("GetEmployeeEmails", con);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Email", email);

                con.Open();
                int count = (int)cmd.ExecuteScalar();
                return count > 0;
            }
        }

        public void UpdatePassword(string email, string password)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("UpdateUserPassword", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Password", password);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }


        public void AddUser(Users user)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("AddUsers", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@UserName", user.UserName);
                cmd.Parameters.AddWithValue("@Email", user.Email);
                cmd.Parameters.AddWithValue("@Password",user.Password);
                cmd.Parameters.AddWithValue("@ConfirmPassword", user.ConfirmPassword); 

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }



        public Users ValidateLogin(string email, string password)
        {
            Users user = null;

            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("ValidateUserLogin", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Password", password);

                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();

                if (dr.Read())
                {
                    user = new Users
                    {
                        UserId = Convert.ToInt32(dr["User_Id"]),
                        UserName = dr["USER_NAME"].ToString(),
                        Email = dr["Email_Id"].ToString(),
                        RoleId = Convert.ToInt32(dr["Role_Id"])
                    };
                }
            }
            return user;
        }


        public List<Users> GetUsers()
        {
            List<Users> list = new List<Users>();

            using (SqlConnection con = new SqlConnection(conStr))
            {

                SqlCommand cmd = new SqlCommand("GetUsers", con);
                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();


                while (dr.Read())
                {
                    list.Add(new Users
                    {
                        UserId = Convert.ToInt32(dr["User_id"]),
                        UserName = dr["User_Name"].ToString(),
                        Email = dr["Email_Id"].ToString(),
                        IsEmployee = Convert.ToInt32(dr["IsEmployee"]),
                        
                    });
                }
            }
            return list;

        }


        public void DeleteUsers(int id)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("DeleteUser", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Id", id);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }


        public DataSet GetEmployeeDetails(int id)
        {
            DataSet ds = new DataSet();

            using (SqlConnection con = new SqlConnection(conStr))
            {
                using (SqlCommand cmd = new SqlCommand("GetEmployeeDetails", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Id", id);

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds);
                    }
                }
            }

            return ds;
        }



        public void Assign_Employee(Employee emp)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("AssignEmployee", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@User_Id", emp.id);
                cmd.Parameters.AddWithValue("@Emp_Name", emp.name);
                cmd.Parameters.AddWithValue("@Emp_Mail", emp.email);
                cmd.Parameters.AddWithValue("@Emp_Phone", emp.phone);
                cmd.Parameters.AddWithValue("@Emp_Gender", emp.gender);
                cmd.Parameters.AddWithValue("@Emp_Department_Id", emp.department_id);
                cmd.Parameters.AddWithValue("@Emp_Designation_Id", emp.designation_id);
                cmd.Parameters.AddWithValue("@Emp_Salary", emp.salary);
                cmd.Parameters.AddWithValue("@EmploymentType_Id", emp.employmentType_id); 
                cmd.Parameters.AddWithValue("@Emp_Location", emp.location);
                cmd.Parameters.AddWithValue("@Emp_Address", emp.address);

                cmd.Parameters.Add("@Emp_Photo", SqlDbType.VarBinary).Value = (object)emp.photo ?? DBNull.Value;

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }


        public DataSet GetMenuRoles(int RoleId)
        {
            DataSet ds = new DataSet();

            using (SqlConnection con = new SqlConnection(conStr))
            {
                using (SqlCommand cmd = new SqlCommand("GetRoleMenu", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Role_Id", RoleId);

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds);
                    }
                }
            }

            return ds;
        }
    }
}