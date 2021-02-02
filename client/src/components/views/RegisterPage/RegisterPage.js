import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';

function RegisterPage(props) {
    const dispatch = useDispatch();//import한 dispatch를 담아준다.

    const [Email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfrimPassword, setConfirmPassword] = useState("")

    const onEmailHandler =  (event) =>{

        setEmail(event.currentTarget.value)
    }
    const onNameHandler =  (event) =>{

        setName(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }

    const onSumbitHandler = (event) => {
        event.preventDefault();//이 버튼을 눌렀을 때 submit이 되기 때문에 페이지가 refresh되는데 그걸 막아주는 기능.
         
        if(Password !== ConfrimPassword){
            return alert('비밀번호가 일치하지 않습니다.')
        }
        
        
        let body = {
             email: Email,
             name: Name,
             password: Password
         }
        //redux를 이용하지 않으면 axios.post('/api/users/register',body) 이런식으로 axios로 처리할 것이다.
         dispatch(registerUser(body))
            .then(response => {
                if(response.payload.success){
                    props.history.push('/login')
                }else{
                    alert('Fail to Login')
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
                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <label>Password Confirm</label>
                <input type="password" value={ConfrimPassword} onChange={onConfirmPasswordHandler} />

                <button type="submit">
                    Register
                </button>

                <br />
            </form>


        </div>
    )
}

export default RegisterPage