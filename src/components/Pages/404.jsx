import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const NotFound = () => {
    return ( 
       <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center'
    }}>
            <ErrorOutlineIcon style={{marginRight: '0.5rem',fontSize: 40}} color="secondary" />   
            <h2> Page not found!</h2>
       </div>
     );
}
 
export default NotFound;