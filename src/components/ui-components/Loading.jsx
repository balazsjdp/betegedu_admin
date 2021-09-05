import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      position: "absolute",
      top: "50%",
      left: "50%"
    }
  }));

const Loading = () => {
    const classes = useStyles();
    return ( 
       <div className={classes.root}>
            <CircularProgress size={60} color="secondary" />
       </div>
     );
}
 
export default Loading;