const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const postSchema = new mongoose.Schema({

    postId: {
        type: Number
    },
    postName: {
        type: String,
        required: true
    },
    postAddress: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});
postSchema.plugin(AutoIncrement, { inc_field: 'postId' });

//Delete Unnecessary Object
postSchema.methods.toJSON = function () {
    const post = this
    const postObject = post.toObject()

    delete postObject._id
    delete postObject.__v

    return postObject
}

//Make a Pagination 
postSchema.statics.paginate = function (pageNo, callback) {
   
    var limit = 5;
    var skip =  pageNo * (limit);
    var totalCount;
    
    //count documents
    this.count({}, function(err,count){
        if (err) {
            totalCount = 0;
        }
        else {
            totalCount = count;
        }
    })

    if (totalCount == 0) {
        return callback('No Document in Database..', null);
    }
   // get paginated documents
    this.find().skip(skip).limit(limit).exec(function (err, docs) {

        if (err) {
            return callback('Error Occured', null);
        }
        else if (!docs) {
            return callback('Docs Not Found', null);
        }
        else {
            var result = {
                "totalRecords": totalCount,
                "page": pageNo,
                "nextPage": pageNo + 1,
                "result": docs
            };
            return callback(null, result);
        }

    });

}

const PostList = mongoose.model('PostList', postSchema);
module.exports = PostList;