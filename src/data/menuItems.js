import DashboardIcon from "@material-ui/icons/Dashboard";
import PostAdd from "@material-ui/icons/PostAdd";
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline";
import Mic from "@material-ui/icons/Mic";

// Pages
import Dashboard from "../components/Pages/Dashboard"
import Posts from "../components/Pages/Posts";
import EditPost from "../components/Pages/EditPost";
import Videos from "../components/Pages/Videos";
import EditVideo from '../components/Pages/EditVideo'
import Podcasts from "../components/Pages/Podcasts";
import EditPodcast from '../components/Pages/EditPodcast'

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
    },
    {
        id: 6,
        displayName: "Videó Szerkesztés",
        showInMenu: false,
        link: "/video/:videoId",
        icon: PostAdd,
        component: EditVideo
    },
    {
        id: 7,
        displayName: "Podcast Szerkesztés",
        showInMenu: false,
        link: "/podcast/:podcastId",
        icon: PostAdd,
        component: EditPodcast
    }
];


export default menuItems;