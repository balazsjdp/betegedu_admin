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
    _tiny_api_key: "a099g992q1ytxekiw7ai6uvxyccsmfrfrvxwzduas90g1814"
}

export const _helpers = {
    error: function(message){
        console.log(message)
    }
}


export default constants;