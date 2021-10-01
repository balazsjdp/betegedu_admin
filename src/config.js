const constants = {
    _api_base_url: "http://127.0.0.1:8000",
    _images_path: "https://betegedukacio.webition.hu/img/uploads",
    _post_categories: [
        {
            id: 1,
            name: "Gyomorbántalmak"
        },
        {
            id: 2,
            name: "Vizelettartási problémák"
        }
    ],
    _tiny_api_key: "a099g992q1ytxekiw7ai6uvxyccsmfrfrvxwzduas90g1814",
    _youtube_api_key: "AIzaSyAXpnt0JFFJSCeuHt1AHYA5ZkR2bbsOEMU",
    _youtube_api_parts: "statistics,snippet"
}

export const _helpers = {
    error: function(message){
        console.log(message)
    },
    getVideoTitle: async (videoId) => {
        console.log(videoId)
        const data = fetch(`https://www.googleapis.com/youtube/v3/videos?key=${constants._youtube_api_key}&id=${videoId}&part=${constants._youtube_api_parts}`)
        .then((result) => {
            return result.json();
        })
        .catch((err) => {
            console.log(err)
            return null;
        })
        return data;
    }
}


export default constants;