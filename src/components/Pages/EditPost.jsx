import { Paper } from "@material-ui/core";
import { useParams } from "react-router";
import NotFound from "./404";
import { makeStyles } from "@material-ui/styles";
import { TextField } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import { useRef } from "react";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Typography } from "@material-ui/core";

import { Editor } from '@tinymce/tinymce-react';

import config from '../../config'
const categories = config._post_categories;

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
        }
    }
));


const EditPost = (props) => {
    const params = useParams()
    const classes = useStyles();
    const editorRef = useRef(null);
    if(!params.postId) return <NotFound />;

    const log = () => {
        if (editorRef.current) {
          console.log(editorRef.current.getContent());
        }
      };

    return ( 
        <Grid spacing={4} container className={classes.postEditorWrapper}>
            {/* Left side */}
            <Grid item xs={12} md={4}>
                <Paper className={classes.paper}>
                    <Typography variant="h5" component="h5">
                       Alapvető beállítások
                    </Typography>
                    <Grid spacing={4} container>
                        <Grid item xs={12} md={12}>
                            <TextField className={classes.textField} id="post_title" label="Cím" variant="standard" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl variant="standard" className={classes.formControl}>
                                <InputLabel >Kategória</InputLabel>
                                <Select
                                id="post_title"
                                label="Kategória"
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
                        <Grid style={{textAlign: "left"}} item xs={12} md={12}>
                        <FormControlLabel
                            control={
                            <Checkbox

                                name="checkedB"
                                color="secondary"
                            />
                            }
                            label="Piszkozat"
                        />
                            <FormControlLabel
                            control={
                            <Checkbox

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
                <Paper className={classes.paper}>
                    <Typography style={{marginBottom: 16}} variant="h5" component="h5">
                        Tartalom
                    </Typography>
                    <Editor
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue="<p>This is the initial content of the editor.</p>"
                        init={{
                        height: 500,
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
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
                </Paper>
            </Grid>
        </Grid>
     );
}
 
export default EditPost;