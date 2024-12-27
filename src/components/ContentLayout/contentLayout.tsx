import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    Popover,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import { mainListItems } from './listItemsPage';
import { MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import {
    childrenStyles,
    dropIcons,
    sideBarIconBtnStyles,
    typographyHeaderUserStyles,
    userButtonStyles,
    menuItemStyles
} from './styles';
import LockResetIcon from '@mui/icons-material/LockReset';
import Log from 'features/GlobalLogs/Log';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import NotificationPage from './NotificationPage';
import SearchPage from './SearchPage';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Badge } from 'reactstrap';
import logo from '../../assets/logo.png';

interface Props {
    children: React.ReactNode;
}

const ContentLayout: React.FC<Props> = ({ children }) => {
    const [activeLink, setActiveLink] = useState<string>('');
    const [sidebarToggle, setSidebarToggle] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<any>(null);
    const [searchAnchorEl, setSearchAnchorEl] = useState<any>(null);

    const navigate = useNavigate();
    const location = useLocation(); // Get the current location

    const togglesidebar = () => setSidebarToggle(!sidebarToggle);

    const toggleDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setDropdownOpen(!dropdownOpen);
    };
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('')

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedEmail = localStorage.getItem('email');
        console.log({ storedUsername });
        if (storedUsername) {
            setUsername(storedUsername);
        }
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const [logDrawerOpen, setLogDrawerOpen] = useState(false);
    const handleLogDrawerToggle = () => {
        setLogDrawerOpen(!logDrawerOpen);
    };

    useEffect(() => {
        // Extract the pathname from the location object and set it as the active link
        setActiveLink(location.pathname);
    }, [location]);

    const logOutAction = () => {
        localStorage.clear();
        setAnchorEl(null); // Close the popover
        navigate('/');
    }
    const handleClick = () => {
        navigate('/setting');
    }
    const User = username.charAt(0).toUpperCase();
    const isHomePage = location.pathname === '/dashboard';

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleNotificationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };
    const notificationOpen = Boolean(notificationAnchorEl);

    const handleSearchClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSearchAnchorEl(event.currentTarget);
    };

    const handleSearchClose = () => {
        setSearchAnchorEl(null);
    };

    const searchOpen = Boolean(searchAnchorEl);

    return (
        <div className={`app ${sidebarToggle ? "toggled" : ""}`} style={{ position: "relative" }}>
            <AppBar
                sx={{
                    width: '100%',
                    height: '3rem',
                    // position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 1201,
                    backgroundColor: '#f44336',
                    paddingRight: '0 !important',
                }}>
                <Toolbar sx={{ pr: '24px' }}>
                    <div>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            className='header__menu-icon'
                            onClick={togglesidebar}
                            sx={sideBarIconBtnStyles}
                        >
                            <MenuIcon />
                        </IconButton>
                    </div>
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{ marginBottom: '10px' }}
                    >
                        {/* Logo */}
                        {/* <Box
                            component="img"
                            src={logo}
                            alt="Better Day Energy Logo"
                            sx={{
                                height: 30, // Adjust the size of the logo
                                marginRight: 2,
                                marginBottom: 2,// Spacing between logo and text
                            }}
                        /> */}

                        {/* Title */}
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1, marginBottom: 2, }}
                        >
                            American Petroleum
                        </Typography>
                    </Box>


                    <div style={{ position: 'absolute', right: '1rem', height: '4rem' }}>
                        <Typography component="h4" variant="h6"
                            color="inherit" noWrap
                            sx={typographyHeaderUserStyles}
                        >
                            <>
                                <Tooltip title="Search" arrow>
                                    <IconButton
                                        color="inherit"
                                        sx={{ marginRight: "5px" }}
                                        onClick={handleSearchClick}
                                    >
                                        <SearchIcon sx={{ fontSize: "1.2rem" }} />
                                    </IconButton>
                                </Tooltip>
                                <SearchPage
                                    anchorEl={searchAnchorEl}
                                    handleClose={handleSearchClose}
                                    open={searchOpen}
                                />
                            </>

                            <>
                                <Tooltip title="Notification" arrow>
                                    <IconButton
                                        color="inherit"
                                        sx={{ marginRight: "5px" }}
                                        onClick={handleNotificationClick}
                                    >
                                        <NotificationsIcon sx={{ fontSize: "1.2rem" }} />
                                    </IconButton>
                                </Tooltip>
                                <NotificationPage
                                    anchorEl={notificationAnchorEl}
                                    handleClose={handleNotificationClose}
                                    open={notificationOpen}
                                />
                            </>

                            <Tooltip title="Settings" arrow>
                                <IconButton onClick={handleClick} color="inherit" sx={{ marginRight: "15px" }}>
                                    <SettingsIcon sx={{ fontSize: "1.2rem" }} />
                                </IconButton>
                            </Tooltip>
                            <IconButton onClick={toggleDropdown} color="inherit" sx={userButtonStyles}>
                                {User}
                            </IconButton>
                        </Typography>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            sx={{
                                padding: '1rem'
                            }}
                        >
                            <Box sx={{ padding: 2, textAlign: 'center' }}>
                                <Typography color="inherit" sx={userButtonStyles}>
                                    {User}
                                </Typography>
                                <Typography variant="h6" color="inherit" sx={{ marginTop: '0.5rem', fontWeight: 'bold', fontSize: '12px' }}>
                                    {username}
                                </Typography>
                                <Typography variant="body2" color="inherit">
                                    {/* {localStorage.getItem('email')} */}
                                    {email}
                                </Typography>
                            </Box>
                            <MenuItem sx={menuItemStyles} onClick={logOutAction}>
                                <LogoutIcon sx={dropIcons} />
                                Sign Out
                            </MenuItem>
                            {/* <MenuItem sx={{ color: '#515a5a' }}>
                                <LockResetIcon sx={dropIcons} />
                                Reset Password
                            </MenuItem> */}
                        </Popover>
                        {/* <Menu open={dropdownOpen} anchorEl={anchorEl}
                            onClose={() => setDropdownOpen(false)}
                            className='logout__menu'>
                            <MenuItem className='logout__menu-item'
                                sx={{ color: '#FF0000' }}
                                onClick={logOutAction}
                            >
                                <LogoutIcon sx={dropIcons} />
                                Logout
                            </MenuItem>
                            <MenuItem sx={{ color: '#515a5a' }}>
                                <LockResetIcon sx={dropIcons} />
                                Reset Password
                            </MenuItem>
                        </Menu> */}
                    </div>
                </Toolbar>
            </AppBar>
            <div className="main" style={{ display: 'flex', flexDirection: 'row', paddingRight: '0rem' }}>
                <Box className="sidebar"
                    sx={{
                        width: sidebarToggle ? '60px' : '220px',
                        transition: 'width 255ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

                    }} >
                    <Drawer variant="permanent" className='sidebar-header'
                        sx={{
                            width: sidebarToggle ? '60px' : '220px',
                            flex: '0 0  auto',
                            transition: 'width 255ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                        }}
                    >
                        <Divider />
                        <List component="nav"
                            sx={{
                                width: sidebarToggle ? '60px' : '225px',
                                transition: 'width 255ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                marginTop: '3rem',
                                height: '100%'
                            }}
                        >
                            {mainListItems({ showText: !sidebarToggle, activeLink, setActiveLink, sidebarToggle })}
                        </List>
                    </Drawer>
                </Box>
                <Box className='content-children' sx={childrenStyles} >
                    {children}
                </Box>

                <Drawer
                    anchor="right"
                    open={logDrawerOpen}
                    onClose={handleLogDrawerToggle}
                    sx={{ width: 300 }}
                >
                    <Box sx={{ width: 300, padding: 2, marginTop: '40px' }}>
                        <Log />
                    </Box>
                </Drawer>

                <Tooltip title="View Logs" arrow>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleLogDrawerToggle}
                        sx={{
                            position: 'fixed',
                            right: logDrawerOpen ? '300px' : 0, // Move to the left side when drawer is open
                            top: '3.2rem', // Top margin
                            zIndex: 1300, // Ensure it's on top
                            borderRadius: '1px', // Rectangle shape (adjust if needed)
                            backgroundColor: 'rgb(210, 25, 25)', // Background color of the button
                            padding: '10px 20px', // Adjust padding to create a rectangle
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Floating effect
                            transition: 'right 0.6s ease', // Smooth transition for the right position
                            '&:hover': {
                                backgroundColor: 'rgb(163, 21, 21)', // Darker shade on hover
                            },
                        }}
                    >
                        <MenuIcon fontSize="small" sx={{ color: 'white' }} />
                    </IconButton>
                </Tooltip>


                {/* {!isHomePage && (
                    <Box sx={{ marginTop: '4.5rem', marginRight: '1.2rem' }}>
                        <Log />
                    </Box>
                )} */}
            </div>

        </div >
    );
}

export default ContentLayout;