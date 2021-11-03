echo "停止中..."
mail_to_gitlab_issues=$(cat .mail_to_gitlab_issues.pid)

sudo kill -9 $mail_to_gitlab_issues

rm -rf .mail_to_gitlab_issues.pid