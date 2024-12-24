import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from 'components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { boxStyles, containerStyles, typographyBottomStyles } from './styles';
interface Props {

}

const loginInitialValues = {
  old_password: '',
  new_password: '',
}

const PasswordResetPage = (props: Props) => {

  const [initialData, setInitialData] = useState<typeof loginInitialValues>({
    ...loginInitialValues,
  })
  const [isLoader, setIsLoader] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setInitialData({ ...initialData, [name]: value });
  }

  const handleSubmit = async () => {

  }

  return (
    <Container component="main" maxWidth="xs" 
    sx={containerStyles}>
      <CssBaseline />
      <Box sx={boxStyles}>
        {/* <Typography component="p" variant="h5" sx={{ mt: 2 }}>
          Better Day Energy
        </Typography> */}
        <Typography component="h1" variant="h5"
          sx={typographyBottomStyles} >
          Reset Your Password
        </Typography>
        <ValidatorForm onSubmit={handleSubmit} style={{ width: '100%' }} autoComplete="off">
          <TextValidator
            label="Old Password"
            onChange={handleChange}
            name="old_password"
            type="password"
            value={initialData.old_password}
            validators={['required']}
            errorMessages={['This field is required']}
            sx={{ width: '100%', mt: 2 }}
          />
          <TextValidator
            label="New Password"
            onChange={handleChange}
            name="new_password"
            type="password"
            value={initialData.new_password}
            validators={['required']}
            errorMessages={['This field is required']}
            sx={{ width: '100%', mt: 2 }}
          />
          <Grid sx={{ mt: 2 }}>
            <Button
              type="submit"
              name="RESET PASSWORD"
              variant='contained'
              fullWidth
              loading={isLoader}
              disabled={isLoader}
            />
          </Grid>
        </ValidatorForm>
        <Grid container sx={{ mt: 2 }}>
          <Grid item>
            <Link component={RouterLink} to="/" variant="body2">
              {"Back to Login"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default PasswordResetPage;