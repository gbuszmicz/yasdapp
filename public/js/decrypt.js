// Funcion para generar un passphrase
function randomString(len, charSet) {
	charSet = charSet || 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
	var randomString = '';
	for (var i = 0; i < len; i++) {
		var randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz,randomPoz+1);
	}
	return randomString;
}

function randomStringGenerator(element, len) {
  var i = setInterval(function() {
   var s = randomString(len);
   element.text(s);
   if(_interval) clearInterval(i);
  }, 50);
}

function simulateMatrix() {
  $('ul.encrypted-files li').each(function(i) {
    var elementId = $(this).attr("id");
    var matrix = (function(fid) {
      var $typeElement = $("li#"+fid+" .file-info .file-type span");
      var $nameElement = $("li#"+fid+" .file-info .file-name span");
      randomStringGenerator($nameElement, 25);
      randomStringGenerator($typeElement, 12);
    })(elementId)
  });
}

// Funcion para eliminar el mensaje con todos los archivos asociados
function removeMessage() {
  var passphrase = $('input[ref=password]').val() || null;
  if(!passphrase) {
    $passElement.addClass("error");
    if(locale == 'es') {
      $err.text("Ingresa una contraseña");
    } else {
      $err.text("Please enter a passphrase");
    }
    return
  }
  var seed = CryptoJS.AES.decrypt(_secret, passphrase).toString(CryptoJS.enc.Latin1);
  var validatedData = { "seed":seed, "lang":locale }
  $.ajax({
      type: "POST",
      url: "/m/"+_msgId+'/remove',
      data: JSON.stringify(validatedData),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data) { 
        if(data.status == "success") {
          setTimeout(function() {
            $("fieldset.service").hide();
            $("fieldset.success-message").show();
          }, 1000)
        }
        if(data.status == "error") {
          alert(data.msg)
        }
      },
      failure: function(err) { alert(err); }
  });
}

// Una vez validado el hash de la contraseña actualizo los datos en pantalla
function updateMessageInfo(data, passphrase) {
  var _files = data.files;
  if(_files.length > 0) {
    for(var i=0; i<_files.length; i++) {
      var f = _files[i];
      var m = (function(f) {
        setTimeout(function() {
          $("li#"+f._id+" .file-info .file-type span").text(f.type);
          $("li#"+f._id+" .file-info .file-name span").text(f.name);
        }, 50)
        downloadFile(f, passphrase);
      })(f)
    }
  }
}

// Esta funcion se utiliza para actualizar el estado del progreso del upload
function updateProcessStatus(elementId, newStatus) {
  var $status = $("li#"+elementId+" .file-info .download .progress");
  $status.removeClass("waiting decrypting downloading finishing complete")
  $status.addClass(newStatus)
}

// Funcion para descargar los archivos de la nube
// Se ejecuta una vez valido el hash del passphrase
function downloadFile(file, passphrase) {
  if(file && passphrase) {
    var fileId = file._id;
    var fileName = file.name;
    var fileUrl = file.url;
    var fileType = file.type;
    var $progressBar = $("li#"+fileId+" .file-info .download .progress .progress-bar");
    $.ajax({
        type: "GET",
        url: fileUrl,
        xhr: function () {
          var xhr = new window.XMLHttpRequest();
          //Download progress
          xhr.addEventListener("progress", function(evt) {
            if (evt.lengthComputable) {
              var percentComplete = Math.round((evt.loaded / evt.total) * 100);
              if(percentComplete > 80 && percentComplete < 95) updateProcessStatus(fileId, "decrypting");
              $progressBar.css('width', percentComplete + '%');
              // console.log(Math.round(percentComplete * 100) + "%");
            }
          }, false);
          return xhr;
        },
        beforeSend: function () {
          updateProcessStatus(fileId, "downloading");
        },
        success: function(response) { 
          var decrypted = CryptoJS.AES.decrypt(response, passphrase).toString(CryptoJS.enc.Latin1);
  				if(!/^data:/.test(decrypted)) { //
  					console.log("Invalid pass phrase or file! Please try again.");
            // $progressBar.css('background-color','#d9534f');
  					updateProcessStatus(fileId, "error");
  					return false;
  				} else {
  				  updateProcessStatus(fileId, "finishing");
  				}
  				console.log("File ready for download")
  				var $a = $("li#"+fileId+" .file-info .download .actions a.download-file");
          $a.attr('data-href', decrypted);
          $a.attr('data-name', fileName);
          $a.attr('data-type', fileType);
          updateProcessStatus(fileId, "complete");
          $("li#"+fileId+" .file-info .download .progress .progress-bar").removeClass("progress-bar-striped active");
          setTimeout(function() {
            $("li#"+fileId+" .file-info .download").addClass("ready");
          }, 300)
          
          
        },
        failure: function(err) { console.log(err); }
    });
  }
}

function dataURItoBlob(dataURI) {
  var byteString;
  // Le saco el data: y el base64
  // data:image/png;base64,|@412931023812903
  if(dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = unescape(dataURI.split(',')[1]);
  }
  // Separo el mime, aunque lo podría tomar por parámetro
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  // escribo los bytes del string a un array
  var ia = new Uint8Array(byteString.length);
  for(var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], {type:mimeString});
}

function saveFile(element) {
  var data = element.getAttribute("data-href");
  var name = element.getAttribute("data-name");
  var blob = dataURItoBlob(data);
  saveAs(blob, name);
}

$(".button.process").click(function(e) {
  e.preventDefault();
  var $passElement = $(".passphrase");
  var $err = $(".passphrase .error-msg");
  $passElement.removeClass("error");

  var passphrase = $('input[ref=password]').val() || null;
  if(!passphrase) {
    $passElement.addClass("error");
    if(locale == 'es') {
      $err.text("Ingresa una contraseña");
    } else {
      $err.text("Please enter a passphrase");
    }
    return
  }
  _interval = false;
  simulateMatrix();
  
  var seed = CryptoJS.AES.decrypt(_secret, passphrase).toString(CryptoJS.enc.Latin1);
  var validatedData = { "seed":seed, "lang":locale }
  $.ajax({
      type: "POST",
      url: "/m/"+_msgId,
      data: JSON.stringify(validatedData),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data) { 
        if(data.status == "success") {
          _interval = true; // Para parar simulateMatrix();
          updateMessageInfo(data, passphrase);
          $(".msg-actions").show(); // Para mostrar la accion de eliminar mensaje
        }
        if(data.status == "error") {
          _interval = true; // Para parar simulateMatrix();
          setTimeout(function() {
            $(".file-info .file-type span").text("data/encrypted");
            $('ul.encrypted-files li').each(function(i) {
              var fid = $(this).attr("id");
              var t = $("li#"+fid+" .file-info .file-name span").text()+".encrypted";
              $("li#"+fid+" .file-info .file-name span").text(t);
            });
          }, 50)
          $passElement.addClass("error");
          $err.text(data.msg);
          // alert(data.msg);
        }
      },
      failure: function(err) { alert(err); }
  });
});