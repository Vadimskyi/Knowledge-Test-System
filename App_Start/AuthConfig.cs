using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Web.WebPages.OAuth;
using System.Configuration;
using TestApplication.Helpers;

namespace TestApplication
{
    public static class AuthConfig
    {
        public static void RegisterAuth()
        {

            OAuthWebSecurity.RegisterTwitterClient(
                consumerKey:  ConfigurationManager.AppSettings["TwitterKey"],
                consumerSecret: ConfigurationManager.AppSettings["TwitterSecret"]);

            OAuthWebSecurity.RegisterFacebookClient(
                appId: ConfigurationManager.AppSettings["FacebookKey"],
                appSecret: ConfigurationManager.AppSettings["FacebookSecret"]);

            OAuthWebSecurity.RegisterGoogleClient();

            Dictionary<string, object> MicrosoftsocialData = new Dictionary<string, object>();
            MicrosoftsocialData.Add("Icon", "../Content/icons/microsoft.png");
            OAuthWebSecurity.RegisterClient(new MicrosoftScopedClient(ConfigurationManager.AppSettings["MicrosoftKey"], 
                                                                      ConfigurationManager.AppSettings["MicrosoftSecret"],
                                                                      "wl.basic wl.emails"), "Microsoft", MicrosoftsocialData);
        }
    }
}
