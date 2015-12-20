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
    echo "Source Folder doesn't exist!"
    exit 1
fi

# Path to the release folder
if [ -d "$WORKING_PATH/../$DEPLOY_FOLDER/" ]; then
    DEPLOY_PATH=$( cd "$WORKING_PATH/../$DEPLOY_FOLDER/"; pwd )
fi

cd "$WORKING_PATH"

echo ""
echo "Running 'watch' script! "
echo "---------------------------------------"
echo "  - WORKING_PATH : $WORKING_PATH"
echo "  - SOURCE_PATH  : $SOURCE_PATH"
echo "  - DEPLOY_PATH  : $DEPLOY_PATH"
echo ""

echo "No watch command currently set up for this project!"