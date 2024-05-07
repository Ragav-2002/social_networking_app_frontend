import React, {useEffect, useState} from 'react'
import axios from '../config/axios'
import {  Box, Button, CircularProgress, Paper,  Stack, TextField, Typography } from '@mui/material'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup' 
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginFunc } from '../actions/userActions'
import Toaster from './Toaster'
export default function Login(props){
    const {handleModalClose, handleOpenRegisterModal} = props
    const dispatch = useDispatch()
    const [l, setL] = useState(false)
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)
    const [error, setError] = useState(false)
    const [serverError, setServerError] = useState({})
    const navigate = useNavigate()
    const initialValues = {
        email: '',
        password: ''
    }
    useEffect(()=>{
        setTimeout(()=>{
            setError(false)
            setOpen(false)
        }, 6000)
    },[])
    const validationSchema = Yup.object().shape({
        email: Yup.string()
        .email('enter valid email')
        .required('email cannot be empty'),
        password: Yup.string()
        .min(8, 'password should be between 8 to 128 character long')
        .max(128, 'password should be between 8 to 128 character long')
        .required('password cannot be empty')
    })
    const handleSubmit = async(values, {resetForm, setSubmitting}) => {
        try{
            setSubmitting(true)
            setL(true)
            const response = await axios.post('api/user/login', values)
            console.log(response.data, 'login component')
            setMessage(response.data.message)
            setTimeout(()=>{
                localStorage.setItem('token', response.data.token)
                dispatch(loginFunc())
                handleModalClose()
                resetForm()
                navigate('/')
            },1000)
            setOpen(true)
        }
        catch(e){
            if(e.code=='ERR_NETWORK'){
                setServerError('network error')
            }else{
                setServerError(e.response.data.errors)
            }
            setError(true)
        }
        finally{
            setL(false)
            setSubmitting(false)
        }
    }
    const regiModelOpen = () => {
        handleOpenRegisterModal()
        handleModalClose()

    }
    return (
        <Box >
            <Paper sx={{width:'400px', padding: '20px 40px', margin:'0 auto', height:'360px'}} elevation={5}>
                <Typography variant='h6' textAlign='center' paddingBottom="10px">LOGIN</Typography>
                    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                        {(props)=>(
                            <Form >
                                <Stack spacing={2}>
                                    <Field as={TextField}
                                    label="Email"
                                    name='email'
                                    type="email"
                                    variant='outlined'
                                    helperText={<ErrorMessage name='email'/>}
                                    required
                                    />
                                    <Field as={TextField}
                                    label="Password"
                                    name='password'
                                    type="password"
                                    variant='outlined'
                                    helperText={serverError.length ? serverError[0].msg : <ErrorMessage name='password'/>}
                                    required
                                    />
                                    <Button type='submit' color='primary' variant='contained'>{l ? <CircularProgress size='25px' color='inherit'/> : 'login'}</Button>
                                    <Button onClick={()=>{handleModalClose()}} color='error' variant='contained'>close</Button>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                <Box display='flex' justifyContent='space-between'>
                    <Typography paddingTop='20px'>Don't have an account?<Button onClick={regiModelOpen}>Register</Button> </Typography>
                </Box>
                <Toaster success={open} successMsg={message}/>
                <Toaster error={error.msg} errorMsg={serverError}/>
            </Paper>
        </Box>
    )
}