#!/bin/bash
set -u

declare WORKING_PATH=""
declare SOURCE_PATH=""
declare DEPLOY_PATH=""

declare SOURCE_FOLDER="source"
declare DEPLOY_FOLDER="release"

# Path that this script is currently running from
WORKING_PATH=$( cd `dirname $0`; pwd )

# Path to the source folder
if [ -d "$WORKING_PATH/../$SOURCE_FOLDER/" ]; then
    SOURCE_PATH=$( cd "$WORKING_PATH/../$SOURCE_FOLDER/"; pwd )
else
    mkdir "$WORKING_PATH/../$SOURCE_FOLDER"
    DEPLOY_PATH=$( cd "$WORKING_PATH/../$SOURCE_FOLDER/"; pwd )
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
echo "Running 'setup' script! "
echo "---------------------------------------"
echo "  - WORKING_PATH : $WORKING_PATH"
echo "  - SOURCE_PATH  : $SOURCE_PATH"
echo "  - DEPLOY_PATH  : $DEPLOY_PATH"
echo ""


chmod a+x "${WORKING_PATH}/build.sh"
chmod a+x "${WORKING_PATH}/deploy.sh"
chmod a+x "${WORKING_PATH}/setup.sh"

echo "No setup command currently created for this project!"