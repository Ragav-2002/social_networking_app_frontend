import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import { Box, List, ListItemText, ListItemButton, Collapse } from '@mui/material';

export default function Test(){
    const [open, setOpen] = React.useState(false)
    const categoryData = useSelector((state)=>{
        return state.categories.data
    })
    const user = useSelector((state)=>{
        return state.users.data
    })
    const community = useSelector((state)=>{
        return state.communities.data.find(com => com.createdBy == user._id)
    })
    const authHandlers = useSelector((state)=>{
        return state.auth
    })
    const navigate = useNavigate()
    const handleClick = () => {
        setOpen(!open)
    }
    const handleCatClick = (id) => {
        navigate('/category/communities', {state:{id: id}})
    }
    const handleCreateCom = () => {
        if(localStorage.getItem('token')){
            navigate('/create/community')
        }else{
            authHandlers.handleOpenLoginModal()
        }
    }
    return (
        <Box sx={{display:{xs: 'block', md: 'none'}, marginTop: '2px'}}>
            <PopupState variant="popover" popupId="demo-popup-menu" >
                    {(popupState) => (
                        <React.Fragment>
                            <MenuIcon {...bindTrigger(popupState)} 
                            sx={{
                                color: 'white',
                                '&:hover': {
                                    borderRadius: '5px',
                                    transform: 'scale(1.1)', 
                                    transition: 'transform 0.2s, color 0.2s',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' 
                                }
                            }}     
                        />
                        <Menu {...bindMenu(popupState)}>
                        <MenuItem onClick={()=>{navigate('/')}}>Home</MenuItem>
                        <MenuItem onClick={handleClick}>categories{open ? <ExpandLess /> : <ExpandMore />}</MenuItem>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {categoryData.map((e)=>{
                                    return (
                                        <ListItemButton key={e._id} onClick={()=>{handleCatClick(e._id)}}>
                                            <ListItemText primary={e.name}/>
                                        </ListItemButton>
                                    )
                                })}
                            </List>
                        </Collapse>
                        { community ? 
                        <>
                            <MenuItem onClick={()=>{navigate('/show/community', {state:{id: community._id}})}}>My Community</MenuItem>
                            <MenuItem onClick={()=>{navigate('/create/post')}}>Create Post</MenuItem>
                        </>
                        :
                        <MenuItem onClick={()=>{navigate('/create/post')}}>Create Community</MenuItem> }
                        {user.role=='admin' && 
                        <MenuItem onClick={()=>{navigate('/show/reportedPosts')}}>Create Community</MenuItem>}
                        </Menu>
                        </React.Fragment>
                    )}
                </PopupState>
        </Box>
    )
}