const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type:String,
        trim:true,
        required:[true, 'please provide product name'],
        minLength: 3,
        maxLength: [100, "name cannot be more than 100 characters"],
        
    },
    price:{
        type:Number,
        required:[true, 'please provide product price'],
        default:0,
    },
    description:{
        type:String,
        required:[true, 'please provide product description'],
        maxLength: [1000, "description cannot be more than 1000 characters"],
    },
    image: {
        type:String,
        default:'/uploads/example.jpeg'
    },
    category: {
        type:String,
        required:[true, 'please provide product category'],
        enum:['office', 'kitchen', 'bedroom'],
    },
    company: {
        type:String,
        required:[true, 'please provide product company'],
        enum:{
            values:['ikea', 'liddy', 'marcos'],
            message:'{VALUE} is not supported',
        }
    },
    colors: {
        type:[String],
        default:["#222"],
        required:[true, 'please provide product colors'],
    },
    featured: {
        type:Boolean,
        default:false,
    },
    freeShipping: {
        type:Boolean,
        default:false,
    },
    inventory: {
        type:Number,
        required:true,
        default:15,
    },
    numOfReviews:{
        type:Number,
        default:0,
    },
    averageRating:{
        type:Number,
        default:0,
    },
    user: {
        type:mongoose.Types.ObjectId,
        ref:"User",
        required: true,
    },
}, {timestamps:true, toJSON:{virtuals:true}, toObject:{virtuals:true}});

ProductSchema.virtual('reviews', {
    ref:'Review', 
    localField:'_id',
    foreignField:'product',
    justOne:false,
})
ProductSchema.pre('remove', async function(next){
    await this.model('Review').deleteMany({product:this._id})
})
module.exports = mongoose.model('Product', ProductSchema);

