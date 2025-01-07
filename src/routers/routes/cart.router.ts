import { Router } from "express";
import { 
  createCart,
  getCart,
  addToCarts,
  removeFromCart,
  applyCoupon,
  checkout 
} from "../../controllers/cart.Controller";
import checkAuth from "../../middlewares/checkAuth.mdw";

const cartRouter = Router();

cartRouter.post("/", checkAuth, createCart);
cartRouter.get("/:userId", checkAuth, getCart);
cartRouter.put("/:userId/add", checkAuth, addToCarts);
cartRouter.put("/:userId/remove", checkAuth, removeFromCart);
cartRouter.put("/:userId/coupon", checkAuth, applyCoupon);
cartRouter.put("/:userId/checkout", checkAuth, checkout);

export default cartRouter;
