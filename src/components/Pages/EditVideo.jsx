import { Link, Paper } from "@material-ui/core";
import { useHistory, useParams } from "react-router";
import NotFound from "./404";
import { makeStyles } from "@material-ui/styles";
import { TextField } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import { useRef, useState } from "react";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Typography } from "@material-ui/core";
import { Editor } from '@tinymce/tinymce-react';
import { styled } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { useEffect } from "react";
import Loading from '../ui-components/Loading'; 
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Save from '@material-ui/icons/Save';
import { useTheme } from "@material-ui/styles";
import CustomAlert from "../ui-components/CustomAlert";
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmationDialog from "../ui-components/ConfirmationDialog";

import { Link as RouterLink } from 'react-router-dom';


import constants from '../../config'


const {_api_base_url,_post_categories,_youtube_api_key,_youtube_api_parts} = constants




const useStyles = makeStyles((theme) => (
    {
        videoEditorWrapper: {
            display: 'flex'
        },
        gridContainer: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(5),
            marginTop: theme.spacing(2),
            color: theme.palette.text.secondary,
        },
        textField: {
            width: "100%"
        },
        formControl: {
            width: "100%",
            textAlign: "left"
        },
        editor: {
            marginTop: "16px"
        },
        featuredImage: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            maxWidth: "100%",
            width: "100%",
            height: "209px",
            objectFit: "cover"
        },
        saveButton: {
            marginTop: theme.spacing(2),
            float: "right"
        }
    }
));

const Input = styled('input')({
    display: 'none',
  });


const EditVideo = (props) => {
    const theme = useTheme();
    const params = useParams()
    const classes = useStyles();
    const history = useHistory();
    const [videoData,setVideoData] = useState(null);
    const [youtubeData, setYoutubeData] = useState(null)
    const [loading,setLoading] = useState(true);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);


    console.log(params, props)

    useEffect(() => {
        getYoutubeData()
    },[])

    if(!params.videoId) return <NotFound />;


    function getYoutubeData(){
        const data = fetch(`https://www.googleapis.com/youtube/v3/videos?key=${_youtube_api_key}&id=${params.videoId}&part=${_youtube_api_parts}`)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            setYoutubeData(data)
        })
        .catch((err) => {
            console.log(err)
            return null;
        })
        return data;
    }

    function getVideoData(){
      
    }

    function getAllVideos(){
     
    }

    function getRelatedVideos(){
      
    }

    function uploadFeaturedImage(e){
    }

   
    function saveVideo(){
       
    }
    
    function ShowAlert(type){
        if(type == "success"){
            setShowSuccessAlert(true)
            setTimeout(() => {
                setShowSuccessAlert(false)
            }, 2000);
        }else if(type == "error"){
            setShowErrorAlert(true)
            setTimeout(() => {
                setShowSuccessAlert(false)
            }, 2000);
        }
    }

   

    if(loading){
        return (
            <Grid spacing={4} container className={classes.videoEditorWrapper}>
               <Grid item xs={12} md={12}>
                <Loading />
               </Grid>
            </Grid>
        )
    }else{
        return ( 
            <Grid spacing={4} container className={classes.videoEditorWrapper}>
                
            </Grid>
         );
    }


}
 
export default EditVideo;