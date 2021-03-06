import fs from 'fs';
import fetch from 'node-fetch';
import formData from 'form-data';
import config from '../../server/config';


class live {

    constructor(options){

    }

    get(url, callback){
        fetch(url)
        .then(function(res) {
            return res.text();
        }).then(function(body) {
            try{
                var data = JSON.parse(body);
                callback(null, data.message, data)
            }catch(e){
                console.error(e)
                callback(true, e, null)
            }
        });
    }

    post(url, options, callback){
        callback = callback || function(){};
        let form = [];
        for(name in options){
          form.push(`${name}=${options[name]}`);
        }
        fetch(url, { method: 'POST', body: form.join("&") })
        .then(function(res) {
            return res.json();
        }).then(function(data) {
            callback(data)
        });
    }

    sendMessage(options, callback){
        callback = callback || function(){};
        let form = new formData();
        for(name in options){
            if(options[name] instanceof Array){
                for (var i = 0; i < options[name].length; i++) {
                    form.append(name+"[]", options[name][i]);
                };
            }else{
                form.append(name, options[name]);
            }
        }
        fetch(config.MANAGER_HOST, { method: 'POST', body: form })
        .then(function(res) {
            return res.text();
        }).then(function(body) {
            //console.info(options)
            console.info(body)
            try{
                var data = JSON.parse(body);
                callback(null, data.message, data.result)
            }catch(e){
                console.error(e)
                callback(true, e, null)
            }
        });
    }
 
}


module.exports = new live()
