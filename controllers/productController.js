import productModels from "../models/productModels.js";
import categoryModels from '../models/categoryModels.js';
import fs from 'fs'
import slugify from "slugify";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";

//payment gateway

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "2qz42xh9xnykmwcb",
  publicKey: 'x979w8gprvyxzq3m',
  privateKey: "e70cfdc7d811822cc993c49362919d6a",
});







export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }


    const products = new productModels({ ...req.fields, slug: slugify(name) });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type
    }

    await products.save();
    res.status(201).send({
      success: true,
      message: "product created sucessfully",
      products
    })
  } catch (error) {
    console.log(error)
    res.status(404).send({
      message: "unable to create products",
      error,
      success: false
    })
  }
}

//getting all products

export const getProductController = async (req, res) => {
  try {
    const product = await productModels.find({}).select('-photo').limit(12).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "all products",
      product,
      total: product.length
    })

  } catch (error) {
    console.log(error)
    res.status(404).send({
      message: "unable to create products",
      error,
      success: false
    })
  }
}

//get single product

export const getSingleProduct = async (req, res) => {
  try {

    const product = await productModels.findOne({ slug: req.params.slug }).select('-photo').populate('category');

    res.status(200).send({
      success: true,
      message: "product fetched successfully",
      product,
      total: product.length
    })

  } catch (error) {
    console.log(error)
    res.status(404).send({
      message: "unable to get single products",
      error,
      success: false
    })
  }
}
//get photo

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModels.findById(req.params.pid).select("photo");

    if (product.photo.data) {
      res.set('Content-type', product.photo.contentType);
      res.status(200).send(product.photo.data);
    }


  } catch (error) {
    console.log(error)
    res.status(404).send({
      message: "unable to get products",
      error,
      success: false
    })
  }
}

// delete product


export const deleteProductController = async (req, res) => {
  try {
    await productModels.findByIdAndDelete(req.params.pid).select("-photo");


    res.status(200).send({
      success: true,
      message: "product deleted successfully"
    });

  } catch (error) {
    console.log(error)
    res.status(404).send({
      message: "unable to delete products",
      error,
      success: false
    })
  }
}

//update  product controller

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }


    const products = await productModels.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type
    }

    await products.save();
    res.status(201).send({
      success: true,
      message: "product updated sucessfully",
      products
    })
  } catch (error) {
    console.log(error)
    res.status(404).send({
      message: "unable to update products",
      error,
      success: false
    })
  }
}

//product filter controller
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let arg = {};
    if (checked.length > 0) arg.category = checked;
    if (radio.length) arg.price = { $gte: radio[0], $lte: radio[1] }
    const products = await productModels.find(arg);
    res.status(200).send({
      success: true,
      products
    })

  } catch (error) {
    console.log(error)
    res.status(400).send({
      message: "Error while filtering products",
      error,
      success: false
    })
  }
}

// product count controller

export const productCountController = async (req, res) => {
  try {
    const total = await productModels.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total
    })
  } catch (error) {
    res.status(400).send({
      message: "Error while filtering products",
      error,
      success: false
    })
  }
}

//product list based on the page 

export const productListController = async (req, res) => {
  try {
    const perPage = 3
    const page = req.params.page ? req.params.page : 1
    const product = await productModels.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      product
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      message: "Error while counting products",
      error,
      success: false
    })
  }
}

// serch  product

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productModels.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    }).select("-photo");
    res.json(result);
  } catch (error) {
    console.log(error)
    res.status(400).send({
      message: "Error while searching products",
      error,
      success: false
    })
  }
}

// related product controller

export const similarProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const product = await productModels.find({ category: cid, _id: { $ne: pid } }).select('-photo').limit(3).populate('category');
    res.status(200).send({
      success: true,
      product
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      message: "Error while getting related  products",
      error,
      success: false
    })
  }
}

//get product by category

export const ProductCategoryController = async (req, res) => {
  try {
    const category = await categoryModels.findOne({ slug: req.params.slug });
    const products = await productModels.find({ category }).populate('category');
    res.status(200).send({
      success: true,
      category,
      products

    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      message: "Error while getting category wise products",
      error,
      success: false
    })
  }
}

// gateway token  api

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.send(response);
      }
    })
  } catch (error) {
    console.log(error);

  }
}

//payment gateway

export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => { total += i.price });

    let newTrasaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },

      }, function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id
          }).save();
          res.json({ ok: true })
        }
      })

  } catch (error) {
    console.log(error);
  }
}
