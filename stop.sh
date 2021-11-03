if [ `whoami` != "root" ];then
	echo "请使用root用户！"
    exit;
fi

echo "停止中..."
mail_to_gitlab_issues=$(cat .mail_to_gitlab_issues.pid)

kill -9 $mail_to_gitlab_issues

rm -rf .mail_to_gitlab_issues.pid
echo "已停止"