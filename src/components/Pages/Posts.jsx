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

const {_api_base_url,_post_categories} = constants





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



const Posts = () => {
    const classes = useStyles()
    const [posts,setPosts] = useState();
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState(false);

    const tableColumns =  [
        { field: 'post_id', headerName: '#',width: 90 },
        {
          field: 'post_title',
          headerName: 'Cím',
          width: 400,
          flex: 1,
        },
        {
          field: 'post_category',
          headerName: 'Kategória',
          width: 195,
          valueGetter: (params) => {
              return _post_categories.filter(cat => cat.id == params.row.post_category)[0].name
          }
        ,
         
        },
        {
          field: 'post_views',
          headerName: 'Megtekintések',
          width:190,
          renderCell: (params) => {
            return (
              <Fragment>
                  {params.row.post_views}
              </Fragment>
            )
        }
        },
        {
          field: 'post_likes',
          headerName: 'Kedvelések',
          width: 160,
          renderCell: (params) => {
              return (
                <Fragment>
                    {params.row.post_likes}
                </Fragment>
              )
          }
        },
        {
            field: 'Actions',
            headerName: 'Lehetőségek',
            width: 180,
            sortable: false,
            renderCell: (params) => {
                return (
                    <div>
                        <Button
                         variant="contained"
                         color="primary"
                         component={Link} 
                         to={`/post/${params.id}`}
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
        getPosts()
    },[])

    const getPosts = () => {
        fetch(_api_base_url + '/post')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            setPosts(data)
            setLoading(false)
        })
        .catch((err) => {
            _helpers.error(err)
            setError(true)
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
            getPosts()
        })
        .catch((err) => {
            console.log(err)
        })
    }


    if(loading){
       return  <Loading />
    }

    if(error){
        return "Nem sikerült betölteni...";
    }

    return ( 
        <Fragment>
            <Paper className={classes.paper}>
                <DataGrid className={classes.table}
                    rows={posts}
                    columns={tableColumns}
                    autoHeight={true}
                    rowsPerPageOptions={[5]}
                    id="post_id"
                    disableSelectionOnClick
                    getRowId={(row) => row.post_id}
                />
            </Paper>
            <Fab title="Új poszt" onClick={onNewPostClick} className={classes.fab} color="secondary" aria-label="Új poszt">
                <AddIcon />
            </Fab>
        </Fragment>
     );
}
 
export default Posts;