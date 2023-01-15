const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true, "please provide rating"],
    },
    title:{
        type:String,
        trim:true,
        maxLength:100,
        required:[true, "please provide review title"],
    },
    comment:{
        type:String,
        trim:true,
        require:[true, "please provide review text"],
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required: true,
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required:true,
    },
    },
    {timeStamps:true}
    );


    ReviewSchema.statics.calculateAverageRating = async function(productId){
        const agg = [
            {
              $match: {
                product: productId
              },
            }, {
              $group: {
                _id: null, 
                averageRating: {
                  $avg: '$rating'
                }, 
                numOfReviews: {
                  $sum: 1
                },
              },
            },
          ];
          
        const result = await this.aggregate(agg)
    
        try {
            await this.model('Product').findOneAndUpdate({_id:productId},
                {averageRating:Math.ceil(result[0]?.averageRating || 0),
                numOfReviews:result[0]?.numOfReviews || 0})
        } catch (error) {
            console.log(error);
        }

    }


    ReviewSchema.post('save', async function () {
        await this.constructor.calculateAverageRating(this.product)
        
    })
    ReviewSchema.post('remove', async function () {
        await this.constructor.calculateAverageRating(this.product)

    })
    ReviewSchema.index({product:1, user:1}, {unique:true});

    module.exports = mongoose.model('Review', ReviewSchema);