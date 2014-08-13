using DotNetOpenAuth.AspNet;
using Microsoft.Web.WebPages.OAuth;
using System.IO;
using System.Diagnostics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Web.Http;
using System.Web.Security;
using System.Threading;
using System.Threading.Tasks;
using TestApplication.Filters;
using WebMatrix.WebData;
using System.Web;

namespace TestApplication.Controllers
{
    [ModelValidation]
    public class AccountController : ApiController
    {
        private readonly EFDbContext _db;

        public AccountController(EFDbContext context)
        {
            _db = context;
        }

        [HttpPost]
        [HttpOptions]
        [AllowAnonymous]
        public UserInfo Login(Credential credential)
        {
            if (WebSecurity.Login(credential.UserName, credential.Password, persistCookie: credential.RememberMe))
            {               
                IPrincipal principal = new GenericPrincipal(new GenericIdentity(credential.UserName), Roles.GetRolesForUser(credential.UserName));
                Thread.CurrentPrincipal = principal;
                HttpContext.Current.User = principal;
                return new UserInfo
                {
                    IsAuthenticated = true,
                    UserName = credential.UserName,
                    Roles = Roles.GetRolesForUser(credential.UserName),
                    UserId = WebSecurity.CurrentUserId
                };
            }

            var errors = new Dictionary<string, IEnumerable<string>>();
            errors.Add("Authorization", new string[] { "The supplied credentials are not valid" });
            throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.Unauthorized, errors));
        }

        [HttpPost]
        [HttpOptions]
        public UserInfo Logout()
        {
            try
            {
                WebSecurity.Logout();
                Thread.CurrentPrincipal = null;
                HttpContext.Current.User = null;
            }
            catch (MembershipCreateUserException e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, e.Message));
            }
            return new UserInfo
            {
                IsAuthenticated = false,
                UserName = "",
                Roles = new string[] { }
            };
        }

        [HttpPost]
        [AllowAnonymous]
        public UserInfo Register(RegisterModel model)
        {
            try
            {
                User user = new User()
                {
                    Login = model.UserName,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Password = model.Password,
                    Email = model.Email,
                    UserRole = _db.UserRoles.Where(ur => ur.RoleName.Equals("User")).First()
                };

                _db.Users.Add(user);
                _db.SaveChanges();

                WebSecurity.CreateAccount(model.UserName, model.Password, false);
                WebSecurity.Login(model.UserName, model.Password);
                Roles.AddUsersToRole(new string[] { model.UserName }, "User");
                IPrincipal principal = new GenericPrincipal(new GenericIdentity(model.UserName), Roles.GetRolesForUser(model.UserName));
                Thread.CurrentPrincipal = principal;
                HttpContext.Current.User = principal;
                return new UserInfo()
                {
                    IsAuthenticated = true,
                    UserName = model.UserName,
                    UserId = user.Id,
                    Roles = new List<string> { "User" }
                };
            }
            catch (MembershipCreateUserException e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, e.Message));
            }
        }

        [HttpPost]
        [HttpOptions]
        public async Task<HttpResponseMessage> UploadImage()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            string root = HttpContext.Current.Server.MapPath("~/Content/images/Questions/");
            var provider = new MultipartFormDataStreamProvider(root);

            try
            {
                string createdFilePath = "";

                await Request.Content.ReadAsMultipartAsync(provider);

                foreach (var file in provider.FileData)
                {
                    string fileName = file.Headers.ContentDisposition.FileName;
                    if (fileName.StartsWith("\"") && fileName.EndsWith("\""))
                    {
                        fileName = fileName.Trim('"');
                    }
                    if (fileName.Contains(@"/") || fileName.Contains(@"\"))
                    {
                        fileName = Path.GetFileName(fileName);
                    }
                    createdFilePath = "questions/" + fileName;
                    Question qn = _db.Questions.Where(q => q.ImageSource.Equals(fileName)).FirstOrDefault();

                    if (qn != null)
                    {
                        string[] arr = fileName.Split('.');
                        arr[0] = arr[0] + "_" + qn.Id.ToString() + '.';
                        fileName = arr[0] + arr[1];
                        qn.ImageSource = fileName;
                        _db.SaveChanges();
                    }

                    File.Move(file.LocalFileName, Path.Combine(root, fileName));
                }
                return new HttpResponseMessage()
                {
                    Content = new StringContent(createdFilePath)
                };
            }
            catch (System.Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);
            }
        }


        [HttpGet]
        [AllowAnonymous]
        public IEnumerable<ExternalLogin> ExternalLoginsList()
        {
            var externalLogins = new List<ExternalLogin>();
            foreach (var client in OAuthWebSecurity.RegisteredClientData)
            {
                externalLogins.Add(new ExternalLogin
                {
                    Provider = client.AuthenticationClient.ProviderName,
                    ProviderDisplayName = client.DisplayName
                });
            }
            return externalLogins;
        }

        [HttpGet]
        [AllowAnonymous]
        public HttpResponseMessage ExternalLogin(string provider, string returnUrl)
        {
            try
            {
                OAuthWebSecurity.RequestAuthentication(provider, "/api/account/ExternalLoginCallback?returnurl=" + returnUrl);
                return new HttpResponseMessage(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.InnerException.Message));
            }

        }

        [HttpGet]
        [AllowAnonymous]
        public HttpResponseMessage ExternalLoginCallback(string returnUrl)
        {
            try
            {
                AuthenticationResult result = OAuthWebSecurity.VerifyAuthentication();
                if (!result.IsSuccessful)
                {
                    var response = Request.CreateResponse(HttpStatusCode.Redirect);
                    response.Headers.Location = new Uri("http://" + Request.RequestUri.Authority + "/#/externalloginfailure");
                    return response;
                }

                if (OAuthWebSecurity.Login(result.Provider, result.ProviderUserId, createPersistentCookie: false))
                {
                    IPrincipal principal = new GenericPrincipal(new GenericIdentity(result.ProviderUserId), null);
                    Thread.CurrentPrincipal = principal;
                    HttpContext.Current.User = principal;
                    var response = Request.CreateResponse(HttpStatusCode.Redirect);
                    response.Headers.Location = new Uri("http://" + Request.RequestUri.Authority + "/#/" + returnUrl);
                    return response;
                }

                if (User.Identity.IsAuthenticated)
                {
                    OAuthWebSecurity.CreateOrUpdateAccount(result.Provider, result.ProviderUserId, User.Identity.Name);
                    var response = Request.CreateResponse(HttpStatusCode.Redirect);
                    response.Headers.Location = new Uri("http://" + Request.RequestUri.Authority + "/#/" + returnUrl);
                    return response;
                }
                else
                {
                    string loginData = OAuthWebSecurity.SerializeProviderUserId(result.Provider, result.ProviderUserId);
                    var response = Request.CreateResponse(HttpStatusCode.Redirect);
                    response.Headers.Location = new Uri("http://" + Request.RequestUri.Authority + "/#/externalloginconfirmation?returnurl=" + returnUrl + "&username=" + result.UserName + "&provideruserid=" + result.ProviderUserId + "&provider=" + result.Provider);
                    return response;
                }
            }
            catch (Exception ex)
            {
                var response = Request.CreateResponse(HttpStatusCode.Redirect);
                response.Headers.Location = new Uri("http://" + Request.RequestUri.Authority + "/#/externalloginfailure");
                return response;
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public UserInfo UserInfo()
        {
            if (WebSecurity.IsAuthenticated)
            {
                return new UserInfo
                {
                    IsAuthenticated = true,
                    UserName = WebSecurity.CurrentUserName,
                    Roles = Roles.GetRolesForUser(WebSecurity.CurrentUserName),
                    UserId = WebSecurity.CurrentUserId
                };
            }
            else
            {
                return new UserInfo
                {
                    IsAuthenticated = false
                };
            }
        }

        [HttpPost]
        [HttpOptions]
        [AllowAnonymous]
        public bool IsTestTaken(TestIdObject test)
        {
            if (test == null)
                return false;
            if (WebSecurity.IsAuthenticated)
            {
                try
                {
                    Statistic stat = _db.Statistics.Where(s => (s.TestId == test.TestId && s.UserId == WebSecurity.CurrentUserId)).First();
                }
                catch (Exception ex)
                {
                    return false;
                }
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}