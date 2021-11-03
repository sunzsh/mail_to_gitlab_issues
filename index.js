var smtp = require('smtp-protocol');
const simpleParser = require('mailparser').simpleParser;
const request = require('request');
const config = require('./config.js');
const { commitIssues, uploadfile } = require('./glservice.js');

var server = smtp.createServer(function (req) {
    req.on('to', function (to, ack) {
        var req_domain = to.split('@')[1] || config.mail_domain;
        if (req_domain === config.mail_domain) {
          ack.accept();
        } else {
          console.log('e1:' + req_domain);
          ack.reject();
        } 
    });
    
    
    req.on('message', function (stream, ack) {
      var gitlabToken = config.gltoken_of_frommail[req.from];
      if(!gitlabToken) {
        console.log('gitlabToken is null');
        ack.reject();
        return;
      }

      var proj_id = req.to[0].replace(/\@.*$/g, '')
      if (!proj_id) {
        console.log('proj_id is null');
        ack.reject();
        return;
      }


      simpleParser(stream, {}).then(parsed => {
        try {
          
          var content = parsed.html || parsed.text;


          var uploadAllAttachments = [];

          for (let i = 0; i < parsed.attachments.length; i++) {
            const at = parsed.attachments[i];
            console.log(at.filename);
            uploadAllAttachments.push(uploadfile(proj_id, gitlabToken, at.content, at.filename, at.contentType));
          }

          Promise.all(uploadAllAttachments).then((resArr) => {
            for (let i = 0; i < resArr.length; i++) {
              const atRes = resArr[i];
              if (!atRes.markdown) {
                console.log(atRes);
              }
              if (content.indexOf('（可在附件中查看）') >= 0) {
                content = content.replaceAll(new RegExp(atRes.alt + "（可在附件中查看）", "g"), atRes.markdown);
              } else {
                content = content.replace(/<img.*?(?:>|\/>)/g, atRes.markdown)
              }
              // content += '\n\n<hr />\n\n' + atRes.markdown
            }

            commitIssues(proj_id, gitlabToken, parsed.subject, content).then(res => {
              console.log(res);
            })

            console.log('from: ' + req.from);
            console.log('to: ' + req.to);
            console.log('subject:' + parsed.subject);
            console.log(content);
          })
        } catch (e) {
          console.log('出错了：\n' + e);
        }
        
      }).catch(err => {
        console.log(err);
      });

      ack.accept();
    });

    req.on('greeting', function(a,b) {
      b.accept();
    });

});

server.listen(25);

console.log("start listening 25...");