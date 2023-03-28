const CustomError = require('../errors');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const { rmvTempImgs } = require('../utils/rmvUnusedImg');
const cloudinary = require('cloudinary').v2;


const createProduct = async (req, res)=>{
    req.body.user = req.user.userId;

    const product = await Product.create(req.body);

    res.status(StatusCodes.CREATED).json({product})
    
}

const getAllProducts = async (req, res)=>{
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({products, count: products.length,})
    
}

const getSingleProduct = async (req, res)=>{
    const {id:productId} = req.params;
    const product = await Product.findOne({_id:productId}).populate('reviews')
    if(!product){
        throw new CustomError.NotFoundError(`No product with id: ${productId}`);
    }

    res.status(StatusCodes.OK).json({product})

}

const updateProduct = async (req, res)=>{

    const {id:productId} = req.params;

    const product = await Product.findOneAndUpdate({_id:productId}, req.body, {
        runValidators:true,
        new:true,
    })
    if(!product){
        throw new CustomError.NotFoundError(`No product with id: ${productId}`);
    }
    res.status(StatusCodes.OK).json({product});
}

const deleteProduct = async (req, res)=>{
    const {id:productId} = req.params;
   
    const product = await Product.findOne({_id:productId})
    if(!product){
        throw new CustomError.NotFoundError(`No product with id: ${productId}`);
    }

        await product.remove();
        res.status(StatusCodes.OK).json({msg:"success!! product removed"})
}

const uploadImage = async (req, res)=>{

    if(!req.files){
        throw new CustomError.BadRequestError("Please provide file")
    }
    const {image:productImage} = req.files;
    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError("Please upload image")
    }
    const maxSize = 1024 * 1024
    if(productImage.size>maxSize){
        throw new CustomError.BadRequestError("Please upload image smaller than 1MB")
    }

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename:true, folder:'cermuel-ecommerce-api',
    })

    await rmvTempImgs(req, res)
    return res.status(StatusCodes.OK).json({image:result.secure_url})
      
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    uploadImage,
    deleteProduct,
}