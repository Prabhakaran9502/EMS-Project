using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Web;

namespace Backend.Data
{
    public class JwtTokenHelper
    {
        public static string GenerateToken(int userId, string userName, int roleId)
        {
            var secret = ConfigurationManager.AppSettings["JwtSecret"];
            var issuer = ConfigurationManager.AppSettings["JwtIssuer"];
            var audience = ConfigurationManager.AppSettings["JwtAudience"];

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secret)
            );

            var creds = new SigningCredentials(
                key, SecurityAlgorithms.HmacSha256
            );

            var claims = new[]
            {
            new Claim("UserId", userId.ToString()),
            new Claim("UserName", userName),
            new Claim("RoleId", roleId.ToString())
        };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}