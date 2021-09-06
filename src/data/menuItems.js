import DashboardIcon from "@material-ui/icons/Dashboard";
import PostAdd from "@material-ui/icons/PostAdd";
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline";
import Mic from "@material-ui/icons/Mic";

// Pages
import Dashboard from "../components/Pages/Dashboard"
import Posts from "../components/Pages/Posts";
import EditPost from "../components/Pages/EditPost";


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
        showInMenu: true,
        link: "/",
        icon: DashboardIcon,
        component: Dashboard
    },
    {
        id: 2,
        displayName: "Posztok",
        showInMenu: true,
        link: "/posts",
        icon: PostAdd,
        component: Posts
    },
    {
        id: 3,
        displayName: "Videók",
        showInMenu: true,
        link: "/videos",
        icon: PlayCircleOutline,
        component: Videos
    },
    {
        id: 4,
        displayName: "Podcastek",
        showInMenu: true,
        link: "/podcasts",
        icon: Mic,
        component: Podcasts
    },
    {
        id: 5,
        displayName: "Poszt Szerkesztés",
        showInMenu: false,
        link: "/post/:postId",
        icon: PostAdd,
        component: EditPost
    }
];


export default menuItems;