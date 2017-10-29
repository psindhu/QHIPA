
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);

        console.log('Received Event: ' + id);
    }

};
var currentProfile;
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

function verifyLogin(){
    var username = document.getElementById('username').value;
    var password = document.getElementById('passwordLogin').value;
    console.log(username +' attempting to login');
    var modal = document.querySelector('ons-modal');
    modal.show();
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://18.220.231.8:8080/QuipaServer/services/profileservice/profileLogin?mobilePhoneNumber=" + username + "&password=" + password);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onload = function () {
     try {
         if (this.status === 200) {
            var data = JSON.parse(this.response);
            console.log(data);
            if(data === ''){
             alert("Wrong Password or Phone Number");
            }else{
                document.getElementById('profileId').value = data['profileId'];
                document.getElementById('tabLoaderId').value = 0;


            document.querySelector('#Navigator').pushPage('tabbar.html', { data: { title: 'My Requests' } });
               
            }
            var modal = document.querySelector('ons-modal');
            modal.hide();
        } else {
         console.log(this.status + " " + this.statusText);
         var modal = document.querySelector('ons-modal');
            modal.hide();
            alert("Wrong Password or Phone Number");
     }
 } catch (e) {
     console.log(e.message);
     var modal = document.querySelector('ons-modal');
            modal.hide();
 }
};

xhr.onerror = function () {
 console.log(this.status + " " + this.statusText);
};

xhr.send();

}
function loadProfileCreated(){
    console.log('test');
    var modal = document.querySelector('ons-modal');
    modal.show();
    var profileId = document.getElementById('profileId').value;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://18.220.231.8:8080/QuipaServer/services/profileservice/profile/"+profileId);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onload = function () {
     try {
         if (this.status === 200) {
            var data = JSON.parse(this.response);
            console.log(data);
            document.getElementById('previewName').innerHTML=data['name'];
            document.getElementById('previewImage').src=data['profilePicture'];
            document.getElementById('previewDescription').innerHTML=data['description'];
            document.getElementById('previewPriceHour').innerHTML='$' + data['priceHour'] + ' per Hour';
            var profileSkills = data['skills'];
            profileSkills = profileSkills.slice(1, -1);
            var arrayOfStrings = profileSkills.split('][');
            var auxSkills = '';
            for (var i = 0; i < arrayOfStrings.length; i++) {
                console.log(arrayOfStrings[i]);
                auxSkills+='<img src="'+skillObj[arrayOfStrings[i]]+'" width="50" height="50">';
            }
            document.getElementById('previewSkills').innerHTML=auxSkills;
            console.log(data);
            var modal = document.querySelector('ons-modal');
            modal.hide();
        } else {
         console.log(this.status + " " + this.statusText);
         var modal = document.querySelector('ons-modal');
            modal.hide();
     }
 } catch (e) {
     console.log(e.message);
     var modal = document.querySelector('ons-modal');
            modal.hide();
 }
};

xhr.onerror = function () {
 console.log(this.status + " " + this.statusText);
};

xhr.send();
}

function backToLogin(){
    document.querySelector('#Navigator').pushPage('login.html', { data: { title: 'Qhipa' } });
}
function moveToProfilePicture(){
    document.querySelector('#Navigator').pushPage('profilepic.html', { data: { title: 'Profile Picture' } });
}
function moveToSkills(){
    document.querySelector('#Navigator').pushPage('skills.html', { data: { title: 'Skills' } });
}
function addToSkills(skillId){
    var skills = document.getElementById('skills').value;
    if(typeof skills === 'undefined'){
        skills = '';
    }
    if(document.getElementById("skill_"+skillId).className == "skillsSelected"){
        document.getElementById("skill_"+skillId).className = "skills";
        skills = skills.replace('[' + skillId + ']','');
    }else{
        document.getElementById("skill_"+skillId).className = "skillsSelected"
        skills = skills + '[' + skillId+']';
    }
    document.getElementById('skills').value = skills;
    console.log(skills);
}
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img,0,0,img.width,img.height);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
function createProfile(){
    var base64 = getBase64Image(document.getElementById("imageView"));
    var profile = {
        "name": document.getElementById('name').value,
        "description": document.getElementById('description').value,
        "profilePicture": base64,
        "email": document.getElementById('email').value,
        "password": document.getElementById('password').value,
        "mobilePhoneNumber": document.getElementById('mobilePhoneNumber').value,
        "latitude": document.getElementById('latitude').value,
        "longitude": document.getElementById('longitude').value,
        "skills": document.getElementById('skills').value
    }
    console.log(profile);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://18.220.231.8:8080/QuipaServer/services/profileservice/profile");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        try {
            if (this.status === 200) {
                var data = JSON.parse(this.response);
                document.querySelector('#Navigator').pushPage('profile.html', { data: { title: 'Profile Created' } });
                document.getElementById('profilePictureCreated').value=data['profilePicture'];
                document.getElementById('profileId').value=data['profileId'];
            } else {
                console.log(this.status + " " + this.statusText);
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    xhr.onerror = function() {
        console.log(this.status + " " + this.statusText);
    };
    xhr.send(JSON.stringify(profile));
}

app.initialize();

/*Pinky*/
function profileToHire(){
    document.querySelector('#Navigator').pushPage('profileHire.html', { data: { title: 'Hiring a Profile' } });
}

function profileToSend() {
    document.querySelector('#Navigator').pushPage('profileSend.html', { data: { title: 'Hiring a Profile' } });
}

function confirmProfile() {

    var profileId = document.getElementById('profileId').value;

    var hours = document.getElementById('noOfHours').value;
    var date = document.getElementById('dateOfRequest').value;
    var prospectId = document.getElementById('prospectIdProfileHire').value;
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
        "description":"",
        "profileId": profileId,
        "prospectId": prospectId
    }
    console.log(request);
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "http://18.220.231.8:8080/QuipaServer/services/requestservice/request/");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        try {
            if (this.status === 200) {
                var data = JSON.parse(this.response);
                console.log(data);
                document.getElementById('tabLoaderId').value = 1;
                document.querySelector('#Navigator').bringPageTop('tabbar.html', {data: {title: 'My Requests'}});


            } else {
                console.log(this.status + " " + this.statusText);
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    xhr.onerror = function() {
        console.log(this.status + " " + this.statusText);
    };
    xhr.send(JSON.stringify(request));
}
/*Pinky*/
