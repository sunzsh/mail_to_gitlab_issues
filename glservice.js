const request = require('request');
const path = require('path');
const fs = require('fs');
const config = require('./config.js');
const { resolve } = require('path');

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


function getAssigneeIdIfExists(gitlab_token, title) {
    if (title == null) {
        return Promise.resolve(null)
    }
    let assigneeName = title.replace(/.*@\s*(.*?)\s*$/g, '$1')
    if (assigneeName === title) {
        return Promise.resolve(null)
    }
    return new Promise((resolve, reject) => {
        request.get(`${BASE_URL}/users?search=${encodeURI(assigneeName)}`, buildOptions(gitlab_token), (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }
            let resArray = JSON.parse(body).filter(item => item.state === 'active')
            if (resArray == null || resArray.length == 0) {
                resolve(null) 
            } else {
                resolve(resArray[0].id)
            }
        });
    });
}


function commitIssues(proj_id, gitlab_token, title, content) {
    return new Promise((resolve, reject) => {
        getAssigneeIdIfExists(gitlab_token, title).then(assigneeId => {
            let r = request.post(`${BASE_URL}/projects/${proj_id}/issues`, buildOptions(gitlab_token), (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(JSON.parse(body));
            });

            var form = r.form()
            form.append('title', title.replace(/@.*$/g, ''))
            form.append('description', content);
            if (assigneeId) {
                form.append('assignee_id', assigneeId)
            }
        })
    });
}

module.exports = { commitIssues, uploadfile };


