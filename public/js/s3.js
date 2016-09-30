var previewNode = document.querySelector("#template");
previewNode.id = "";
var previewTemplate = previewNode.parentNode.innerHTML;
previewNode.parentNode.removeChild(previewNode);

var app = {};
app.signS3RequestURL = '/sign-upload';
app.S3_BUCKET = 'http://securesend.s3.amazonaws.com/';
app._dropzoneAcceptCallback = function _dropzoneAcceptCallback(file, done) {
	console.log("_dropzoneAcceptCallback")

	var totalFiles = this.files.length || 0;
	var maxfiles = this.options.maxfiles;
	var isDuplicated = false;
	
	console.log(totalFiles)
	console.log(maxfiles)
	
	if(totalFiles > maxfiles) {
		this.emit("maxfilesreached", file);
		return done();
	}

	reader = new FileReader();
  reader.onload = handleReaderLoad;
	var _this = this;
  function handleReaderLoad(e) {
	
	
		// var key = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
		// var iv  = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');
		// console.log(this.result)
		// var wordArray = CryptoJS.lib.WordArray.create(this.result);
		// // console.log(wordArray)
		// if(file.sarasa != "sisi") {
		// 	var encrypted = CryptoJS.AES.encrypt(
		// 	        //convert to a word array via CryptoJS. 'this' is the file reader.
		// 	        this.result, 
		// 	        //our server generated key happens to be in Base64. 
		// 	        //We need to convert it to a word array
		// 	        "sarasa");
		// 			// var blob = new Blob([encrypted], {type: file.type });
		// 			// _this.removeFile(file);
		// 			// _this.addFile(blob)
		// 			// console.log(blob.type)
		// 			console.log(encrypted)
		// 			file.sarasa = "sisi";
		// 			console.log(file)
		// 			var parseFile = new Parse.File(file.name, encrypted);
		// 			_this.removeFile(file);
		// 			_this.addFile(parseFile)
		// 			return done();
		// }
    // var encrypted = CryptoJS.AES.encrypt(
    //     //convert to a word array via CryptoJS. 'this' is the file reader.
    //     wordArray, 
    //     //our server generated key happens to be in Base64. 
    //     //We need to convert it to a word array
    //     "sarasa", 
    //     {
    //         // iv was created on our server with the key 
    //         iv: "CryptoJS" 
    //     });
    // 				// var blob = new Blob([encrypted], {type: file.type });
    // 				// _this.removeFile(file);
    // 				// _this.addFile(blob)
    // 				// console.log(blob.type)
    // 				console.log(encrypted)
    // 				file.sarasa = true;
    // 				console.log(file)
				
			// console.log(e.target.result)
			// var password = $("input[ref=password]").val();
			// var encrypted = CryptoJS.AES.encrypt(e.target.result, "password");
			// e.target.result = encrypted;
			// console.log(e.target)
			// var newFile = e;
			// var toEncrypt = e.target.result
			// console.log(toEncrypt)
			// e.target.result = CryptoJS.AES.encrypt(toEncrypt, "password");
			
			// console.log(e.target.result)
			// console.log(file)
			file.postData = [];
					  $.ajax({
					    url: app.signS3RequestURL,
					    data: {
					      name: file.name,
					      type: file.type,
					      size: file.size,
					      _csrf: $('#__createPostToken').val() // this is not needed to make Dropzone work, it's express related
					    },
					    type: 'POST',
					    success: function jQAjaxSuccess(response) {
					      response = JSON.parse(response);
					      file.custom_status = 'ready';
					      file.postData = response;
					      file.s3 = response.key;
								file.src = CryptoJS.AES.encrypt(e.target.result, "password");
					      // $(file.previewTemplate).addClass('uploading');
					      done();
					    },
					    error: function(response) {
					      file.custom_status = 'rejected';
					      if (response.responseText) {
					        response = JSON.parse(response.responseText);
					      }
					      if (response.message) {
					        done(response.message);
					        return;
					      }
					      done('error preparing the upload');
					    }
					  });
	}
  reader.readAsDataURL(file);

};

app._dropzoneSendingCallback = function(file, xhr, formData) {
	console.log("_dropzoneSendingCallback")
	// console.log("File src: "+file.src)
	// processFile(file, function(err, f) {
	// 	if(err) return err
	// 	console.log(f)
		
		$.each(file.postData, function(k, v) {
	    formData.append(k, v);
	  });
		console.log(formData)
	  formData.append('Content-type', '');
	  formData.append('Content-length', '');
	  formData.append('acl', 'public-read');
	// })
  // $.each(file.postData, function(k, v) {
  //   formData.append(k, v);
  // });
  // formData.append('Content-type', '');
  // formData.append('Content-length', '');
  // formData.append('acl', 'public-read');
};

app._dropzoneProcessCallback = function(file) {
	console.log("_dropzoneProcessCallback")
	console.log("-----------")
	// console.log(app.dropzone.files.getAcceptedFiles());
	console.log("-----------")
	// console.log(this.dropzone.files.getQueuedFiles())
	// console.log(file)
	// file.postData = [];
	//   $.ajax({
	//     url: app.signS3RequestURL,
	//     data: {
	//       name: file.name,
	//       type: file.type,
	//       size: file.size,
	//       _csrf: $('#__createPostToken').val() // this is not needed to make Dropzone work, it's express related
	//     },
	//     type: 'POST',
	//     success: function jQAjaxSuccess(response) {
	//       response = JSON.parse(response);
	//       file.custom_status = 'ready';
	//       file.postData = response;
	//       file.s3 = response.key;
	//     },
	//     error: function(response) {
	//       file.custom_status = 'rejected';
	//       if (response.responseText) {
	//         response = JSON.parse(response.responseText);
	//       }
	//       if (response.message) {
	//         done(response.message);
	//         return;
	//       }
	//       done('error preparing the upload');
	//     }
	//   });
	
}

app._dropzoneCompleteCallback = function(file) {
	console.log("_dropzoneCompleteCallback")
  var json = {
    url: app.S3_BUCKET + file.postData.key,
    originalFilename: file.name
  };
  console.log(json, JSON.stringify(json), JSON.stringify(json).replace('"', '\"'));
}

app._dropzoneThumbnailCallback = function(file, dataUri) {
	console.log("_dropzoneThumbnailCallback")
	// console.log(dataUri)
	// var encrypted = CryptoJS.AES.encrypt(dataUri, 'ascxee0');
	// dataUri = encrypted;
	// return encrypted
}

app._dropzoneMaxfilesexceededCallback = function(file) {
	console.log("_dropzoneMaxfilesexceededCallback")
	this.removeFile(file);
}


app.setupDropzone = function setupDropzone() {
  if ($('div#dropzone').length === 0) {
    return;
  }
  Dropzone.autoDiscover = false;
  app.dropzone = new Dropzone("div#dropzone", {
    url: app.S3_BUCKET,
    method: "post",
    autoProcessQueue: false, // Para que no suba automaticamente
    clickable: true, // Click to upload
    maxfiles: 2,
    parallelUploads: 2,
    maxFilesize: 5, // in mb
		// createImageThumbnails: false,
		previewTemplate: previewTemplate,
		previewsContainer: "#previews", // Define the container to display the previews
		
    // maxThumbnailFilesize: 8, // 3MB
    // thumbnailWidth: 0,
    // thumbnailHeight: 0,
    // acceptedMimeTypes: "image/bmp,image/gif,image/jpg,image/jpeg,image/png",
    accept: app._dropzoneAcceptCallback,
    sending: app._dropzoneSendingCallback,
    complete: app._dropzoneCompleteCallback,
		thumbnail: app._dropzoneThumbnailCallback,
		processing: app._dropzoneProcessCallback,
		maxfilesreached: app._dropzoneMaxfilesexceededCallback
  });
};

app.startup = function startup() {
  app.setupDropzone();
}
$(document).ready(app.startup);

$("#testingbutton").click(function() { 
	console.log(app.dropzone.files);
	// var f = app.dropzone.files;
	// console.log(f[0])
	// var e = CryptoJS.AES.encrypt(f[0], "password");
	// app.dropzone.addFiles(e)
	// console.log($("input[type=file]")[0].files)
	app.dropzone.processQueue(); 
})

function processFile(file, callback) {
	file.postData = [];
	  $.ajax({
	    url: app.signS3RequestURL,
	    data: {
	      name: file.name,
	      type: file.type,
	      size: file.size,
	      _csrf: $('#__createPostToken').val() // this is not needed to make Dropzone work, it's express related
	    },
	    type: 'POST',
	    success: function jQAjaxSuccess(response) {
	      response = JSON.parse(response);
	      file.custom_status = 'ready';
	      file.postData = response;
	      file.s3 = response.key;
				callback(null, file);
	    },
	    error: function(response) {
	      file.custom_status = 'rejected';
	      if (response.responseText) {
	        response = JSON.parse(response.responseText);
	      }
	      if (response.message) {
	        done(response.message);
	        return;
	      }
				callback('error preparing the upload', null)
	    }
	  });
}


var handleFileSelect = function(file_element) {
  var f, files, output, _i, _len, _results;
  files = file_element.files;
  output = [];
  _results = [];
  for (_i = 0, _len = files.length; _i < _len; _i++) {
    f = files[_i];
    console.log(f)
  }
};

var getAcceptedFiles = function(files) {
  var file, _i, _len, _ref, _results;
  _ref = files;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    file = _ref[_i];
    if (file.accepted) {
      _results.push(file);
    }
  }
  return _results;
};

