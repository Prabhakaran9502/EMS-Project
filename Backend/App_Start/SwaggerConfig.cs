using System.Web;
using System.Web.Http;
using Backend.Swagger;
using Swashbuckle.Application;

[assembly: PreApplicationStartMethod(
    typeof(Backend.SwaggerConfig), "Register")]

namespace Backend
{
    public class SwaggerConfig
    {
        public static void Register()
        {
            GlobalConfiguration.Configuration
                .EnableSwagger(c =>
                {
                    c.SingleApiVersion("v1", "Backend");
                    c.ApiKey("Bearer")
                     .Description("JWT Authorization header using Bearer scheme")
                     .Name("Authorization")
                     .In("header");
                    c.OperationFilter<AuthOperationFilter>();
                })
                .EnableSwaggerUi();
        }
    }
}
