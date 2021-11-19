# mail_to_gitlab_issues

模拟邮件服务器：接收邮件，将邮件内容转发至gitlab的issues
>针对微信微信聊天记录中的 图片/文档/视频附件 做了布局优化（部分机型的聊天记录内容中，图片被统一放到了最下面，聊天记录中仅显示：图片1（可在附件中查看））

[抖音视频介绍](https://v.douyin.com/RCvbRhx/)

## 配置方法
1. **域名：** 添加MX记录解析，例如：`@.abc.com`（注意：MX记录只能解析到一个普通A记录，所以你需要提前添加一个A记录，然后将MX记录解析到这个A记录对应的域名上）
2. **配置文件：**
    1. `mail_domain` 收件箱的后缀，例如：`abc.com`
    2. `gltoken_of_frommail` 配置发件人白名单，同时配置了对应不同发件人使用不同的token对接gitlab
    3. `gitlab_base_url` 配置gitlab根路径，不能以`/`结尾
    4. `issues_timeout` 创建gitlab时的超时时间
3. **占用问题：** 默认情况下，大部分Linux服务器会自带一个Postfix服务占用25端口，如果使用此程序，需要先将postfix停止掉：
    1. 停止postfix服务： `systemctl stop postfix` 
    2. 禁止postfix开机启动： `systemctl disable postfix`
4. **启动：** 
    1. `npm install` （首次启动前，安装依赖）
    2. `./startup.sh` （因为需要监听25端口，故必须使用root用户）
5. **查看日志文件：** `tail -f ./output_mail.log`
6. **停止：** `./stop.sh`

## 感谢
* [substack/node-smtp-protocol](https://github.com/substack/node-smtp-protocol) 基于smtp协议的邮件服务nodejs版
* [nodemailer/mailparser](https://github.com/nodemailer/mailparser) 邮件内容解析nodejs版
