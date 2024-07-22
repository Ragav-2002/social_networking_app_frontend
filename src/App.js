import React from "react";
import NavBar from "./components/Navbar";
import RightBar from "./components/Rightbar";
import SideBar from "./components/Sidebar"
import {Box, Stack} from '@mui/material'
import RouteList from "./components/RouteList";
import { getComFunc } from "./actions/communityAction";
import { getCatFun } from "./actions/categoryAction";
import {getPostsFunc} from './actions/postActions'
import { loginFunc } from "./actions/userActions";
import { useEffect } from "react";
import { useDispatch} from "react-redux";
import { getComments } from "./actions/commentActions";
import { getLikesFunc } from "./actions/likeActions";

export default function App() {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(getComFunc())
    dispatch(getCatFun())
    dispatch(getPostsFunc())
    dispatch(getComments())
    dispatch(getLikesFunc())
    if(localStorage.getItem('token')){
      dispatch(loginFunc())
    }
  },[])
  return (
    <Box sx={{margin: 0}}>
      <NavBar/>
      <Stack direction='row' spacing={2} >
        <SideBar/>
        <RouteList/>
        <RightBar/>
      </Stack>
    </Box>
   
  );
}

