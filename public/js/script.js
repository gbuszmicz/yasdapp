$(function(){

	var body = $('body'),
		stage = $('#stage'),
		back = $('a.back');

	/* Step 1 */

	$('#step1 .encrypt').click(function(){
		body.attr('class', 'encrypt');

		// Go to step 2
		step(2);
	});

	$('#step1 .decrypt').click(function(){
		body.attr('class', 'decrypt');
		step(2);
	});


	/* Step 2 */


	$('#step2 .button').click(function(){
		// Trigger the file browser dialog
		$(this).parent().find('input').click();
	});


	// Set up events for the file inputs

	var file = null;

	$('#step2').on('change', '#encrypt-input', function(e){

		// Has a file been selected?

		if(e.target.files.length!=1){
			alert('Please select a file to encrypt!');
			return false;
		}

		file = e.target.files[0];

		if(file.size > 1024*1024){
			alert('Please choose files smaller than 1mb, otherwise you may crash your browser. \nThis is a known issue. See the tutorial.');
			return;
		}

		step(3);
	});

	$('#step2').on('change', '#decrypt-input', function(e){

		if(e.target.files.length!=1){
			alert('Please select a file to decrypt!');
			return false;
		}

		file = e.target.files[0];
		step(3);
	});


	/* Step 3 */


	$('a.button.process').click(function(){

		var input = $(this).parent().find('input[type=password]'),
			a = $('#step4 a.download'),
			password = input.val();

		input.val('');

		if(password.length<5){
			alert('Please choose a longer password!');
			return;
		}

		// The HTML5 FileReader object will allow us to read the 
		// contents of the	selected file.

		var reader = new FileReader();

		if(body.hasClass('encrypt')){

			// Encrypt the file!

			reader.onload = function(e) {

				// Use the CryptoJS library and the AES cypher to encrypt the 
				// contents of the file, held in e.target.result, with the password
				var encrypted = CryptoJS.AES.encrypt(e.target.result, password);

				// The download attribute will cause the contents of the href
				// attribute to be downloaded when clicked. The download attribute
				// also holds the name of the file that is offered for download.

				a.attr('href', 'data:application/octet-stream,' + encrypted);
				a.attr('download', file.name + '.encrypted');
				
				// Hacer algo aca para onClick s3_upload(msgid);
				s3_upload('28ushys6', encrypted, file.name);

				step(4);
			};

			// This will encode the contents of the file into a data-uri.
			// It will trigger the onload handler above, with the result

			reader.readAsDataURL(file);
		}
		else {

			// Decrypt it!

			reader.onload = function(e){

				var decrypted = CryptoJS.AES.decrypt(e.target.result, password)
										.toString(CryptoJS.enc.Latin1);

				if(!/^data:/.test(decrypted)){
					alert("Invalid pass phrase or file! Please try again.");
					return false;
				}

				a.attr('href', decrypted);
				a.attr('download', file.name.replace('.encrypted',''));

				step(4);
			};

			reader.readAsText(file);
		}
	});


	/* The back button */


	back.click(function(){

		// Reinitialize the hidden file inputs,
		// so that they don't hold the selection 
		// from last time

		$('#step2 input[type=file]').replaceWith(function(){
			return $(this).clone();
		});

		step(1);
	});


	// Helper function that moves the viewport to the correct step div

	function step(i){

		if(i == 1){
			back.fadeOut();
		}
		else{
			back.fadeIn();
		}

		// Move the #stage div. Changing the top property will trigger
		// a css transition on the element. i-1 because we want the
		// steps to start from 1:

		stage.css('top',(-(i-1)*100)+'%');
	}
	
	function s3_upload(msgid, file, file_name) {
    var s3upload = new S3Upload({
      s3_object_name: msgid,
      file_dom_selector: 'encrypt-input',
      s3_sign_put_url: '/sign-upload/'+file_name,
      onProgress: function(percent, message) {
        $('.progress-bar').css('background-color','#01BE8E');
       	$('#creation-progress').show();
		    $('.progress-bar').css('width', percent + '%');
				$('.progress-text').text(message+'   '+percent + "%");
      },
      onFinishS3Put: function(public_url) {
        console.log("File uploaded successfully");
		    $('.progress-bar').css('width','100%');
				$('.progress-text').text(public_url);
				var action = '/m/'+msgid+'/update';
				
				$.post(action, { link:public_url }, function(data) {
					if(typeof(data) !== 'undefined') {
	          if(data.status == 'Error') {
							console.log(data.err)
							if(confirm("Error subiendo archivo. Volver a intentar") == true) {
								var link = "/m/"+msgid+"/edit";
					      // window.location.href = link;
							} else {
								// window.location.href = "/";
							}
						}
	        	if(data.status == 'Success') {
							console.log("Success!!")
						}
					}
				});
      },
      onError: function(status) {
        $('.progress-bar').css('background-color','#d9534f');
				$('.progress-bar').css('width','100%');
				$('.progress-text').text("Error uploading files: "+status);
				var link = "/m/"+msgid+"/edit";
				// window.location.href = link;
        console.log('Error uploading image. Details: '+ status);
      }
    });
	}
});
