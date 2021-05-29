import $ from "jquery";

export class Backend{
    constructor() {
        this.serverURL = 'https://dezz.space/'
        this.authParams = null
    }

    async auth(){
        let params = this.__getKeysToAuth()
        try {
            let response = await $.get({
                url: `${this.serverURL}auth/`,
                data: params
            })

            this.authParams = {
                token: response.token,
                user_id: params.vk_user_id
            }
        }

        catch{
            this.authParams = false
        }
        return (this.authParams !== false)
    }

    __getKeysToAuth(){
        let qs = require('querystring');

        let params = window.location.search.slice(1);
        return (qs.parse(params))
    }
}
