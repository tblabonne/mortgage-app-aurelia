using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MortgageApp.Models;

namespace MortgageApp
{
    public class MortgageContext : DbContext
    {
        public MortgageContext(DbContextOptions<MortgageContext> options) : base(options) { }

        public DbSet<Mortgage> Mortgages { get; set; }
    }
}
