require('./connect');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;
// 电影id指向movie数据表,用户id指向user数据表
var Comment_Schema = new Schema({
    movie: {
        type: ObjectId,
        ref: 'movie'
    },
    from: {
        type: ObjectId,
        ref: 'user'
    },
    reply: [{
        from: {
            type: ObjectId,
            ref: 'user'
        },
        to: {
            type: ObjectId,
            ref: 'user'
        },
        content: String
    }],
    content: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
}, {
    versionKey: false
});

Comment_Schema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }
    next()
});

var Comment = mongoose.model("comment", Comment_Schema);

exports.Comment = Comment;