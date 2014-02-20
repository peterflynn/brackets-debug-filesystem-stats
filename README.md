This extension helps gather info on FileSystem memory usage.

## To gather FileSystem stats

1. Use Brackets normally for a while
2. Debug > Report FS Stats
3. Debug > Show Developer Tools
4. In the Console tab, copy everything between the "============" dividers
5. In the Profiles tab, select Take Heap Snapshot and click the snapshot button
6. Record the total heap size (shown in the left-hand sidebar under "Snapshot 1"
7. In the filter field near the upper-left, type "file". Locate "File" in the list below (should be first).
8. Record the object count, shallow size and retained size (both number and percentage).
9. For good measure, you may also want to save the snapshot so we can review it in more detail later - right-click the "Snapshot 1" entry and choose Save.
<br>_Note: This may cause Dev Tools to freeze for a few seconds before the Save dialog appears._