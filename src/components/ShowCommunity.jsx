import { Box, Button, CircularProgress, Dialog, DialogActions, DialogTitle, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import axios from "../config/axios";
import ShowPosts from './ShowPosts';
import { deleteCommunityF, joinLeft } from "../actions/communityAction";
import {getPostDispatch} from '../actions/postActions'

export default function ShowCommunity(props){
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const posts = useSelector((state)=>{
            return state.posts.data.filter(post=>location.state?.id==post.community)
    })
    const community = useSelector((state)=>{
        return state.communities.data.find(com=> com._id == location.state?.id)
    })
    const user = useSelector((state)=>{
        return state.users.data
    })
    const [openDialog, setOpenDialog] = useState(false);
    const [del, setDel] = useState(false)

    const handleDel = async()=>{
        setDel(true)
    }

    const handleDelConf = async()=>{
        try{
            const response = await axios.delete(`api/community/delete/${community._id}`)
            dispatch(deleteCommunityF(community._id));
            dispatch(getPostDispatch({data: [...response.data], serverErrors: {}}))
            navigate('/')
        }catch(e){
            alert(e.response.data.error)
        }finally{
            setDel(false);
        }
    }

    const handleJoin = async () => {
        setOpenDialog(true);
    };

    const handleConfirm = async () => {
        try {
            const response = await axios.post(`api/community/join/${community._id}`);
            const updatedCom = { ...community, users: response.data.users };
            dispatch(joinLeft(updatedCom));
            setOpenDialog(false);
        } catch (e) {
            alert(e.response.data.error);
            setOpenDialog(false);
        }
    };

    const handleCancel = () => {
        setOpenDialog(false);
        setDel(false)
    };

    return (
        community  ?
        <Box sx={{flex:{xs: 40, md: 4}}} p={2}>
            <Box bgcolor='skyblue' 
            padding='10px'
            borderRadius='10px'>
                <h1>{community.name} | {community.premium ? <b>premium</b> : <b>free</b> }</h1>
                <h3>{community.description}</h3>
                {
                    !(community.createdBy==user._id) ?
                     <Button onClick={community.users.find(id=>id==user._id)?handleJoin:handleConfirm} variant="contained" size="small" >
                        {community.users.find(id=>id==user._id) ? 'Leave community' : 'join community'}
                    </Button> : 
                    <Box>
                        <Button variant='contained' sx={{marginRight: '10px'}} onClick={()=>{navigate('/create/community', {state:{community: community}})}}>edit community</Button>
                        <Button variant='contained' onClick={handleDel}>delete community</Button>
                    </Box>

                }
                <Dialog open={openDialog} onClose={handleCancel}>
                    <DialogTitle>Want to leave this community?</DialogTitle>
                    <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={del} onClose={handleCancel}>
                    <DialogTitle>if you delete this community the posts you posted will be deleted as well, are you sure?</DialogTitle>
                    <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleDelConf}>Confirm</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            { 
                user._id==community.createdBy ? 
                (posts.length ? <ShowPosts posts={posts}/> : 
                <Typography marginTop='30px' textAlign='center' variant="h6">no posts yet<Button onClick={()=>{navigate('/create/post')}}>
                    create one
                </Button></Typography>)
                :
                (!community.premium ? 
                (posts.length ? <ShowPosts posts={posts}/> : 
                <Typography marginTop='30px' textAlign='center' variant="h6">No Posts in this Community</Typography>) :
                <Typography marginTop='30px' textAlign='center' variant="h6">This is premium community you need to join to access the content</Typography>)
            }
        </Box>
        : 
        <Box height='600px' flex={4} p={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <CircularProgress />
        </Box>
    )
}

