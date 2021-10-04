import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import constants from '../../config'
import { _helpers } from '../../config';
import CustomAlert from '../ui-components/CustomAlert';

const {_api_base_url,_access_token_key} = constants;


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
}));

export default function SignIn() {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(false)
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null)

  const onEmailChange = (e) => {
    setEmailIsValid(_helpers.validateEmail(e.target.value))
    setEmail(e.target.value)
  }

  const onPasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const onLoginClick = () => {
    fetch(_api_base_url + '/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then((response) => {
      return response.json();
    })
    .then((data) => {
      if(data.accessToken){
        localStorage.setItem(_access_token_key,data.accessToken)
        window.location.reload()
      }else{
        setErrorMessage(data.message)
        ShowError()
      }
      
      //window.location.reload()
    })
    .catch((err) => {
      console.log(err)
    })
  }

  function ShowError(){
    setShowError(true)
    setTimeout(() => {
      setShowError(false)
    }, 3000);
  }



  return (
    <Container component="main" maxWidth="xs">
      {<CustomAlert style={{top: '1rem'}} open={showError} severity={"error"} content={errorMessage} />}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
         Bejelentkezés
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={email}
            onChange={onEmailChange}
            id="email"
            label="Email Cím"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={password}
            onChange={onPasswordChange}
            name="password"
            label="Jelszó"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            fullWidth
            disabled={!emailIsValid}
            variant="contained"
            color="primary"
            onClick={onLoginClick}
            className={classes.submit}
          >
            Bejelentkezés
          </Button>
          
        </form>
      </div>
    </Container>
  );
}