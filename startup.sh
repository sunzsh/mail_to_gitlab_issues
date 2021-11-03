if [ `whoami` != "root" ];then
	echo "请使用root用户！"
    exit;
fi
nohup node ./index.js >> ./output_mail.log 2>&1 & echo $! > .mail_to_gitlab_issues.pid