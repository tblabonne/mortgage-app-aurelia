using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MortgageApp.Models;
using Microsoft.EntityFrameworkCore;

namespace MortgageApp.Controllers
{
    [Produces("application/json")]
    [Consumes("application/json")]
    [Route("api/mortgages")]
    public class MortgagesController : Controller
    {
        private readonly MortgageContext db;

        public MortgagesController(MortgageContext db)
        {
            this.db = db;
        }

        [HttpGet("")]
        public IQueryable<Mortgage> Mortgages()
        {
            return db.Mortgages.AsNoTracking();
        }

        [HttpGet("{id}")]
        public Mortgage Mortgage(int id)
        {
            return db.Mortgages.SingleOrDefault(x => x.Id == id);
        }

        [HttpPost("")]
        public IActionResult PostMortgage([FromBody] Mortgage mortgage)
        {
            if (mortgage == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Mortgages.Add(mortgage);
            db.SaveChanges();

            return Ok(mortgage);
        }

        [HttpPut("")]
        public IActionResult UpdateMortgage([FromBody] Mortgage mortgage)
        {
            if (mortgage == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!db.Mortgages.Any(x => x.Id == mortgage.Id))
            {
                return NotFound();
            }

            db.Mortgages.Attach(mortgage);
            db.Entry(mortgage).State = EntityState.Modified;
            db.SaveChanges();

            return Ok(mortgage);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMortgage(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mortgage = db.Mortgages.SingleOrDefault(x => x.Id == id);
            if (mortgage == null)
            {
                return NotFound();
            }

            db.Mortgages.Remove(mortgage);
            db.SaveChanges();

            return Ok();
        }
    }
}