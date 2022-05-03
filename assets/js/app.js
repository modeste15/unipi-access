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
        top.location.href = '/input';
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        alert("Incorrect password");

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
        top.location.href = '/datetime';
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
    clockUpdate();
    setInterval(clockUpdate, 1000);
    inputUpdate();
    $('input[type="datetime-local"]').setNow();

});

function clockUpdate() {

    var date = new Date();
    $('.digital-clock').css({'color': '#000'});

    function addZero(x) {
        if (x < 10) {
        return x = '0' + x;
        } else {
        return x;
    }
    }

    function twelveHour(x) {
        if (x > 12) {
        return x = x - 12;
        } else if (x == 0) {
        return x = 12;
        } else {
        return x;
        }
    }

    var h = addZero(twelveHour(date.getHours()));
    var m = addZero(date.getMinutes());
    var s = addZero(date.getSeconds());

    $('.digital-clock').text(h + ':' + m + ':' + s)

    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    today = dd + '/'+mm + '/' + yyyy;
    $('.date').text(today)

}

$.fn.setNow = function (onlyBlank) {
    var now = new Date($.now())
        , year
        , month
        , date
        , hours
        , minutes
        , seconds
        , formattedDateTime
        ;

    year = now.getFullYear();
    month = now.getMonth().toString().length === 1 ? '0' + (now.getMonth() + 1).toString() : now.getMonth() + 1;
    date = now.getDate().toString().length === 1 ? '0' + (now.getDate()).toString() : now.getDate();
    hours = now.getHours().toString().length === 1 ? '0' + now.getHours().toString() : now.getHours();
    minutes = now.getMinutes().toString().length === 1 ? '0' + now.getMinutes().toString() : now.getMinutes();
    seconds = now.getSeconds().toString().length === 1 ? '0' + now.getSeconds().toString() : now.getSeconds();

    formattedDateTime = year + '-' + month + '-' + date + 'T' + hours + ':' + minutes + ':' + seconds;

    if ( onlyBlank === true && $(this).val() ) {
        return this;
    }

    $(this).val(formattedDateTime);

    return this;
}




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