import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useEffect, useState } from 'react';

export default function FormDialog(props) {
  const [open, setOpen] = useState(props.open);
  const [link, setLink] = useState(null);
  const [addDisabled, setAddDisabled] = useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setOpen(props.open)
  },[props.open])



  const handleClose = (addVideo) => {
    setOpen(false);
    setLink(null);
    setAddDisabled(true)
    props.callBack && props.callBack(link,addVideo)
  };


  const validateVideoLink = (link) => {
      const regexp = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
      return regexp.test(link);
  }

  const onLinkChange = (e) => {
    let isValidLink = validateVideoLink(e.target.value);
    if(isValidLink){
        setAddDisabled(false);
    }else{
        setAddDisabled(true);
    }
    setLink(e.target.value);
  }

  return (

      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Új videó hozzáadása</DialogTitle>
        <DialogContent>
          <DialogContentText>
           <p> Másolja be ide a videó linkjét, és kattintsok az hozzáadásra.</p> 
           <p><b>Szükséges formátum:</b><br /> https://www.youtube.com/watch?v=ID</p>
          </DialogContentText>
          <TextField
            autoFocus
            onChange={onLinkChange}
            margin="dense"
            id="link"
            label="Videó Link"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {handleClose(false)}} color="primary">
            Mégsem
          </Button>
          <Button disabled={addDisabled} onClick={() => {handleClose(true)}} variant="contained" color="primary" autoFocus>
            Hozzáadás
          </Button>
        </DialogActions>
      </Dialog>
  );
}