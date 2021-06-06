import $ from "jquery";

export class Backend{
    static authParams = null
    static serverURL = 'https://skinemsya.dezz.space'
    static purchase_id = undefined
    static target_id = undefined
    static vk_token = undefined
    static product_id = undefined

    static async auth(){
        let params = Backend.__getKeysToAuth()
        try {
            let response = await $.get({
                url: `${Backend.serverURL}/auth/`,
                data: params
            })

            Backend.authParams = {
                token: response.token,
                user_id: params.vk_user_id
            }
        }

        catch{
            Backend.authParams = false
        }
        return (Backend.authParams !== false)
    }

    static __getKeysToAuth(){
        let qs = require('querystring');

        let params = window.location.search.slice(1);
        return (qs.parse(params))
    }

    static async callMethod(methodType, method, args){
        args = Object.assign({}, Backend.authParams, args)
        if (method === 'post')
            return await Backend.__post(method, args)
        else
            return await Backend.__get(method, args)
    }

    static async __post(method, args){
        try {
            return await $.post({
                url: `${Backend.serverURL}/${method}/`,
                data: args
            })
        }
        catch {return false}
    }

    static async __get(method, args){
        try {
            return await $.get({
                url: `${Backend.serverURL}/${method}/`,
                data: args
            })
        }
        catch {return false}
    }
}
