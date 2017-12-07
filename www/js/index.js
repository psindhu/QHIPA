/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        console.log("test");
        checkConnection();
    },
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        console.log('Received Event: ' + id);
    }
};

app.initialize();

function checkConnection() {
    var networkState = navigator.connection.type;
    if(networkState === Connection.WIFI || networkState === Connection.CELL_4G){
        //saveProfileIntoIndexDB();
        flushDataToServer();
    }
    console.log(networkState);
}
function saveProfileIntoIndexDB(){
    var openReq = window.indexedDB.open("Profiles");
    openReq.onupgradeneeded = function (event) {
        var db = event.target.result;
        db.createObjectStore("profile", {autoIncrement: true});
    };
    openReq.onsuccess = function (event) {
        var db = event.target.result,
            profile = {
                "name": "Peter",
                "description": "test",
                "profilePicture": "",
                "email": "test@gmail.com",
                "password": "pwd",
                "mobilePhoneNumber": "123-123-1234",
                "latitude": 41.9945637,
                "longitude": -87.6581804,
                "skills": "[1][2]"
            };
        var addReq = db.transaction("profile", "readwrite").objectStore("profile").add(profile);
        addReq.onsuccess = function (event) {
            console.log("Operation completed successfully");
        };
        addReq.onerror = function (event) {
            console.log("Operation failed");
        };
    }
    openReq.onerror = function (event) {
        console.log("Operation failed");
    }
}

function flushDataToServer(){
    console.log("Saving Data to Server");
    var modal = document.querySelector('ons-modal');
    modal.show();
    var openReq = window.indexedDB.open("Profiles");
    openReq.onsuccess = function (event) {
        var db = openReq.result;
        var addReq = db.transaction("profile", "readwrite");
        var trans = db.transaction(["profile"], "readwrite");
        var profile = trans.objectStore("profile");
        // Get everything in the store;
        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = profile.openCursor(keyRange);
        cursorRequest.onsuccess = function(e) {
            var result = e.target.result;
            if(!!result == false)
                return;
            console.log(result.value);
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "http://18.220.231.8/QuipaServer/services/profileservice/profile");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function() {
                try {
                    if (this.status === 200) {
                        //console.log(data);
                    } else {
                        showDialogWithMessage('dialog-invalid-message', 'Error creating Profiles!');
                    }
                } catch (e) {
                    showDialogWithMessage('dialog-invalid-message', 'Error creating Profiles!');
                }
            };

            xhr.onerror = function() {
                showDialogWithMessage('dialog-invalid-message', 'Error creating Profiles!');
            };
            xhr.send(JSON.stringify(result.value));
            profile.delete(result.key);
            result.continue();
        };
        modal.hide();
        console.log(addReq);
    }

}
