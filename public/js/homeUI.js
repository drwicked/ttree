


$(function () {
	showList();
	console.log("homeui");
})
function showList() {
	$.getJSON('/listWishes', function(data){
		var dataObj = data.reduce(function(o, v, i) {
			o[i] = v;
			return o;
		}, {});
		console.log(data,dataObj);
		var ractive = new Ractive({
		  el: '#wishView',
		  template: '#wishView_template',
		  data: {
			  wishes:data
			  
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
