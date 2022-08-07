import { useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import defaultImage from "../../assets/default.png";
import { useAuthContext } from "../../context/AuthContext";
import { useProductContext } from "../../context/ProductContext";
import { useUserContext } from "../../context/UserContext";
import {
  getFromLocalStorage,
  setToLocalStorage,
} from "../../services/localStorageService";
import { deleteProduct, getProduct } from "../../services/productService";
import { getUserById } from "../../services/userService";
import { toast } from "react-toastify";

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
    const data = {
      productId: selectedProduct.productId,
      name: selectedProduct.productName,
    };
    deleteProduct(data)
      .then((response) => {
        toast.success(response.message);
        navigate("/main");
      })
      .catch((err) => console.log(err));
  };

  const handleBuyProduct = () => {};

  return (
    <div className="py-24 flex justify-between px-36">
      <div className="w-2/5 mb-16  bg-white rounded-md shadow-item mx-auto">
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
          <div className="w-full flex justify-between border-2 py-3 px-20 font-bold">
            <div>İsim</div>
            <div>{selectedProduct.productName}</div>
          </div>
          <div className="w-full flex justify-between border-2 py-3 px-20 font-bold">
            <div>Marka</div>
            <div>{selectedProduct.brandName}</div>
          </div>
          <div className="w-full flex justify-between border-2 py-3 px-20 font-bold">
            <div>Kategori</div>
            <div>{selectedProduct.categoryName}</div>
          </div>
          <div className="w-full flex justify-between border-2 py-3 px-20 font-bold">
            <div>Renk</div>
            <div>{selectedProduct.colorName}</div>
          </div>
          <div className="w-full flex justify-between border-2 py-3 px-20 font-bold">
            <div>Fiyat</div>
            <div>{selectedProduct.price}₺</div>
          </div>
        </div>
      </div>

      <div className="w-1/2 pt-20">
        <div className="bg-white rounded-md w-1/2 m-auto p-10 flex flex-col gap-3 shadow-item text-center">
          {selectedProduct.ownerId != selectedUser.userId && (
            <div className="flex flex-col w-full">
              <NavLink
                to={`/offerForProduct/${selectedProduct.productId}`}
                className="btn  py-3"
              >
                Teklif Ver
              </NavLink>
              <div
                className="btn  py-3 cursor-pointer mt-2"
                onClick={handleBuyProduct}
              >
                Satın Al
              </div>
            </div>
          )}

          {selectedProduct.ownerId == selectedUser.userId && (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
