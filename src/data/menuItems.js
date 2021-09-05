import DashboardIcon from "@material-ui/icons/Dashboard";
import PostAdd from "@material-ui/icons/PostAdd";
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline";
import Mic from "@material-ui/icons/Mic";

// Pages
import Dashboard from "../components/Pages/Dashboard"
import Posts from "../components/Pages/Posts";



const Videos = () => {
    return (
        "Videos"
    )
}

const Podcasts = () => {
    return (
        "Podcasts"
    )
}

const menuItems = [
    {
        id: 1,
        displayName: "Főoldal",
        link: "/",
        icon: DashboardIcon,
        component: Dashboard
    },
    {
        id: 2,
        displayName: "Posztok",
        link: "/posts",
        icon: PostAdd,
        component: Posts
    },
    {
        id: 3,
        displayName: "Videók",
        link: "/videos",
        icon: PlayCircleOutline,
        component: Videos
    },
    {
        id: 4,
        displayName: "Podcastek",
        link: "/podcasts",
        icon: Mic,
        component: Podcasts
    }
];


export default menuItems;