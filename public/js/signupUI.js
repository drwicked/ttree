$(function () {
	
	
	
	var t;
	
	
/*
	$('#submitButton').hide();
	$('#username').on('keyup',function(){
		clearTimeout(t);
		t = setTimeout(function () {
			var usernameVal = $.trim($('#username').val());
			if (usernameVal == '') {
				console.log(usernameVal)
			} else if (usernameVal.length<4) {
				$('#usernameGroup').removeClass('has-success')
				$('#usernameGroup').addClass('has-warning')
				$('#usernameWarn').text("Username too short.");
				$('#submitButton').hide();
			} else {
				searchRequest = $.ajax({
					type: "GET",
					url: "/checkUsername/"+usernameVal,
					dataType: "text",
					success: function(msg){
						//we need to check if the value is the same
						if (msg == 200) {
							$('#usernameGroup').removeClass('has-warning')
							$('#usernameGroup').addClass('has-success')
							$('#usernameWarn').text('');
							$('#submitButton').show();
						} else {
							$('#usernameGroup').removeClass('has-success')
							$('#usernameGroup').addClass('has-warning')
							$('#usernameWarn').text("Username is taken. Try something else.");
							$('#submitButton').hide();
						}
					}
				});
				
			}
		}, 600);
	})
	$('#signupForm :input').on('keyup',function(){
		var bad = 0;
		$('#signupForm :input').each(function ()
	    {
	        if ($.trim(this.value) == "") bad++;
	    });
	    console.log(bad)
	    if ( bad == 0 ) {
			$('#usernameWarn').text('');
			$('#submitButton').show();
	    } else {
			$('#usernameWarn').text('');
			$('#submitButton').hide();
	    }
	})
*/
	
})