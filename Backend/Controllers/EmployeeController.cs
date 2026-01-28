using Backend.Data;
using Backend.Models; 
using System;
using System.Data;
using System.IO;
using System.Web;
using System.Web.Http;

namespace EMS_WebAPI.Controllers
{
    [RoutePrefix("api/employees")]
    public class EmployeeController : ApiController
    {
        EmployeeDAL dal = new EmployeeDAL();


        [HttpGet, Authorize]
        [Route("getMasterData")]
        public IHttpActionResult GetEmployeeMasterData()
        {
            DataSet ds = dal.GetEmployeeMasterData();
            return Ok(ds);    
        }



        [HttpGet, Route(""), Authorize]
        public IHttpActionResult GetEmployees()
        {
            return Ok(dal.GetEmployees());
        }

        [HttpGet, Route("{id:int}"), Authorize]
        public IHttpActionResult GetEmployee(int id)
        {
            var emp = dal.GetEmployee(id);
            if (emp == null) return NotFound();
            return Ok(emp);
        }

        [HttpPost, Authorize]
        [Route("")]
        public IHttpActionResult AddEmployee()
        {
            try
            {
                var request = HttpContext.Current.Request;
                bool statusValue = false;
                bool.TryParse(request.Form["status"], out statusValue);

                Employee emp = new Employee
                {
                    name = request.Form["name"],
                    email = request.Form["email"],
                    phone = request.Form["phone"],
                    gender = request.Form["gender"],
                    department_id = Convert.ToInt32(request.Form["department_id"]),
                    designation_id = Convert.ToInt32(request.Form["designation_id"]),
                    employmentType_id = Convert.ToInt32(request.Form["employmentType_id"]),
                    salary = Convert.ToDecimal(request.Form["salary"]),
                    location = request.Form["location"],
                    address = request.Form["address"],
                    status = statusValue
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

                dal.AddEmployee(emp);

                return Ok("Employee added successfully");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPut, Route("{id:int}"), Authorize]
        public IHttpActionResult UpdateEmployee(int id)
        {
            try
            {
                var request = HttpContext.Current.Request;
                bool statusValue = false;
                bool.TryParse(request.Form["status"], out statusValue);

                Employee emp = new Employee
                {
                    name = request.Form["name"],
                    email = request.Form["email"],
                    phone = request.Form["phone"],
                    gender = request.Form["gender"],
                    department_id = Convert.ToInt32(request.Form["department_id"]),
                    designation_id = Convert.ToInt32(request.Form["designation_id"]),
                    employmentType_id = Convert.ToInt32(request.Form["employmentType_id"]),
                    salary = Convert.ToDecimal(request.Form["salary"]),
                    location = request.Form["location"],
                    address = request.Form["address"],
                    status = statusValue
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

                dal.UpdateEmployee(id, emp);

                return Ok("Employee updated successfully");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
            
        }

        [HttpDelete, Route("{id:int}"), Authorize]
        public IHttpActionResult DeleteEmployee(int id)
        {
            dal.DeleteEmployee(id);
            return Ok("Employee deleted successfully");
        }
    }
}
