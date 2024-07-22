import React, {useEffect, useState} from 'react'
import axios from '../config/axios'
import { Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup' 
import Toaster from './Toaster'
export default function Register(props){
    const {handleModalClose, handleOpenLoginModal} = props
    const [l, setL] = useState(false)
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)
    const [error, setError] = useState(false)
    const [serverError, setServerError] = useState('')
    const initialValues = {
        username: '',
        email: '',
        password: ''
    }
    const handleLogIn = () => {
        handleModalClose()
        handleOpenLoginModal()
    }
    useEffect(()=>{
        setTimeout(()=>{
            setError(false)
            setOpen(false)
        }, 6000)
    })
    const validationSchema = Yup.object().shape({
        username: Yup.string()
        .min(3, 'username must be 3 characters long')
        .required('username cannot be empty'),
        email: Yup.string()
        .email('enter valid email')
        .required('email cannot be empty'),
        password: Yup.string()
        .min(8, 'password should be between 8 to 128 character long')
        .max(128, 'password should be between 8 to 128 character long')
        .required('password cannot be empty')
    })
    const handleSubmit = async(values, {resetForm, setSubmitting}) => {
        console.log(values)
        try{
            setSubmitting(true)
            setL(true)
            const response = await axios.post('api/user/register', values)
            setMessage(response.data.msg)
            setOpen(true)
            setTimeout(()=>{
                handleLogIn()
                resetForm()
            },1000)
        }
        catch(e){
            if(e.code=='ERR_NETWORK'){
                setServerError('network error')
            }else{
                setServerError(e.response.data.errors)
            }
            setError(true)
        }finally{
            setL(false)
            setSubmitting(false)
        }
    }
    return (
        <Box >
            <Paper sx={{ 
                width: { xs: '60%', md: '400px' }, 
                padding: { xs: '20px', sm: '20px 40px' }, 
                margin: '0 auto', 
                height: '430px', 
                overflow: 'hidden'
            }} elevation={5}>
                <Typography variant='h6' textAlign='center' paddingBottom="10px">REGISTER</Typography>
                    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                        {(props)=>(
                            <Form >
                                <Stack spacing={2}>
                                    <Field as={TextField}
                                    label="Username"
                                    name='username'
                                    type="text"
                                    variant='outlined'
                                    helperText={<ErrorMessage name='username'/>}
                                    required
                                    />
                                    <Field as={TextField}
                                    label="Email"
                                    name='email'
                                    type="email"
                                    variant='outlined'
                                    helperText={serverError.length ? serverError[0].msg : <ErrorMessage name='email'/>}
                                    required
                                    />
                                    <Field as={TextField}
                                    label="Password"
                                    name='password'
                                    type="password"
                                    variant='outlined'
                                    helperText={<ErrorMessage name='password'/>}
                                    required
                                    />
                                    <Button type='submit' color='primary' variant='contained'>{l ? <CircularProgress size='25px' color='inherit'/> : 'register'}</Button>
                                    <Button onClick={()=>{handleModalClose()}} color='error' variant='contained'>close</Button>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                <Typography paddingTop='10px'>Already have an account? <Button onClick={handleLogIn}>login</Button></Typography>
                <Toaster success={open} successMsg={message}/>
                <Toaster error={error} errorMsg={serverError}/>
            </Paper>
        </Box>
    )
}