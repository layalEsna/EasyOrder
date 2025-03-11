



import React, { useState } from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
// Successful login

function Login({setCustomer}) {

    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*]).{8,}$/

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''

        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required('Username is required.')
                .min(5, 'Username must be at least 5 characters.')
                .max(50, 'Username must be less than 50 characters.'),
            password: Yup.string()
                .required('Password is required.')
                .min(8, 'Password must be at least 8 characters.')
                .matches(passwordPattern, 'Password must be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, and 1 special character (!@#$%^&*).'),

        }),
        onSubmit: (values => {
            console.log("Submitting login request with values:", values);

            
            fetch('/login', {
               
                method: 'POST',
                
                
                headers: {
                    'Content-Type': 'application/json'
                },
                
                 
                body: JSON.stringify(values)

            })
                .then(res => res.json())


                .then((data) => {
                    console.log('login data', data)
                    if (data) {
                        if (data.error) {
                            throw new Error(data.error)
                        }
                        setCustomer(data)
                        navigate('/items')
                    }
                    else {
                        throw new Error('Login failed.')
                    }                    
                    
                })
                .catch(e => {
                    setErrorMessage(e.message)
                   
                })

        })
    })

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor='username'>username:</label>
                    <input
                        id='username'
                        type='text'
                        name='username'
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.username && formik.touched.username && (
                        <div className='error'>{formik.errors.username}</div>
                    )}
                </div>
                <div>
                    <label htmlFor='password'>password:</label>
                    <input
                        id='password'
                        type='password'
                        name='password'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.password && formik.touched.password && (
                        <div className='error'>{formik.errors.password}</div>
                    )}
                </div>

                <div>
                    <button className='btn' type='submit'>login</button>
                    <button className='btn' onClick={()=> navigate('/signup') } type='submit'>signup</button>
                </div>

            </form>
            

        </div>
    )
}

export default Login
