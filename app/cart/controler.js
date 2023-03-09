const productFood = require("../product/model");
const CartItem = require("../cart-item/model");

const update = async (req, res, next) => {
  try {
    let { items } = req.body;
    const productIds = items.map((item) => item.product._id);
    const products = await productFood.find({ _id: { $in: productIds } });
    let cartItems = items.map((item) => {
      let relatedProduct = products.find((product) => product._id.toString() === item.product._id);
      return {
        product: relatedProduct._id,
        name: relatedProduct.name,
        price: relatedProduct.price * item.quantity,
        image: relatedProduct.image_url,
        user: req.user._id,
        quantity: item.quantity,
      };
    });

    await CartItem.deleteMany({ user: req.user._id });
    await CartItem.bulkWrite(
      cartItems.map((item) => {
        return {
          updateOne: {
            filter: {
              user: req.user._id,
              product: item.product,
            },
            update: item,
            upsert: true,
          },
        };
      })
    );
    return res.json(cartItems);

    // --------------------------------------------------------------------------------------------------------------------

    //   const { product, quantity } = req.body;
    //   const user = req.user;
    //   const cart = CartItem.find({ user: user._id });
    //   const productId = productFood.find({ _id: product._id });
    //   // jika produk sudah ada di keranjang maka
    //   const price = productId.price;
    //   const name = productId.name;
    //   if (cart) {
    //     const itemIndex = cart.product.findIndex((item) => item.product._id == product._id);
    //     // chek apakah item nya sudah ada atau belum
    //     if (itemIndex > -1) {
    //       let products = cart.product[itemIndex];
    //       products.quantity += quantity;
    //       cart.price = cart.product.reduce((total, current) => {
    //         total + current.price * current.quantity;
    //       }, 0);
    //       cart.product[itemIndex] = products;
    //       await cart.save();
    //       return res.json(cart);
    //     } else {
    //       cart.product.push({
    //         product: product._id,
    //         name,
    //         price,
    //       });
    //       cart.price = cart.product.reduce((total, current) => {
    //         total + current.price * current.quantity;
    //       }, 0);
    //       await cart.save();
    //       return res.json.parse(cart);
    //     }
    //   } else {
    //     // jika tidak ada barang di keranjang maka tambahkan
    //     const newCart = CartItem.create({
    //       user,
    //       product: [
    //         {
    //           name,
    //           price,
    //           quantity: items.quantity,
    //         },
    //       ],
    //       price: price * items.quantity,
    //       image_url: items.image_url,
    //     });
    //     await newCart.save();
    //     return res.json(newCart);
    //   }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    const items = await CartItem.find({ user: req.user._id }).populate("product");
    return res.json(items);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};
module.exports = { update, index };
