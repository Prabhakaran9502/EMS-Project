using Backend.Data;
using Backend.Models;
using System;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail; 
using System.Web;
using System.Web.Http;


namespace Backend.Controllers
{
    [RoutePrefix("api/users")]
    public class UsersController : ApiController
    {
        
        UserDAL userdal = new UserDAL();


        [HttpGet]
        [Route("fetchRoleMenu")]
        public IHttpActionResult FetchRoleMenu(int RoleId)
        {
            var roles = userdal.GetMenuRoles(RoleId);
            return Ok(roles);
        }


        [HttpGet]
        [Route("check-email")]
        public IHttpActionResult CheckEmail(string email)
        {
            bool exists = userdal.IsEmailExists(email);
            return Ok(new { exists });
        }

        
        [HttpPost]
        [Route("forgot-password")]
        public IHttpActionResult ForgotPassword([FromBody] string email)
        {
            UserDAL dal = new UserDAL();

            if (!dal.IsEmailExists(email))
                return BadRequest("Email not found");

            string tempPassword = GenerateTempPassword();
            
            
            EmailHelper.SendPasswordResetEmail(email, tempPassword);
           
            dal.UpdatePassword(email, tempPassword);
            

            return Ok(new { message = "Reset link sent" });
        }

        public static string GenerateTempPassword(int length = 8)
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#";
            Random rnd = new Random();

            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[rnd.Next(s.Length)]).ToArray());
        }


        [HttpPost]
        [Route("")]
        public IHttpActionResult AddEmployee()
        {
            try
            {
                var request = HttpContext.Current.Request;

                Users user = new Users
                {
                    UserName = request.Form["name"],
                    Email = request.Form["email"],
                    Password = request.Form["password"],
                    ConfirmPassword = request.Form["confirmPassword"]
                };

                userdal.AddUser(user);

                return Ok("User added successfully");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [HttpPost, AllowAnonymous]
        [Route("login")]
        public IHttpActionResult Login(LoginRequest model)
        {
            UserDAL dal = new UserDAL();

            var user = dal.ValidateLogin(model.Email, model.Password);

            if (user == null)
                return Unauthorized();

            var token = JwtTokenHelper.GenerateToken(
                            user.UserId,
                            user.UserName,
                            user.RoleId
                        );

            return Ok(new
            {
                user.UserId,
                user.UserName,
                user.RoleId,
                token
            });
        }



        [HttpGet, Authorize, Route("")]
        public IHttpActionResult GetUsers()
        {
            return Ok(userdal.GetUsers());
        }

        [Authorize]
        public IHttpActionResult DeleteUsers(int id)
        {
            userdal.DeleteUsers(id);
            return Ok("User deleted successfully");
        }


        [HttpGet, Authorize]
        [Route("getEmployeeDetails/{id:int}")]
        public IHttpActionResult GetEmployeeDetails(int id)
        {
            DataSet ds = userdal.GetEmployeeDetails(id);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                return Ok();
            }

            DataRow row = ds.Tables[0].Rows[0];

            Employee emp = new Employee
            {
                id = id,
                name = row["Emp_Name"].ToString(),
                email = row["Emp_Mail"].ToString(),
                phone = row["Emp_Phone"].ToString(),
                gender = row["Emp_Gender"].ToString(),
                department_id = Convert.ToInt32(row["Emp_Department_Id"]),
                department =  row["Department_Name"].ToString(),
                designation_id = Convert.ToInt32(row["Emp_Designation_Id"]),
                designation =  row["Designation_Name"].ToString(),
                salary = Convert.ToDecimal(row["Emp_Salary"]),
                employmentType_id = Convert.ToInt32(row["EmploymentType_Id"]),
                employmentType = row["Employment_Type_Name"].ToString(),
                location = row["Emp_Location"].ToString(),
                address = row["Emp_Address"].ToString(),

                photo = row["Emp_Photo"] != DBNull.Value
                    ? (byte[])row["Emp_Photo"]
                    : null
            };

            return Ok(emp);
        }



        [HttpPost, Authorize]
        [Route("AssignEmployee")]
        public IHttpActionResult AssignEmployee()
        {
            try
            {
                var request = HttpContext.Current.Request;

                Employee emp = new Employee
                {
                    name = request.Form["employeeName"],
                    email = request.Form["email"],
                    phone = request.Form["phone"],
                    gender = request.Form["gender"],
                    department_id = Convert.ToInt32(request.Form["department_id"]),
                    designation_id = Convert.ToInt32(request.Form["designation_id"]),
                    employmentType_id = Convert.ToInt32(request.Form["employment_type_id"]),
                    salary = Convert.ToDecimal(request.Form["salary"]),
                    location = request.Form["location"],
                    address = request.Form["address"],
                    id= Convert.ToInt32(request.Form["userId"]),
                };

                // PHOTO
                if (request.Files.Count > 0)
                {
                    HttpPostedFile file = request.Files["photo"];
                    if (file != null && file.ContentLength > 0)
                    {
                        using (BinaryReader br = new BinaryReader(file.InputStream))
                        {
                            emp.photo = br.ReadBytes(file.ContentLength);
                        }
                    }
                }

                userdal.Assign_Employee(emp);

                return Ok("Employee added successfully");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}