$(function () {
	$('input:file').change(function(){
		//event.preventDefault();
		var formData = new FormData($("#uploadProfileImage")[0]);
		console.log(formData);
		 $.ajax({
            url: '/upload',
            data: formData,
            type: 'post',
            //async: false,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (data) {
                console.log(data.filename);
                $('#profileImageURL').val(data.filename).trigger('change');
                $('#imgBg').css('background','url("/img/p/'+data.filename+'")');
                $('#imgBg').css('background-size', '128px 128px');
                $('#hasProfileImage').val(true);
            },
        });
	})
	$('#uploadNewProfileImage').click(function(){
		$('#filePick').trigger('click');
	})
	$('#updateProfile').prop('disabled',true);
	$('#profileForm :input').on('change input',function(){
		$('#updateProfile').prop('disabled',false).addClass('btn-success');
	})
	$('#uploadNewSecondaryImage').click(function(){
		$('#filePickSecondary').trigger('click');
	})
})