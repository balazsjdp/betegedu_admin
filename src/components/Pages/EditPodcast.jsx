import { Paper } from "@material-ui/core";
import { useHistory, useParams } from "react-router";
import NotFound from "./404";
import { makeStyles } from "@material-ui/styles";
import { TextField } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import { Fragment, useState,useRef } from "react";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Editor } from '@tinymce/tinymce-react';
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

const {_api_base_url,_post_categories,_youtube_api_key,_youtube_api_parts,_images_path,_tiny_api_key} = constants
const {getVideoTitle} = _helpers;



const useStyles = makeStyles((theme) => (
    {
        podcastEditorWrapper: {
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


const EditPodcast = (props) => {
    const theme = useTheme();
    const params = useParams()
    const classes = useStyles();
    const editorRef = useRef(null);
    const history = useHistory();
    const [podcastData,setPodcastData] = useState(null);
    const [loading,setLoading] = useState(true);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [allPodcasts, setAllPodcasts] = useState();
    const [confirmDialogOpen, setConfigmDialogOpen] = useState(false);
    const [error, setError] = useState(false)

    const [title, setTitle] = useState('?');
    const [link, setLink] = useState();
    const [category, setCategory] = useState();
    const [relatedPodcasts, setRelatedPodcasts] = useState();
    const [shortDesc, setShortDesc] = useState();
    const [longDesc, setLongDesc] = useState();

    useEffect(() => {
        getPodcastData()
        getAllPodcasts()
    },[])

    if(!params.podcastId) return <NotFound />;


    function getPodcastData(){
        fetch(_api_base_url + '/podcast/' + params.podcastId)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const podcastData = data[0] ? data[0] : null;
            if(!podcastData) {
                setError(true);
                return;
            }
            setPodcastData(podcastData)
            setLink(podcastData.link)
            setCategory(podcastData.category)
            setTitle(podcastData.title)
            setShortDesc(podcastData.description)
            setLongDesc(podcastData.long_description)
        })
    }

    function getAllPodcasts(){
        fetch(_api_base_url + '/podcast')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setAllPodcasts(data)
            getRelatedPodcasts()
        })
        .catch((err) => {
            setError(true)
            setLoading(false)
            console.log(err)
        })
    }

    function getRelatedPodcasts(){
        fetch(_api_base_url + '/podcast/' + params.podcastId + '/related')
        .then((response) => {
            return response.json()
        })
        .then((data) =>{
            setRelatedPodcasts(data.map(pod => pod.id))
            console.log(data.map(pod => pod.id))
            setLoading(false)
        })
    }
   
    function savePodcast(){
        const pData = {
            title: title,
            description: shortDesc,
            long_description: longDesc,
            category: category,
            related: relatedPodcasts
        }

        fetch(_api_base_url + '/podcast/' + podcastData.id, {
            method: 'PUT',
            body: JSON.stringify(pData)
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
        setRelatedPodcasts(Array.from(e.target.options).filter(o => o.selected).map(o => o.value))
    }

    function onCategoryChange(e){
       setCategory(e.target.value)
    }

    function onContentChange(content){
        setLongDesc(content)
    }

    function onShortDescChange(e){
        setShortDesc(e.target.value)
    }

    function onTitleChange(e){
        setTitle(e.target.value)
    }


    function confirmDialogResult(result){
        setConfigmDialogOpen(false)
        if(result){
            // Delete post
            fetch(_api_base_url + '/podcast/' + podcastData.id, {
                method: 'DELETE'
            })
            .then(() => {
                history.push("/podcasts");
            })
            .catch(() => {
                ShowAlert('error')
            })
        }else{
            return;
        }
    }

    function handlePodcastDelete(){
        setConfigmDialogOpen(true)
    }

    
    if(loading){
        return (
            <Grid spacing={4} container className={classes.podcastEditorWrapper}>
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
                <Grid spacing={4} container className={classes.podcastEditorWrapper}>
                <Grid item xs={12} md={6} lg={6}>
                    <Paper style={{height: '100%'}} className={classes.paper}>
                        <Typography variant="h5" component="h5">
                            Alapvető beállítások
                        </Typography>
                        <Grid spacing={4} container>
                            <Grid item xs={12} md={12}>
                                <TextField disabled className={classes.textField} id="link" label="Link" variant="standard" value={link}  />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField className={classes.textField} onChange={onTitleChange} id="link" label="Cím" variant="standard" value={title}  />
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
                                <TextField className={classes.textField} onChange={onShortDescChange} id="short_desc" label="Rövid Leírás" variant="standard" value={shortDesc}  />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography style={{marginBottom: '1rem'}} variant="caption" component="p">
                                    Előnézet
                                </Typography>
                                <div>
                                    <iframe src={link} width="100%" height="232" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
                                </div>
                            </Grid>
                        
                        </Grid>
                    </Paper>
                </Grid>
                <Grid  item xs={12} md={6} lg={6}>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" component="h5">
                            Kapcsolódó podcastek
                        </Typography>
                        <FormControl style={{marginTop: theme.spacing(3), height: '100%'}} className={classes.formControl}>
                            <InputLabel shrink htmlFor="select-multiple-native">
                            Kapcsolódó videók kiválasztása
                            </InputLabel>
                            <Select
                            multiple
                            native
                            value={relatedPodcasts}
                            onChange={onRelatedChange}
                            inputProps={{
                                id: 'select-multiple-native',
                            }}
                            >
                             {allPodcasts
                            .filter(pod =>{
                                return  pod.id != podcastData.id
                            })
                            .map((pod) => (
                                <option key={pod.id} value={pod.id}>
                                {pod.title}
                                </option>
                            ))}
                            </Select>
                            </FormControl>
                    </Paper>
                </Grid>
            
                <Grid item xs={12} md={12}>
                    <Paper className={classes.paper}>
                        <Typography style={{marginBottom: 16}} variant="h5" component="h5">
                            Leírás
                        </Typography>
                        <Editor
                            onInit={(evt, editor) => editorRef.current = editor}
                            onEditorChange={(content,editor) => {onContentChange(content)}}
                            initialValue={podcastData.long_description}
                            apiKey={_tiny_api_key}
                            init={{
                            height: 550,
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                            'bold italic backcolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',

                        }}
                        />
                    </Paper>
                </Grid>

                <div className={classes.buttonWrapper}>
                    <Button style={{float: 'left', backgroundColor: "#f44336", color: "#fff"}} onClick={handlePodcastDelete} className={classes.saveButton}  variant="contained"><DeleteIcon />Törlés</Button>
                    <div>
                        <Button style={{marginLeft: theme.spacing(2)}} onClick={savePodcast} className={classes.saveButton} color="primary" variant="contained"><Save />Mentés</Button>
                        <Button component={RouterLink} to="/videos" className={classes.saveButton} color="gray" variant="contained"><ClearIcon />Elvetés</Button>
                    </div>
                </div>
            </Grid>
           </Fragment>
         );
    }


}
 
export default EditPodcast;