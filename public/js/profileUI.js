$(function () {
	$('form#uploadProfileImage').submit(function(event){
		event.preventDefault();
		var formData = new FormData($(this)[0]);
		 $.ajax({
            url: '/upload',
            data: formData,
            type: 'post',
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (data) {
                console.log(data.filename);
                $('#profileImageURL').val(data.filename);
            },
        });
	})
})