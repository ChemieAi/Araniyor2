import Yup from "./validation";

export const ProductSchema = Yup.object().shape({
  name: Yup.string().required().max(100),
  categoryId: Yup.string().required().max(500),
  brandId: Yup.string().required(),
  colorId: Yup.string().required(),
  price: Yup.number().required(),
  description: Yup.string().required(),
  usingStateId: Yup.string().required(),
});
