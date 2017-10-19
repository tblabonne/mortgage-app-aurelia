using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MortgageApp.Models
{
    public class Mortgage
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [Range(0, double.MaxValue)]
        public decimal PurchasePrice { get; set; }

        [Range(0, double.MaxValue)]
        public decimal DownPayment { get; set; }

        [Range(0, 100)]
        public decimal Term { get; set; }

        [Range(0, 100)]
        public decimal Rate { get; set; }

        [Range(0, double.MaxValue)]
        public decimal PropertyTax { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Pmi { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Dues { get; set; }
    }
}
