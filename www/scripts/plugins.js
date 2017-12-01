
document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'login') {
        page.querySelector('#push-button').onclick = function () {
            console.log('pushing page');
            window.location = 'register.html';
           // document.querySelector('#Navigator').pushPage('register.html', { data: { title: 'Register' } });

        };
    } else if (page.id === 'register') {
            getLocation();
           // document.querySelector('#Navigator').pushPage('register.html', { data: { title: 'Register' } });
    } else if (page.id === 'profilepic') {
        page.querySelector("#cameraPhoto").onclick = function (e) {
            e.preventDefault();
            //call getPhoto() to access native device's camera
            getPhoto(true);
        };
        page.querySelector("#galleryPhoto").onclick = function (e) {
            e.preventDefault();
            getPhoto(false);
        };

    } else if (page.id === 'peopleMap') {
        getSearcherLocation();

    /*Percy*/
    } else if (page.id === 'profile') {
        console.log('profile');
        loadProfileCreated();
    /*Percy*/
    /*Pinky*/
    }else if (page.id === 'profileHire') {

      var modal = document.querySelector('ons-modal');
      modal.show();

    }else if (page.id === 'profileSend') {

        var skillObj = {
                            1: "images/computer.png",
                            2: "images/cooker.png",
                            3: "images/hair_stylist.png",
                            4: "images/handyman.png",
                            5: "images/mechanic.png",
                            6: "images/painter.png",
                            7: "images/telephonist.png",
                            8: "images/tutor.png",
                            9: "images/waitress.png"

                            };

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
        $('#reviewPricePerHourValue').html("$"+reviewHourTotalValue);

        var taxPrice = reviewHourTotalValue * 0.1;
        var transPrice = reviewHourTotalValue * 0.05;
        $('#reviewPriceTax').html("$"+taxPrice);
        $('#reviewPriceTransportation').html("$"+transPrice);

        var totalPrice = reviewHourTotalValue + taxPrice + transPrice;

        $('#reviewTotalPriceSub').html('$' + totalPrice);
        $('#reviewTotalPriceMain').html('$' + totalPrice + ' for ' + $('#reviewHours').html() + ' hours');

        document.getElementById('reviewProfileImage').src = document.getElementById('profileImage').src;

        var skillId = document.getElementById('profileSkillId').value;

        document.getElementById('reviewSkillImage').src = skillObj[skillId];


    }else if (page.id == "requestHired") {

          var modal = document.querySelector('ons-modal');
          modal.show();

    }
    
    /*Pinky*/

    //SKILL TOGGLE FOR SEARCH PAGE
    function toggleDrop() {
        console.log("Toggled list");
        document.getElementById("myDropdown").classList.toggle("show");
    }


    //LOCATION FUNCTIONS
    function onSuccess(location) {
        console.log("Inside location success call");
        //location recording time
        var locationTime = Date(location.timestamp);
        var lat = location.coords.latitude;
        var long = location.coords.longitude;
        //output result to #location div...
        document.getElementById("latitude").value=lat;
        document.getElementById("longitude").value=long;
        //build map with current latitude and longitude
        buildMap(lat, long);
    }

    function onFail(error) {
        console.log("location error code = " + error.code + " message = " + error.message);
    }

    function getLocation() {
        console.log("getLocation fired");
        navigator.geolocation.getCurrentPosition(onSuccess,
            onFail, {
                timeout: 15000,
                enableHighAccuracy: true
            });
    }

    function buildMap(lat, long) {
        //set combined position for user
        console.log("Inside of buildMap");
        var latlong = new google.maps.LatLng(lat, long);
        //set required options
        var mapOptions = {
            center: latlong,
            zoom: 12,
            zoomControl: false,
            gestureHandling: 'none',
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }; //zoom control and gesture handling to keep map from flopping about when user is scrolling
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        //add initial location marker
        var marker = new google.maps.Marker({ position: latlong, map: map });
        console.log("Marker has been added");
    }

    function onSuccessImage(imageData) {
        console.log("Inside on success");
        console.log("imageData is of type " + typeof imageData);
        var image = document.getElementById('imageView');
        image.src = imageData;

    }

    function onFailImage(message) {
        alert('Could not complete: ' + message);
    }

    function getPhoto(camera) {
        console.log("Inside of getPhoto");
        if (camera === true) {
            //Use from Camera
            navigator.camera.getPicture(onSuccessImage, onFailImage, {
                quality: 10,
                correctOrientation: true,
                sourceType: Camera.PictureSourceType.CAMERA,
                destinationType: Camera.DestinationType.FILE_URI
            });
        }
        else {
            navigator.camera.getPicture(onSuccessImage, onFailImage, {
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.FILE_URI
            });
        }
    }


    //PEOPLE MAP LOCATION FUNCTIONS
    function onSuccessPM(location) {
        console.log("Inside location success call");
        //location recording time
        var locationTime = Date(location.timestamp);
        var lat = location.coords.latitude;
        var long = location.coords.longitude;
        //build map with current latitude and longitude
        buildMapSearch(lat, long);
    }

    function onFailPM(error) {
        document.getElementById("searchLocation").innerHTML = "location error code = " + error.code + " message = " + error.message;
    }

    function getSearcherLocation() {
        console.log("getLocation fired");
        navigator.geolocation.getCurrentPosition(onSuccessPM,
            onFailPM, {
                timeout: 15000,
                enableHighAccuracy: true
            });
    }


    function buildMapSearch(lat, long) {
         //set combined position for user
         console.log("Inside of buildMapSearch");
         var latlong = new google.maps.LatLng(lat, long);
         //set required options
         var mapOptions = {
             center: latlong,
             zoom: 12,
             mapTypeId: google.maps.MapTypeId.ROADMAP
         };
         var map = new google.maps.Map(document.getElementById("search_map"), mapOptions);
         //add initial location marker
         var marker = new google.maps.Marker({ position: latlong, map: map });
         console.log("Marker has been added");

         var geocoder = new google.maps.Geocoder;
         var prospects = [];
         const xhr = new XMLHttpRequest();
         xhr.open("GET", "http://18.220.231.8:8080/QuipaServer/services/profileservice/profile");
         xhr.setRequestHeader("Accept", "application/json");
         xhr.onload = function () {
             try {
                 if (this.status === 200) {
                     var data = JSON.parse(this.response);
                    console.log(data);
                     for (var i = 0; i < data.length; i++) {
                         var record = data[i];
                        // if (record['profileId'] === 30 || record['profileId'] === 7 || record['profileId'] === 23) {
                             var newContent = [];
                             newContent.push(record['latitude']); //0
                             newContent.push(record['longitude']); //1
                             newContent.push(record['name']); //2
                             newContent.push(record['description']); //3
                             newContent.push(record['priceHour']); //4
                             newContent.push(record['profileId']); //5
                             newContent.push(record['profilePicture']); //6
                             prospects.push(newContent);
                             console.log("Pulling matching content from DB");
                        // }

                     }

                     console.log(prospects);

                     //lat, long, prospect info, userid, profilepic
                     for (i = 0; i < prospects.length; i++) {
                             var infowindow = new google.maps.InfoWindow;
                             var d_latlng = { lat: parseFloat(prospects[i][0]), lng: parseFloat(prospects[i][1]) };
                             console.log(d_latlng);
                             var prospect = prospects[i][2] + '(' + prospects[i][4] + ' $/h)';
                             console.log(prospect);
                             var userId = prospects[i][5];
                             var profilePic = prospects[i][6];
                             var image = {
                              url: profilePic,
                              size: new google.maps.Size(40, 40),
                              scaledSize: new google.maps.Size(40, 40)
                            };
                             map.setZoom(13);
                             var marker = new google.maps.Marker({
                                 position: d_latlng,
                                 icon: image,
                                 map: map
                             });
                             infowindow.setContent(prospect);
                             infowindow.open(map, marker);
                             marker.addListener('click', function () {
                                 console.log("Marker clicked!" + userId);
                                 document.getElementById('prospectIdProfileHire').value=userId;
                                 profileToHire();
                                 //document.querySelector('#Navigator').pushPage('fakeProfile.html', { date: { title: 'Fake Profile' } });
                             });
                         }
                         var modal = document.querySelector('ons-modal');
                        modal.hide();
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

         xhr.send();
       }



   });

/*Pinky*/
document.addEventListener('show', function(event) {
  var page = event.target;

  var skillObj = {
                    1: "images/computer.png",
                    2: "images/cooker.png",
                    3: "images/hair_stylist.png",
                    4: "images/handyman.png",
                    5: "images/mechanic.png",
                    6: "images/painter.png",
                    7: "images/telephonist.png",
                    8: "images/tutor.png",
                    9: "images/waitress.png"

                    };

  var prospectIdList = [];

  if (page.id == "requestHired") {

        var modal = document.querySelector('ons-modal');
        modal.show();

        var element = document.getElementById("myrequestContent");
        element.innerHTML = '';

        var profileId = document.getElementById('profileId').value;
        console.log('profileId = ' + profileId);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://18.220.231.8:8080/QuipaServer/services/requestservice/request?profileId="+profileId);
        xhr.setRequestHeader("Accept", "application/json");

        xhr.onload = function() {

            modal.hide();
            try {
                if (this.status === 200) {

                    var data = JSON.parse(this.response);
                    console.log(JSON.stringify(data));

                    if(data.length == 0) {

                            element.appendChild(ons.createElement('<div style="width:100%;text-align:center;font-size:20px;">No Requests Found!</div>'));
                            return;
                    }

                    for(var i=0; i< data.length; i++) {

                        var currentItem = data[i];
                        var statusColor = "green";
                        if(currentItem['status'].toLowerCase() === 'pending') {
                            statusColor = "orange";
                        }

                        prospectIdList.push(currentItem['prospectId'] + '_' + i);

                        element.appendChild(ons.createElement(
                                                              '<ons-list-item>' +
                                                              '<div class="center">' +
                                                              '<div style="width:100%;">' +
                                                              '<span style="float:left;line-height: 50px;font-size:18px;font-weight:bold;" id="prospectIdName_'+ currentItem['prospectId'] + '_' + i + '"></span>' +
                                                              '</div>' +
                                                              '<div style="width:100%;">' +
                                                              '<img src="'+skillObj[currentItem['requiredSkill'][1]]+'" style="float:left;" width="50" height="50">' +
                                                              '<span style="float:left;margin-left:20px;line-height: 50px;font-size:18px;font-weight:bold;">for '+ currentItem['hours'] +' hours</span>' +
                                                              '</div>' +
                                                              '<div  style="width:100%;height:40px;">' +
                                                              '<span style="float:left;font-size:20px;line-height: 40px;">on </span>' +
                                                              '<span style="float:right;padding-right:20px;font-size:18px;line-height: 40px;font-weight:bold;">10-19-2017</span>' +
                                                              '</div><br/><br/>' +
                                                              '<div  style="width:100%;height:30px;">' +
                                                              '<span style="float:left;font-size:20px;line-height: 30px;">from</span>' +
                                                              '<span style="float:right;font-weight:bold;font-size:18px;padding-right:20px;">'+ currentItem['fromHour'] +'</span>' +
                                                              '</div><br/><br/>' +
                                                              '<div  style="width:100%;height:30px;">' +
                                                              '<span style="float:left;font-size:20px;line-height: 30px;">to</span>' +
                                                              '<span style="float:right;font-weight:bold;font-size:18px;padding-right:20px;">'+ currentItem['toHour'] +'</span>' +
                                                              '</div><br/><br/>' +
                                                              '<div  style="width:100%;height:30px;">' +
                                                              '<span style="float:left;font-size:20px;line-height: 30px;">Total</span>' +
                                                              '<span style="float:right;font-weight:bold;font-size:18px;padding-right:20px;">$'+ currentItem['total'] +'</span>' +
                                                              '</div>' +
                                                              '</div>' +
                                                              '<div class="right">' +
                                                              '<div style="float:left;width:120px;height:120px; vertical-align:middle; text-align:center;">' +
                                                              '<img src="images/image_loader.gif" style="max-width:100%;max-height:100%"  id="prospectIdImage_'+ currentItem['prospectId'] + '_' + i + '" />' +
                                                              '<br clear="all"/><br clear="all"/>' +
                                                              '<div style="float:left;width:100%;">' +
                                                              '<ons-button onclick="" modifier="large" style="background:' + statusColor +';">'+ currentItem['status'] +'</ons-button>' +
                                                              '</div>' +
                                                              '</div>' +
                                                              '</div>' +
                                                              '</ons-list-item>'
                                                              ));

                    }

                    setTimeout(function(){
                               loadProspectDetails();
                               }, 1000);

                }else {

                    element.appendChild(ons.createElement('<div style="width:100%;text-align:center;font-size:20px;">No Requests Found!</div>'));
                }
            } catch (e) {
                console.log(e.message);

                element.appendChild(ons.createElement('<div style="width:100%;text-align:center;font-size:20px;">No Requests Found!</div>'));
            }
        };
        xhr.onerror = function() {
            modal.hide();
            console.log(this.status + " " + this.statusText);
            element.appendChild(ons.createElement('<div style="width:100%;text-align:center;font-size:20px;">No Requests Found!</div>'));
        };
        xhr.send();

    }
    else if(page.id == "tabbar-page") {
      if(document.getElementById('tabLoaderId').value == 1) {

                          document.getElementById('appTabbar').setActiveTab(2);

                          document.getElementById('tabLoaderId').value = 0;

                          }
    }

    else if (page.id === 'profileHire') {

      var modal = document.querySelector('ons-modal');
      modal.show();

      var prospectId = document.getElementById('prospectIdProfileHire').value;

      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://18.220.231.8:8080/QuipaServer/services/profileservice/profile/"+prospectId);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function() {

          modal.hide();
          try {
              if (this.status === 200) {
                  $('#star').raty({ 'score': 4, 'readonly': true });

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
                  hourlyRate.innerHTML =  "$" + data.priceHour;
                  hourlyRate.setAttribute('style', 'text-align:left;font-size:5;font-weight:bold');

                  var skillnum = data.skills.length/3;
                  if (skillnum !=0){
                      var num = 1;
                      for(i=1; i<=skillnum; i++){
                          var ahref = document.createElement("a");
                          ahref.setAttribute('href', '#');
                          var img = document.createElement("img");
                          img.setAttribute('src', skillObj[data.skills[num]]);
                          img.setAttribute('style', 'margin-left:10px;');
                          num = num+3;
                          ahref.appendChild(img);
                          parentDiv.appendChild(ahref);
                      }
                  }
              }

          } catch (e) {
              console.log(e.message);
          }
      };
      xhr.onerror = function() {
          modal.hide();
          console.log(this.status + " " + this.statusText);
      };
      xhr.send();
  }

  function loadProspectDetails() {

        if(prospectIdList.length > 0) {

            console.log(prospectIdList);

            var itemMain = prospectIdList.pop();

            var itemArray = itemMain.split('_');

            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://18.220.231.8:8080/QuipaServer/services/profileservice/profile/"+itemArray[0]);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function() {

                try {
                    if (this.status === 200) {

                        var data = JSON.parse(this.response);

                        var nameElement = document.getElementById('prospectIdName_'+itemArray[0] + '_' + itemArray[1]);
                        nameElement.innerHTML = data['name'];

                        var imageElement = document.getElementById('prospectIdImage_'+itemArray[0] + '_' + itemArray[1]);
                        imageElement.setAttribute('style', 'width:120px;height:120px;');
                        imageElement.src = data['profilePicture'];

                        console.log(JSON.stringify(data));

                        loadProspectDetails();

                    }else {
                        loadProspectDetails();
                    }

                } catch (e) {

                    loadProspectDetails();
                    console.log(e.message);
                }
            };
            xhr.onerror = function() {
                loadProspectDetails();
                console.log(this.status + " " + this.statusText);
            };
            xhr.send();
        }
    }
});
/*Pinky*/
