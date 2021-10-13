import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/register.css';
import * as yup from 'yup';
import { schema } from '../schema/loginSchema';
import axios from 'axios';
import { connect } from 'react-redux';
import { NavBar } from './NavBar';
import { createUser } from '../actions/userActions';

function RegisterForm(props) {
    const initialValues = {
		firstName: "",
		lastName: "",
		email: "",
        username: "",
        password: "",
        confirmPassword: ""
    }
    const [disabled, setDisabled] = useState(true);
    const [form, setForm] = useState(initialValues);
    const [shaped, setShaped] = useState({});
    let history = useHistory();

    const postNewUser = (user) => {
        var neoUser = {
            username: user.username,
            password: user.password
        }
        axios
          .post('https://dungeon-site-api.herokuapp.com/api/auth/register', neoUser)
          .then((res) => {
            history.push('/login');
          })
          .catch((err) => {
            console.log({err});
          });
    };

    const checkSchema = (name, value) => {
        yup.reach(schema, name).validate(value)
            .then(() => {
                setShaped({...shaped, [name]: ''});
            }).catch((err) => {
                if (err.errors) { 
                    setShaped({...shaped, [name]: err.errors[0]});
                }
        });

        schema.isValid(form)
            .then((valid) => setDisabled(!valid));
    }

    const gotoLogin = () => {
        history.push("/login");
    }

    const handleChange = (event) => {
        const { name, type, value, checked } = event.target;
        const updateData = (type === 'checkbox')?checked:value;
        setForm({...form, [name]: updateData});
        checkSchema(name, updateData);
    }

    const handleSubmit = () => {
        postNewUser(form)
    }

    return (
        <div id="registerContainer">
            <NavBar />
            <div id="form-register" className="form form-register">
                <h1>Register Form</h1>
				<div id="registerSecondRow">
				<div id="registerFirstLeft">
                <div id="error-firstName" className="error error-firstName" >{shaped.firstName}</div>
                <label id="label-firstName" htmlFor="firstName">First Name
                    <input id="firstName" name="firstName" type="text" 
                        onChange={handleChange} value={form.firstName}/>
                </label>
				</div>
				<div id="registerFirstRight">
                <div id="error-lastName" className="error error-lastName" >{shaped.lastName}</div>
                <label id="label-lastName" htmlFor="lastName">Last Name
                    <input id="lastName" name="lastName" type="text" 
                        onChange={handleChange} value={form.lastName}/>
                </label>
				</div>
				<div id="registerSecondLeft">
                <div id="error-email" className="error error-email" >{shaped.email}</div>
                <label id="label-email" htmlFor="email">Email
                    <input id="email" name="email" type="text" 
                        onChange={handleChange} value={form.email}/>
                </label>
				</div>
				<div id="registerSecondRight">
                <div id="error-register" className="error error-register" ></div>
                <div id="error-username" className="error error-username" >{shaped.username}</div>
                <label id="label-username" htmlFor="username">Username
                    <input id="username" name="username" type="text" 
                        onChange={handleChange} value={form.username}/>
                </label>
				</div>
				<div id="registerThirdLeft">
                <div id="error-password" className="error error-password" >
                    {shaped.password}</div>
                <label id="label-password" htmlFor="password">Password
                    <input id="password" name="password" type="password"
                        onChange={handleChange} value={form.password} />
                </label>
				</div>
				<div id="registerThirdRight">
                <div id="error-confirm-password" className="error error-confirm-password" >{shaped.confirmPassword}</div>
                <label id="label-confirm-password" htmlFor="confirmPassword">Confirm Password
                    <input id="confirmPassword" name="confirmPassword" type="password" onChange={handleChange} 
                    value={form.confirmPassword} />
                </label>
				</div>
				</div>
				<div id="registerThirdRow">
                <button id="button-nav-register" className="btn nav-btn nav-login"
                    onClick={gotoLogin} >Submit</button>
                {props.children}
				</div>
            </div>
        </div>
    )
}

export default connect(null, { createUser })(RegisterForm);
