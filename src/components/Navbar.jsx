import { AppBar, Avatar, styled, Toolbar, Typography,  Menu, MenuItem,  Box, Modal, Stack, TextField, Button, } from "@mui/material";
import StayCurrentPortraitIcon from '@mui/icons-material/StayCurrentPortrait';
import React, {useState, useEffect} from "react";
import Autocomplete from '@mui/material/Autocomplete';
import Register from "./Register";
import Login from './Login'
import { useSelector, useDispatch } from "react-redux";
import { logoutFunc } from "../actions/userActions";
import {addDispatch} from '../actions/authActions'
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";
import Test from "./test";
const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between'
})

const Profile = styled('div')({
    height: '25px',
    width: 'auto',
    borderRadius: '15px',
    display: 'flex',
    gap:'5px'
})
export default function NavBar(props){
    const [openRegisterModal, setOpenRegisterModal] = useState(false)
    const [openLoginModal, setOpenLoginModal] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state)=>{
        return state.users.data
    })
    const communities = useSelector((state)=>{
        return state.communities.data
    })

    const handleLogout = () => {
        dispatch(logoutFunc())
    }
    const handleOpenRegisterModal = ()=> {
        setOpenRegisterModal(true)
    }
    const handleRegisterModalClose = ()=> {
        setOpenRegisterModal(false)
    }
    const handleOpenLoginModal = () => {
        setOpenLoginModal(true)
    }
    const handleLoginModalClose = ()=> {
        setOpenLoginModal(false)
    }
    useEffect(() => {
        dispatch(addDispatch({
            handleOpenRegisterModal,
            handleRegisterModalClose,
            handleOpenLoginModal,
            handleLoginModalClose
        }));
    }, []);
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          const selectedValue = event.target.value;
          const selectedCommunity = communities.find((community) => community.name.toLowerCase().includes(selectedValue.toLowerCase()));
          
          if (selectedCommunity) {
            navigate('/show/community', { state: { id: selectedCommunity._id } });
          }
        }
      };
    const handleAutocompleteChange = (_, value) => {
        if (value) {
          navigate('/show/community', { state: { id: value._id } });
        }
      };
    return (
        <AppBar position="sticky">
            <StyledToolbar>
                <Stack direction='row' >
                    <Test/>
                <StayCurrentPortraitIcon sx={{padding: '2px 3px 0px 0px', marginLeft:'0', marginRight: '0'}} onClick={()=>{navigate('/')}}/>
                <Typography variant="h6" sx={{display:{xs: 'none', md: 'block'}}}>
                    SNAPP
                </Typography>
                </Stack>
                <Autocomplete
                    id="community-search"
                    getOptionLabel={(communities)=>communities.name}
                    options={communities}
                    sx={{ 
                        width: { xs: '150px', md: '300px' }, // set different widths for xs and md
                        bgcolor: "white",
                        borderRadius: '4px' 
                    }}
                    size="small"
                    isOptionEqualToValue={(option, value)=>
                        option.name.includes(value)
                    }
                    noOptionsText={'No Communities there with this name'}
                    renderOption={(props, communities)=>(
                        <Box component='li' {...props} key={communities._id}  >
                            {communities.name}
                        </Box>
                    )}
                    onChange={handleAutocompleteChange}
                    renderInput={(params)=>
                        <TextField {...params} placeholder="search" onKeyDown={handleKeyDown} />
                }
                />
                <Profile>
                    <Avatar sx={{ bgcolor: 'white' , height:'25px', width: '25px',fontSize: '15px'}} aria-label="profile" onClick={(e)=>{setAnchorEl(e.currentTarget)}}>
                    {user.username ? <Typography color={blue[800]} >{user.username[0].toUpperCase()}</Typography> : <Typography color={blue[800]} >?</Typography>}
                    </Avatar>
                    <Typography >{user.username ? user.username : 'GUEST'}</Typography>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={()=>{setAnchorEl(null)}}>
                        { !(localStorage.getItem('token')) ? 
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={()=>{setAnchorEl(null)}}>
                                <MenuItem onClick={handleOpenLoginModal}>login</MenuItem>
                                <MenuItem onClick={handleOpenRegisterModal}>register</MenuItem>
                            </Menu> :
                                <MenuItem onClick={handleLogout}>logout</MenuItem>
                        }
                    </Menu>
                </Profile>
            </StyledToolbar>
            <Modal
            open={openRegisterModal}
            width='50'
            >
                <Register handleOpenLoginModal={handleOpenLoginModal} handleModalClose={handleRegisterModalClose}/>
            </Modal>
            <Modal
            open={openLoginModal}
            width='50'
            >
                <Login handleOpenRegisterModal={handleOpenRegisterModal} handleModalClose={handleLoginModalClose}/>
            </Modal>

        </AppBar>
    )
}