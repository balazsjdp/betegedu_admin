import { Paper } from "@material-ui/core";
import { useHistory, useParams } from "react-router";
import NotFound from "./404";
import { makeStyles } from "@material-ui/styles";
import { TextField } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import { Fragment, useState } from "react";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Typography } from "@material-ui/core";
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
import { _helpers } from '../../config';

const {_api_base_url,_post_categories,_youtube_api_key,_youtube_api_parts,_images_path} = constants
const {getVideoTitle} = _helpers;



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
            height: '100%'
        },
        textField: {
            width: "100%"
        },
        formControl: {
            width: "100%",
            height: '100%',
            textAlign: "left",
            "& option": {
                minHeight: 50
              }
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
        },
        buttonWrapper: {
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            padding: '1rem'
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
    const [allVideos, setAllVideos] = useState();
    const [confirmDialogOpen, setConfigmDialogOpen] = useState(false);


    const [title, setTitle] = useState('?');
    const [link, setLink] = useState();
    const [category, setCategory] = useState();
    const [relatedVideos, setRelatedVideos] = useState();


    useEffect(() => {
        getYoutubeData()
        getVideoData()
        getAllVideos()
    },[])

    if(!params.videoId) return <NotFound />;


    function getYoutubeData(){
        const data = fetch(`https://www.googleapis.com/youtube/v3/videos?key=${_youtube_api_key}&id=${params.videoId}&part=${_youtube_api_parts}`)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            setYoutubeData(data)
            setTitle(data.items[0].snippet.title ? data.items[0].snippet.title  : '??')
        })
        .catch((err) => {
            console.log(err)
            return null;
        })
        return data;
    }

    function getVideoData(){
        fetch(_api_base_url + '/video/' + params.videoId)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setVideoData(data[0]);
            if(data[0]){
                const videoData = data[0];
                setVideoData(videoData);
                setLink(videoData.link);
                setCategory(videoData.category);
            }
           
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function getAllVideos(){
        fetch(`${_api_base_url}/video`)
        .then((response) => {
            return response.json()
        })
        .then(async (data) => {
            const videos = data;
            let videosUpdatedWithTitle = [];

            for await (let video of videos) {
                const videoDataFromYT = await getVideoTitle(video.id)
                const title = videoDataFromYT.items[0] && videoDataFromYT.items[0].snippet.title;

                videosUpdatedWithTitle.push({
                    ...video,
                    title
                })
            }

            setAllVideos(videosUpdatedWithTitle)
            getRelatedVideos()
        })
        .catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }

    function getRelatedVideos(){
        fetch(`${_api_base_url}/video/${params.videoId}/related`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setRelatedVideos(data.map(vid => vid.id))
            setLoading(false)
        })
        .catch((err) => {
            setLoading(false)
        })
    }

    function uploadFeaturedImage(e){
        const formData = new FormData();

        formData.append("videoId", videoData.id)
        formData.append("image",e.target.files[0])

        fetch(_api_base_url + '/upload/video', {
            method: "POST",
            body: formData
        })
        .then(() => {
            getVideoData()
        })
    }

   
    function saveVideo(){
        const videoData = {
            category: category,
            relatedVideos: relatedVideos
        }

        fetch(_api_base_url + '/video/' + params.videoId, {
            method: "PUT",
            body: JSON.stringify(videoData)
        })
        .then(() => {
            ShowAlert("success")
        })
        .catch(() => {
            ShowAlert("error")
        })
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


    function onRelatedChange(e){
        setRelatedVideos(Array.from(e.target.options).filter(o => o.selected).map(o => o.value))
    }

    function onCategoryChange(e){
        setCategory(e.target.value)
    }


    function confirmDialogResult(result){
        setConfigmDialogOpen(false)
        if(result){
            // Delete post
            fetch(_api_base_url + '/video/' + videoData.id, {
                method: 'DELETE'
            })
            .then(() => {
                history.push("/videos");
            })
            .catch(() => {
                ShowAlert('error')
            })
        }else{
            return;
        }
    }

    function handleVideoDelete(){
        setConfigmDialogOpen(true)
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
           <Fragment>
                {<CustomAlert open={showSuccessAlert} severity={"success"} content={"Sikeres mentés"} />}
                {<CustomAlert open={showErrorAlert} severity={"error"} content={"Hiba történt!"} />}
                <ConfirmationDialog title={"Megerősítés szükséges!"} body={"Biztosan törli a videót? A művelet nem visszavontható!"} cancelText={"Mégse"} confirmText={"Törlés"} callBack={confirmDialogResult} open={confirmDialogOpen} />
                <Typography style={{marginBottom: '2rem'}} variant="h6" component="h6">
                   {title}
                </Typography>
                <Grid spacing={4} container className={classes.videoEditorWrapper}>
                <Grid style={{height: '600px'}} item xs={12} md={4} lg={4}>
                    <Paper style={{height: '100%'}} className={classes.paper}>
                        <Typography variant="h5" component="h5">
                            Alapvető beállítások
                        </Typography>
                        <Grid spacing={4} container>
                            <Grid item xs={12} md={12}>
                                <TextField disabled className={classes.textField} id="link" label="Link" variant="standard" value={link}  />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <FormControl variant="standard" className={classes.formControl}>
                                    <InputLabel >Kategória</InputLabel>
                                    <Select
                                    id="category"
                                    label="Kategória"
                                    onChange={onCategoryChange}
                                    defaultValue={category}
                                    >
                                    <MenuItem value="">
                                        <em>Nincs</em>
                                    </MenuItem>
                                    {
                                        _post_categories.map((cat,index) => {
                                            return ( <MenuItem key={index} value={cat.id}>{cat.name}</MenuItem>)
                                        })
                                    }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={12}>
                            <iframe id="ytplayer" type="text/html" width="100%" height="200"
                                src={`https://www.youtube.com/embed/${params.videoId}?autoplay=0`}
                                frameborder="0"></iframe>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid style={{height: '600px'}} item xs={12} md={4} lg={4}>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" component="h5">
                            Kapcsolódó videók
                        </Typography>
                        <FormControl style={{marginTop: theme.spacing(3), height: '100%'}} className={classes.formControl}>
                            <InputLabel shrink htmlFor="select-multiple-native">
                            Kapcsolódó videók kiválasztása
                            </InputLabel>
                            <Select
                            multiple
                            native
                            value={relatedVideos}
                            onChange={onRelatedChange}
                            inputProps={{
                                id: 'select-multiple-native',
                            }}
                            >
                            {allVideos
                            .filter(vid => vid.id != params.videoId)
                            .map((vid) => (
                                <option key={vid.id} value={vid.id}>
                                {vid.title}
                                </option>
                            ))}
                            </Select>
                            </FormControl>
                    </Paper>
                </Grid>
                <Grid style={{height: '600px'}} item xs={12} md={4} lg={4}>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" component="h5">
                            Kiemelt kép
                        </Typography>
                        <Typography variant="span" component="span">
                            Ha üres, a Youtube borítókép lesz látható az oldalon
                        </Typography>
                        <img className={classes.featuredImage} src={videoData.cover_image ? `${_images_path}/${videoData.cover_image}` : '/img/placeholder.jpg'} alt="" />
                            <label htmlFor="contained-button-file">
                                <Input onChange={uploadFeaturedImage} accept="image/*" id="contained-button-file" multiple type="file" />
                                <Button color="primary" variant="contained" component="span">
                                <PhotoCamera /> Új feltöltése  
                                </Button>
                            </label>
                    </Paper>
                </Grid>               
            
                <div className={classes.buttonWrapper}>
                    <Button style={{float: 'left', backgroundColor: "#f44336", color: "#fff"}} onClick={handleVideoDelete} className={classes.saveButton}  variant="contained"><DeleteIcon />Törlés</Button>
                    <div>
                        <Button style={{marginLeft: theme.spacing(2)}} onClick={saveVideo} className={classes.saveButton} color="primary" variant="contained"><Save />Mentés</Button>
                        <Button component={RouterLink} to="/videos" className={classes.saveButton} color="gray" variant="contained"><ClearIcon />Elvetés</Button>
                    </div>
                </div>
            </Grid>
           </Fragment>
         );
    }


}
 
export default EditVideo;