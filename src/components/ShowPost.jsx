import React, { useState } from "react";
import { Box, Checkbox, CircularProgress, Menu, MenuItem} from "@mui/material";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import  {blue} from '@mui/material/colors';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Carousel from 'react-material-ui-carousel'
import { useSelector } from "react-redux";
import Comments from "./Comments";
import { useLocation } from "react-router-dom";
import ShowComments from "./ShowComments";

export default function ShowPost(props){
    const location = useLocation()
    const post = location.state?.post
    const community = useSelector((state)=>{
        return state.communities.data.find(com=>location.state?.post.community==com._id)
    })
    const user = useSelector((state)=>{
        return state.users.data
    })
    const [anchorEl, setAnchorEl] = useState(null);
    
    const [cM, setCM] = useState(false)
    const [uM, setUM] = useState(false)
    const handleClick = (id, event) => {
        console.log('handleClick called')
            if(user._id==id){
                setCM(true)
                setUM(false)
            }else{
                setUM(true)
                setCM(false)
            }
            setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
    <Box sx={{flex:{xs: 40, md: 4}}} p={2} >
        { Object.keys(post).length && community ? 
        <Box >
        <Card key={post._id} sx={{margin:'0 auto', marginBottom: '20px'}}>
            <CardHeader
            sx={{height: 'auto', padding: '10px', bgcolor: ''}}
                avatar={
                <Avatar sx={{ bgcolor: blue[500] , height:'30px', width: '30px',fontSize: '15px'}} aria-label="profile">
                    {community.name[0].toUpperCase()+community.name[1].toUpperCase()}
                </Avatar>
                }
                action={
                    <Box>
                        <IconButton aria-label="settings" onClick={(event)=>{handleClick(post.user, event)}}>
                        <MoreVertIcon />
                        </IconButton>
                        <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        >
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            {cM && (
                                <Box>
                                    <MenuItem onClick={handleClose}>delete post</MenuItem>
                                    <MenuItem onClick={handleClose}>edit post</MenuItem>
                                </Box>
                            )}
                            {uM && (
                                <Box>
                                    <MenuItem onClick={handleClose}>report post</MenuItem>
                                    <MenuItem onClick={handleClose}>check community</MenuItem>
                                </Box>
                            )}
                        </Menu>
                        </Menu>
                    </Box>
                }
                title={<Typography variant="h6">{community.name}</Typography>}
            />
            {post.content.length>1 ? <Carousel>
                {post.content.map(ele=>{
                    return (post.type.includes('image') ? 
                    <CardMedia
                        component='img'
                        height="20%"
                        image={ele}
                        alt="img"
                    /> : 
                    <CardMedia
                    component='video'
                    height="374px"
                    controls  
                    >
                        <source src={ele} type="video/mp4" />
                    </CardMedia>)
                })}
            </Carousel> : 
            post.type.includes('image') ? 
            <CardMedia
                component="img"
                height="374px"
                image={post.content[0]}
                alt="img"
            /> : 
            <CardMedia
                component='video'
                height="374px"
                controls  
                >
                <source src={post.content[0]} type="video/mp4" />
            </CardMedia>}
            <Typography padding='10px' variant="h6">{post.title}</Typography>
            <CardContent>
                <Typography variant="p" >
                    {post.body} 
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                <Checkbox  icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                </IconButton>
                <IconButton aria-label="comment" >
                    <CommentIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
            </CardActions>
        </Card>
        <Typography  variant='h5'>Comments</Typography>
        <hr/>
        <Comments postId={post._id}/>
        <ShowComments postId={post._id}/>
        </Box>
            : 
        <Box height='600px' flex={4} p={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <CircularProgress />
        </Box> 
        }  
    </Box>
)
}