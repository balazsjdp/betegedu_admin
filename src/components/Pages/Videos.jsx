import { Fragment, useEffect, useState } from 'react';
import constants from '../../config';
import { _helpers } from '../../config';
import Loading from '../ui-components/Loading';
import { DataGrid } from '@material-ui/data-grid';
import { Paper } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const {_api_base_url,_post_categories,_youtube_api_key,_youtube_api_parts} = constants


const useStyles = makeStyles((theme) => (
    {
        paper: {
            width: "100%",
        },
        table: {
            padding: theme.spacing(2),
            height: 500,
            width: "100%",
            //background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        },
        fab: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
          },
    }
));

const getVideoTitle = async (videoId) => {
    console.log(videoId)
    const data = fetch(`https://www.googleapis.com/youtube/v3/videos?key=${_youtube_api_key}&id=${videoId}&part=${_youtube_api_parts}`)
    .then((result) => {
        return result.json();
    })
    .catch((err) => {
        console.log(err)
        return null;
    })
    return data;
}

const Videos = () => {
    const classes = useStyles()
    const [videos,setVideos] = useState();
    const [loading,setLoading] = useState(true);

    const tableColumns =  [
        { field: 'id', headerName: '#',flex:1 },
        {
          field: 'title',
          headerName: 'Cím',
          flex: 1,
        },
        {
          field: 'category',
          headerName: 'Kategória',
          flex:1,
          valueGetter: (params) => {
              return _post_categories.filter(cat => cat.id == params.row.category)[0].name
          }
        ,
         
        },
        {
          field: 'link',
          headerName: 'Link',
          flex: 1
        },
        {
            field: 'Actions',
            headerName: 'Lehetőségek',
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                return (
                    <div>
                        <Button
                         variant="contained"
                         color="primary"
                         component={Link} 
                         to={`/video/${params.id}`}
                        endIcon={<EditIcon />}
                        >
                        Szerkesztés
                        </Button>
                    </div>
                  
                )
            }
        }
    ];



    useEffect(() => {
        getVideos()
    },[])

    const getVideos = () => {
        fetch(_api_base_url + '/video')
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

            setVideos(videosUpdatedWithTitle)
            setLoading(false)
        })
        .catch((err) => {
            _helpers.error(err)
            setLoading(false)
        })
    }

    function onNewPostClick(){
        fetch(_api_base_url + '/post',{
            method: 'POST',
            body: JSON.stringify({
                post_title : "Új poszt",
                post_category: 1,
                post_meta: "Meta leírás",
                post_body: ""
            })
        })
        .then(() => {
            getVideos()
        })
        .catch((err) => {
            console.log(err)
        })
    }


    if(loading){
       return  <Loading />
    }

    return ( 
        <Fragment>
            <Paper className={classes.paper}>
                <DataGrid className={classes.table}
                    rows={videos}
                    columns={tableColumns}
                    autoHeight={true}
                    rowsPerPageOptions={[5]}
                    id="id"
                    disableSelectionOnClick
                    getRowId={(row) => row.id}
                />
            </Paper>
            <Fab title="Új poszt" onClick={onNewPostClick} className={classes.fab} color="secondary" aria-label="Új poszt">
                <AddIcon />
            </Fab>
        </Fragment>
     );
}
 
export default Videos;