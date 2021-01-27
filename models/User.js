const mongoose = require('mongoose')

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

const User = mongoose.model('User', userSchema)//model(User)로 schema를 감싸서 user를 설정한다.

module.exports = { User } //User model을 다른 파일에서 쓸 수 있게 export하는 부분.