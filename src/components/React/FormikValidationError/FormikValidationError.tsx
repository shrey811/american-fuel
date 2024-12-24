import { Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  name: string,
  errors: { [Key: string]: any | undefined };
  touched: { [Key: string]: any | undefined };
  index?: number;
  keyName?: string;
}

const FormikValidationError = (props: Props) => {

  const { name, errors, touched } = props;
  const { t } = useTranslation();

  return touched[name] && errors[name] ? (
    <Box className="text-left">
      <Typography className='error' 
      sx={{ 
        color: '#ff3d3d',
        fontSize: '0.694rem',
        fontWeight: 'bold',
      }}
      >
        {" "}
        <span className='ic-error'></span>{" "}
        {errors[name] ? t(errors[name] as string) : ''}
      </Typography>
    </Box>
  ) : (
    <></>
  )
}

export default FormikValidationError;