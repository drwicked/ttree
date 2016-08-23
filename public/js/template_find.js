$(function () {
	var searchRequest = null;

    var minlength = 3;

    $("#search").keyup(function () {
        var that = this,
        value = $(this).val();
		var searchType = 'teacher';
        if (value.length >= minlength ) {
            if (searchRequest != null) 
                searchRequest.abort();
            searchRequest = $.ajax({
                type: "GET",
                url: "/find/"+searchType,
                data: {
                    'search' : value
                },
                dataType: "text",
                success: function(msg){
                    //we need to check if the value is the same
                    console.log(msg);
                    if (value==$(that).val()) {
                    //Receiving the result of search here
                    }
                }
            });
        }
    });
});
function showList() {
	
	$('#searchSubmit').on('click',function(){
		var query = $('#search').val();
		$.getJSON('/wishlist', function(data){
			var ractive = new Ractive({
			  el: '#ractiveList',
			  template: '#template',
			  data: {
				  wishes:dataObj
				  
			  }
			})
			$('.tip').tooltipster({
				theme: 'tooltipster-light',
				side: 'bottom'
			});
			$('.clickableTip').tooltipster({
				theme: 'tooltipster-light',
				side: 'bottom',
				interactive: true
			});
		});
	});
}

var helpers = Ractive.defaults.data;
helpers.fromNow = function(timeString){
    return moment(timeString).fromNow()
}
helpers.formatTime = function(timeString){
    return moment(timeString).format("ddd, h:mmA");
}
helpers.humanizeTime = function(timeString){
    return moment.duration(timeString).humanize();
}
