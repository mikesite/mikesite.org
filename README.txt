0. Preamble
-----------
This is the README file for the Card Hunter Utils (or short CHU or simply "utils" in the context of this file), a community driven set of tools that makes playing Card Hunter - a collectible card game - a bit more fun, some would say. This is not a replacement for a long requested but still not existing help section to the utils. Rather this is a general explanation to the tool as a whole.

1. Versions
-----------
There are - at this point - two different versions of the utils that you can get: There is the dev-version and the test-version. If you're unsure which version you have, there are several characteristics that let you identify both version:
- if you have the archive file itself, the dev-version ends in "_dev.zip" while the test-version just ends in ".zip".
- the dev-version features php-files while the test-version features classical html-files to serve the actual utils.
- the dev-version comes with a "change.log" file. This file serves no function but is included in the dev-version because the dev-version comes with everything to recreate essentially everything, hence, also with this file containing the version history.
- the dev-version features the folders "resource" and "src" as well as the files "tsconfig.json" and "build.sh". The "resource" folder might be missing if you turned the utils into their "fully automated update" version (see below), the "src" folder and the two mentioned files might be missing if you are purely using the utils and not intent to develop them, as these components have no function for day to day usage. Again, this version comes with all original sources but not all of them are necessary for every use case.
- there are other more subtle differences, but if you can't tell by this point, it's easiest to just grab the latest version of your flavor from the Card Hunter Forums.

In order to identify which version you want, please read the following sections about the two versions and what they are meant for.

2. The test-version
-------------------
The test-version essentially is a snap-shot of the utils. This version comes with hardwired resource files, meaning this version will never be easily upgradable to the latest in-game Cards, Items, etc. Furthermore, there are some features in the utils that will not work in this version. That is because this version works fully without a (configured) php-environment. The extreme TL;DR for php is, it's one way to serve dynamic/changing websites to different users. The features that won't work in this version are very few and won't affect the general usage of the utils. In general, everything that is doable in a reasonable way without php is actually solved without php; php is always the last resort. Please understand that given the fact that the set of php-dependent features might change at any point (it might even occur that php-features are redone to not require php anymore), there will not be an exhaustive list at this point. Given the sparsity of those features there will in fact be no list at all.

The sole *intended* use case for the test-version is to let non-techy community members play around with a new version in order to identify bugs. If you never heard of php, this is the version for you. You *can* use this version on a day to day basis, too, but at some point the snap-shot will become outdated and there might be no newer snap-shot as the test-version is only released when there are new features, not in case there are just new resource files.

To access the utils, extract the archive file, place the whole content somewhere accessible (e.g. your Documents-folder) and launch the "index.html" in your browser. From this Overview page you can open up every included tool.

3. The dev-version
------------------
The dev-version has several use cases:
- it can be used to develop the utils,
- it can be used to host the utils somewhere accessible for the Card Hunter community,
- it can be used to access the utils locally on your computer while still having up-to-date resource information.

To achieve all of these points, it has requirements that the test-version doesn't have:
- you need (at least from time to time and for specific situations) an internet-connection while the test-version only relies on an internet-connection for one of the utils (that the dev-version also needs an internet-connection for),
- you need a (configured) php-environment that is used to keep the dynamic appearance of the utils that the test-version can't serve,
- for some features and use cases you need different other programs or tools like: a typescript compiler, a capability to run bash-scripts, or a code editor / IDE.

How to host the utils isn't part of the scope of this README. Also, explaining the technical details of every component or clarifying the design choices will not be done here. For any of these, ask in the Card Hunter Forums (specifically the Card Hunter Utils thread) or (for the setup explanation) consult the internet.

If your only intent is to use the utils but not want to work on them, there is a set of files and folders you won't need. In those cases you can delete: the "src" folder, the "change.log" file, the "tsconfig.json" file, and the "build.sh" script. Everything else is necessary to guarantee the operability.

3.1 The two ways of updating the resource files
-----------------------------------------------
From time to time, the developers of Card Hunter introduce new (or change the accessibility of existing) elements to/in the game. To account for some of those changes, the utils may have to change significantly, for other changes you only need the newest resource files to keep the utils operable. In these moments, where the only necessary adaption is to reflect the currently available Cards, Items, etc, this can currently happen in two ways: either by letting the utils always fetch the most recent version of the resource files directly from the game server, or by keeping a local cache that you then have to keep up-to-date either manually or automated with some sort of system scheduler.

When you first extract the dev-version, the utils will be in their "semi automated update" (or "sau" for short) version. This is in contrast to the test-version that could be called the "not automated update" version or "no update at all" version. In this state the utils will use a cache. This cache might be already outdated by the time you extract the utils. But given that some users of the utils might be unable to convert the "fully automated update" ("fau") version into the "semi automated update" version, having the dev-version in its "sau" state was the best compromise. The only difference of those two states is the "resource" folder, the utils will immediately adapt to the presence or non-presence of the resource cache and this cache is the "resource" folder. In this folder, you will find the most recent version of the resource files (at the time of the version's release) and a script (for Linux) to update the resource files.

To update the "sau" version to a newer version of the game's resource files, just execute the update-script [this update-script is currently only available for Linux, to update the resources on Windows or Mac, follow the manual steps of converting from "fau" to "sau" (see below)]. This can happen manually, as soon as you are aware of any changes in the resources (e.g. new Cards/Items being announced and released), or on a regular basis using the system's scheduling capacities. The script will fetch the newest versions of the resources and in case of an actual change, update the cache (the csv-files in the resource folder). As the cache is essentially just these files, you can inspect them at any point in time. To schedule the update-script you can use tools like cron (or anacron) on Linux or similar system utilities for other Operating Systems assuming you can execute this script or an adoption of it to your actual OS.

The conversion between the "sau" and the "fau" state if really simple. To force the utils to always fetch the resources directly from the game server, delete the "resource" folder or delete the ".csv" files from the "resource" folder or just rename the resource files. Any option will do the trick. The only difference is how easy it will be to go back to the "sau" state.

To convert the utils from their "fau" state to the "sau" state, you have to make sure that the cache is set up properly for the utils to pull from it. If you don't have the "resource" folder anymore, get the resources from the archive file that you extracted the utils from initially (or any newer release version of the utils). If you still have the "resource" folder and the update script, executing the update script will automatically rebuild the cache. If you can't execute the update script (or don't want to) you can manually download the (currently) four necessary resource files from the game server and place them in the "resource" folder.

All of the game's resource files are listed in the manifest ( https://live.cardhunter.com/data/manifest/manifest.txt ) although the manifest file omits a common base-URL. All addresses in the manifest are relative to "https://live.cardhunter.com/data/". Currently the utils make use of four of these files and the full URLs look like "http://live.cardhunter.com/data/gameplay/<filename without extension>/<filename>" (e.g. ".../data/gameplay/Equipment/Equipment.csv"). If everything else fails, you can load the resource files manually using this format. The relevant files are "Adventures", "Cards", "Equipment" (the items), and "Figures". You can also just download some of the files and let the utils fetch the remaining resources live from the game server in case you either only need some of the utils and your subset of necessary utils don't use the other resource files or if you want some information to be always up-to-date but aren't that concerned with other resources.
