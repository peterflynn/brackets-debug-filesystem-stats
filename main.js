/*
 * Copyright (c) 2014 Peter Flynn.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */


/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

define(function (require, exports, module) {
    "use strict";
    
    // Brackets modules
    var CommandManager      = brackets.getModule("command/CommandManager"),
        Menus               = brackets.getModule("command/Menus"),
        DocumentManager     = brackets.getModule("document/DocumentManager"),
        ProjectManager      = brackets.getModule("project/ProjectManager"),
        FileSystem          = brackets.getModule("filesystem/FileSystem");
    
    function runReport() {
        console.log("============ FileSystem object stats ============");

        var sampleDir = ProjectManager.getProjectRoot();

        /* @type {FileSystem} instance */
        var fs = sampleDir._fileSystem;

        /* @type {FileIndex} */
        var index = fs._index;


        var indexSize = Object.keys(index._index).length;

        var numCachedFiles = 0,
            numCachedDirs = 0,
            numCachedStats = 0,
            fileCacheBytes = 0,
            nodeModulesFiles = 0,
            unwatchedEntries = 0;
        
        index.visitAll(function (entry, path) {
            if (entry._stat) {
                numCachedStats++;
            }
            if (entry.isFile) {
                if (entry._contents !== null) {
                    numCachedFiles++;
                    fileCacheBytes += entry._contents.length;
                    
                    if (entry.fullPath.indexOf(".png") !== -1) {
                        console.warn("Suspicious cached File " + entry);
                    }
                }
                if (entry.fullPath.indexOf("node_modules") !== -1) {
                    nodeModulesFiles++;
                }
            } else {
                if (entry._contents) {
                    numCachedDirs++;
                }
            }
            if (entry.fullPath.indexOf(".git") !== -1) {
                console.warn("Suspicious FS entry " + entry);
            }
            if (!fs._findWatchedRootForPath(entry.fullPath)) {
                unwatchedEntries++;
//                console.warn("Entry outside any watch root " + entry);
            }
        });

        var nDocumentsAlive = DocumentManager.getAllOpenDocuments().length;

        console.log("Entries in index:", indexSize);
        console.log("Files under node_modules:", nodeModulesFiles);
        console.log("Files with content cached:", numCachedFiles);
        console.log("Total File cached content (B):", fileCacheBytes);
        console.log("Dirs with content cached:", numCachedDirs);
        console.log("Documents kept alive:", nDocumentsAlive);
        console.log("Watch roots:", Object.keys(fs._watchedRoots));
        console.log("Entries outside watch roots:", unwatchedEntries);
        console.log("=================================================");
    }
    
    
    // Register command
    var COMMAND_ID = "pflynn.debug.filesystem.stats";
    CommandManager.register("Report FS Stats", COMMAND_ID, runReport);
    
    var menu = Menus.getMenu("debug-menu");
    menu.addMenuItem(COMMAND_ID, null);
});