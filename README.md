# yinduoglivy

# 检查git版本

which -a git 

git --version



git init 

git clone 

git add <filename>  将文件添加到缓存区

git commit -m ''    将你的改动提交到HEAD中，但是还未上传到远端仓库


git push origin master(其他分支)  


# 添加分支

git checkout -b branch_name

git push origin branch_name


# 切换分支

git checkout branch_name


# 删除分支

git checkout -d branch_name

git push origin :branch_name


# 合并分支

git pull 更新本地仓库至最新改动


git merge branch_name

git diff source_branch  traget_branch

git add filename

git push origin master
