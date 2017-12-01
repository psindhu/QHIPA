var idbSupported = false;
var usersDB;

document.addEventListener("DOMContentLoaded", function () {

    if ("indexedDB" in window) {

        idbSupported = true;
        console.log("IndexedDB is supported.");
    }

    if (idbSupported) {
        var openRequest = indexedDB.open("testDB", 1); //provide DB name and version
        openRequest.onupgradeneeded = function (e) {
            console.log("Upgrading...");
            var thisDB = e.target.result;
            //thisDB is a handler

            if (!thisDB.objectStoreNames.contains("firstObjStore")) {
                thisDB.createObjectStore("firstObjStore");
            }
        }
        openRequest.onsuccess = function (e) {
            console.log("Success!");
            usersDB = e.target.result;
        }
        openRequest.onerror = function (e) {
            console.log("Error");
            console.dir(e);
        }

        /**
        * upgradeneeded used when first opening and when version being changed
        blocked will generally only fire if previous connection never gets closed
        */
    }

}, false);