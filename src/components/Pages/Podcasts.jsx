import { Fragment, useEffect, useState } from 'react';
import constants from '../../config';
import { _helpers } from '../../config';
import Loading from '../ui-components/Loading';
import { DataGrid } from '@material-ui/data-grid';
import { Paper } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import NewPodcastDialog from '../ui-components/NewPodcastDialog'


const {_api_base_url,_post_categories,_youtube_api_key,_youtube_api_parts} = constants
const {getVideoTitle} = _helpers;

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



const Podcasts = () => {
    const classes = useStyles()
    const [videos,setPodcasts] = useState();
    const [loading,setLoading] = useState(true);
    const [newPodcastDialogOpen, setnewPodcastDialogOpen] = useState(false)
    const [error, setError] = useState(false);

    const tableColumns =  [
        {
          field: 'title',
          headerName: 'Cím',
          flex: 1,
        },
        {
            field: 'date',
            headerName: 'Hozzáadva',
            flex: 1
        },
        {
          field: 'category',
          headerName: 'Kategória',
          flex:1,
          valueGetter: (params) => {
              return _post_categories.filter(cat => cat.id == params.row.category)[0].name
          }
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
                         to={`/podcast/${params.id}`}
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
        getPodcasts()
    },[])

    const getPodcasts = () => {
        fetch(_api_base_url + '/podcast')
        .then((response) => {
            return response.json()
        })
        .then(async (data) => {
            setPodcasts(data)
            setLoading(false)
        })
        .catch((err) => {
            _helpers.error(err)
            setError(true);
            setLoading(false)
        })
    }

    function onNewPostClick(){
        setnewPodcastDialogOpen(true);
    }

    function newPodcastDialogCallback(link, addPodcast){
        if(addPodcast){
            fetch(_api_base_url + '/podcast',{
                method: 'POST',
                body: JSON.stringify({
                    link: link
                })
            })
            .then(() => {
                getPodcasts()
            })
            .catch((err) => {
                console.log(err)
            })
        }
        setnewPodcastDialogOpen(false);
    }


    if(loading){
       return  <Loading />
    }

    if(error){
        return "Nem sikerült betölteni...";
    }

    return ( 
        <Fragment>
            <NewPodcastDialog callBack={newPodcastDialogCallback} open={newPodcastDialogOpen} />
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
            <Fab title="Új podcast" onClick={onNewPostClick} className={classes.fab} color="secondary" aria-label="Új podcast">
                <AddIcon />
            </Fab>
        </Fragment>
     );
}
 
export default Podcasts;