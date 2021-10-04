import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      position: "relative",
      height: "100vh",
      width: "100%",
      justifyContent:"center",
      alignContent: "center",
      alignItems: 'center'
    }
  }));


const FullscreenLoading = () => {
    const classes = useStyles();
    return ( 
        <div className={classes.root}>
           <div>
                <CircularProgress size={60} color="secondary" />
           </div>
        </div>
     );
}
 
export default FullscreenLoading;