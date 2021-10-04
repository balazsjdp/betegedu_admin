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

import config from '../../config'
const categories = config._post_categories;
const tinyApiKey = config._tiny_api_key;
const apiBaseUrl = config._api_base_url;
const imagesPath = config._images_path;
const homepage = config._homepage;




const useStyles = makeStyles((theme) => (
    {
        postEditorWrapper: {
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


const EditPost = (props) => {
    const theme = useTheme();
    const params = useParams()
    const classes = useStyles();
    const editorRef = useRef(null);
    const history = useHistory();
    const [postData,setPostData] = useState(null);
    const [loading,setLoading] = useState(true);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [category, setCategory] = useState();
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [draft, setDraft] = useState();
    const [featured,setFeatured] = useState();
    const [meta, setMeta] = useState();

    const [allPosts, setAllPosts] = useState();
    const [relatedPosts, setRelatedPosts] = useState();
    const [confirmDialogOpen, setConfigmDialogOpen] = useState(false);


    useEffect(() => {
        getPostData()

    },[])

    if(!params.postId) return <NotFound />;


    function getPostData(){
        setLoading(true)
        fetch(`${apiBaseUrl}/post/${params.postId}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if(data[0]){
                const postData = data[0];
                setCategory(postData.post_category);
                setTitle(postData.post_title);
                setContent(postData.post_body);
                setDraft(postData.post_is_draft == 1 ? true : false)
                setFeatured(postData.post_is_featured == 1 ? true : false);
                setMeta(postData.post_meta)

                setPostData(data[0])
                getAllPosts()
            }else{
                setLoading(false);
                throw new Error("No post data")
            }
        })
        .catch((err) => {
            setLoading(false);
            return <NotFound />;
        })
    }

    function getAllPosts(){
        setLoading(true)
        console.log('getall')
        fetch(`${apiBaseUrl}/post`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
            setAllPosts(data)
            getRelatedPosts()
        })
        .catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }

    function getRelatedPosts(){
        fetch(`${apiBaseUrl}/post/${params.postId}/related`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setRelatedPosts(data.map(post => post.post_id))
            setLoading(false)
        })
        .catch((err) => {
            setLoading(false)
        })
    }

    function uploadFeaturedImage(e){

        const formData = new FormData();

        formData.append("postId", postData.post_id)
        formData.append("image",e.target.files[0])

        fetch(apiBaseUrl + '/upload/post', {
            method: "POST",
            body: formData
        })
        .then(() => {
            getPostData()
        })
    }

    function onCategoryChange(e){
        setCategory(e.target.value)
    }

    function onTitleChange(e){
        setTitle(e.target.value)
    }

    function onDraftChange(e){
        setDraft(e.target.checked)
    }

    function onFeaturedChange(e){
        setFeatured(e.target.checked)
    }

    function onContentChange(cont){
        setContent(cont)
    }

    function onMetaChange(e){
        setMeta(e.target.value)
    }

    function onRelatedChange(e){
        setRelatedPosts(Array.from(e.target.options).filter(o => o.selected).map(o => o.value))
        console.log(Array.from(e.target.options).filter(o => o.selected).map(o => o.value))
    }

    function onDeletePost(){
        setConfigmDialogOpen(true)
    }

    function deletePostConfirmResult(result){
        setConfigmDialogOpen(false)
        if(result){
            // Delete post
            fetch(apiBaseUrl + '/post/' + postData.post_id, {
                method: 'DELETE'
            })
            .then(() => {
                history.push("/posts");
            })
            .catch(() => {
                ShowAlert('error')
            })
        }else{
            return;
        }
    }


    function savePost(){
        const postData = {
            post_title : title,
            post_category: category,
            post_is_draft: draft,
            post_is_featured: featured,
            post_body: content,
            post_meta: meta,
            post_id: params.postId,
            relatedPosts: relatedPosts
        }

        fetch(apiBaseUrl + '/post/' + params.postId, {
            method: "PUT",
            body: JSON.stringify(postData)
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



    if(loading){
        return (
            <Grid spacing={4} container className={classes.postEditorWrapper}>
               <Grid item xs={12} md={12}>
                <Loading />
               </Grid>
            </Grid>
        )
    }else{
        return ( 
            <Grid spacing={4} container className={classes.postEditorWrapper}>
                <ConfirmationDialog title={"Megerősítés szükséges!"} body={"Biztosan törli a posztot? A művelet nem visszavontható!"} cancelText={"Mégse"} confirmText={"Törlés"} callBack={deletePostConfirmResult} open={confirmDialogOpen} />
                {<CustomAlert open={showSuccessAlert} severity={"success"} content={"Sikeres mentés"} />}
                {<CustomAlert open={showErrorAlert} severity={"error"} content={"Hiba történt!"} />}
                {/* Left side */}
                <Grid item xs={12} md={4} lg={4}>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" component="h5">
                           Alapvető beállítások
                        </Typography>
                        <Grid spacing={4} container>
                            <Grid item xs={12} md={12}>
                                <TextField onChange={onTitleChange} className={classes.textField} id="post_title" label="Cím" variant="standard" value={title} />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <FormControl variant="standard" className={classes.formControl}>
                                    <InputLabel >Kategória</InputLabel>
                                    <Select
                                    id="post_category"
                                    label="Kategória"
                                    defaultValue={category}
                                    onClick={onCategoryChange}
                                    >
                                    <MenuItem value="">
                                        <em>Nincs</em>
                                    </MenuItem>
                                    {
                                        categories.map((cat,index) => {
                                            return ( <MenuItem key={index} value={cat.id}>{cat.name}</MenuItem>)
                                        })
                                    }
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <TextField onChange={onMetaChange} className={classes.textField} id="post_meta" label="Meta leírás (SEO)" variant="standard" value={meta} />
                            </Grid>
                            <Grid style={{textAlign: "left"}} item xs={12} md={12}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    defaultChecked={draft == 1 ? true : false}
                                    onClick={onDraftChange}
                                    name="checkedB"
                                    color="secondary"
                                />
                                }
                                label="Piszkozat"
                            />
                                <FormControlLabel
                                control={
                                <Checkbox
                                    defaultChecked={featured == 1 ? true : false}
                                    onChange={onFeaturedChange}
                                    name="checkedB"
                                    color="secondary"
                                />
                                }
                                label="Kiemelt"
                            />
                            </Grid>
                        </Grid>
                    </Paper>
                   
                </Grid>
                {/* Right side */}
                <Grid item xs={12} md={8}>
                  <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" component="h5">
                            Kiemelt kép
                            </Typography>
                            <img className={classes.featuredImage} src={postData.post_featured_image ? `${imagesPath}/${postData.post_featured_image}` : homepage + '/img/placeholder.jpg'} alt="" />
                            <label htmlFor="contained-button-file">
                                <Input onChange={uploadFeaturedImage} accept="image/*" id="contained-button-file" multiple type="file" />
                                <Button color="primary" variant="contained" component="span">
                                <PhotoCamera /> Új feltöltése  
                                </Button>
                            </label>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" component="h5">
                            Kapcsolódó posztok
                            </Typography>
                            
                            <FormControl style={{marginTop: theme.spacing(3)}} className={classes.formControl}>
                                <InputLabel shrink htmlFor="select-multiple-native">
                                Kapcsolódó posztok kiválasztása
                                </InputLabel>
                                <Select
                                multiple
                                native
                                value={relatedPosts}
                                onChange={onRelatedChange}
                                inputProps={{
                                    id: 'select-multiple-native',
                                }}
                                >
                                {allPosts.filter(post => post.post_id != postData.post_id).map((post) => (
                                    <option key={post.post_id} value={post.post_id}>
                                    {post.post_title}
                                    </option>
                                ))}
                                </Select>
                            </FormControl>
                               
                     
                        </Paper>
                      </Grid>
                  </Grid>                   
                </Grid>
                {/* Editor*/}
                <Grid item xs={12} md={12}>
                    <Paper className={classes.paper}>
                        <Typography style={{marginBottom: 16}} variant="h5" component="h5">
                            Tartalom
                        </Typography>
                        <Editor
                            onInit={(evt, editor) => editorRef.current = editor}
                            onEditorChange={(content,editor) => {onContentChange(content)}}
                            initialValue={postData.post_body}
                            apiKey={tinyApiKey}
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
                    <Button style={{marginLeft: theme.spacing(2)}} onClick={savePost} className={classes.saveButton} color="primary" variant="contained"><Save />Mentés</Button>
                    <Button component={RouterLink} to="/posts" className={classes.saveButton} color="gray" variant="contained"><ClearIcon />Elvetés</Button>
                    <Button style={{float: 'left', backgroundColor: "#f44336", color: "#fff"}} className={classes.saveButton} onClick={onDeletePost} variant="contained"><DeleteIcon />Törlés</Button>
                </Grid>
            </Grid>
         );
    }


}
 
export default EditPost;