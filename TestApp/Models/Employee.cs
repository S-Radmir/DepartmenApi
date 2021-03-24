using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestApp.Models
{
    public class Employee
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public double Salary { get; set; }
        public Department Departmen { get; set; }
    }
}
