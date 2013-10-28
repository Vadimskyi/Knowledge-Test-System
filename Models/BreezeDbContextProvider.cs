using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Breeze.WebApi;

namespace JumpStartTest.Models
{
    public class BreezeDbContextProvider : EFContextProvider<EFDbContext>
    {
        public BreezeDbContextProvider() : base() {}

        protected override bool BeforeSaveEntity(EntityInfo entityInfo)
        {
            return base.BeforeSaveEntity(entityInfo);
        }
    }
}