var endDate = "December 1, 2015 12:00:00";
$('.countdown.styled').countdown({
    date: endDate,
    render: function(data) {
        $(this.el).html("<div><h3>" + this.leadingZeros(data.days, 2) + "</h3><span>días</span></div><div><h3>" + this.leadingZeros(data.hours, 2) + "</h3><span>hrs</span></div><div><h3>" + this.leadingZeros(data.min, 2) + "</h3><span>min</span></div><div><h3>" + this.leadingZeros(data.sec, 2) + "</h3><span>seg</span></div>");
    }
});
//Ajax call invocation to store Crowdfunding Status Data
getCrowdfundingStats();


$(document).ready(function() {
    //Flag initialization
    window.perkTokenBeenCalled = false;
    window.perkButtonEnd = false;
    window.beenShared = false;
    window.libro = false;
    window.curso = false;
    window.perkToggleState = null;
});
//Ajax call definition that stores Crowdfunding Status Data
function getCrowdfundingStats() {
    var spreadsheetID = '1EFRGuZXSTLaGgTqG0Md7DTICMjXBH_2FSGmWIKsP7kg';
    var url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetID + '/od6/public/basic';
    var query = {
        alt: "json"
    };

    var request = $.ajax({
        type: 'get',
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: query,
        async: true
    });
    request.done(function(resultJson) {
        window.crowdfundingStats = new Object();
        //Loops through all the elements in myArr.feed.entry (entry is the container of data)
        var long = resultJson.feed.entry.length;
        for (var i = 0; i < long; i++) {
            var content = resultJson.feed.entry[i].content.$t;
            var title = resultJson.feed.entry[i].title.$t;
            var contentArray = content.split(",");
            var contentObject = new Object();
            var contentArrayLength = contentArray.length;
            for (var k = 0; k < contentArrayLength; k++) {
                var division = contentArray[k];
                var divisionArray = division.split(":");
                var firstChunk = divisionArray[0];
                var secondChunk = divisionArray[1];
                contentObject[firstChunk.trim()] = secondChunk.trim();
            }
            window.crowdfundingStats[title] = contentObject;
        }

    });

}
//Ajax Success function. Runs when Ajax has completed and thrown positive outcome
$(document).ajaxSuccess(function(evnt, xhr, settings) {

    $("#cfStatsAchieved1").html(window.crowdfundingStats.TOTALS.totalincome);
    $("#cfStatsSupporters1").html(window.crowdfundingStats.TOTALS.solditems);
    $("#cfStatsNeeded1").html(window.crowdfundingStats.TOTALS.minimum);
    $("#cfStatsDaysLeft1").html(window.crowdfundingStats.TOTALS.daysleft);
    //window.crowdfundingStats is an object that contains the server response
    for (var prop in window.crowdfundingStats) {
        //window.crowdfundingStats is an object that contains the server response
        if (prop.substring(0, 4) == "PERK") {
            var object = window.crowdfundingStats[prop];
            //initializes all the values to be shown on page load
            $("#div" + toTitleCase(prop) + "customDonationAmount").val(window.crowdfundingStats[prop].price);
            $("#span" + toTitleCase(prop) + "Price").html(window.crowdfundingStats[prop].price);
            $("#span" + toTitleCase(prop) + "SoldItems").html(window.crowdfundingStats[prop].solditems);
            $("#span" + toTitleCase(prop) + "TotalAvailable").html(window.crowdfundingStats[prop].itemstotalavailable);
            $("#span" + toTitleCase(prop) + "Delivery").html(window.crowdfundingStats[prop].delivery);
            $("#span" + toTitleCase(prop) + "Description").html(window.crowdfundingStats[prop].description);
            //sets the minimum value to assign to input box. This can be hacked. CHECKED ON SERVER SIDE.
            $("#" + "div" + toTitleCase(prop) + "customDonationAmount").attr("min", window.crowdfundingStats[prop].price);
            $("#" + "div" + toTitleCase(prop) + "customDonationAmount").attr("title", "Introduce una cantidad mayor de €" + window.crowdfundingStats[prop].price + ".00");
            var placeHolder = parseInt(window.crowdfundingStats[prop].price, 10) + 10;
            $("#" + "div" + toTitleCase(prop) + "customDonationAmount").attr("placeholder", "p.ej. €" + placeHolder);
        }
    }
    $("#remaining_amount").html(8000 - window.crowdfundingStats.TOTALS.totalincome);
});




//Capitalizes first letter, lower case the rest
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

//Declares the Stripe Checkout Handler and configures it
var handler = StripeCheckout.configure({
    key: 'pk_live_uWo17rHYl0BXyyKmoMtHM3aS',
    //***************************************************************IMPORTANT!!!!!!!------CHECK IMAGE STORAGE AND PARAMETERS FOR CHECKOUG**********
    image: 'https://estonoesunaescuela.squarespace.com/s/anagrama_peq_color_whitebckgrnd_small.png',
    locale: 'auto',
    currency: "EUR",
    panelLabel: "Dona {{amount}}",
    allowRememberMe: "false",
    token: function(token, args) {
        window.perkTokenBeenCalled = true;
        var redirectDomain = "https://script.google.com/macros/s/AKfycbywnXbEp_nIPvClMVyEgw_YK_IhHgqnAs9-N-sYVjufx1jPCLw/exec";
        var Query = "stripeEmail=" + token.email + "&stripeToken=" + token.id + "&amount=" + window.amountCents + "&itemID=" + window.perkCode + "&beenShared=" + window.beenShared + "&libro=" + window.libro + "&curso=" + window.curso;
        var eQuery = window.btoa(unescape(encodeURIComponent(Query)));
        var Query = {
            e: eQuery
        };
        var request = $.ajax({
            type: 'get',
            url: redirectDomain,
            jsonpCallback: 'callback',
            contentType: "application/json",
            dataType: 'jsonp',
            data: Query
        });
        request.done(function(resultJson) {
            $("#" + window.containerID).find(".perkCustomDonationAmount").hide();
            var date = new Date();
            var n = date.toLocaleDateString();
            var t = date.toLocaleTimeString();
            var now = "El día " + n + " a las " + t;
            beenHacked = resultJson.beenHacked;
            if (beenHacked) {
                $("#" + window.containerID).find(".divPerkResponse").html("Se ha producido un error en el servidor. Inténtelo más tarde.");
            } else {
                window.amountR = resultJson.amount / 100;
                window.last4 = resultJson.last4;
                window.eMail = resultJson.eMail;
                window.localizer = resultJson.localizer;
                $("#" + window.containerID).find(".perkAmountShow").html(window.amountR);
                $("#" + window.containerID).find(".perkUlt4Show").html(window.last4);
                $("#" + window.containerID).find(".perkEmailShow").html(window.eMail);
                $("#" + window.containerID).find(".perkLocalizerShow").html(window.localizer);
                $("#" + window.containerID).find(".perkDate").html(now);
                var chain = "<br>No has concursado en la rifa";
                window.perkTokenBeenCalled = false;
                window.perkButtonEnd = true;
                window.beenShared = false;
                $("#" + window.containerID).find(".perkCustomButton").html("Finalizar");
                $("#" + window.containerID).find(".perkPostFlight").show();
            }
        });
    }
});

//Calls Stripe Checkout for ANY PERK
$(".perkCustomButton").click(function(e) {
    var inputBoxId = $("#" + window.containerID).find(".perkCustomDonationAmount").attr("id");
    var inputBoxMin = parseInt($("#" + window.containerID).find(".perkCustomDonationAmount").attr("min"), 10);

    if (parseInt($("#" + inputBoxId).val(), 10) < inputBoxMin) {
        $("#" + inputBoxId).val(inputBoxMin);
    }

    if (window.perkButtonEnd == false) {
        window.amount = $("#" + window.containerID).find(".perkCustomDonationAmount").val();
        window.amountCents = window.amount * 100;
        window.perkCode = $("#" + window.containerID).attr("name");
        handler.open({
            name: '@noesunaescuela',
            description: window.crowdfundingStats[window.perkCode].description,
            amount: window.amountCents

        });

    } else if (window.perkButtonEnd == true) {
        perkBlocksReset(window.containerID);
        window.perkButtonEnd = false;
    }
});

//When clicking on perk selection
$(".perkPopUp").click(function(e) {
    console.log(e.currentTarget.attributes);
    window.containerID = e.currentTarget.attributes.name.value;
    window.modalID = e.currentTarget.attributes.href.value.replace("#", "");



    $("#" + window.containerID).find(".perkCustomDonationAmount").on('input', function() {
        var amount = $(this).val();
    });


    window.amount = $("#" + window.containerID).find(".perkCustomDonationAmount").val();
    $(".perkContenedor").css("height", "auto");
    $("#" + window.containerID).find(".perkCustomButton").html("Continuar");
    $("#" + window.containerID).find(".perkDelivery").css("border-bottom", "dashed 1px lightgrey");
    $("#" + window.containerID).find(".perkCustomDonationAmount").css("display", "block");
    $("#" + window.containerID).find(".perkCustomButton").show("blind", {
        easing: "easeInOutSine",
        duration: 500
    });
    $(this).parent().find(".perkCustomDonationAmount").show("blind", {
        easing: "easeInOutSine",
        duration: 500
    });
    $("#" + window.modalID).css({
        opacity: 1,
        "pointer-events": "auto"
    });

});

//closes modal
$(".close.perkContenedor").click(function(e) {
    window.test = e.currentTarget.parentElement.parentElement.attributes.id.value;
    $("#" + e.currentTarget.parentElement.parentElement.attributes.id.value).css({
        opacity: 0,
        "pointer-events": "none"
    });
});

//Resets perk with ID blocks to the initial state
function perkBlocksReset(id) {
    if (window.perkToggleState) {

        $("#" + id).find("#" + window.perkToggleButton).trigger("click");
        $("#" + id).find("#" + window.perkToggleButton).html("Leer más");

    }
    $("#" + id).find(".perkPostFlight").hide();
    $("#" + id).find(".perkCustomButton").html("Seleccionar");
    $("#" + id).find(".perkDelivery").css("border-bottom", "none");
    $("#" + id).find(".perkToggle").css("pointer-events", "none");

}


// Close Checkout on page navigation
$(window).on('popstate', function() {
    handler.close();
});

//checks if user has closed stripe window before submit
$(document).on("DOMNodeRemoved", ".stripe_checkout_app", close);

function close() {
    if (window.perkTokenBeenCalled == false) {}
}

$("a[href^=#]").on("click", function(e) {
    e.preventDefault();
    history.pushState({}, "", this.href);
});

$(".first-name").find("input").attr("placeholder", "Nombre");
$(".last-name").find("input").attr("placeholder", "Apellidos");
$(".form-item.field.email.required").find("input").attr("placeholder", "email");
