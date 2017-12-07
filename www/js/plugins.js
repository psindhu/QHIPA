var skillObj = {
    1: "img/computer.png",
    2: "img/cooker.png",
    3: "img/hair_stylist.png",
    4: "img/handyman.png",
    5: "img/mechanic.png",
    6: "img/painter.png",
    7: "img/telephonist.png",
    8: "img/tutor.png",
    9: "img/waitress.png",
    10: "img/window_cleaner.png"
};

var chats = [];

document.addEventListener('init', function (event) {

    var page = event.target;

    if (page.id === 'profileHire') {

        var modal = document.querySelector('ons-modal');
        modal.show();
        document.getElementById('profile-main-card').style.display = "none";
    }

    if (page.id === 'profileSend') {

        var modal = document.querySelector('ons-modal');
        modal.show();
        document.getElementById('profile-reviewrequest-card').style.display = "none";
    }

    if (page.id === 'profilePage') {

        document.getElementById('profile-tab-maincard').style.display = "none";
    }

});

document.addEventListener('show', function (event) {

    var page = event.target;
    var prospectIdList = [];


    if (page.id === 'tabbar-page') {

        if (sessionStorage.getItem('tabLoaderId') == 1) {

            document.getElementById('appTabbar').setActiveTab(2);
            sessionStorage.setItem('tabLoaderId', 0);
        }
    }

    if (page.id === 'login') {

        page.querySelector('#register-button').onclick = function () {
            document.querySelector('#Navigator').pushPage('register.html', {
                data: {
                    title: 'Create Account'
                }
            });
        };

        page.querySelector('#login-button').onclick = function () {
            console.log(navigator.connection.type);
            if (navigator.connection.type != Connection.NONE) {
                flushDataToServer();
                if (document.getElementById('username').value === '' || document.getElementById('passwordLogin').value === '') {
                    showDialogWithMessage('dialog-invalid-message', 'Please enter valid login details');
                } else {
                    verifyLogin();
                }
            } else {
                showDialogWithMessage('dialog-invalid-message', 'Please check your Internet Connection');
            }

        };
    }

    if (page.id === 'register') {

        getUserLocation();

        page.querySelector('#register-skills-button').onclick = function () {

            if (document.getElementById('name').value === '' || document.getElementById('description').value === '' || document.getElementById('email').value === '' || document.getElementById('password').value === '' || document.getElementById('mobilePhoneNumber').value === '') {
                showDialogWithMessage('dialog-invalid-message', 'Please fill all details');
            } else {
                document.querySelector('#Navigator').pushPage('skills.html', {
                    data: {
                        title: 'Skills'
                    }
                });
            }
        };
    }

    if (page.id === 'skills') {

        page.querySelector('#register-photo-button').onclick = function () {
            document.querySelector('#Navigator').pushPage('profilepic.html', {
                data: {
                    title: 'Photo'
                }
            });
        };
    }

    if (page.id === 'profilepic') {

        page.querySelector("#cameraPhoto").onclick = function (e) {
            e.preventDefault();
            getPhoto(true);
        };

        page.querySelector("#galleryPhoto").onclick = function (e) {
            e.preventDefault();
            getPhoto(false);
        };

        page.querySelector('#register-account-button').onclick = function () {
            createProfile();
        };
    }

    if (page.id === 'searchskills') {

        getSearcherLocation();

        page.querySelector('#search-button').onclick = function () {
            var dialog = document.getElementById('search-filter-dialog');
            if (dialog) {
                dialog.show();
            } else {
                ons.createDialog('searchdialog.html')
                    .then(function (dialog) {
                        dialog.show();
                    });
            }
        };
    }

    if (page.id === 'profilecreated') {

        displayCreatedProfile();

        page.querySelector('#logout-button').onclick = function () {

            logoutUser();
        };
    }

    if (page.id === 'profileHire') {

        loadProspectProfile();

        page.querySelector('#profile-prospect-hire').onclick = function () {
            document.querySelector('#Navigator').pushPage('profileSend.html', {
                data: {
                    title: 'Review your Request'
                }
            });
        };
    }

    if (page.id === 'profileSend') {

        loadConfirmHire();

        page.querySelector('#profile-prospect-hire-confirm').onclick = function () {
            confirmProfile();
        };
    }

    if (page.id === 'requestHired') {

        loadMyRequests();
    }

    if (page.id === 'profilePage') {

        loadProfileCreated();

        page.querySelector('#logout-button').onclick = function () {

            logoutUser();
        };
    }

    if (page.id === 'chatProspect') {

        loadChats(page.data);

        page.querySelector('#chat-message-send-button').onclick = function () {

            sendMessage();
        };
    }


    function verifyLogin() {

        var username = document.getElementById('username').value;
        var password = document.getElementById('passwordLogin').value;

        var modal = document.querySelector('ons-modal');
        modal.show();
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "http://18.220.231.8/QuipaServer/services/profileservice/profileLogin?mobilePhoneNumber=" + username + "&password=" + password);
        xhr.setRequestHeader("Accept", "application/json");

        xhr.onload = function () {

            var modal = document.querySelector('ons-modal');
            modal.hide();

            try {
                if (this.status === 200) {
                    var data = JSON.parse(this.response);
                    console.log(data);
                    if (data === '') {
                        showDialogWithMessage('dialog-invalid-message', 'Invalid Phone number or Password!');
                    } else {

                        sessionStorage.setItem('tabLoaderId', 0);
                        localStorage.setItem('profileId', data['profileId']);
                        document.querySelector('#Navigator').pushPage('tabbar.html', {
                            data: {
                                title: 'My Requests'
                            }
                        });
                    }
                } else {
                    showDialogWithMessage('dialog-invalid-message', 'Invalid Phone number or Password!');
                }
            } catch (e) {
                showDialogWithMessage('dialog-invalid-message', 'Invalid Phone number or Password!');

            }
        };

        xhr.onerror = function () {
            var modal = document.querySelector('ons-modal');
            modal.hide();

            document.querySelector('#Navigator').pushPage('tabbar.html', {
                data: {
                    title: 'My Requests'
                }
            });
            showDialogWithMessage('dialog-invalid-message', 'Invalid Phone number or Password!');
        };

        xhr.send();
    }

    // Get User Location
    function getUserLocation() {

        navigator.geolocation.getCurrentPosition(onSuccessUserLocation,
            onFailUserLocation, {
                timeout: 15000,
                enableHighAccuracy: true
            });
    }

    function onSuccessUserLocation(location) {

        // location recording time
        var locationTime = Date(location.timestamp);
        var lat = location.coords.latitude;
        var long = location.coords.longitude;
        // output result to #location div...
        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = long;
        // build map with current latitude and longitude
        buildMap(lat, long);
    }

    function onFailUserLocation(error) {

        showDialog('dialog-invalid-location');
    }

    function buildMap(lat, long) {
        // set combined position for user
        console.log("Inside of buildMap");
        var latlong = new google.maps.LatLng(lat, long);
        // set required options
        var mapOptions = {
            center: latlong,
            zoom: 12,
            zoomControl: false,
            gestureHandling: 'none',
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }; // zoom control and gesture handling to keep map from flopping about
        // when user is scrolling

        var map = new google.maps.Map(document.getElementById("userlocation_map_canvas"), mapOptions);
        // add initial location marker
        var marker = new google.maps.Marker({
            position: latlong,
            map: map
        });
    }


    // Get Photos/Camera
    function getPhoto(camera) {
        if (camera === true) {
            // Use from Camera
            navigator.camera.getPicture(onSuccessImage, onFailImage, {
                quality: 10,
                correctOrientation: true,
                sourceType: Camera.PictureSourceType.CAMERA,
                destinationType: Camera.DestinationType.FILE_URI
            });
        } else {
            navigator.camera.getPicture(onSuccessImage, onFailImage, {
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.FILE_URI
            });
        }
    }

    function onSuccessImage(imageData) {
        var image = document.getElementById('userImageView');
        image.src = imageData;
    }

    function onFailImage(message) {

        showDialogWithMessage('dialog-invalid-message', message);
    }

    function loadProfile() {
        var profile = {
            "name": document.getElementById('name').value,
            "description": document.getElementById('description').value,
            "profilePicture": getBase64Image(document.getElementById("userImageView")),
            "email": document.getElementById('email').value,
            "password": document.getElementById('password').value,
            "mobilePhoneNumber": document.getElementById('mobilePhoneNumber').value,
            "latitude": document.getElementById('latitude').value,
            "longitude": document.getElementById('longitude').value,
            "skills": document.getElementById('skills').value
        }
        console.log(profile);
        return profile;
    }

    function createProfile() {
        saveProfileIntoIndexDB();
    }

    function saveProfileRemote() {
        var modal = document.querySelector('ons-modal');
        modal.show();
        var profile = createProfile();
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://18.220.231.8/QuipaServer/services/profileservice/profile");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {

            modal.hide();

            try {
                if (this.status === 200) {
                    var data = JSON.parse(this.response);

                    localStorage.setItem('profileId', data['profileId']);

                    document.querySelector('#Navigator').pushPage('tabbar.html', {
                        data: {
                            title: 'Search'
                        }
                    });
                    // document.getElementById('profilePictureCreated').value=data['profilePicture'];

                } else {
                    showDialogWithMessage('dialog-invalid-message', 'Error creating user profile!');
                }
            } catch (e) {
                showDialogWithMessage('dialog-invalid-message', 'Error creating user profile!');
            }
        };

        xhr.onerror = function () {
            modal.hide();

            showDialogWithMessage('dialog-invalid-message', 'Error creating user profile!');
        };
        xhr.send(JSON.stringify(profile));
    }

    function saveProfileIntoIndexDB() {
        var openReq = window.indexedDB.open("Profiles");
        openReq.onupgradeneeded = function (event) {
            var db = event.target.result;
            db.createObjectStore("profile", {autoIncrement: true});
        };
        openReq.onsuccess = function (event) {
            var db = event.target.result,
                profile = loadProfile();
            var addReq = db.transaction("profile", "readwrite").objectStore("profile").add(profile);
            addReq.onsuccess = function (event) {
                console.log("Operation completed successfully");
                document.querySelector('#Navigator').pushPage('profilecreated.html', {
                    data: {
                        title: 'Profile Created'
                    }
                });

            };
            addReq.onerror = function (event) {
                console.log("Operation failed");
            };
        }
        openReq.onerror = function (event) {
            console.log("Operation failed");
        }
    }


    // Get Skills from Location
    function getSearcherLocation() {

        var modal = document.querySelector('ons-modal');
        modal.show();

        navigator.geolocation.getCurrentPosition(onSuccessSearchSkills,
            onFailSearchSkills, {
                timeout: 15000,
                enableHighAccuracy: true
            });
    }

    function onSuccessSearchSkills(location) {
        // location recording time
        var locationTime = Date(location.timestamp);
        var lat = location.coords.latitude;
        var long = location.coords.longitude;
        // build map with current latitude and longitude
        buildMapSearch(lat, long);
    }

    function onFailSearchSkills(error) {

        var modal = document.querySelector('ons-modal');
        modal.hide();

        showDialogWithMessage('dialog-invalid-message', error.message);
    }

    function buildMapSearch(lat, long) {

        var modal = document.querySelector('ons-modal');

        // set combined position for user
        console.log("Inside of buildMapSearch");
        var latlong = new google.maps.LatLng(lat, long);
        // set required options
        var mapOptions = {
            center: latlong,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("search_map"), mapOptions);

        var bounds = new google.maps.LatLngBounds();

        var prospects = [];
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "http://18.220.231.8/QuipaServer/services/profileservice/profile");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onload = function () {

            modal.hide();

            try {
                if (this.status === 200) {
                    var data = JSON.parse(this.response);

                    for (var i = 0; i < data.length; i++) {

                        var infowindow = new google.maps.InfoWindow;

                        var record = data[i];

                        var prospect = record['name'] ? record['name'] : 'Name' + ' ($' + record['priceHour'] + '/hr)';
                        var userId = record['profileId'];
                        var profilePic = record['profilePicture'];
                        var image = {
                            url: profilePic,
                            size: new google.maps.Size(40, 40),
                            scaledSize: new google.maps.Size(40, 40)
                        };

                        var d_latlng = {
                            lat: parseFloat(record['latitude']),
                            lng: parseFloat(record['longitude'])
                        };

                        var marker = new google.maps.Marker({
                            position: d_latlng,
                            icon: image,
                            map: map
                        });

                        infowindow.setContent(prospect);
                        infowindow.open(map, marker);

                        (function (marker, record) {
                            google.maps.event.addListener(marker, "click", function (e) {

                                sessionStorage.setItem('prospectIdProfileHire', record['profileId']);
                                document.querySelector('#Navigator').pushPage('profileHire.html', {
                                    data: {
                                        title: 'Hiring a Profile'
                                    }
                                });

                            });
                        })(marker, record);

                    }

                } else {
                    console.log(this.status + " " + this.statusText);
                }
            } catch (e) {
                console.log(e.message);
            }
        };

        xhr.onerror = function () {

            modal.hide();
            console.log(this.status + " " + this.statusText);
        };

        xhr.send();
    }

    function loadProspectProfile() {

        document.getElementById('profile-main-card').style.display = "none";
        var modal = document.querySelector('ons-modal');

        var prospectId = sessionStorage.getItem('prospectIdProfileHire');

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://18.220.231.8/QuipaServer/services/profileservice/profile/" + prospectId);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            modal.hide();
            try {
                if (this.status === 200) {
                    $('#star').raty({
                        'score': 4,
                        'readonly': true
                    });
                    numReviews = 20;
                    var data = JSON.parse(this.response);
                    document.getElementById('priceHoursProfileHire').value = data.priceHour;
                    document.getElementById('numReviews').innerHTML = numReviews + " Reviews";
                    document.getElementById('profileName').innerHTML = data.name;
                    document.getElementById('profileDescription').innerHTML = data.description;
                    var profileImage = document.getElementById('profileImage');
                    profileImage.setAttribute('src', data.profilePicture);
                    var parentDiv = document.getElementById('thumbs');
                    parentDiv.innerHTML = '';

                    var hourlyRate = document.getElementById('hourlyRate');
                    hourlyRate.innerHTML = "$" + data.priceHour;
                    hourlyRate.setAttribute('style', 'text-align:left;font-size:5;font-weight:bold');

                    var skillnum = data.skills.length / 3;
                    if (skillnum != 0) {
                        var num = 1;
                        for (i = 1; i <= skillnum; i++) {
                            var ahref = document.createElement("a");
                            ahref.setAttribute('href', '#');
                            var img = document.createElement("img");
                            img.setAttribute('src', skillObj[data.skills[num]]);
                            img.setAttribute('style', 'margin-left:10px;');
                            num = num + 3;
                            ahref.appendChild(img);
                            parentDiv.appendChild(ahref);
                        }
                    }
                    document.getElementById('profile-main-card').style.display = "block";
                }
            } catch (e) {
                showDialogWithMessage('dialog-invalid-message', 'Unable to retrieve Prospect information.');
            }
        };
        xhr.onerror = function () {
            modal.hide();
            showDialogWithMessage('dialog-invalid-message', 'Unable to retrieve Prospect information.');
        };
        xhr.send();

    }

    function loadConfirmHire() {

        var modal = document.querySelector('ons-modal');
        var date = new Date();

        var currentHours = date.getHours();
        currentHours = ("0" + currentHours).slice(-2);

        var currentMinutes = date.getMinutes();
        currentMinutes = ("0" + currentMinutes).slice(-2);

        $('#fromTime').val(currentHours + ':' + currentMinutes);
        $('#toTime').val(currentHours + ':' + currentMinutes);


        $('#reviewName').html($('#profileName').html());
        $('#reviewNameMessage').html('Message for ' + $('#profileName').html());
        $('#reviewHours').html($('#noOfHours').val());
        $('#reviewDate').html($('#dateOfRequest').val());

        $('#reviewPricePerHour').html($('#hourlyRate').html() + ' X ' + $('#reviewHours').html());

        var reviewHourTotalValue = $('#priceHoursProfileHire').val() * $('#reviewHours').html();
        $('#reviewPricePerHourValue').html("$" + reviewHourTotalValue);

        var taxPrice = reviewHourTotalValue * 0.1;
        var transPrice = reviewHourTotalValue * 0.05;
        $('#reviewPriceTax').html("$" + taxPrice);
        $('#reviewPriceTransportation').html("$" + transPrice);

        var totalPrice = reviewHourTotalValue + taxPrice + transPrice;

        $('#reviewTotalPriceSub').html('$' + totalPrice);
        $('#reviewTotalPriceMain').html('$' + totalPrice + ' for ' + $('#reviewHours').html() + ' hours');

        document.getElementById('reviewProfileImage').src = document.getElementById('profileImage').src;
        var skillId = document.getElementById('profileSkillId').value;

        document.getElementById('reviewSkillImage').src = skillObj[skillId];

        modal.hide();
        document.getElementById('profile-reviewrequest-card').style.display = "block";
    }

    function confirmProfile() {

        var profileId = localStorage.getItem('profileId');

        var hours = document.getElementById('noOfHours').value;
        var date = document.getElementById('dateOfRequest').value;
        var prospectId = sessionStorage.getItem('prospectIdProfileHire');
        var priceHour = document.getElementById('priceHoursProfileHire').value;
        var skillId = "[2]";
        var request = {
            "date": date,
            "fromHour": document.getElementById('fromTime').value,
            "toHour": document.getElementById('toTime').value,
            "hours": hours,
            "priceHour": priceHour,
            "subTotal": priceHour * hours,
            "taxes": priceHour * hours * 0.1,
            "transportation": priceHour * hours * 0.05,
            "total": (priceHour * hours) + (priceHour * hours * 0.1) + (priceHour * hours * 0.05),
            "requiredSkill": skillId,
            "jobTitle": "",
            "description": "",
            "profileId": profileId,
            "prospectId": prospectId
        };
        const xhr = new XMLHttpRequest();

        xhr.open("POST", "http://18.220.231.8/QuipaServer/services/requestservice/request/");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
            try {
                if (this.status === 200) {
                    var data = JSON.parse(this.response);
                    console.log(data);
                    sessionStorage.setItem('tabLoaderId', 1);
                    document.querySelector('#Navigator').resetToPage('tabbar.html', {
                        data: {
                            title: 'My Requests'
                        }
                    });
                } else {
                    console.log(this.status + " " + this.statusText);
                }
            } catch (e) {
                console.log(e.message);
            }
        };

        xhr.onerror = function () {
            console.log(this.status + " " + this.statusText);
        };
        xhr.send(JSON.stringify(request));
    }

    function loadMyRequests() {

        var modal = document.querySelector('ons-modal');
        modal.show();

        document.getElementById('myrequest-container').style.display = "none";

        var element = document.getElementById("myrequestContent");
//        element.innerHTML = '';

        var profileId = localStorage.getItem('profileId');

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://18.220.231.8/QuipaServer/services/requestservice/request?profileId=" + profileId);
        xhr.setRequestHeader("Accept", "application/json");

        xhr.onload = function () {

            try {
                if (this.status === 200) {

                    var data = JSON.parse(this.response);
                    console.log(JSON.stringify(data));

                    if (data.length == 0) {

                        modal.hide();
                        document.getElementById('myrequest-container').style.display = "block";
                        showDialogWithMessage('dialog-invalid-message', 'No Requests Founds!');
                        return;
                    }

                    element.innerHTML = '';

                    var j = 0;
                    for (var i = data.length - 1; i >= 0; i--) {

                        var currentItem = data[i];
                        var statusColor = "green";
                        if (currentItem['status'].toLowerCase() === 'pending') {
                            statusColor = "orange";
                        }


                        prospectIdList.push(currentItem['prospectId'] + '_' + i);

                        var bgColor = '#DFDFDF;';
                        if (j % 2 == 0) {
                            bgColor = '#FFFFFF;';
                        }
                        j++;

                        element.appendChild(ons.createElement(
                            '<ons-list-item style="background-color:' + bgColor + '">' +

                            '<div class="center" style="width:70% !important;">' +
                            '<div>' +
                            '<span style="float:left;margin-bottom: 20px;font-size:18px;font-weight:bold;" id="prospectIdName_' + currentItem['prospectId'] + '_' + i + '">No Name</span>' +
                            '</div>' +
                            '<div style="width:100%;"><div style="float:left;">' +
                            '<img src="' + skillObj[currentItem['requiredSkill'][1]] + '" style="float:left;" width="50" height="50">' +
                            '<span style="float:left;margin-left:20px;line-height: 50px;font-size:15px;font-weight:normal;">for ' + currentItem['hours'] + ' hours</span></div>' +
                            '<div style="float:right;">' +
                            '<ons-button onclick="chatWithProspect(' + i + ', ' + currentItem['prospectId'] + ', ' + currentItem['requestId'] + ')" style="margin:0px;background-color:green !important;margin-right:20px;">CHAT</ons-button>' +
                            '</div>' +

                            '</div>' +
                            '<div  style="width:100%;height:30px;">' +
                            '<span style="float:left;font-size:15px;line-height: 30px;">on </span>' +
                            '<span style="float:right;padding-right:20px;font-size:15px;line-height: 30px;font-weight:medium;">10-19-2017</span>' +
                            '</div><br/><br/>' +
                            '<div  style="width:100%;height:30px;">' +
                            '<span style="float:left;font-size:15px;line-height: 30px;">from</span>' +
                            '<span style="float:right;font-weight:medium;font-size:15px;padding-right:20px;line-height: 30px;">' + currentItem['fromHour'] + '</span>' +
                            '</div><br/><br/>' +
                            '<div  style="width:100%;height:30px;">' +
                            '<span style="float:left;font-size:15px;line-height: 30px;">to</span>' +
                            '<span style="float:right;font-weight:medium;font-size:15px;padding-right:20px;line-height: 30px;">' + currentItem['toHour'] + '</span>' +
                            '</div><br/><br/>' +
                            '<div  style="width:100%;height:40px;">' +
                            '<span style="float:left;font-size:15px;line-height: 40px;">Total</span>' +
                            '<span style="float:right;font-weight:medium;font-size:15px;padding-right:20px;line-height: 40px;">$' + currentItem['total'] + '</span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="left" style="width:30% !important;">' +


                            '<div style="float:left;height:100%;text-align:center;">' +

                            '<br clear="all"/>' +

                            '<img src="img/image_loader.gif" style="max-width:100%;max-height:100%"  id="prospectIdImage_' + currentItem['prospectId'] + '_' + i + '" />' +
                            '<br clear="all"/><br clear="all"/>' +
                            '<div style="float:left;width:100%;bottom:0px;margin-bottom:15px;margin-top:10px;">' +
                            '<ons-button onclick="" style="background:' + statusColor + ' !important;">' + currentItem['status'] + '</ons-button>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</ons-list-item>'
                        ));

                    }

                    setTimeout(function () {
                        loadProspectDetails();
                    }, 1000);

                } else {

                    modal.hide();
                    document.getElementById('myrequest-container').style.display = "block";
                    showDialogWithMessage('dialog-invalid-message', 'No Requests Founds!');
                }
            } catch (e) {

                modal.hide();
                document.getElementById('myrequest-container').style.display = "block";
                showDialogWithMessage('dialog-invalid-message', 'No Requests Founds!');
            }
        };
        xhr.onerror = function () {

            modal.hide();
            document.getElementById('myrequest-container').style.display = "block";
            showDialogWithMessage('dialog-invalid-message', 'No Requests Founds!');
        };
        xhr.send();
    }

    function loadProspectDetails() {

        if (prospectIdList.length > 0) {
            var itemMain = prospectIdList.pop();
            var itemArray = itemMain.split('_');
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://18.220.231.8/QuipaServer/services/profileservice/profile/" + itemArray[0]);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function () {

                try {
                    if (this.status === 200) {
                        var data = JSON.parse(this.response);
                        var nameElement = document.getElementById('prospectIdName_' + itemArray[0] + '_' + itemArray[1]);
                        nameElement.innerHTML = data['name'] != '' ? data['name'] : 'No Name';
                        var imageElement = document.getElementById('prospectIdImage_' + itemArray[0] + '_' + itemArray[1]);
                        imageElement.setAttribute('style', 'width:80px;height:80px;');
                        imageElement.src = data['profilePicture'];
                        console.log(JSON.stringify(data));

                        loadProspectDetails();

                    } else {
                        loadProspectDetails();
                    }

                } catch (e) {

                    loadProspectDetails();
                    console.log(e.message);
                }
            };
            xhr.onerror = function () {
                loadProspectDetails();
                console.log(this.status + " " + this.statusText);
            };
            xhr.send();
        } else {

            var modal = document.querySelector('ons-modal');
            modal.hide();
            document.getElementById('myrequest-container').style.display = "block";
        }
    }

    function displayCreatedProfile() {
        var profile = loadProfile();
        document.getElementById('previewName_created').innerHTML = profile['name'];
        document.getElementById('previewImage_created').src = document.getElementById('userImageView').src;
        var profileSkills = profile['skills'];
        profileSkills = profileSkills.slice(1, -1);
        var arrayOfStrings = profileSkills.split('][');
        var auxSkills = '';
        for (var i = 0; i < arrayOfStrings.length; i++) {
            console.log(arrayOfStrings[i]);
            auxSkills += '<img src="' + skillObj[arrayOfStrings[i]] + '" width="50" height="50" style="padding:5px;">';
        }
        document.getElementById('previewSkills_created').innerHTML = auxSkills;
        document.getElementById('previewDescription_created').innerHTML = profile['description'];
    }

    function loadProfileCreated() {
        var modal = document.querySelector('ons-modal');
        modal.show();
        document.getElementById('profile-tab-maincard').style.display = "none";
        var profileId = localStorage.getItem('profileId');
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "http://18.220.231.8/QuipaServer/services/profileservice/profile/" + profileId);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onload = function () {
            try {
                if (this.status === 200) {
                    var data = JSON.parse(this.response);
                    console.log(data);
                    document.getElementById('previewName').innerHTML = data['name'];
                    document.getElementById('previewImage').src = data['profilePicture'];
                    document.getElementById('previewDescription').innerHTML = data['description'];
                    document.getElementById('previewPriceHour').innerHTML = '$' + data['priceHour'] + ' per Hour';
                    var profileSkills = data['skills'];
                    profileSkills = profileSkills.slice(1, -1);
                    var arrayOfStrings = profileSkills.split('][');
                    var auxSkills = '';
                    for (var i = 0; i < arrayOfStrings.length; i++) {
                        console.log(arrayOfStrings[i]);
                        auxSkills += '<img src="' + skillObj[arrayOfStrings[i]] + '" width="50" height="50" style="padding:5px;">';
                    }
                    document.getElementById('previewSkills').innerHTML = auxSkills;

                    modal.hide();
                    document.getElementById('profile-tab-maincard').style.display = "block";
                } else {

                    modal.hide();
                    document.getElementById('profile-tab-maincard').style.display = "block";
                    showDialogWithMessage('dialog-invalid-message', 'Error loading profile!');
                }
            } catch (e) {

                modal.hide();
                document.getElementById('profile-tab-maincard').style.display = "block";
                showDialogWithMessage('dialog-invalid-message', 'Error loading profile!');
            }
        };

        xhr.onerror = function () {

            modal.hide();
            document.getElementById('profile-tab-maincard').style.display = "block";
            showDialogWithMessage('dialog-invalid-message', 'Error loading profile!');
        };

        xhr.send();
    }


    function logoutUser() {

        document.querySelector('#Navigator').resetToPage('login.html');
    }


    function loadChats(prospectDetails) {

        // TODO: Load API to get messages

        chats = [];

        chats.push({
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum",
            prospectId: prospectDetails.prospectId
        });
        chats.push({message: "Test Message", prospectId: "1"});
        chats.push({message: "Test Message", prospectId: "1"});
        chats.push({message: "Test Message", prospectId: "1"});
        chats.push({message: "Test Message", prospectId: prospectDetails.prospectId});
        chats.push({message: "Test Message", prospectId: prospectDetails.prospectId});
        chats.push({message: "Test Message", prospectId: prospectDetails.prospectId});
        chats.push({message: "Test Message", prospectId: prospectDetails.prospectId});
        chats.push({message: "Test Message", prospectId: prospectDetails.prospectId});
        chats.push({message: "Test Message", prospectId: prospectDetails.prospectId});
        chats.push({
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum",
            prospectId: prospectDetails.prospectId
        });

        var chatContainer = document.getElementById('chatMainContainer');
        chatContainer.innerHTML = '';

        for (var i = 0; i < chats.length; i++) {

            var html = '';

            var loggedinUser = localStorage.getItem('profileId') ? localStorage.getItem('profileId') : "1";

            if (chats[i].prospectId == loggedinUser) {


                html += '<ons-card style="background-color:#4080ff;color:white;min-height: 80px;display: table;width: 96%;">';
                html += '<div style="float:left;width:80%;">';
                html += '<p style="float:right;">' + chats[i].message + '</p>';
                html += '</div>';
                html += '<div style="float:right;width:20%;">';
                html += '<img src="http://18.220.231.8/QuipaServer/viewProfilePicture.html?profileId=' + chats[i].prospectId + '" width="50" height="50" style="float:right;"/>';
                html += '</div>';
                html += '</ons-card>';

            } else {

                html += '<ons-card style="min-height: 80px;display: table;width: 96%;">';
                html += '<div style="float:left;width:20%;">';
                html += '<img src="http://18.220.231.8/QuipaServer/viewProfilePicture.html?profileId=' + chats[i].prospectId + '" width="50" height="50"/>';
                html += '</div>';
                html += '<div style="float:right;width:80%;">';
                html += '<p style="float:left;">' + chats[i].message + '</p>';
                html += '</div>';
                html += '</ons-card>';

            }

            chatContainer.appendChild(ons.createElement(html));
        }

        $('#chatMainContainer').animate({scrollTop: $('#chatMainContainer')[0].scrollHeight})
    }

    function sendMessage() {

        if (document.getElementById('user-chat-input').value === '') {

            showDialogWithMessage('dialog-invalid-message', 'Enter your message.');
            return;
        }

        chats.push({message: document.getElementById('user-chat-input').value, prospectId: "1"});

        var i = chats.length - 1;

        var html = '';
        html += '<ons-card style="background-color:#4080ff;color:white;min-height: 80px;display: table;width: 96%;">';
        html += '<div style="float:left;width:80%;">';
        html += '<p style="float:right;">' + chats[i].message + '</p>';
        html += '</div>';
        html += '<div style="float:right;width:20%;">';
        html += '<img src="http://18.220.231.8/QuipaServer/viewProfilePicture.html?profileId=' + chats[i].prospectId + '" width="50" height="50" style="float:right;"/>';
        html += '</div>';
        html += '</ons-card>';

        var chatContainer = document.getElementById('chatMainContainer');
        chatContainer.appendChild(ons.createElement(html));

        $('#chatMainContainer').animate({scrollTop: $('#chatMainContainer')[0].scrollHeight})

        document.getElementById('user-chat-input').value = '';
    }

});


var showDialogWithMessage = function (id, message) {
    document.getElementById('inner_error_message').innerHTML = message;
    document
        .getElementById(id)
        .show();
};

var showDialog = function (id) {
    document
        .getElementById(id)
        .show();
};

var hideDialog = function (id) {
    document
        .getElementById(id)
        .hide();
};

function addToSkills(skillId) {
    var skills = document.getElementById('skills').value;
    if (typeof skills === 'undefined') {
        skills = '';
    }
    if (document.getElementById("skill_" + skillId).className == "skillsSelected") {
        document.getElementById("skill_" + skillId).className = "skills";
        skills = skills.replace('[' + skillId + ']', '');
    } else {
        document.getElementById("skill_" + skillId).className = "skillsSelected"
        skills = skills + '[' + skillId + ']';
    }
    document.getElementById('skills').value = skills;
    console.log(skills);
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function searchSkillChanged(event) {
    console.log(event.value);
    document.getElementById('skill_search_image').src = skillObj[event.value];
}

function chatWithProspect(id, prospectId, requestId) {


    var name = "";
    if (document.getElementById('prospectIdName_' + prospectId + '_' + id))
        name = document.getElementById('prospectIdName_' + prospectId + '_' + id).innerHTML;

    var imageURL = "";
    if (document.getElementById('prospectIdImage_' + prospectId + '_' + id))
        imageURL = document.getElementById('prospectIdImage_' + prospectId + '_' + id).src;

    document.querySelector('#Navigator').pushPage('chatProspect.html', {
        data: {
            title: 'Chat',
            prospectName: name ? name : "No Name",
            prospectImage: imageURL ? imageURL : "http://18.220.231.8/QuipaServer/viewProfilePicture.html?profileId=1",
            prospectId: prospectId,
            requestId: requestId
        }
    });

}

function focusPage() {

    $('#login_container').animate({scrollTop: $('#login_container')[0].scrollHeight})
}

function flushDataToServer() {
    if (navigator.connection.type === Connection.WIFI) {
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
            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                if (result) {
                    console.log(result.value);
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", "http://18.220.231.8/QuipaServer/services/profileservice/profile");
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.onload = function () {
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

                    xhr.onerror = function () {
                        showDialogWithMessage('dialog-invalid-message', 'Error creating Profiles!');
                    };
                    xhr.send(JSON.stringify(result.value));
                    profile.delete(result.key);
                    result.continue();
                } else {
                    console.log('No data Found')
                }

            };
            modal.hide();
            console.log(addReq);
        }
    }
}