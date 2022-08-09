﻿using Core.DataAccess.EntityFramework;
using Core.Entities.Concrete;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Concrete.EntityFramework
{
    public class EfUserDal : EfEntityRepositoryBase<User, PrimeforContext>, IUserDal
    {
       
            public void DeleteUserById(int id)
            {
                using (PrimeforContext context = new PrimeforContext())
                {

                    User user = new User() { UserId = id };
                    context.Users.Attach(user);
                    context.Users.Remove(user);
                    context.SaveChanges();
                }
            }
        

        public List<OperationClaim> GetClaims(User user)
        {
            using (var context = new PrimeforContext())
            {
                var result = from operationClaim in context.OperationClaims
                             join userOperationClaim in context.UserOperationClaims
                                 on operationClaim.OperationClaimId equals userOperationClaim.OperationClaimId
                             where userOperationClaim.UserId == user.UserId
                             select new OperationClaim { OperationClaimId = operationClaim.OperationClaimId, Name = operationClaim.Name };
                return result.ToList();

            }
        }

        
    }
}
