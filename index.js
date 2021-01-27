const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');//body-Parser 라이브러리 불러오기
const { User } =require("./models/User");//User Model을 불러온다.

const config = require('./config/key');

//application/x-www-form-urlencoded 분석해서 가져오게 해준다.
app.use(bodyParser.urlencoded({extended:true}));

//application/json을 분석해서 가져오게 해준다.
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!~~안녕하세요 nodemon 실행중'))


app.post('/register',(req, res)=>{

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


app.listen(port, () => console.log(`Example app listening on port ${port}!`))