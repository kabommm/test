'use strict';
const express = require('express');
const User = require('../models/User.js');
const Question = require('../models/Question.js');
const Drink = require('../models/Drink.js');
const Img = require('../models/Img.js');
const multer = require('multer');
const Storage = multer.diskStorage(
    {
        destination : "./src/uploads", // 파일이 저장될 folder설정
        filename : (req, file, cb) => {
            // image filename setting! 
            cb(null, file.originalname);
        },
        // 즉, image file이 저장될 저장소와 파일이름 설정해놓음. 
        // image스키마 변경 후 filename설정
    }
)
const upload = multer({ storage : Storage }); // 이거뒤에 .single을 사용해서 router middleware로 넣어줄거임 
const bcrypt = require('bcrypt'); // 비밀번호 저장할 때 plain문이 아니라 hashed문으로 저장할거야. 

module.exports = (passport) => {
    const router = express.Router();
    
    // 1. 회원가입
    router.post('/register' , upload.single("img"), async(req,res) => {
        try{
            const { id, password, name } = req.body;  //회원가입.ejs에서 name이 id와 password인 것을 받아옴
        
            console.log(req.body);
            
            let user = new User({
                id : id,
                password : password,  
                name : name,            
                img : {
                    data : req.file.filename, // req.file.filename으로 img찾기~
                    contentType : 'image/png',
                }
            })
            let saveUser = await user.save(); // 저장! 
            console.log(saveUser); // 저장된 js객체 출력! -> mongoose덕분임. 
            return res.redirect('/index');
        }catch(err){
            return console.log(err);
        }
    })
    
    // 2. 로그인 
    router.post('/login', 
        passport.authenticate('local', { // 'local'에서 로그인 성패 여부 따지고 따져지면 redirect코드로 온다. 
            successRedirect : '/index',
            failureRedirect : '/login',
        })
        // 1. 먼저 로그인 router를 타고 들어온다. 
        // 2. passport.authenticate 'local'방식으로 한다고 지정한다. 
        //  - 성공, 실패 시 리다이렉트 페이지도 지정. 
        // 3. 그럼 어떻게 성공인지 실패인지 알아?
        // passport.use로 간다. => 거기서 성공 실패 판별.
    )

    // 3. 이미지 업로드
    router.post('/image' , upload.single("img"), async(req,res) => {
        try{
                        
            let img = new Img({           
                img : {
                    data : req.file.filename, // req.file.filename으로 img찾기~
                    contentType : 'image/png',
                }
            })
            let saveImg = await img.save(); // 저장! 
            console.log(saveImg); // 저장된 js객체 출력! -> mongoose덕분임. 
            return res.redirect('/index');
        }catch(err){
            return console.log(err);
        }
    })

    // 3. 술 취향 테스트
    router.post('/test' , async(req,res) => {
        try{
            const { id, content, answer1, answer2 } = req.body;  //회원가입.ejs에서 name이 id와 password인 것을 받아옴
        
            console.log(req.body);

            let question = new Question({           
                id : id,
                content : content,
                answer1 : answer1,
                answer2 : answer2,
            })
            let saveQuestion = await question.save(); // 저장! 
            console.log(saveQuestion); // 저장된 js객체 출력! -> mongoose덕분임. 
            return res.redirect('/question');
        }catch(err){
            return console.log(err);
        }
    })

    // 3. 술 정보 업로드
    router.post('/drink' , async(req,res) => {
        try{
            const { id, content, answer1, answer2, answer3, answer4, answer5, answer6, answer7, answer8,
                answer9, answer10, answer11 } = req.body;  //회원가입.ejs에서 name이 id와 password인 것을 받아옴
        
            console.log(req.body);

            let drink = new Drink({           
                id : id,
                전통주명 : content,
                가격 : answer1,
                용량 : answer2,
                주종 : answer3,
                도수 : answer4,
                단맛 : answer5,
                신맛 : answer6,
                바디감 : answer7,
                청량감 : answer8,
                잘어울리는음식 : answer9,
                주원료 : answer10,
                이미지 : answer11,
            })
            let saveDrink = await drink.save(); // 저장! 
            console.log(saveDrink); // 저장된 js객체 출력! -> mongoose덕분임. 
            return res.redirect('/drink');
        }catch(err){
            return console.log(err);
        }
    })

    return router;
}
