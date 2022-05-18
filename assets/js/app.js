$('#dhcp').on('click', function(){
    if ( $(this).is(':checked') ) {
        //$('.form-input').hide();
        $('.network-input').attr('disabled','disabled');
    } 
    else {
        //$('.form-input').show();
        $('.network-input').attr('disabled', false);
    }
});

$('#automatic').on('click', function(){

    if ( $(this).is(':checked') ) {
        $('input[type="datetime-local"]').attr( 'disabled', 'disabled');
        $("#form-automatic").removeClass("hide");
        $("#form-automatic").addClass("show");
    } 
    else {
        $('input[type="datetime-local"]').attr( 'disabled', false);
        $("#form-automatic").addClass("hide");
        $("#form-automatic").removeClass("show");
    }
});

$("#form-operator").submit(function(event){
    // Prevent default posting of form - put here to work in case of errors
    event.preventDefault();

    // setup some local variables
    var $form = $(this);

    // Serialize the data in the form
    var serializedData = $form.serialize();

    // Fire off the request to /form.php
    request = $.ajax({
        url: "/update-operator",
        type: "post",
        data: serializedData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        top.location.href = '/';
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        alert("Admin Incorrect password");

    });


});

$("#form-network").submit(function(event){
    // Prevent default posting of form - put here to work in case of errors
    event.preventDefault();

    // setup some local variables
    var $form = $(this);

    // Serialize the data in the form
    var serializedData = $form.serialize();

    // Fire off the request to /form.php
    request = $.ajax({
        url: "/update-network",
        type: "post",
        data: serializedData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        top.location.href = '/network';
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        alert("Error");

    });


});

$("#form-reader").submit(function(event){
    // Prevent default posting of form - put here to work in case of errors
    event.preventDefault();

    // setup some local variables
    var $form = $(this);

    // Serialize the data in the form
    var serializedData = $form.serialize();

    // Fire off the request to /form.php
    request = $.ajax({
        url: "/update-reader",
        type: "post",
        data: serializedData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        top.location.href = '/reader';
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        alert("Error");

    });


});

$("#reload-network").click(  function(event){
    // Prevent default posting of form - put here to work in case of errors
    event.preventDefault();

    // setup some local variables
    var $form = $(this);

    // Serialize the data in the form
    var serializedData = $form.serialize();

    // Fire off the request to /form.php
    request = $.ajax({
        url: "/reload-network",
        type: "post",
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        top.location.href = '/network';
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        alert("Error");

    });


});

$('#form-time').submit(function(event){
    // Prevent default posting of form - put here to work in case of errors
    event.preventDefault();

    // setup some local variables
    var $form = $(this);

    // Serialize the data in the form
    var serializedData = $form.serialize();

    // Fire off the request to /form.php
    request = $.ajax({
        url: "/update-time",
        type: "post",
        data: serializedData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        top.location.href = '/';
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        alert("Error");

    });


});


function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
function toggleSystem() {
    document.getElementById("sysDrop").classList.toggle("show");
}
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
        }
    }
} 



$(document).ready(function() {
    webSocketRegister();
    updateValues();
});




//Navigation

$('#m-input').on('click', function(){
    top.location = '/input'
});


$('#m-output').on('click', function(){

    top.location = '/output'
});

$('#m-config').on('click', function(){
    top.location = '/config'
});

$('#m-network').on('click', function(){
    top.location = '/network'
});

$('#m-reader').on('click', function(){
    top.location = '/reader'
});

$('#m-operator').on('click', function(){
    top.location = '/operator'
});

$('#m-datetime').on('click', function(){
    top.location = '/datetime'
});

$('#m-log').on('click', function(){
    top.location = '/log'
});

$('#m-device').on('click', function(){
    top.location = '/device'
});