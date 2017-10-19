using MortgageApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MortgageApp
{
    public static class DbInitializer
    {
        public static void Initialize(MortgageContext context)
        {
            context.Database.EnsureCreated();

            if (context.Mortgages.Any())
            {
                return;
            }

            // create sample data
            Mortgage sample = new Mortgage()
            {
                Name = "Sample",
                PurchasePrice = 250000,
                DownPayment = 50000,
                PropertyTax = 2000,
                Rate = 4,
                Term = 30,
                Pmi = 0,
                Dues = 0
            };

            context.Mortgages.Add(sample);

            context.SaveChanges();
        }
    }
}
