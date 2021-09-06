const constants = {
    _api_base_url: "http://127.0.0.1:8000",
    _post_categories: [
        {
            id: 1,
            name: "Gyomorbántalmak"
        },
        {
            id: 2,
            name: "Vizelettartási problémák"
        }
    ]
}

export const _helpers = {
    error: function(message){
        console.log(message)
    }
}


export default constants;