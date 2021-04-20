import {React} from 'react'
import useForm from './useForm'
import './index.css'


function Register() {
    const {value, error, changeHandler, submitHandler} = useForm()
    return (
        <div className="bg">
            <form className="content" onSubmit={submitHandler}>
                <h1>Register</h1>
                <div className="inner-form">
                    <div className="inner-form-left">
                        <div className="input-container id-container">
                            <i class="fas fa-address-card icon"></i>
                            <input type="text" name="id" placeholder="Enter your Voter ID" value={value.id} onChange = {changeHandler}/>
                        </div>
                        <span className="input-border id-border"/>
                        {error.idError && <p className="error-message">*Id is required</p>}
                        
                        <div className="input-container password-container">
                            <i class="fas fa-lock icon"></i>
                            <input type="password" name="password" placeholder="Enter your Password" value={value.password} onChange={changeHandler}/>
                        </div>
                        <span className="input-border password-border"/>
                        {error.passwordError && <p className="error-message">*Password is required</p>}

                        <div className="input-container password-container">
                            <i class="fas fa-lock icon"></i>
                            <input type="password" name="password" placeholder="Enter your Password" value={value.password} onChange={changeHandler}/>
                        </div>
                        <span className="input-border password-border"/>

                        <div className="input-container password-container">
                            <i class="fas fa-lock icon"></i>
                            <input type="password" name="password" placeholder="Enter your Password" value={value.password} onChange={changeHandler}/>
                        </div>
                        <span className="input-border password-border"/>

                        <div className="input-container password-container">
                            <i class="fas fa-lock icon"></i>
                            <input type="password" name="password" placeholder="Enter your Password" value={value.password} onChange={changeHandler}/>
                        </div>
                        <span className="input-border password-border"/>
                    </div>
                    <div className="inner-form-right">
                        <div className="input-container email-container">
                            <i class="fas fa-envelope icon"></i>
                            <input type="email" name="email" placeholder="Enter your Email ID" value={value.email} onChange = {changeHandler}/>
                        </div>
                        <span className="input-border user-border"/>
                        {error.idError && <p className="error-message">*Id is required</p>}
                        
                        <div className="input-container lastname-container">
                            <i class="fas fa-lock icon"></i>
                            <input type="text" name="lastname" placeholder="Enter your Last Name" value={value.lastname} onChange={changeHandler}/>
                        </div>
                        <span className="input-border lastname-border"/>

                        <div className="input-container confirm-password-container">
                            <i class="fas fa-lock icon"></i>
                            <input type="password" name="confirm-password" placeholder="Confirm your Password" value={value.confirmPassword} onChange={changeHandler}/>
                        </div>
                        <span className="input-border confirm-password-border"/>
                        {error.passwordError && <p className="error-message">*Password is required</p>}

                        <div className="input-container password-container">
                            <i class="fas fa-lock icon"></i>
                            <input type="password" name="password" placeholder="Enter your Password" value={value.password} onChange={changeHandler}/>
                        </div>
                        <span className="input-border password-border"/>

                        <div className="input-container password-container">
                            <i class="fas fa-lock icon"></i>
                            <input type="password" name="password" placeholder="Enter your Password" value={value.password} onChange={changeHandler}/>
                        </div>
                        <span className="input-border password-border"/>

                    </div>
                </div>


                <button className="button" type="submit">Login</button>
                <p className="no-account">Don't you have an account?</p>
                <a href="/home" className="nav-link">Create account</a>
            </form>
        </div>
    )
}

export default Register
