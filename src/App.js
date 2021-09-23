import './App.css';
import Layout from './components/layout/Layout'
import Login from './components/layout/Login'
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import {
  BrowserRouter as Router
} from "react-router-dom";


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
  return (
    <ThemeProvider theme={theme}>
      <Router>
      <div className="App">
        <Layout />
      </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
