#!/bin/sh
echo "=== Starting update job for the resource files of the Card Hunter Utils ==="
# if true, a history of changes is kept, each time one of the files changes, a whole set is kept
keep_history=false
# resources that should be updated
resources="Adventures Cards Equipment Figures"
# temp dir for download
echo "--- Asserting last run wasn't today ---"
today=$(date +%Y%m%d)
if [ -f "_last.time" ] && [ "$(cat _last.time)" = "$today" ] ; then
	echo "--- Update already ran today ---"
	echo "--- To force update, delete \"_last.time\" ---"
  echo "=== Update job for the resource files of the Card Hunter Utils aborted ==="
  exit 0
fi
echo "--- Attempting to download current versions of the necessary resource files ---"
mkdir _new
(
cd _new || exit
# download current version of all resource
for r in ${resources}
do
	echo "--- Attempting to download resource file \"$r\" ---"
	wget "http://live.cardhunter.com/data/gameplay/$r/$r.csv"
done
)
#cd ..
# check for changes in any resource file
echo "--- Comparing existing resource files with newly pulled versions ---"
change_detected=false
for r in ${resources}
do
	echo "--- Comparing resource file \"$r\" ---"
	if [ -f "_new/$r.csv" ] && { [ ! -f "$r.csv" ] || [ -n "$(diff "_new/$r.csv" "$r.csv")" ] ; } ; then
		echo "--- Resource file \"$r\" was outdated and gets updated ---"
		change_detected=true
		cp -f "_new/$r.csv" "$r.csv"
	fi
done
# remove temp dir or keep history if resources changed and history is enabled
if [ "$change_detected" = true ] && [ "$keep_history" = true ] ; then
	echo "--- Newly pulled resource files get saved ---"
	mv _new "$(find . -mindepth 1 -maxdepth 1 -type d | wc -l)"
else
	echo "--- Newly pulled resource files get deleted ---"
	rm -r _new
fi
echo "$today" > _last.time
echo "=== Update job for the resource files of the Card Hunter Utils finished ==="
