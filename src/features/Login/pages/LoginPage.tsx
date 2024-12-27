import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Button from 'components/Button/Button';
import { STORAGE_KEY } from 'globalConstants/rootConstants';
import { useAppDispatch } from 'hooks/useStore';
import { useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { InutitLogin, InutitToken } from 'store/slices/intuitloginSlice';
import { login } from 'store/slices/loginSlice';
import { boxStyles, containerStyles, typographyBottomStyles, typographyStyles } from './styles';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { listIntuitAccount } from 'store/slices/accountSlice';
interface Props {
}

const loginInitialValues = {
  username: '',
  password: '',
}
const clearBrowserCache = () => {
  // Clear Local Storage
  localStorage.clear();

  // Clear Session Storage
  sessionStorage.clear();

  // Clear Cookies (Optional)
  document.cookie.split(";").forEach((cookie) => {
    const [name] = cookie.split("=");
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};

const LoginPage = (props: Props) => {

  const [initialData, setInitialData] = useState<typeof loginInitialValues>({
    ...loginInitialValues,
  });

  const [isLoader, setIsLoader] = useState(false);
  const [isIntuitLoader, setIsIntuitLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setInitialData({ ...initialData, [name]: value });
  }

  const handleSubmit = async () => {
    setIsLoader(true);
    const formData = new FormData();
    formData.append("username", initialData.username);
    formData.append("password", initialData.password);
    console.log("hello", formData);

    try {
      const action = await dispatch(login(formData));
      clearBrowserCache();
      const response = action.payload;
      localStorage.setItem(STORAGE_KEY, response?.message.access_token || '');
      localStorage.setItem('username', response?.message.data?.user_details?.username || '');
      localStorage.setItem('email', response?.message.data?.user_details?.Email || '');
      setIsLoader(false);
      navigate('/dashboard');
    } catch (error) {
      setIsLoader(false);
      toast.error('Failed to login. Please try again.');
    }
  }
  // const handleIntuit = async () => {
  //   try {
  //     const action = await dispatch(InutitLogin());
  //     const response = action.payload;

  //     const redirectUrl = response.message.authorizationUrl;

  //     const popupWindow = window.open(redirectUrl, "_blank", "width=600,height=600");

  //     setIsIntuitLoader(true);

  //     if (popupWindow) {

  //       const interval = setInterval(async () => {

  //         if (popupWindow.location.href.includes('code=') && popupWindow.location.href.includes('realmId=')) {
  //           const urlParams = new URLSearchParams(popupWindow.location.search);
  //           const code = urlParams.get('code');
  //           const realm_id = urlParams.get('realmId');
  //           localStorage.setItem('realm_id', realm_id || '');
  //           popupWindow.close();

  //           clearInterval(interval);
  //           const intuitData = {
  //             code: code,
  //             realm_id: realm_id
  //           }
  //           const action = await dispatch(InutitToken(intuitData))
  //           const response = action.payload;
  //           localStorage.setItem(STORAGE_KEY, response?.message.access_token || '');
  //           localStorage.setItem('username', response?.message.data?.user_details?.GivenName || '');
  //           console.log("response", response);
  //           setIsLoader(false);
  //           navigate('/dashboard');
  //         }
  //         // setIsIntuitLoader(false);
  //       }, 1000);
  //     }
  //   } catch (error) {
  //     setIsIntuitLoader(false);
  //     console.error('Error occurred:', error);
  //   }
  // };

  const handleIntuit = async () => {
    try {
      const action = await dispatch(InutitLogin());
      const response = action.payload;

      const redirectUrl = response.message.authorizationUrl;

      const popupWindow = window.open(redirectUrl, "_blank", "width=600,height=600");

      setIsIntuitLoader(true);

      if (popupWindow) {

        const interval = setInterval(async () => {

          if (popupWindow.closed) {
            clearInterval(interval);
            setIsIntuitLoader(false);
          }

          if (popupWindow.location.href.includes('code=') && popupWindow.location.href.includes('realmId=')) {
            const urlParams = new URLSearchParams(popupWindow.location.search);
            const code = urlParams.get('code');
            const realm_id = urlParams.get('realmId');
            localStorage.setItem('realm_id', realm_id || '');
            popupWindow.close();

            clearInterval(interval);
            const intuitData = {
              code: code,
              realm_id: realm_id
            }
            const action = await dispatch(InutitToken(intuitData))
            clearBrowserCache();
            const response = action.payload;
            console.log({ response })
            localStorage.setItem(STORAGE_KEY, response?.message.access_token || '');
            localStorage.setItem('username', response?.message.data?.user_details?.GivenName || '');
            localStorage.setItem('email', response?.message.data?.user_details?.Email || '');
            console.log("response", response);
            setIsIntuitLoader(false);
            navigate('/dashboard');
          }
        }, 1000);

        const popupCloseListener = () => {
          if (popupWindow.closed) {
            clearInterval(interval);
            setIsIntuitLoader(false);
            window.removeEventListener('focus', popupCloseListener);
          }
        };

        window.addEventListener('focus', popupCloseListener);
      }
    } catch (error) {
      setIsIntuitLoader(false);
      console.error('Error occurred:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs"
      sx={containerStyles} className="login-page">
      <CssBaseline />
      <Box
        sx={boxStyles}>
        <Typography component="p" variant="h5" sx={typographyStyles}>
          American Petroleum
        </Typography>
        <Typography component="h1" variant="h5"
          sx={typographyBottomStyles}>
          Configuration
        </Typography>
        <ValidatorForm onSubmit={handleSubmit} style={{ width: '100%' }} autoComplete="off">
          <TextValidator
            label="Username"
            onChange={handleChange}
            name="username"
            value={initialData.username}
            validators={['required']}
            errorMessages={['This field is required']}
            sx={{ width: '100%', mt: 3 }}
            variant="filled"
          />
          <TextValidator
            label="Password"
            onChange={handleChange}
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={initialData.password}
            validators={['required']}
            errorMessages={['This field is required']}
            variant="filled"
            sx={{ width: '100%', mt: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Grid sx={{ mt: 2 }}>
            <Button
              type="submit"
              name="LOGIN"
              variant='contained'
              fullWidth
              loading={isLoader}
              disabled={isLoader}
            />
          </Grid>
        </ValidatorForm>
        <Grid container sx={{ mt: 2 }} className="intuit-account">
          <Button
            type="submit"
            name="Login with Intuit Account"
            variant='contained'
            fullWidth
            onClick={handleIntuit}
            loading={isIntuitLoader}
            disabled={isIntuitLoader}
          />
        </Grid>
        <Grid container sx={{ mt: 2 }}>
          <Grid item xs>
            <Link component={RouterLink} to="/reset-password" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default LoginPage;