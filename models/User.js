const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;//salt를 몇글자로 만들지 설정
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,//앞 뒤 공백 삭제
        unique: 1//email을 유니크설정
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0//기본값설정
    },
    image: String,//그냥 String으로만 지정한경우
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})
//유저 모델에 유저정보를 저장하기 전에 즉 post방식으로 받은 정보를 mongoDB에 넣기 전에
userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        //비밀 번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)//next는 index.js에 있는 user.save 

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash //user.password를 salt를 이용해서 만든 hash로 바꾼다.
                next()
            })
        })
    } else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainpassword 1234567 암호화된 비밀번호 $2b$10$nbG.WYuKivFLfStpDYfCoOBM1.r60pcMKRedHkS6rDHgvR6GFLVXO plainpassword를 암호화해서 비교해야한다
    //복호화불가능
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){//bcrypt가 plainPassword를 암호화해서 this.password와 비교
        if(err) return cb(err);
        cb(null, isMatch)//isMatch is true
    })
}

userSchema.methods.generateToken = function(cb){//parameter로 callback함수를 받는다.

    var user = this;
    //jsonwebtoken으로 token 생성하기

    var token = jwt.sign(user._id.toHexString(), 'secretToken')//_id는 mongoDB에 저장된 PK _id값 //_id값이 plainObject가 아니라서 tohexString으로 변환
    //user.id + 'secretToken' = token
    //-> 'secretToken' ->user._id
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    //user._id + 'secretToken' = token
    //토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 보관된 token이 일치하는지 확인
        user.findOne({"_id": decoded, "token":token}, function(err,user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)//model(User)로 schema를 감싸서 user를 설정한다.

module.exports = { User } //User model을 다른 파일에서 쓸 수 있게 export하는 부분.