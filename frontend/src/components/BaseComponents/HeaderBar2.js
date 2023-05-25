import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Link from '@mui/material/Link';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import './toolbar.css'
import {styled} from "@mui/material/styles";
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Chip from "@mui/material/Chip";
import {useState} from "react";

const pages = ['Collection', 'Statistics'];
const settings = ['Profile',  'Logout'];

// const ResponsiveAppBar = () => {

function HeaderBar(props){
    const [Counter,SetCounter] = useState(0)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const Username = window.username

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };




    return(
        <div className='header_bar'>
            <AppBar position="static" sx={{
                height:'5vh',
                minHeight:'5vh',
                boxShadow:0
                // backgroundColor:'#17a2b8'
            }}>
                <Container maxWidth="xl" sx={{height:'5vh',minHeight:'5vh'}}>
                    <Toolbar disableGutters sx={{height:'5vh',minHeight:'5vh'}}>
                        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LOGO
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button
                                href={'/collections'}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2,  display: 'block' }}
                            >
                                Collections
                            </Button>
                            <Button

                                href={'/statistics'}
                                sx={{ my: 2, display: 'block' }}
                            >
                               Statistics
                            </Button>
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>

                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <AccountCircleIcon />
                                </IconButton>

                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >

                                {Username && <div style={{paddingLeft: '1%'}}>
                                    <b>{Username}</b>
                                </div>}
                                <hr/>
                                <MenuItem onClick={handleCloseUserMenu} component="a" href="/logout">
                                    <Typography  textAlign="center">Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {/*<div style={{float:"right",height:"inherit",fontWeight:"bold"}}>*/}

            {/*    {Username}*/}


            {/*</div>*/}
            {/*<Tooltip title="Account settings">*/}
            {/*    <IconButton*/}
            {/*        onClick={handleClick}*/}
            {/*        size="small"*/}
            {/*        sx={{ ml: 2, float:"right" }}*/}
            {/*        aria-controls={open ? 'account-menu' : undefined}*/}
            {/*        aria-haspopup="true"*/}
            {/*        aria-expanded={open ? 'true' : undefined}*/}
            {/*    >*/}
            {/*        <AccountCircleIcon />*/}
            {/*    </IconButton>*/}
            {/*</Tooltip>*/}
        {/*</Box>*/}

            {/*<span>Home</span>*/}
            {/*<span>Statistics</span>*/}
            {/*<span>Collection</span>*/}
            {/*<span>Settings</span>*/}
            {/*<span>Logout</span>*/}

        {/*<Menu*/}
        {/*    anchorEl={anchorEl}*/}
        {/*    id="account-menu"*/}
        {/*    open={open}*/}
        {/*    onClose={handleClose}*/}
        {/*    onClick={handleClose}*/}
        {/*    PaperProps={{*/}
        {/*        elevation: 0,*/}
        {/*        sx: {*/}
        {/*            overflow: 'visible',*/}
        {/*            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',*/}
        {/*            mt: 1.5,*/}
        {/*            '& .MuiAvatar-root': {*/}
        {/*                width: 32,*/}
        {/*                height: 32,*/}
        {/*                ml: -0.5,*/}
        {/*                mr: 1,*/}
        {/*            },*/}
        {/*            '&:before': {*/}
        {/*                content: '""',*/}
        {/*                display: 'block',*/}
        {/*                position: 'absolute',*/}
        {/*                top: 0,*/}
        {/*                right: 14,*/}
        {/*                width: 10,*/}
        {/*                height: 10,*/}
        {/*                bgcolor: 'background.paper',*/}
        {/*                transform: 'translateY(-50%) rotate(45deg)',*/}
        {/*                zIndex: 0,*/}
        {/*            },*/}
        {/*        },*/}
        {/*    }}*/}
        {/*    transformOrigin={{ horizontal: 'right', vertical: 'top' }}*/}
        {/*    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}*/}
        {/*>*/}
        {/*    <MenuItem>*/}
        {/*        Profile*/}
        {/*    </MenuItem>*/}
        {/*    <MenuItem>*/}
        {/*         My collections*/}
        {/*    </MenuItem>*/}
        {/*    <MenuItem>*/}
        {/*         Statistics*/}
        {/*    </MenuItem>*/}

        {/*    <Divider />*/}

        {/*    <MenuItem>*/}

        {/*        <Logout />*/}
        {/*        Logout*/}
        {/*    </MenuItem>*/}
        {/*</Menu>*/}
    </div>


    );

}
export default HeaderBar