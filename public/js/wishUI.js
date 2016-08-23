


$(function () {

	$('#wishURL').on('blur',function(){
		if ( $(this).val().match(regexURL) ) {
			var postData = {
				_csrf: $('#csrf').val(),
				URL: $("#wishURL").val()
			};
			console.log(JSON.stringify(postData));
			$.ajax({
				url: '/urlData',
				type: 'POST',
				data: postData,
				success: function(data){
					$('#imageURL').val(data.image);
					console.log("success:",data,$('#wishTitle').val());
					if (!$.trim($('#wishTitle').val())) {
						$('#wishTitle').val(data.title);
					} else {
						console.log("There is already input in this field",$('#wishTitle').val());
					}
					
				},
				done:function(err,cb){
					console.log(err,cb);
				},
			})
		} else {
			console.log("not a URL");
		}
	});

	var param_URL = decodeURIComponent($.urlParam('url'));
	var param_title = decodeURIComponent($.urlParam('title'))
	if (isValidURL(param_URL)) {
		$('#wishURL').val(param_URL);
		if (param_title) {
			$('#wishTitle').val(param_title);
		}
	} else {
		console.log("Invalid URL",param_URL);
	}
	
	var timer, delay = 500;
	$('#wishURL').bind('keydown blur change', function(e) {
		var _this = $(this);
		clearTimeout(timer);
		timer = setTimeout(function() {
		    getPageTitle();
		}, delay );
	});
	
	$('#neededBefore').datepicker();	
	
	 $('#gradeList').multiselect({
		 nonSelectedText: "Select Grade(s):"
	 });
	$('#test').click(function(){
		checkForm(function(w){
			console.log(w);
		});
	})
	var populatedTags = $('#tagsValue').val();
	$('#tags').tagsManager({
		hiddenTagListId: 'tagsValue',
		prefilled: populatedTags,
		tagsContainer: $('#tagsContainer')
	});
	
	
	$('.wishTypeBtns').on('click',function(e){
		var buttonClicked = e.target.innerHTML;
		$('.wishTypeBtns').each(function(el){
			if (buttonClicked == $(this).html()) {
				$(this).addClass('btn-success');
				wishType = buttonClicked;
			} else {
				$(this).removeClass('btn-success');
				
			}
		})
	})
	
	$('#add').click(function(){
		//var wishData = $('form#wishForm').serializeJSON();
		checkForm(function(data){
			
			wishData = JSON.stringify(data);
			console.log("w",wishData);
			//wishData.tags = $("#tags").tagsinput('items');
			$.ajax({
				url: '/wishes',
				type: 'POST',
				contentType: 'application/json',
				data: wishData,
				done:function(err,cb){
					console.log(err,cb);
				},
				success:function(){
					showList();
					resetForm($('#wishForm'));
					$('.btn-success').removeClass('btn-success');
					$('#gradeList').val('');
					wishType = 'wish';
					
				}
			})
		});
		return false;
	});
	
	
	$('#update').click(function(){
		var wishId = $('#wishId').val();
		checkForm(function(wishData){
			wishData.wishId = wishId;
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
			
		});
		return false;
	});
	
})

function checkForm(thenDo) {
	var wishData = $('form#wishForm').serializeObject();
	var gradeArray = [],
		wType = 'want';
	$( '#gradeList :selected' ).each( function( i, selected ) {
		//$( selected ).val();
		gradeArray.push( $( selected ).text() );
	});
	$('.wishTypeBtns').each(function(i, el){
		//console.log(el);
		if ( $( el ).hasClass('btn-success') ) {
			wType = $(el).val();
			console.log(wType);
		}
	});
	wishData.wishType = wType;
	wishData.neededBefore = new Date( $('#neededBefore').val() );
	wishData.forGrade = gradeArray;
	wishData._csrf = $('#csrf').val();
	if (!!thenDo) {
		thenDo(wishData);
	} else {
		console.log(wishData);
	}

}

function getPageTitle(){
	var theURL = $("#wishURL").val();
	if (!isValidURL(theURL)) {
		console.log("Not valid", theURL);
	}
	var postData = {
		_csrf: $('#csrf').val(),
		URL: theURL
	};
	console.log(JSON.stringify(postData));
	$.ajax({
		url: '/urlData',
		type: 'POST',
		data: postData,
		success: function(data){
			console.log("success:",data,$('#wishTitle').val());
			if (!$.trim($('#wishTitle').val())) {
				$('#wishTitle').val(data.title);
			} else {
				console.log("There is already input in this field",$('#wishTitle').val());
			}
			
		},
		done:function(err,cb){
			console.log(err,cb);
		},
	})
}
function getMultipleSelectVals( id ){
  $( '#' + id + ' :selected' ).each( function( i, selected ) {
      vals[i] = $( selected ).val();
      textvals[i] = $( selected ).text();
  });
}




var wishType = 'want';

function deleteWish(_id) {
	$.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
    }
  });
	$.ajax({
	    url: "/wish/"+_id, 
	    type: "DELETE",
	    success: function (data, textStatus, jqXHR) { 
	        console.log("Post resposne:"); 
	        console.dir(data); 
	        console.log(textStatus); 
	        console.dir(jqXHR); 
	        showList();
	    }
	});
}
