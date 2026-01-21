using SendGrid;
using SendGrid.Helpers.Mail;
using System.Configuration;
using System.Net.Mail;
using System.Threading.Tasks;

public static class EmailHelper
{
    public static async Task SendPasswordResetEmail(string toEmail, string tempPassword)
    {
        var apiKey = ConfigurationManager.AppSettings["SendGridApiKey"];
        var client = new SendGridClient(apiKey);

        var from = new EmailAddress(
            ConfigurationManager.AppSettings["FromEmail"],
            ConfigurationManager.AppSettings["FromName"]
        );

        var to = new EmailAddress(toEmail);
        var subject = "Password Reset";
        var body = $"Your temporary password is: <b>{tempPassword}</b>";

        var msg = MailHelper.CreateSingleEmail(
            from, to, subject, body, body
        );

        await client.SendEmailAsync(msg);
    }
}
