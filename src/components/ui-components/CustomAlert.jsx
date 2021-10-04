import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import zIndex from '@material-ui/core/styles/zIndex';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        top: "5rem",
        right: "2rem",
        zIndex: 99999999999,
        width: "300px"
    },
  }));

const CustomAlert = (props) => {
    const classes = useStyles();
    const open = props.open



    return ( 
        <Fade in={open}>
            <Alert style={props.style} onClose={() => {}} className={classes.root} variant="filled" severity={props.severity}>
                {props.content}
            </Alert>
        </Fade>
     );
}
 
export default CustomAlert;