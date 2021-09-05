import { useEffect, useState } from 'react';
import constants from '../../config';
import { _helpers } from '../../config';
import Loading from '../ui-components/Loading';

import { DataGrid } from '@material-ui/data-grid';


const {_api_base_url} = constants


const Posts = () => {
    const [posts,setPosts] = useState();
    const [loading,setLoading] = useState(true);

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
            setLoading(false)
        })
    }


    if(loading){
       return  <Loading />
    }

    return ( 
        <div>
           
        </div>
     );
}
 
export default Posts;