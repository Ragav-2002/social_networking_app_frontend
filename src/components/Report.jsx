import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
import axios from "../config/axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from 'yup'
import Toaster from "./Toaster";

export default function Report(props){
    const {postId, onComplete} = props
    const [reasons, setReasons] = useState([])
    const [l, setL] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    useEffect(()=>{
        setTimeout(()=>{
            setError(false)
            setSuccess(false)
        }, 6000)
    })
    useEffect(()=>{
        (async()=>{
            const response = await axios.get('api/getReason')
            setReasons(response.data)
        })()
    }, [])
    const initialValues = {
        reason: ''
    }
    const validationSchema = Yup.object().shape({
        reason: Yup.string().required('must select a reason')
    })
    const handleSubmit = async(values, {setSubmitting, resetForm}) => {
       try{
        setSubmitting(true)
        setL(true)
        const response = await axios.post(`api/report/${postId}`, values)
        setSuccessMsg(response.data.message)
        setSuccess(true)
        setTimeout(()=>{
            onComplete(false)
        }, 1000)
       }catch(e){
        if(e.code=='ERR_NETWORK'){
            setErrorMsg('network error')
        }else{
            setErrorMsg(e.response.data.errors)
        }
        setError(true)
       }finally{
        setSubmitting(false)
        setL(false)
       }
    }
    return(
        <Box sx={{width: { xs: '70%', md: '400px' }, margin: '0 auto', marginTop: '150px'}} p={0}>
            <Paper sx={{width:'auto', padding: '15px 15px', margin:'0 auto', height:'auto', borderRadius: '5px'}} elevation={5}>
            <Typography>Select Reason</Typography>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {(props=>(
                    <Form>
                        <FormControl fullWidth>
                            <InputLabel id="reason">reason</InputLabel>
                            <Field as={Select} name="reason" labelId="reason" label="reason" onChange={props.handleChange}>
                                {reasons.map(e=>{
                                    return <MenuItem value={e._id} key={e._id}>{e.reason}</MenuItem>
                                })}
                            </Field>
                            <Typography variant="caption" color="textSecondary" gutterBottom>{<ErrorMessage name='reason'/>}</Typography>
                        </FormControl>
                        <Button size='small' type='submit' color='primary' variant='contained'>{l ? <CircularProgress size='25px' color='inherit'/> : 'submit'}</Button>
                    </Form>
                ))}
            </Formik>
            </Paper>
            <Toaster success={success} successMsg={successMsg} />
            <Toaster error={error} errorMsg={errorMsg}/>
        </Box>
    )
}