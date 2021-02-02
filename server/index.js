const express = require('express')
const app = express()
const bodyParser = require('body-parser');//body-Parser 라이브러리 불러오기
const cookieParser = require('cookie-parser');//cookie-Parser import
const { auth } = require("./middleware/auth");//middleware auth 구현하고 import
const { User } = require("./models/User");//User Model을 불러온다.


const config = require('./config/key');

//application/x-www-form-urlencoded 분석해서 가져오게 해준다.
app.use(bodyParser.urlencoded({extended:true}));

//application/json을 분석해서 가져오게 해준다.
app.use(bodyParser.json());//bodyparser로 body를 json형식으로 parsing
app.use(cookieParser());//cookie를 json으로 parsing

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!~~안녕하세요 nodemon 실행중'))

app.get('/api/hello', (req,res)=>{
    res.send("안녕하세요.")
})


app.post('/api/users/register',(req, res) => {
    //회원 가입 할때 필요한 정보를 clinet에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.
    //req.body 안에 { id:"hello" password:1234}로 body에 들어 있는 것을 body parser를 통해서 가져온다.
    const user = new User(req.body)

    user.save((err, doc) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success:true
        })
    })
})



app.post('/api/users/login', (req, res) => {
    //DB에서 요청된 Email이 있는지 찾는다.
    
    User.findOne({email: req.body.email}, (err,user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "요청한 이메일과 일치하는 유저가 없습니다."
            })
        }
        //DB에 있는 Email과 요청된 비밀번호가 일치하는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {//comparePassword는 userSchema에 등록한 function
            if(!isMatch){
            return res.json({
                loginSuccess: false, 
                message: "비밀번호가 틀렸습니다."
            })
        }
            //비밀번호가 일치하면 토큰을 생성
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                //토큰을 저장한다. 어디에? cookie, localStorage, session 
                //어디에 저장하는지는 논란이 있고 방법이 많다. 각기 다 장단점이 있다.
                res.cookie("x_auth", user.token)//cookie에 x_auth로 token저장
                .status(200)
                .json({loginSuccess: true, userId: user._id})

            })
        })
    })
})

app.get('/api/users/auth', auth, (req, res) => {
    //여기까지 middleware를 통과했다는 얘기는 authentication이 True라는 말.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0? false : true,
        isAuth: true,
        eamil: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
    //role이 0이 아니면 어드민 0이면 일반유저 이건 설정에 따라서 다르다. 
    //이렇게 정보를 주면 어느 페이지던지 로그인 된 유저 정보를 사용할 수 있다.
})

app.get('/api/users/logout', auth, (req,res) =>{
    //cookie에 토큰을 지워서 인증이 불가능하게 만들면된다.

    User.findOneAndUpdate({_id: req.user._id},
        {token: ""}
        , (err, user) => {
            if (err) return res.json({ success: false, err});
            return res.status(200).send({
                success: true

            })
    })
})

const port = 5000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))