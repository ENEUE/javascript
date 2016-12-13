$(document).ajaxSuccess(function(evnt, xhr, settings) {
	if(settings.url == "https://raw.githubusercontent.com/ENEUE/eneue.github.io/gh/raffle.js"){
        window.raffleParticipants = JSON.parse(xhr.responseText);
        $.each(window.raffleParticipants, function(key, data) {
        	var tableRaffle = $('#raffleParticipantsTable');
        	var tableRow = $('<tr/>')
             	.addClass('ui-tr')
              	.appendTo(tableRaffle);
            var tableItem = $('<td/>')
            	.addClass('ui-td-mail')
            	.text(key)
            	.appendTo(tableRow);
        	$.each(data, function(index, datae) {
        		if(datae == "true") {
        			datae = "Sí";
        		} else if (datae == "false") {
        			datae = "No";
        		}
        		tableItem = $('<td/>')
            		.addClass('ui-td')
            		.text(datae)
            		.appendTo(tableRow);
        	});
        });
     	$("#raffleParticipantsTable").tablesorter({sortList: [[1,0]]});
    }
});
  
var url_raffle = "https://raw.githubusercontent.com/ENEUE/eneue.github.io/gh/raffle.js"
$.ajax({
  type: 'GET',
  dataType: 'text', //use jsonp data type in order to perform cross domain ajax
  crossDomain: true,
  url: url_raffle}) ;
