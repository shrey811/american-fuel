import React from 'react';
import { ListItemIcon, Tooltip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

interface Props {
  id: string;
  text: string;
}

const TooltipLabel = (props: Props) => {
  return (
    <>
      {props.text && (
        <ListItemIcon id={props.id}>
          <Tooltip placement="top" arrow title={props.text}>
            <HelpIcon />
          </Tooltip>
        </ListItemIcon>
      )}
    </>
  )
}

export default TooltipLabel;
