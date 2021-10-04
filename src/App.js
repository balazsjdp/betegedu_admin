import './App.css';
import Layout from './components/layout/Layout'
import Login from './components/layout/Login'
import FullscreenLoading from './components/layout/FullscreenLoading';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import {
  BrowserRouter as Router
} from "react-router-dom";
import { useEffect, useState } from 'react';
import constants from './config'

const {_api_base_url,_access_token_key} = constants;

const theme = createTheme({
  typography:{
    fontFamily: "Montserrat, sans-serif",
  },
  palette: {
    primary: {
      main: "#d8db30",
      dark: "#979921",
      light: "#dfe259"
    },
    secondary: {
      main: "#00C5C8",
      dark: "#00898c",
      light: "#33d0d3"
    },
    error: {
      main: "#f44336",
      dark: "#ff7961",
      light: "#ba000d"
    }
    
  },
});




function App() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);


  useEffect(() => {
    isAuthorized()
  },[])


  const isAuthorized = () => {
      fetch(_api_base_url + '/auth/loggedIn', {
        method: 'POST',
        body: JSON.stringify(
          {
            token: localStorage.getItem(_access_token_key) ? localStorage.getItem(_access_token_key) : null
          }
        )
      })
      .then((response) => {
        if(response.status === 401){
          setAuthorized(false);
          setLoading(false);
          return null;
        }
        return response.json();
      })
      .then((data) => {
          if(!data) return;
          setAuthorized(true)
          setLoading(false)
      })
      .catch((err) => {
        setAuthorized(false);
        setLoading(false);
      })
  }










  if(loading) return (
    <ThemeProvider theme={theme}>
      <FullscreenLoading />
    </ThemeProvider>
  )

  if(!authorized){
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <Login />
        </div>
    </ThemeProvider>
    )
  }else{
    return (
      <ThemeProvider theme={theme}>
        <Router basename={'/admin'}>
        <div className="App">
          <Layout />
        </div>
        </Router>
      </ThemeProvider>
    )
  }


}

export default App;
