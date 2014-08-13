using System.Web.Helpers;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using WebMatrix.WebData;


namespace TestApplication
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();       

            if (!WebSecurity.Initialized)
            {
                WebSecurity.InitializeDatabaseConnection("TestAppDb", "User", "Id", "Login", autoCreateTables: true);
            }


            Bootstrapper.Initialise();
        }
    }
}