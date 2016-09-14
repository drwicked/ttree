
function urgencyName(p){
	if (p<=25) { return "Not very urgent" };
	if (p<=50) { return "Somewhat urgent" };
	if (p<=75) { return "Quite urgent" };
	if (p<=100) { return "Critically important" };
};

$(function () {

	var param_URL = decodeURIComponent($.urlParam('url'));
	var param_title = decodeURIComponent($.urlParam('title'))
	if (isValidURL(param_URL)) {
		$('#wishURL').val(param_URL);
		//$('#storeName').val(domainFromUrl(param_URL));
		if (param_title) {
			//$('#wishTitle').val(param_title);
		}
			getPageData(param_URL);
		doDelay(function(){
			
		})
	} else {
		console.log("Invalid URL",param_URL);
	}
	
	var timer, delay = 500;
	
	$('#wishURL').bind('keydown blur change paste', function(e) {
		doDelay(function(){
		    getPageData();
		});
	});
	
	
	$('#neededBefore').datepicker({
	    startDate: '+3d',
	    todayHighlight: true
	});
	$('#neededBefore').on('changeDate', function(){
		$('#neededBeforeDate').val(
			$('#neededBefore').datepicker('getFormattedDate')
		).trigger('change');
	})
	
	
	$('#next').click(function(e){
		nextGuide();
	}).hide();
	
	$('#storeName').keyup(function(){
		doDelay(function(){
			$('#2').show();
		})
	});
	$('#wishTitle').keyup(function(){
		doDelay(function(){
			$('#3').show();
			$('#3a').show();
			$('#3b').show();
		})
	});
	$('#neededBeforeDate').on('change',function(){
		$('#4').show();
		$('#4a').show();
		$('#description').focus();
		$('#description').keyup(function(){
			doDelay(function(){
				$('#addWrap').show();
				
			})
		});
	})
	
	$('#urgency').slider({
		formatter: function(v) {
			$('#urgencyLabel').html( urgencyName(v) );
			return urgencyName(v) + ': '+ v;
		}
	});
	
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
		console.log("add clicked");
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
				success:function(wid){
					//showList();
					window.location.href = '/wishes';
					//resetForm($('#wishForm'));
					//$('.btn-success').removeClass('btn-success');
					//$('#gradeList').val('');
					//wishType = 'wish';
					//$('#status').html("Wish added! ")
					
				}
			})
		});
		//return false;
	});
	
	
	$('#update').click(function(){
		$('#spinner').show();
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
				success:function(msg){
					$('#status').html("Wish updated successfully.")
					console.log("wish updated",msg);
					$('#spinner').hide();
				}
			})
			
		});
		return false;
	});
	
})

var currentGuide = 1;
function nextGuide() {
	currentGuide++;
	$('#'+currentGuide).show();
	$('#'+currentGuide+" > input" ).focus();
}

var timeout = undefined;
function doDelay(cb){
	//$("#"+el).keyup(function() {
	if(timeout != undefined) {
		clearTimeout(timeout);
	}
	timeout = setTimeout(function() {
		timeout = undefined;
		cb();
	}, 400);
	//});
}

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
	wishData.urgency = parseInt($('#urgency').val());
	wishData.neededBefore = new Date( $('#neededBeforeDate').val() );
	wishData.forGrade = gradeArray;
	wishData._csrf = $('#csrf').val();
	if (!!thenDo) {
		thenDo(wishData);
	} else {
		console.log(wishData);
	}

}
function domainFromUrl(data) {
  var    a      = document.createElement('a');
         a.href = data;
  return a.hostname;
}

function getPageData(url){
	var theURL = url || $("#wishURL").val();
	
	if ( theURL.match(regexURL) ) {
		$('#storeName').val(domainFromUrl(theURL));
		var postData = {
			_csrf: $('#csrf').val(),
			URL: $("#wishURL").val()
		};
		console.log(JSON.stringify(postData));
		$('#2').show();
		$('#3').show();
		$('#3a').show();
		$('#3b').show();
		
		$('#spinner').show();
		
		$.ajax({
			url: '/urlData',
			type: 'POST',
			data: postData,
			success: function(data){
				$('#imageURL').val(data.image);
				$('#spinner').hide();
				console.log("success:",data);
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
	
/*
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
*/
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
	    }
	});
}
