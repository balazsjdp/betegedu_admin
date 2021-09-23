import { Paper } from "@material-ui/core";
import { useParams } from "react-router";
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

import CustomAlert from "../ui-components/CustomAlert";

import config from '../../config'
const categories = config._post_categories;
const tinyApiKey = config._tiny_api_key;
const apiBaseUrl = config._api_base_url;
const imagesPath = config._images_path;




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
            width: "100%"
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
    const params = useParams()
    const classes = useStyles();
    const editorRef = useRef(null);
    const [postData,setPostData] = useState(null);
    const [loading,setLoading] = useState(true);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [category, setCategory] = useState();
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [draft, setDraft] = useState();
    const [featured,setFeatured] = useState();
    const [meta, setMeta] = useState()

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
                setLoading(false);
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


    function savePost(){

        const postData = {
            post_title : title,
            post_category: category,
            post_is_draft: draft,
            post_is_featured: featured,
            post_body: content,
            post_meta: meta,
            post_id: params.postId
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
                    <Paper className={classes.paper}>
                        <Typography variant="h5" component="h5">
                           Kiemelt kép
                        </Typography>
                        <img className={classes.featuredImage} src={`${imagesPath}/${postData.post_featured_image}`} alt="" />
                        <label htmlFor="contained-button-file">
                            <Input onChange={uploadFeaturedImage} accept="image/*" id="contained-button-file" multiple type="file" />
                            <Button color="primary" variant="contained" component="span">
                            <PhotoCamera /> Új feltöltése  
                            </Button>
                        </label>
                    </Paper>
                </Grid>
                {/* Right side */}
                <Grid item xs={12} md={8}>
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
                    <Button onClick={savePost} className={classes.saveButton} color="primary" variant="contained"><Save />Mentés</Button>
                </Grid>
            </Grid>
         );
    }


}
 
export default EditPost;