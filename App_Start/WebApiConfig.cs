using JumpStartTest.Filters;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using Thinktecture.IdentityModel.Http.Cors.WebApi;
using Thinktecture.IdentityModel.Tokens.Http;
using WebMatrix.WebData;

namespace JumpStartTest
{
    public class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            //Configure(config);

            config.Routes.MapHttpRoute(
                name: "AccountApi",
                routeTemplate: "api/account/{action}/{id}",
                defaults: new { controller = "Account", id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.EnableQuerySupport();

            //config.Filters.Add(new AuthorizeAttribute());
            if (!HttpContext.Current.IsDebuggingEnabled)
            {
                config.Filters.Add(new RequireHttpsAttribute());
            }

            ConfigureBasicAuth(config);

            ConfigureCors(config);   
        }

        private static void ConfigureBasicAuth(HttpConfiguration config)
        {
            var authConfig = new AuthenticationConfiguration
            {
                InheritHostClientIdentity = true, 
                EnableSessionToken = true, 
                RequireSsl = false, // Remember to change in Production
                SendWwwAuthenticateResponseHeaders = false 
            };

            authConfig.AddBasicAuthentication((userName, password) =>
               WebSecurity.Login(userName, password, false));

            config.MessageHandlers.Add(new AuthenticationHandler(authConfig));
        }

        private static void ConfigureCors(HttpConfiguration config)
        {
            var corsConfig = new WebApiCorsConfiguration();
            config.MessageHandlers.Add(new CorsMessageHandler(corsConfig, config));

            corsConfig
                .ForAllOrigins()
                .AllowAllMethods()
                .AllowAllRequestHeaders();
        }

        private static void Configure(HttpConfiguration config)
        {
            config.Formatters.Remove(config.Formatters.XmlFormatter);
            var json = config.Formatters.JsonFormatter;
            json.SerializerSettings.ContractResolver =
                new CamelCasePropertyNamesContractResolver();
        }
    }
}