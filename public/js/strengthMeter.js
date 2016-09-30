function strengthMeter(passwordFieldId, nodes, locale) {

    // init undefined 
    if ('undefined' === typeof(nodes)) {
        var nodes = 1;
    }   
    
    // Para traducir el texto
    var localePossibilities = " <span class='weak'>possibilities</span>";
    if(locale == "es") localePossibilities = " <span class='weak'>posibilidades</span>";

    // init character classes
    var password = $("#" + passwordFieldId).val();
    var numEx = /\d/;
    var lcEx = /[a-z]/;
    var ucEx = /[A-Z]/;
    var syEx = /\W/;
    var meterMult = 1;
    var character_set_size = 0;
    
    // loop over each char of the password and check it per regexes above.
    // weight numbers, upper case and lowercase at .75, 1 and .25 respectively.
    if (numEx.test(password)) {
        character_set_size += 10;
    }
    if (ucEx.test(password)) {
        character_set_size += 26;
    }
    if (lcEx.test(password)) {
        character_set_size += 26;
    }
    if (syEx.test(password)) {
        character_set_size += 32;
    }

    // assume that 100% is a meterMult of maxMulti
    var strength = Math.pow(character_set_size, password.length);

    // init crackers at hashes/second
    // all numbers from slowest computer here http://hashcat.net/oclhashcat-plus/
    var rateMd5 = 1333000000; 
    // var rateSHA1 = 433000000;
    // var rateMd5crypt = 855000;
    // var rateBcrypt = 604;
        
    // calculate a human readable time based on seconds and nodes
    // var secMd5 = secondsToStr(toFixed(strength/(rateMd5*nodes))); 
    // var secSHA1 = secondsToStr(toFixed(strength/(rateSHA1*nodes)));
    // var secMd5crypt = secondsToStr(toFixed(strength/(rateMd5crypt*nodes)));
    // var secBcrypt = secondsToStr(toFixed(strength/(rateBcrypt*nodes)));
    
    var rates = secMd5;
       //  "SHA1: " + secSHA1 +  "<br/>" +
       //  "MD5Crypt: " + secMd5crypt + "<br/>" +
       //  "Bcrypt: " + secBcrypt + "<br/>" +
       // " ";
    
    // if null, don't show anything
    if (password.length > 0) {
        $(".strength-meter").show();
        $("#possibilities").html(numberWithCommas(strength) + localePossibilities);
        $("#rates").html(rates);
    } else {
        $(".strength-meter").hide();
    }
    
}

// thanks http://stackoverflow.com/questions/2901102/how-to-print-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// thanks http://stackoverflow.com/questions/8211744/convert-milliseconds-or-seconds-into-human-readable-form
function secondsToStr(seconds){
    // TIP: to find current time in milliseconds, use:
    // var milliseconds_now = new Date().getTime();
    seconds = Math.round(seconds);
    var numyears = Math.floor(seconds / 31536000);
    if(numyears){
        return numberWithCommas(numyears) + ' year' + ((numyears > 1) ? 's' : '');
    }
    var numdays = Math.floor((seconds % 31536000) / 86400);
    if(numdays){
        return numdays + ' day' + ((numdays > 1) ? 's' : '');
    }
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    if(numhours){
        return numhours + ' hour' + ((numhours > 1) ? 's' : '');
    }
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    if(numminutes){
        return numminutes + ' minute' + ((numminutes > 1) ? 's' : '');
    }
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    if(numseconds){
        return numseconds + ' second' + ((numseconds > 1) ? 's' : '');
    }
    return 'less then a second'; //'just now' //or other string you like;
}

// thanks http://stackoverflow.com/questions/1685680/how-to-avoid-scientific-notation-for-large-numbers-in-javascript
function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
    return x;
}