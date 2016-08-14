


$(function () {	
	var wishId = $('#wishId').val();
	
	$('#update').click(function(){
		var wishData = checkForm();
		wishData = JSON.stringify(wishData);
		console.log("w",wishData);
		
		//wishData.tags = $("#tags").tagsinput('items');
		$.ajax({
			url: '/wish/edit/'+wishId,
			type: 'PUT',
			contentType: 'application/json',
			data: wishData,
			done:function(err,cb){
				console.log(err,cb);
			},
			success:function(){
				console.log("wish updated");
			}
		})
		return false;
	});
	
	
	
})

function checkForm() {
	var wishData = $('form#editWishForm').serializeObject();
	var gradeArray = [];
	$( '#gradeList :selected' ).each( function( i, selected ) {
		$( selected ).val();
		gradeArray.push( $( selected ).text() );
		
	});
	wishData.for_grade = gradeArray;
	console.log(wishData);
	return wishData;
}
