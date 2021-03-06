$(function () {
	showList();
});
function showList() {
	$.getJSON('/listWishes', function(data){
		console.log(data);
/*
		var dataObj = data.reduce(function(o, v, i) {
			o[i] = v;
			return o;
		}, {});
*/
		var array = [];
		array.push(data);

		var ractive = new Ractive({
		  el: '#ractiveList',
		  template: '#template',
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
    return moment(timeString).format('MMMM Do YYYY, h:mm a');
}
helpers.formatDate = function(timeString){
    return moment(timeString).format('MMMM Do YYYY');
}
helpers.humanizeTime = function(timeString){
    return moment.duration(timeString).humanize();
}
