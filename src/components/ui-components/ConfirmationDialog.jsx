import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import { useEffect, useState } from 'react';

export default function ConfirmationDialog(props) {
  const [open, setOpen] = useState(props.open);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  useEffect(() => {
    console.log("props cahnged")
    setOpen(props.open)
  },[props.open])

  const handleClose = (retVal) => {
    setOpen(false);
    props.callBack && props.callBack(retVal)
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{props.title ? props.title : 'TITLE'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.body ? props.body : 'BODY'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => {handleClose(false)}} color="primary">
            {props.cancelText ? props.cancelText : 'CANCEL'}
          </Button>
          <Button onClick={() => {handleClose(true)}} variant="contained" color="primary" autoFocus>
          {props.confirmText ? props.confirmText : 'CONFIRM'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}