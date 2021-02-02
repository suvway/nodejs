import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action'
function LoginPage(props) {
    const dispatch = useDispatch();//import한 dispatch를 담아준다.

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler =  (event) =>{

        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSumbitHandler = (event) => {
        event.preventDefault();//이 버튼을 눌렀을 때 submit이 되기 때문에 페이지가 refresh되는데 그걸 막아주는 기능.
        //console.log('email', Email) 
        //console.log('Password', Password)
         let body = {
             email: Email,
             password: Password
         }

         dispatch(loginUser(body))
            .then(response => {
                if(response.payload.loginSuccess){
                    props.history.push('/')
                }else{
                    alert('Error')
                }
            })

        
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{display:'flex', flexDirection: 'column'}}
                onSubmit={onSumbitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <button type="submit">
                    Login
                </button>

                <br />
            </form>


        </div>
    )
}

export default LoginPage
