using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Backend.Models
{
    public class Employee
    {
        public int id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string gender { get; set; }
        public string department { get; set; }
        public int department_id { get; set; }
        public string designation { get; set; }
        public int designation_id { get; set; }
        public decimal salary { get; set; }
        public string employmentType { get; set; }
        public int employmentType_id { get; set; }
        public bool status { get; set; }
        public string role { get; set; }
        public int role_id { get; set; }
        public string location { get; set; }
        public string address { get; set; }

        public byte[] photo { get; set; }

        public string photoBase64
        {
            get
            {
                return photo != null
                    ? Convert.ToBase64String(photo)
                    : null;
            }
        }
    }
}