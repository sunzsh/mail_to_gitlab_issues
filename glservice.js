const request = require('request');
const path = require('path');
const fs = require('fs');
const config = require('./config.js');

const BASE_URL = config.gitlab_base_url + "/api/v4";

var default_options = {
    timeout: config.issues_timeout
};

function buildOptions(gitlab_token) {
    var options = {... default_options};
    options.headers = { 'PRIVATE-TOKEN': gitlab_token }
    return options;
}

function uploadfile(proj_id, gitlab_token, file, filename, contentType) {
    return new Promise((resolve, reject) => {
        var r = request.post(`${BASE_URL}/projects/${proj_id}/uploads`, buildOptions(gitlab_token), (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(JSON.parse(body));
        });
        var form = r.form()
        form.append('file', file, {
            filename: filename,
            contentType: contentType
          });
    });
}



function commitIssues(proj_id, gitlab_token, title, content) {
    return new Promise((resolve, reject) => {
        var r = request.post(`${BASE_URL}/projects/${proj_id}/issues`, buildOptions(gitlab_token), (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(JSON.parse(body));
        });
        var form = r.form()
        form.append('title', title);
        form.append('description', content);
    });
}

module.exports = { commitIssues, uploadfile };


// commitIssues(442, '你好', "好好好！\n\n![test](/uploads/2f584fee7d5fd3f9fcf516e6585aaf58/test.png)").then(res => {
//     console.log(res);
// })
// 442
// **测试一下**\n\n![test](/uploads/2f584fee7d5fd3f9fcf516e6585aaf58/test.png)

