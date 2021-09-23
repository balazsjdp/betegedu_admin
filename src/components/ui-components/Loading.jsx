import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      position: "relative",
      height: "100%",
      width: "100%",
      justifyContent:"center",
      alignContent: "center"
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