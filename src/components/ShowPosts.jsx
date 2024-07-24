import React, { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Menu, MenuItem, Modal, Snackbar } from "@mui/material";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Carousel from 'react-material-ui-carousel';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hitLike } from "../actions/likeActions";
import Toaster from "./Toaster";
import Report from "./Report";
import axios from '../config/axios';

export default function ShowPosts(props) {
    const { posts, removePosts } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    useEffect(() => {
        setTimeout(() => {
            setError(false);
            setOpen(false);
        }, 6000);
    }, [open, error]);

    const communities = useSelector((state) => {
        return state.communities.data;
    });
    const user = useSelector((state) => {
        return state.users.data;
    });
    const likes = useSelector((state) => {
        return state.likes.data;
    });
    const comments = useSelector((state) => {
        return state.comments.data;
    });
    const authHandlers = useSelector((state) => {
        return state.auth;
    });
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setOpen(false);
            setError(false);
        }, [6000]);
    }, [open]);

    const copyToClipboard = async (url) => {
        try {
            await navigator.clipboard.writeText(url);
            setMessage('Copied to clipboard');
            setOpen(true);
        } catch (error) {
            setErrorMsg('Error occurred while copying');
            setError(true);
        }
    };

    const [anchorElMap, setAnchorElMap] = useState({});

    const handleClick = (postId, event) => {
        setAnchorElMap((prev) => ({ ...prev, [postId]: event.currentTarget }));
    };

    const handleClose = (postId) => {
        setAnchorElMap((prev) => ({ ...prev, [postId]: null }));
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`api/dltPost/${id}`);
            setMessage(response.data.message);
            setOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (e) {
            setErrorMsg(e.code);
            setError(true);
        }
    };

    const handleLike = (id) => {
        if (localStorage.getItem('token')) {
            dispatch(hitLike(id));
        } else {
            authHandlers.handleOpenLoginModal();
        }
    };

    return (
        <Box sx={{ flex: { xs: 40, md: 4 } }} p={2}>
            {(posts.length && communities.length && likes) ? posts.map(post => {
                const community = communities.find(com => post.community == com._id);
                return (
                    <Card key={post._id} sx={{ margin: '0 auto', marginBottom: '20px' }}>
                        <CardHeader
                            sx={{ height: 'auto', padding: '10px' }}
                            avatar={
                                <Avatar sx={{ bgcolor: blue[500], height: '30px', width: '30px', fontSize: '15px' }} aria-label="profile" onClick={() => { navigate('/show/community', { state: { id: community._id } }) }}>
                                    {community.name[0].toUpperCase() + community.name[1].toUpperCase()}
                                </Avatar>
                            }
                            action={
                                <Box>
                                    <IconButton aria-label="settings" onClick={(event) => { handleClick(post._id, event) }}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorElMap[post._id]}
                                        open={Boolean(anchorElMap[post._id])}
                                        onClose={() => handleClose(post._id)}
                                    >
                                        {user._id === post.user || user.role === 'admin' ?
                                            <Box>
                                                <MenuItem onClick={() => { handleDelete(post._id) }}>Delete post</MenuItem>
                                                {post.reports && <MenuItem onClick={() => { removePosts(post._id) }}>Remove post</MenuItem>}
                                            </Box> : <Box>
                                                <MenuItem onClick={() => { setOpenModal(true) }}>Report post</MenuItem>
                                                <MenuItem onClick={() => { navigate('/show/community', { state: { id: community._id } }) }}>Check community</MenuItem>
                                                <Modal
                                                    open={openModal}
                                                    onClose={() => { setOpenModal(false) }}
                                                >
                                                    <Report postId={post._id} onComplete={setOpenModal} />
                                                </Modal>
                                            </Box>}
                                    </Menu>
                                </Box>
                            }
                            title={<Typography variant="h6">{community.name}</Typography>}
                        />
                        {post.content.length > 1 ? <Carousel sx={{ height: '374px' }}>
                            {post.content.map(ele => {
                                return (post.type.includes('image') ?
                                    <Box sx={{ height: '374px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img src={ele} alt="img" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                                    </Box>
                                    :
                                    <Box sx={{ height: '374px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <video controls style={{ height: '100%', width: '100%', objectFit: 'cover' }}>
                                            <source src={ele} type="video/mp4" />
                                        </video>
                                    </Box>)
                            })}
                        </Carousel> :
                            post.type.includes('image') ?
                                <Box sx={{ height: '374px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img src={post.content[0]} alt="img" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                                </Box>
                                :
                                <Box sx={{ height: '374px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <video controls style={{ height: '100%', width: '100%', objectFit: 'cover' }}>
                                        <source src={post.content[0]} type="video/mp4" />
                                    </video>
                                </Box>}
                        <Typography padding='10px' variant="h6">{post.title}</Typography>
                        <CardContent>
                            <Typography variant="body1">
                                {post.body}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton aria-label="like" onClick={() => { handleLike(post._id) }}>
                                {likes.find(like => {
                                    return like.targetId == post._id && like.userId == user._id
                                }) ? <Favorite sx={{ color: 'darkviolet' }} /> : <FavoriteBorder />}
                                <Typography>{likes.filter(like => like.targetId == post._id).length}</Typography>
                            </IconButton>
                            <IconButton aria-label="comment" onClick={() => { navigate('/show/post', { state: { post: post } }) }}>
                                <CommentIcon sx={{ color: 'royalblue' }} />
                                <Typography>{comments?.filter(c => c.post == post._id).length}</Typography>
                            </IconButton>
                            <IconButton aria-label="share" onClick={() => { copyToClipboard(post.content) }}>
                                <ShareIcon sx={{ color: 'royalblue' }} />
                            </IconButton>
                        </CardActions>
                        {post.reports && <Typography marginLeft='5px'><b>Report count</b>: {post.reports}</Typography>}
                        <Toaster success={open} successMsg={message} />
                        <Toaster error={error} errorMsg={errorMsg} />
                    </Card>
                )
            }) :
                <Box height='600px' flex={4} p={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <CircularProgress />
                </Box>}
        </Box>
    )
}
