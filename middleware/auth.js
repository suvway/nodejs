const { User } = require('../models/User');

let auth = (req, res, next) => {
    //인증 처리를 하는 곳\
    //client cookie에서 token을 가져온다.
    let token = req.cookies.x_auth;

    //token을 복호화 한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true})

        req.token = token;//req에 token과 user를 넣어줌으로 써 index.js에서 req.token과 req.user를 가질 수 있게 한다.
        req.user = user;
        next();
    })

    //유저가 있으면 인증 Okay

    //유저가 없으면 인증 No

}

module.exports = { auth };