import { useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import defaultImage from "../../assets/default.png";
import { useAuthContext } from "../../context/AuthContext";
import { useProductContext } from "../../context/ProductContext";
import { useUserContext } from "../../context/UserContext";
import { setToLocalStorage } from "../../services/localStorageService";
import { deleteProduct, getProduct } from "../../services/productService";
import { toast } from "react-toastify";
import { deleteProductImage } from "../../services/productImageService";

function ProductDetails() {
  const apiImagesUrl = "https://localhost:44350/uploads/images/";
  const { selectedProduct, setSelectedProduct } = useProductContext();
  const { selectedUser } = useUserContext();
  const { isAdmin } = useAuthContext();
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    getProduct(id).then((result) => {
      setSelectedProduct(result.data[0]);
      setToLocalStorage("productId", result.data[0].productId);
    });
  }, []);

  const handleDeleteProduct = () => {
    if (selectedProduct.productImageId) {
      deleteProductImage(selectedProduct.productImageId)
        .then((result) => {
          if (result.success) {
            deleteProduct(selectedProduct.productId)
              .then((response) => {
                toast.success(response.message);
                navigate("/main");
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    } else {
      deleteProduct(selectedProduct.productId)
        .then((response) => {
          toast.success(response.message);
          navigate("/main");
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="py-24 flex justify-between px-36">
      <div className="w-2/5 mb-16  bg-white dark:bg-gray-800 dark:text-white  rounded-md shadow-item mx-auto">
        <img
          src={
            selectedProduct.imagePath
              ? apiImagesUrl + selectedProduct.imagePath
              : defaultImage
          }
          className="object-cover object-center rounded-t-md w-full"
          alt=""
        />
        <div>
          <div className="w-full flex justify-between border-2 py-3 px-20 font-bold dark:border-gray-700">
            <div>İsim</div>
            <div>{selectedProduct.productName}</div>
          </div>
          <div className="w-full flex justify-between border-2 py-3 px-20 font-bold dark:border-gray-700">
            <div>Kategori</div>
            <div>{selectedProduct.categoryName}</div>
          </div>
          {selectedProduct.brandName && (
            <div className="w-full flex justify-between border-2 py-3 px-20 font-bold dark:border-gray-700">
              <div>Marka</div>
              <div>{selectedProduct.brandName}</div>
            </div>
          )}
          {selectedProduct.colorName && (
            <div className="w-full flex justify-between border-2 py-3 px-20 font-bold dark:border-gray-700">
              <div>Renk</div>
              <div>{selectedProduct.colorName}</div>
            </div>
          )}
          <div className="w-full flex justify-between border-2 py-3 px-20 font-bold dark:border-gray-700">
            <div>Fiyat</div>
            <div>{selectedProduct.price}₺</div>
          </div>
          <div className="w-full flex justify-between border-2 py-3 px-20 font-bold dark:border-gray-700">
            <div>Kullanım Durumu</div>
            <div>{selectedProduct.usingStateName}</div>
          </div>
          <div className="w-full flex justify-between border-2 py-3 px-20 font-bold dark:border-gray-700">
            <div>Açıklama</div>
            <div>{selectedProduct.description}</div>
          </div>
          <div className="w-full flex justify-between border-2 py-3 px-20 font-bold dark:border-gray-700">
            <div>Ürün Sahibi</div>
            <div>{selectedProduct.ownerName}</div>
          </div>
        </div>
      </div>

      <div className="w-1/2 pt-20">
        <div className="bg-white dark:bg-gray-800 rounded-md w-1/2 m-auto p-10 flex flex-col gap-3 shadow-item text-center">
          {selectedProduct.ownerId != selectedUser.userId && (
            <div className="flex flex-col w-full">
              {selectedProduct.isOfferable && (
                <div className="flex flex-col w-full">
                  {!selectedProduct.isSold && (
                    <NavLink
                      to={`/offerForProduct/${selectedProduct.productId}`}
                      className="btn  py-3 mb-2"
                    >
                      Teklif Ver
                    </NavLink>
                  )}
                </div>
              )}

              {!selectedProduct.isSold ? (
                <NavLink
                  to={`/payment/product/${selectedProduct.productId}`}
                  className="btn py-3 cursor-pointer mt-1"
                >
                  Satın Al
                </NavLink>
              ) : (
                <div className="flex flex-col">
                  <p className="text-2xl"> Ürün Satılmıştır</p>
                  <NavLink
                    className="btn bg-white border-4 border-darkBlue text-darkBlue hover:bg-darkBlue hover:text-white transition-all  text-2xl mt-4"
                    to={"/main"}
                  >
                    Diğer Ürünler
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {selectedProduct.ownerId == selectedUser.userId && (
            <div>
              {!selectedProduct.isSold ? (
                <div className="flex flex-col w-full">
                  <NavLink
                    to={`/updateProduct/${selectedProduct.productId}`}
                    className="btn bg-littleDarkBlue py-3"
                  >
                    Ürünü Güncelle
                  </NavLink>
                  <button
                    onClick={handleDeleteProduct}
                    className="btn bg-red-500  py-3 mt-2"
                  >
                    Ürünü Sil
                  </button>
                </div>
              ) : (
                <div className="flex flex-col">
                  <p className="text-2xl"> Ürün Satılmıştır</p>
                  <NavLink
                    className="btn bg-white border-4 border-darkBlue text-darkBlue hover:bg-darkBlue hover:text-white transition-all  text-2xl mt-4"
                    to={"/main"}
                  >
                    Diğer Ürünler
                  </NavLink>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
