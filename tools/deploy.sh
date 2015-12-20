#!/bin/bash
set -u

declare WORKING_PATH=""
declare SOURCE_PATH=""
declare DEPLOY_PATH=""
declare ENVIRONMENT=${1:-""}

declare SOURCE_FOLDER="source"
declare DEPLOY_FOLDER="release"

# Path that this script is currently running from
WORKING_PATH=$( cd `dirname $0`; pwd )

# Path to the source folder
if [ -d "$WORKING_PATH/../$SOURCE_FOLDER/" ]; then
    SOURCE_PATH=$( cd "$WORKING_PATH/../$SOURCE_FOLDER/"; pwd )
else
    echo "Source Folder doesn't exist!"
    exit 1
fi

# Path to the release folder
if [ -d "$WORKING_PATH/../$DEPLOY_FOLDER/" ]; then
    DEPLOY_PATH=$( cd "$WORKING_PATH/../$DEPLOY_FOLDER/"; pwd )
else
    mkdir "$WORKING_PATH/../$DEPLOY_FOLDER"
    DEPLOY_PATH=$( cd "$WORKING_PATH/../$DEPLOY_FOLDER/"; pwd )
fi

cd "$WORKING_PATH"

echo ""
echo "Running 'deploy' script! "
echo "---------------------------------------"
echo "  - WORKING_PATH : $WORKING_PATH"
echo "  - SOURCE_PATH  : $SOURCE_PATH"
echo "  - DEPLOY_PATH  : $DEPLOY_PATH"
echo "  - ENVIRONMENT  : $ENVIRONMENT"
echo ""

declare HASH=$( git rev-parse --short HEAD )

./build.sh


cd "${DEPLOY_PATH}"

# Check if the repo has been initialized
if [ ! -d "${DEPLOY_PATH}/.git" ]; then
    git clone "git@heroku.com:i-org-campaign-$ENVIRONMENT.git"
    git remote rename "origin" "heroku-$ENVIRONMENT"

    echo "Cloning repo from Heroku.... "
fi

declare remote_check=$( git branch -a | grep "heroku-$ENVIRONMENT" )
# Now look to see if the remote has been added (this shouldn't happen )
if [ -z "$remote_check" ] ; then
    git remote add "heroku-$ENVIRONMENT" "git@heroku.com:i-org-campaign-$ENVIRONMENT.git"
    echo "Creating remote \"heroku-$ENVIRONMENT\" ... "
fi

git pull

cd "${WORKING_PATH}/../"

rsync -avz \
    --exclude '**/.sass-cache' \
    --exclude '**/.DS_Store' \
    --exclude '**/*.box' \
    --exclude '**/.git' \
    --exclude '**/vendor' \
    --exclude '**/sass' \
    --exclude '**/app.js' \
    --exclude '**/news.json' \
    --delete \
"${SOURCE_PATH}/laravel/" "${DEPLOY_PATH}/"

mkdir "${DEPLOY_PATH}/public"

rsync -avz \
    --exclude '**/.sass-cache' \
    --exclude '**/.DS_Store' \
    --exclude '**/*.box' \
    --exclude '**/.git' \
    --exclude '**/.gitignore' \
    --exclude '**/.htaccess' \
    --exclude '**/uploads' \
    --exclude '**/assets/media' \
    --delete \
"${SOURCE_PATH}/public/" "${DEPLOY_PATH}/public/"
    # --exclude '**/assets/images/globe-*' \

cp "${SOURCE_PATH}/heroku/.gitignore.heroku" "${DEPLOY_PATH}/.gitignore"
cp "${SOURCE_PATH}/heroku/.htpasswd-heroku" "${DEPLOY_PATH}/.htpasswd"
cp "${SOURCE_PATH}/heroku/.htaccess-heroku" "${DEPLOY_PATH}/public/.htaccess"

sed -i '' -e "s/{{HASH}}/$HASH/g" "${DEPLOY_PATH}/public/.htaccess"


cd "${DEPLOY_PATH}"
echo -n "$HASH" > .revision
cd "${SOURCE_PATH}/laravel"
php artisan version:add --env="${ENVIRONMENT}"
php artisan s3:deploy --env="${ENVIRONMENT}"

cd "${DEPLOY_PATH}"
git add -u .
git add .
git commit -m "Buid from 'brp': v1.0 - Beta 1.0 (revision $HASH)"
if [ -n $ENVIRONMENT ]; then
    git push heroku-$ENVIRONMENT master
fi

