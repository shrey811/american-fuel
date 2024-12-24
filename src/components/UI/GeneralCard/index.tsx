import {
  Box,
  BoxProps,
  CardContent,
  Divider,
  Grid,
  Tooltip,
  Typography
} from '@mui/material';
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Button from 'components/Button/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

interface GeneralCardPropsType {
  title: any;
  children?: any;
  className?: string;
  print?: boolean;
  componentRef?: any;
  action?: any;
  boxProps?: BoxProps;
  arrowRight?: any;
  arrowLeft?: any;
  back?: any;
  add?: any;
  addLabel?: string; // New prop for the add button label
  backLabel?: string; // Back button label
}

const GeneralCard = (props: GeneralCardPropsType) => {

  const componentRef = React.useRef<any>(null);

  return (

    <Box
      ref={componentRef}
      sx={{
        borderRadius: '0.5rem',
        backgroundColor: 'FFFFFF',
        filter: 'drop-shadow(0px 5px 25px #52575d21)',
        // boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.1)',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)'
      }}
      {...props.boxProps}
    >
      <CardContent sx={{ padding: '16px 5px' }}>
        <Box>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {props.arrowLeft && (
                <Box role="button" onClick={props.arrowLeft} sx={{ cursor: 'pointer',marginTop: '6px', marginLeft: '0.5rem' }} >
                  <ArrowBackIosNewIcon />
                </Box>
              )}
              {props.title && (
                <Box sx={{ ml: 1 }}>
                  <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    {props.title}
                  </Typography>
                </Box>
              )}
            </div>
            <Typography variant="h5" component="div" sx={{ pb: 1, display: 'flex', justifyContent: 'space-between' }}>
              {/* {props.title} */}

              {props.action && (
                <Box role="button" onClick={props.action} sx={{ cursor: 'pointer' }}>
                  <EditIcon />
                </Box>
              )}
              {/* BUTTON FOR FORM */}
              {props.add && !props.back && (
                <Box role="button" onClick={props.add} sx={{ cursor: 'pointer' }}>
                  <Button
                    name={props.addLabel || "Add Form"} // Use the addLabel prop or default to "Add Form"
                    variant="contained"
                  />
                </Box>
              )}

              {props.back && (
                <Box role="button" onClick={props.back} sx={{ cursor: 'pointer' }}>
                  <Button
                    name={props.backLabel || "Back"} // Use the backLabel prop or default to "Back"
                    variant="contained"
                  />
                </Box>
              )}

              {/* END BUTTON FOR FORM */}

              {props.arrowRight && !props.arrowLeft && (
                <Box role="button" onClick={props.arrowRight} sx={{ cursor: 'pointer' }}>
                  <Tooltip title="Add " placement="top" arrow>
                    <ArrowCircleRightIcon />
                  </Tooltip>
                </Box>
              )}

              {props.print && (
                <Box>
                  <span>Print</span>
                </Box>
              )}
            </Typography>
          </div>

          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {props.children}
          </Typography>
        </Box>
      </CardContent>
    </Box>
  )
}

export default GeneralCard;