import { ButtonPropType } from 'types/ButtonType';
import MuiButton from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
export default function Button(props: ButtonPropType) {

  const { loading, name, children, ...args } = props;

  return (
    <MuiButton
      disabled={loading}
      {...args}
      sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
    >
      {children}
      {loading && (
        <CircularProgress
          size={20}
          color='primary'
          style={{ position: 'absolute' }}
        />
      )}
      {name}
    </MuiButton>
  );
}

