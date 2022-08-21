﻿using Business.Abstract;
using Business.Constants;
using Core.Utilities.Business;
using Core.Utilities.Helpers.FileHelper;
using Core.Utilities.Results;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework.UnitOfWork;
using Entities.Concrete;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Concrete
{
    public class ProductImageManager : IProductImageService
    {
        IProductImageDal _productImageDal;
        IFileHelper _fileHelper;

        public ProductImageManager(IProductImageDal productImageDal, IFileHelper fileHelper)
        {
            _productImageDal = productImageDal;
            _fileHelper = fileHelper;
        }

        public Core.Utilities.Results.IResult Add(IFormFile file, ProductImage productImage, int productId)
        {
            Core.Utilities.Results.IResult result = BusinessRules.Run(
                CheckIfImageSizeInvalid(file)
                ); ;

            if (result != null)
            {
                return new ErrorDataResult<List<Product>>(result.Message);
            }

            productImage.ImagePath = _fileHelper.Upload(file, FilePath.ImagesPath);
            productImage.ProductId = productId;
            _productImageDal.Add(productImage);
            _productImageDal.Commit();
            return new SuccessResult("Fotoğraf eklendi");
        }

        public Core.Utilities.Results.IResult Update(IFormFile file, int productImageId)
        {
            Core.Utilities.Results.IResult result = BusinessRules.Run(
                CheckIfImageSizeInvalid(file)
                ); ;

            if (result != null)
            {
                return new ErrorDataResult<List<Product>>(result.Message);
            }

            ProductImage productImageToUpdate = _productImageDal.Get(image => image.ProductImageId == productImageId);

            productImageToUpdate.ImagePath = _fileHelper.Update(file, FilePath.ImagesPath + productImageToUpdate.ImagePath, FilePath.ImagesPath);
            productImageToUpdate.ProductId = productImageToUpdate.ProductId;
            productImageToUpdate.ProductImageId = productImageToUpdate.ProductImageId;
            _productImageDal.Update(productImageToUpdate);
            _productImageDal.Commit();
            return new SuccessResult("Fotoğraf Güncellendi");
        }

       


        public Core.Utilities.Results.IResult Delete(ProductImage productImage)
        {
            _fileHelper.Delete(FilePath.ImagesPath + productImage.ImagePath);
            _productImageDal.Delete(productImage);
            _productImageDal.Commit();
            return new SuccessResult("Fotoğraf Silindi");
        }

        public IDataResult<List<ProductImage>> GetAll()
        {
            return new SuccessDataResult<List<ProductImage>>(_productImageDal.GetAll(), "Araba fotoğrafları getirildi");
        }

        public IDataResult<List<ProductImage>> GetByProductId(int productId)
        {
            var result = BusinessRules.Run(CheckCarImage(productId));
            if (result != null)
            {
                return new ErrorDataResult<List<ProductImage>>("default image");
            }
            return new SuccessDataResult<List<ProductImage>>(_productImageDal.GetAll(p => p.ProductId == productId));
        }

        public IDataResult<ProductImage> GetByImageId(int imageId)
        {
            var result = _productImageDal.Get(p => p.ProductImageId == imageId);
            return new SuccessDataResult<ProductImage>(_productImageDal.Get(p => p.ProductImageId == imageId));
        }

        
        private Core.Utilities.Results.IResult CheckCarImage(int productId)
        {
            var result = _productImageDal.GetAll(p => p.ProductId == productId).Count;
            if (result > 0)
            {
                return new SuccessResult();
            }
            return new ErrorResult();
        }

        private Core.Utilities.Results.IResult CheckIfImageSizeInvalid(IFormFile file)
        {
            var size = file.Length;
            var limit = 400 * Math.Pow(2, 10);
            if (size > limit)
            {
                return new ErrorResult(Messages.ProductImageSizeInvalid);
            }
            return new SuccessResult();
        }
    }
}
