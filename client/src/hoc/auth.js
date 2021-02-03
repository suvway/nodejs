import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_action'

export default function (SpecificComponent, option, adminRoute = null) {
    
    //option
    //null => everyone can access page
    //true => only login user can access page
    //false => only logout user can aceess page
    //adminRoute default = null (es6 grammar)
    //null => users can accesss Page
    //treu => only admin can access Page


    function AuthenticationCheck(props) {
        //Backend에 Request를 날려서 상태를 가져온다.
        const dispatch = useDispatch();
        
        useEffect(() => {//useEffect를 통해서 functional Coponent를 Class Coponent 처럼 사용 react hooks
            //Axios.get('/api/users/auth') 이런식으로 날려야함 그걸 redux를 거쳐서 처리해준다.
            dispatch(auth()).then(response => {
                console.log(response)
                
                //로그인 하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){
                        props.history.push('/login')
                    }
                } else { 
                    if(adminRoute && !response.payload.isAdmin){
                        props.history.push('/')
                    }else{
                        if(option === false){
                            props.history.push('/')
                        }
                    }
                }


            })

            

        }, [])

        return (
            <SpecificComponent />
        )

    }
    return AuthenticationCheck    
}