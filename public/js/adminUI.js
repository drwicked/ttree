$(function () {
	$('#mainMenu li a').click(function(e){
		var tDiv = $(this).attr('name');
		$('.page').hide();
		$(tDiv).show();
	})
})