Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  for(var i = this.length - 1; i >= 0; i--) {
    if(this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
}

var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FileReader' in window;
}();

function fileSizeIEC(a,b,c,d,e){
 return (b=Math,c=b.log,d=1024,e=c(a)/c(d)|0,a/b.pow(d,e)).toFixed(2)
 +' '+(e?'KMGTPEZY'[--e]+'iB':'Bytes')
}

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

$('input[ref=password]').keyup(function(event) {
  $(".passphrase").removeClass("error");
  strengthMeter("password", 8, locale); // 8 = cores
});

// Elimino un archivo de la pantalla
function _removeFileFromScreen(fid) {
  document.getElementById(fid).remove();
}
// Elimino un archivo del array de archivos
function _removeFileFromArray(fid) {
  if(_files.length > 0) {
    for (var i = 0; i < _files.length; i++) {
    var itemFound = false;
     if(_files[i].hash === fid) {
       console.log("File found, removing!")
       _files.splice(i, 1);
       if(_files.length == 0) $("div.results").hide();
       itemFound = true;
     }
     if(itemFound) break;
    }
  }
}  
function removeFile(fid) {
  console.log("Removing file id "+fid)
  _removeFileFromScreen(fid);
  _removeFileFromArray(fid);
}

$('#generate-passphrase').click(function() {
	var element = $('input[ref=password]');
  // element.val(xkcd_pw_gen());
  generatePassphrase(element, 4, function(generated) {
    if(generated) strengthMeter("password", 8, locale); // 8 = cores
  });
})

$('.upload').click(function() {
	// Trigger the file browser dialog
	$("#encrypt-input").click();
  // $(this).parent().find('input').click();
	$(".upload").removeClass('error');
});

function handleErrorMsgs(err, subErr) {
  $errorMsg = $(".upload p.error-messages");
  $subErrorMsg = $(".upload p.sub-error-messages");
  $upload = $(".upload");
  $upload.addClass("error");
  $errorMsg.text(err);
  if(subErr) $subErrorMsg.html(subErr);
  if(!subErr) $subErrorMsg.text("");
  console.log(err)
}

function handleFileSelect(evt) {
  var files = evt.length ? evt : evt.target.files;
  // var files = evt.target.files; // FileList object
  // var files = evt
  var totalFiles = _files.length || 0;
	
  // Loop through the FileList and render image files as thumbnails.
  for (var i = 0, f; f = files[i]; i++) {
    // Valido que no se alcance el maximo de archivos permitidos
    if((totalFiles+i) >= _maxFiles) {
      if(locale == 'es') {
        var err = "Se alcanzó el máximo permitido de archivos";
        var subErr = "Se permiten hasta <strong>5 archivos</strong> ¿Tienes que enviar más? Repite estos pasos más tarde";
      } else {
        var err = "Max files reached!";
        var subErr = "Up to <strong>5 files</strong> are allowed. But you can always send <strong>2 emails!</strong>";
      }
      handleErrorMsgs(err, subErr);
      break;
    }
    // Para detectar rusticamente si es un directorio o un archivo: size < 4096 y sin type
    if(f.size < 4096 && f.type == "") {
      if(locale == 'es') {
        var err = "¡Parece ser una carpeta!";
        var subErr = "No se permiten carpetas. Prueba seleccionando los archivos uno a uno";
      } else {
        var err = "Looks like a folder to me!";
        var subErr = "Folders are not allowed. Try selecting one file at a time";
      }
      handleErrorMsgs(err, subErr);
      break;
    }
    
    // Solamente se permiten archivos menores a 2MB
    if(f.size > 5*1042*1024) {
      if(locale == 'es') {
        var err = "Recuerda: el tamaño máximo permitido por archivo es de <strong>5MB</strong>";
      } else {
        var err = "Remember: max file size is <strong>5MB</strong>. This one is too big!!";
      }
      handleErrorMsgs(err);
      break;
    }
    // var _tempId = CryptoJS.SHA1(f.size)
    // console.log(_tempId)
    var id = ((new Date(f.lastModifiedDate).getTime())+f.size);
    var isDuplicated = false;
    for (var i = 0; i < _files.length; i++) { // -1 para excluir el archivo actual
      if(_files[i].hash === id) { //  && _files[i].name == f.name
        if(locale == 'es') {
          var err = "¡Archivo duplicado!";
          var subErr = "No se permiten archivos duplicados";
        } else {
          var err = "File already selected!";
          var subErr = "Duplicated files are not allowed";
        }
        handleErrorMsgs(err, subErr);
        isDuplicated = true;
      }
      if(isDuplicated) break;
    }
    if(isDuplicated) break;

    var li = document.createElement('li');
    li.setAttribute("id", id.toString());
    li.setAttribute("class","selected-file");
    var $list = document.getElementById('output-list');
    if(locale == 'es') {
      var removeText = "Eliminar";
    } else {
      var removeText = "Remove";
    }
    li.innerHTML = ['<div class="file-info">',
                      '<span class="file-size">'+fileSizeIEC(f.size)+'</span>'+f.name,
                    '</div>',
                    '<div class="progress waiting">',
                      '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>',
                    '</div>',
                    '<div class="actions">',
                      '<a class="remove-file" href="javascript:" onClick="removeFile('+id+')">'+removeText+'</a>',
                    '</div>'].join('');
    $list.insertBefore(li, null);
    f.hash = id;
    $("div.results").show();
    _files.push(f);
  }
}

document.getElementById('encrypt-input').addEventListener('change', handleFileSelect, false);

if (isAdvancedUpload) {
  var droppedFiles = false;
  var $dropArea = $("div.upload");
  $dropArea.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
  })
  .on('dragover dragenter', function() {
    $dropArea.removeClass('error');
    $dropArea.addClass('is-dragover');
  })
  .on('dragleave dragend drop', function() {
    $dropArea.removeClass('is-dragover');
  })
  .on('drop', function(e) {
    droppedFiles = e.originalEvent.dataTransfer.files;
    handleFileSelect(droppedFiles)
  });
}


function processFiles(passphrase) {
  for(var i = 0; i<_files.length; i++) {
    var file = _files[i];
    if(_workingFiles.indexOf(file.hash) != -1) continue; // file ya procesado, skip this
    _workingFiles.push(file.hash);
    $("li#"+file.hash+" div.actions").hide();
    updateProcessStatus(file.hash, "encrypting");
    var reader = new FileReader();
    reader.onload = (function(eFile) {
      return function(e) {
        try {
          var overrideType = "application/octet-stream";
          var encrypted = CryptoJS.AES.encrypt(e.target.result, passphrase);
          var encryptedFile = new Blob([encrypted], {
             type: overrideType
          });
          
          var f = { name:eFile.name, type:eFile.type, size:encryptedFile.size, timestamp:eFile.lastModified };
          s3_upload(f, encryptedFile, eFile.hash);
        } 
        catch(err) {
          console.log(err)
        }

      }
    })(file);
    reader.readAsDataURL(file);
  }
}

$(".button.process").click(function(e) {
  e.preventDefault();
  
 var $emailElement = $(".destination-email");
 var $emailErr = $(".destination-email .error-msg");
 $emailElement.removeClass("error");
  
  var $passElement = $(".passphrase");
  var $err = $(".passphrase .error-msg");
  $passElement.removeClass("error");
  
  var passphrase = $('input[ref=password]').val() || null;
  if(!passphrase) {
    $passElement.addClass("error");
    if(locale == 'es') {
      $err.text("Ingresa una contraseña o genera una");
    } else {
      $err.text("Please choose a passphrase or generate one");
    }
    return
  }
  if(passphrase.length < 6) {
    $passElement.addClass("error");
    if(locale == 'es') {
      $err.text("La contraseña debe contener al menos 6 caracteres");
    } else {
      $err.text("Passphrase should have at least 6 chars");
    }
    return 
  }
  var email = $('input[type=email]').val() || null;
  if(!email) {
    $emailElement.addClass("error");
    if(locale == 'es') {
      $emailErr.text("Ingresa una dirección de correo electrónico destino");
    } else {
      $emailErr.text("Please choose a destination email address");
    }
    return
  }
  if(_files.length == 0) {
    if(locale == 'es') {
      return handleErrorMsgs("Debes seleccionar al menos un archivo!");
    } else {
      return handleErrorMsgs("You have to select al least one file!");
    }
  }
 /*** FIN DE VALIDACIONES ***/

  // _pHash = CryptoJS.MD5(passphrase).toString();
  _secret = CryptoJS.AES.encrypt(_seed, passphrase).toString();
  _tempPass = passphrase;
	_tempEmail = email;
  
  if(_files.length > 0) {
    $('input[ref=password]').attr("disabled",true);
		$('input[type=email]').attr("disabled",true);
    var validatedData = { "seed":_seed, "secret":_secret, "email":email }
    $.ajax({
        type: "POST",
        url: "/new",
        data: JSON.stringify(validatedData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) { 
          if(data.status == "success") {
            _msgId = data.msgid;
            processFiles(passphrase);
          }
          if(data.status == "error") {
						if(data.location == "email") {
							$('input[type=email]').attr("disabled",false);
						}
            $emailElement.addClass("error");
            $emailErr.text(data.msg);
          }
        },
        failure: function(err) { alert(err); }
    });
  }
})

// Esta funcion se utiliza para actualizar el estado del progreso del upload
function updateProcessStatus(elementId, newStatus) {
  var $status = $("#"+elementId+" .progress");
  $status.removeClass("waiting encrypting uploading finishing complete")
  $status.addClass(newStatus)
}

// Se llama desde S3 luego de finalizar el upload de un archivo
// Esta funcion se utiliza para actualizar el mensaje en la base de datos
// Se valida el ID del mensaje y el hash del passphrase
function finishUploadProcess(updatedData, elementId) {
  $.ajax({
      type: "POST",
      url: "/m/"+_msgId+"/update",
      data: JSON.stringify(updatedData),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data) { 
        if(data.status == "success") updateProcessStatus(elementId, "complete")
        if(data.status == "error") {
          // var $progressBar = $("#"+elementId+" .progress .progress-bar");
          // $progressBar.css('background-color','#d9534f');
          updateProcessStatus(elementId, "error");
          console.log(data.msg)
        }
      },
      failure: function(err) { alert(err); }
  });
}

// Se llama desde S3 luego de finalizar el upload de un archivo
// Esta funcion se encarga de agregar el nuevo archivo finalizado de upload
// al array de completados. Luego se comprueba si las tareas de la pagina
// se encuentran finalizadas comparando contra el array de _workingFiles
function addFile2Completed(fileHash) {
  if(_completedFiles.indexOf(fileHash) == -1) _completedFiles.push(fileHash);
  if(_errorFiles.length > 0) { // Hay errores
    for(var i = 0; i<_errorFiles.length; i++) {
      var file = _errorFiles[i];
      var fileIndex = _workingFiles.indexOf(file);
      if( fileIndex != -1) {
        _workingFiles.splice(fileIndex, 1);
      }
    }
    _errorFiles.length = 0; // Reinicio el array
    // TODO. Habilitar el boton de submit y avisarle al usuario que pruebe otra vez
  }
  if(_completedFiles.length >= _workingFiles.length && _errorFiles.length == 0) {
    console.log("Listop!!!")
    var updatedData = { 
     "action": "closeMessage",
     "secret":_secret
   }
    $.ajax({
        type: "POST",
        url: "/m/"+_msgId+"/update",
        data: JSON.stringify(updatedData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) { 
          if(data.status == "success") {
            $("fieldset.success-message a.encrypted-files-link").attr("href",data.link);
            $("fieldset.success-message a.encrypted-files-link").text(_baseUrl+data.link);
            $("fieldset.success-message p.encrypted-files-pass span").text(_tempPass);
						$("fieldset.success-message #email-account").text(_tempEmail);
            _tempEmail, _tempPass = "nothing to see here";
            
            setTimeout(function() {
              $("fieldset.service").hide();
              $("fieldset.success-message").show();
            },1200)
            console.log("ready"); //window.location.href = data.redirect;
          }
          if(data.status == "error") {
            // var $progressBar = $("#"+elementId+" .progress .progress-bar");
            // $progressBar.css('background-color','#d9534f');
            updateProcessStatus(elementId, "error");
            console.log(data.msg)
          }
        },
        failure: function(err) { alert(err); }
    });
  }
}

// Esta funcion se utiliza para subir los archivos a S3
// Primero se firma la peticion y luego se hace el upload
function s3_upload(file, efile, elementId) {
  // var elementId = document.getElementById(eId);
  var fileName = randomString(20)+'.encrypted';
  var $progressBar = $("#"+elementId+" .progress .progress-bar");
  // var $progressText = $("#"+eId+" .progress-text");
  var s3upload = new S3Upload({
    s3_object_name: _msgId,
    file_dom_selector: efile,
    s3_sign_put_url: '/sign-upload/'+fileName, // uso un nombre random para ocultar el real
    onProgress: function(percent, message) {
     	// $('#creation-progress').show();
     	if(percent > 40) updateProcessStatus(elementId, "uploading"); // Muestro el cartel de encrypting por mas tiempo
      $progressBar.css('width', percent + '%');
      // $progressText.text(message+'   '+percent + "%");
    },
    onFinishS3Put: function(public_url) {
      console.log("File uploaded successfully");
      $progressBar.css('width','100%');
      updateProcessStatus(elementId, "finishing")
      $progressBar.removeClass("progress-bar-striped active");
      var updatedData = { 
        "action": "addFile",
        "secret":_secret, 
        "public_url":public_url, 
        "name":file.name, 
        "hashName":fileName,  
        "size": file.size,
        "type": file.type,
        "timestamp": file.timestamp
      }
      addFile2Completed(elementId);
      finishUploadProcess(updatedData, elementId);
    },
    onError: function(status) {
      _errorFiles.push(elementId); // Agrego el archivo al array de errores
      // $progressBar.css('background-color','#d9534f');
		  $progressBar.css('width','100%');
		  updateProcessStatus(elementId, "error")
      // $progressText.text("Error uploading files: "+status);
      // var link = "/m/"+msgid+"/edit";
		  // window.location.href = link;
      if(locale == 'es') {
        var errorMsg = 'Error subiendo archivo. Detalle: '+status;
      } else {
        var errorMsg = 'Error uploading file. Details: '+status;
      }
      console.log(errorMsg);
      alert(errorMsg)
    }
  });
}