using System;
using System.Web.Optimization;

namespace JumpStartTest
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.IgnoreList.Clear();
            AddDefaultIgnorePatterns(bundles.IgnoreList);

            bundles.Add(
                new ScriptBundle("~/scripts/modernizr")
                    .Include("~/scripts/modernizr-{version}.js"));

            bundles.Add(
              new ScriptBundle("~/scripts/vendor")
                .Include("~/scripts/jquery-2.0.3.min.js")
                .Include("~/scripts/TrafficCop.js")
                .Include("~/scripts/infuser.js")
                .Include("~/scripts/bootstrap.min.js")
                .Include("~/scripts/knockout-{version}.js")
                .Include("~/Scripts/knockout.activity.js")
                .Include("~/Scripts/knockout.asyncCommand.js")
                .Include("~/Scripts/knockout.dirtyFlag.js")
                .Include("~/Scripts/knockout.validation.js")
                .Include("~/Scripts/koExternalTemplateEngine.js")
                .Include("~/scripts/underscore.min.js")
                .Include("~/scripts/moment.min.js")
                .Include("~/scripts/sammy-{version}.js")
                .Include("~/Scripts/jquery.hammer.min.js")
                .Include("~/Scripts/Stashy.js")
                .Include("~/scripts/Q.js")
                .Include("~/scripts/breeze.debug.js")
                .Include("~/scripts/amplify.min.js")
                .Include("~/scripts/toastr.js")
                .Include("~/scripts/jquery.fancybox.pack.js")
                .Include("~/scripts/custom.js")
              );

            bundles.Add(
             new StyleBundle("~/Content/css")
                .Include("~/Content/ie10mobile.css") // IE10 mobile viewport fix
                .Include("~/Content/bootstrap.min.css")
                .Include("~/Content/bootstrap-responsive.min.css")
                .Include("~/Content/font-awesome.min.css")
                //.Include("~/Content/durandal.css")
                .Include("~/Content/toastr.css")
                .Include("~/Content/spa.css")
                .Include("~/Content/styles.css")
                .Include("~/Content/Stashy.css")
                .Include("~/Content/jquery.fancybox.css")
                .Include("~/Content/boilerplate-styles.css")
                .Include("~/Content/jquery.fancybox.css")
             );

            // Custom LESS files
            bundles.Add(new Bundle("~/Content/Less", new LessTransform(), new CssMinify())
                .Include("~/Content/styles.less")
                );

            bundles.Add(new StyleBundle("~/Content/customcss")
                .Include("~/Content/app.css"));
        }

        public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
        {
            if (ignoreList == null)
            {
                throw new ArgumentNullException("ignoreList");
            }

            ignoreList.Ignore("*.intellisense.js");
            ignoreList.Ignore("*-vsdoc.js");
            //ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
            //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
            //ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
        }
    }
}