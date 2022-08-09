﻿using Business.Abstract;
using Business.BusinessAspects.Autofac;
using Business.Constants;
using Business.ValidationRules.FluentValidation;
using Core.Aspects.Autofac.Validation;
using Core.CrossCuttingConcerns.Validation;
using Core.Utilities.Business;
using Core.Utilities.Results;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework;
using Entities.Concrete;
using Entities.Dtos;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Concrete
{
    public class ProductManager : IProductService
    {
        IProductDal _productDal;
        ICategoryService _categoryService;
        public ProductManager(IProductDal productDal, ICategoryService categoryService)
        {
            this._productDal = productDal;
            this._categoryService = categoryService;
        }

        public IResult Add(Product product)
        {

            IResult result = BusinessRules.Run(
                CheckIfProductCountOfCategoryCorrect(product.CategoryId),
                CheckIfProductNameExists(product.Name),
                CheckIfCategoryLimitExceded()
                );

            if (result != null)
            {
                return result;
            }


            _productDal.Add(product);
            return new SuccessResult(Messages.ProductAdded);
        }

    
        public IResult Update(Product product)
        {
            _productDal.Update(product);
            return new SuccessResult(Messages.ProductUpdated);
        }

        public IResult Delete(Product product)
        {
            _productDal.Delete(product);
            return new SuccessResult(Messages.ProductDeleted);
        }

        public IDataResult<List<Product>> GetAll()
        {

            return new SuccessDataResult<List<Product>>(_productDal.GetAll(), Messages.ProductsListed);
        }

        public IDataResult<List<Product>> GetAllByCategoryId(int id)
        {
            return new SuccessDataResult<List<Product>>(_productDal.GetAll(p => p.CategoryId == id));
        }

        public IDataResult<Product> GetById(int productId)
        {
            return new SuccessDataResult<Product>(_productDal.Get(p => p.ProductId == productId));
        }
        public IDataResult<List<ProductDetailDto>> GetProductDetailsById(int id)
        {
            return new SuccessDataResult<List<ProductDetailDto>>(_productDal.GetProductDetails(p => p.ProductId == id), "Ürün Listelendi");
        }

        public IDataResult<List<ProductDetailDto>> GetProductDetailsByCategoryId(int categoryId)
        {
            return new SuccessDataResult<List<ProductDetailDto>>(_productDal.GetProductDetails(p => p.CategoryId == categoryId), "Ürün Listelendi");
        }

        public IDataResult<List<Product>> GetByUnitPrice(decimal min, decimal max)
        {
            return new SuccessDataResult<List<Product>>(_productDal.GetAll(p => p.Price <= max && p.Price >= min));
        }

        public IDataResult<List<ProductDetailDto>> GetProductDetails()
        {
            return new SuccessDataResult<List<ProductDetailDto>>(_productDal.GetProductDetails(), Messages.ProductsListed);
        }

        public IDataResult<List<ProductDetailDto>> GetProductDetailsByBrandId(int brandId)
        {
            return new SuccessDataResult<List<ProductDetailDto>>(_productDal.GetProductDetails(p => p.BrandId == brandId), Messages.ProductsListed);
        }
        public IDataResult<List<ProductDetailDto>> GetProductDetailsByColorId(int colorId)
        {
            return new SuccessDataResult<List<ProductDetailDto>>(_productDal.GetProductDetails(p => p.ColorId == colorId), Messages.ProductsListed);
        }

        public IDataResult<List<ProductDetailDto>> GetProductDetailsByOwnerId(int ownerId)
        {
            return new SuccessDataResult<List<ProductDetailDto>>(_productDal.GetProductDetails(p => p.OwnerId == ownerId), Messages.ProductsListed);
        }
        private IResult CheckIfProductCountOfCategoryCorrect(int categoryId)
        {
            return new SuccessResult();
        }

        private IResult CheckIfProductNameExists(string productName)
        {
            var result = _productDal.GetAll(p => p.Name == productName).Any();
            if (result)
            {
                return new ErrorResult(Messages.ProductNameAlreadyExists);
            }
            return new SuccessResult();
        }

        private IResult CheckIfCategoryLimitExceded()
        {
            var result = _categoryService.GetAll();
            return new SuccessResult();
        }

        
    }
}
