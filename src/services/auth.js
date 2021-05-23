import $ from "jquery";
var TOKEN = null;

function getKeysToAuth(){
    let qs = require('querystring');

    let params = window.location.search.slice(1);
    return qs.parse(params);
}

export default function auth(){
    $.get({
        url: 'https://dezz.space/auth/',
        data: getKeysToAuth(),
        success: (response) => {TOKEN = response.token},
        fail: (response) => {TOKEN = false}
    })
}


