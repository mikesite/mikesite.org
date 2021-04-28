#!/bin/sh
echo "=== Starting build job for the Card Hunter Utils ==="
echo "--- Checking for existing build for today ---"
today=$(date +%Y%m%d)
if [ -f ".builds/utils_$today.zip" ] ; then
  echo "--- There is already a build released for today ---"
  echo "=== Build job for the Card Hunter Utils aborted ==="
  exit 0
fi
echo "--- Invoking typescript compiler ---"
tsc --project . | grep -Po "^(?! )(?!(src/parser/parser)).*"
if [ $? -ne 1 ] ; then
  echo "--- Typescript reported issues, no build done ---"
  echo "=== Build job for the Card Hunter Utils aborted ==="
  exit 0
fi
echo "--- Starting update of the resource files ---"
(
cd resource
sh update-resources.sh
sleep 2
)
echo "--- Updating the resource files done ---"
echo "--- Starting to package the dev-artifact ---"
echo "-- Compressing files into archive --"
zip -r ".builds/utils_${today}_dev.zip" \
  badges guides utils index.php fetch-resource.php \
  external script src tsconfig.json \
  layout resource favicon.ico favicon-16x16.png favicon-32x32.png \
  build.sh change.log README.txt
echo "--- Packaging the dev-artifact done ---"
echo "--- Starting to package the test-artifact ---"
(
mkdir _test
basepath=$(pwd)
echo "-- Preprocessing the php files --"
for phpf in $(find . -type f -name "*.php" -printf "%P\n")
do
  (
  cd "$(dirname "$phpf")"
  if [ "$phpf" = "fetch-resource.php" ] ; then
    continue
  fi
  mkdir -p "$basepath/_test/$(dirname "$phpf")"
  htmlf="$basepath/_test/$(echo "$phpf" | sed "s/\.php/\.html/")"
  php "$(basename "$phpf")" > "$htmlf"
  sed -i "s/\.php/\.html/g" "$htmlf"
  )
done
echo "-- Copying js, css, and favicon files --"
cp README.txt _test/README.txt
cp favicon.ico _test/favicon.ico
cp favicon-16x16.png _test/favicon-16x16.png
cp favicon-32x32.png _test/favicon-32x32.png
cp -r external _test/
cp -r layout _test/
cp -r script _test/
echo "-- Compressing files into archive --"
cd _test
zip -r "$basepath/.builds/utils_${today}.zip" .
)
echo "-- Deleting temporary folder --"
rm -r _test
echo "--- Packaging the test-artifact done ---"
echo "=== Build job for the Card Hunter Utils finished ==="
