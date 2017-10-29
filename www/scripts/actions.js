/*
function testFunction() {
    alert("Test function is working...");
}

$(document).ready(testFunction);
*/

$(document).ready(function () {
    $("input[type=submit]").click(function (e) {
        var firstName = $("#firstName").val();
        var lastName = $("#surname").val();
        var email = $("#signUpEmail").val();
        var age = $("#age").val();
        
        if (firstName == '' || lastName == '' || email == '') {
            e.preventDefault();
            alert("Please Fill Required Fields");
        }

        alert("You are " + firstName + " " + lastName + ", " + age + " years old and we can contact you at\n" + email);

    });
});