/* Author:
* Diego Gutiérrez Marañón ground.contact@gmail.com
*
Rawgit resources:

 Production: https://cdn.rawgit.com/ENEUE/javascript/master/transactions.js
 Development: https://rawgit.com/ENEUE/javascript/master/transactions.js

*/


//resizes youtube player

function youTubeResize(idFrame, widthContainer) {
    $("#" + idFrame).width(widthContainer);
    var height = widthContainer * 9 / 16;
    $("#" + idFrame).height(height);
}

function showGauge(min, max, days, val, id) {
    var g = new JustGage({
        id: id,
        value: Math.round(val),
        min: Math.round(min),
        max: Math.round(max),
        title: "Obtenido",
        label: "quedan " + days + " días",
        symbol: "€",
        gaugeWidthScale: 0.2,
        levelColors: ["#B51A41", "#F59827", "#AFE826"],
        titleMinFontSize: 25
    });
}

$(document).ready(function() {

    $("#cfCTA1").css({
        top: '100px'
    });

    //Youtube resizing

    window.ytfwidth = $("#cfPlayerFrame1").width();
    youTubeResize("cfPlayer1", window.ytfwidth);
    window.ytfheight = $("#cfPlayerFrame1").width();

    //*******************************************IMPORTANT!!!   PARSERS MUST BE CALLED ON THEIR RESPECTIVE PAGE
    trustParser();
    var disqus_shortname = 'estonoesunaescuelaorg';
    var disqus_identifier = 'eneueCrowdfunding';

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
        var dsq = document.createElement('script');
        dsq.type = 'text/javascript';
        dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();

    //Flag initialization
    window.perkTokenBeenCalled = false;
    window.perkButtonEnd = false;
    window.beenShared = false;
    window.perkToggleState = null;
    window.libro = false;
    window.curso = false;
    //    $(".perkSocial").hide();
});

//Ajax Success Main function

function budgetSuccess(xhr) {
    window.projectNeedsJson = JSON.parse(xhr.responseText);
    //First Level
    $.each(window.projectNeedsJson, function(key, data) {
        //Second Level
        $.each(data, function(index, data) {
            //Checks data items and avoids summary
            if (index != "totals") {
                //Check only data for minimum and efective budget
                if ((data.totals.min != 0) || (data.totals.efect != 0)) {
                    var cList = $('.projectBudgetList');
                    var divItem = $('<div/>')
                        .addClass('ui-div-top-item projectBudgetBox')
                        .appendTo(cList);
                    var headerItem = $('<h4/>')
                        .addClass('ui-h4-top-item')
                        .text(data.desig)
                        .appendTo(divItem);
                    var totalsItem = $('<p/>')
                        .addClass('ui-p-top-item-desc')
                        .text(data.descriptor)
                        .appendTo(divItem);
                    var totalsItem = $('<p/>')
                        .addClass('ui-p-top-item-cant')
                        .text("€ " + (parseInt(data.totals.min) + parseInt(data.totals.efect)))
                        .appendTo(divItem);
                    //Third level
                    $.each(data, function(keys, datae) {
                        if ((keys != "totals") && (keys != "desig") && (keys != "descriptor")) {
                            //Check only data for minimum and efective budget
                            if ((datae.totals.min > 0) || (datae.totals.efect > 0)) {
                                var divSubItem = $('<div/>')
                                    .addClass('ui-div-item')
                                    .appendTo(divItem);
                                var headerSubItem = $('<h5/>')
                                    .addClass('ui-h5-item')
                                    .text(datae.desig)
                                    .appendTo(divSubItem);
                                var totalsSubItem = $('<p/>')
                                    .addClass('ui-p-item-desc')
                                    .text(datae.descriptor)
                                    .appendTo(divSubItem);
                                if ((datae.totals.min != 0) && (datae.totals.efect != 0)) {
                                    var totalsSubItem = $('<p/>')
                                        .addClass('ui-p-item-cant')
                                        .text("€ " + (parseInt(datae.totals.efect) + parseInt(datae.totals.min)))
                                        .appendTo(divSubItem);
                                } else if (datae.totals.efect != 0) {
                                    var totalsSubItem = $('<p/>')
                                        .addClass('ui-p-item-cant')
                                        .text("€ " + datae.totals.efect)
                                        .appendTo(divSubItem);
                                } else {
                                    var totalsSubItem = $('<p/>')
                                        .addClass('ui-p-item-cant')
                                        .text("€ " + datae.totals.min)
                                        .appendTo(divSubItem);
                                }
                                //Fourth Level
                                $.each(datae, function(keyser, dataes) {
                                    if ((keyser != "totals") && (keyser != "desig") && (keyser != "descriptor") && (keyser != "cant") && (keyser != "uds") && (keyser != "precio")) {
                                        if ((dataes.totals.min > 0) || (dataes.totals.efect > 0)) {
                                            var divSubSubItem = $('<div/>')
                                                .addClass('ui-div-sub-item')
                                                .appendTo(divSubItem);
                                            var headerSubSubItem = $('<h5/>')
                                                .addClass('ui-h5-sub-item')
                                                .text(dataes.desig)
                                                .appendTo(divSubSubItem);
                                            var totalsSubSubItem = $('<p/>')
                                                .addClass('ui-p-sub-item-desc')
                                                .text(dataes.descriptor)
                                                .appendTo(divSubSubItem);
                                            if (dataes.totals.min > 0) {
                                                var totalsSubSubItem = $('<p/>')
                                                    .addClass('ui-p-sub-item-cant')
                                                    .text("€ " + dataes.totals.min)
                                                    .appendTo(divSubSubItem);

                                            } else {
                                                var totalsSubSubItem = $('<p/>')
                                                    .addClass('ui-p-sub-item-cant ui-p-red')
                                                    .text("€ " + dataes.totals.efect)
                                                    .appendTo(divSubSubItem);
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    })

                }
            }
        })
        var cList = $('.projectBudgetListTotals');

        var divItem = $('<div/>')
            .addClass('ui-div-item')
            .appendTo(cList);
        var headerItem = $('<h4/>')
            .addClass('ui-header-item-sub')
            .text('Subtotal:')
            .appendTo(divItem);
        var totalsItem = $('<p/>')
            .addClass('ui-paragraph-item-sub')
            .text("€ " + (Math.round(parseInt(data.totals.min)) + Math.round(parseInt(data.totals.efect))))
            .appendTo(divItem);
        divItem = $('<div/>')
            .addClass('ui-div-item')
            .appendTo(cList);
        headerItem = $('<h4/>')
            .addClass('ui-header-item-pre')
            .text('Fondo de contingencia (1%):')
            .appendTo(divItem);
        totalsItem = $('<p/>')
            .addClass('ui-paragraph-item-pre')
            .text("€ " + Math.round((Math.round(parseInt(data.totals.min)) + Math.round(parseInt(data.totals.efect))) * 0.01))
            .appendTo(divItem);
        divItem = $('<div/>')
            .addClass('ui-div-item')
            .appendTo(cList);
        headerItem = $('<h4/>')
            .addClass('ui-header-item')
            .text('Total:')
            .appendTo(divItem);
        totalsItem = $('<p/>')
            .addClass('ui-paragraph-item')
            .text("€ " + Math.round((Math.round(parseInt(data.totals.min)) + Math.round(parseInt(data.totals.efect))) * 1.01))
            .appendTo(divItem);
    })
}

function statsInit() {
    window.statsLoaded = true;
    //Assigns global variables to the different values retrieved from stats server. This includes all the details to be shown on page load
    showGauge(0, window.crowdfundingStats.TOTALS.optimal, window.crowdfundingStats.TOTALS.daysleft, window.crowdfundingStats.TOTALS.totalincome, "perks-gauge1");

    $("#cfStatsAchieved1").html(window.crowdfundingStats.TOTALS.totalincome);
    $("#cfStatsSupporters1").html(window.crowdfundingStats.TOTALS.solditems);
    $("#cfStatsNeeded1").html(parseInt(window.crowdfundingStats.TOTALS.optimal));
    $("#cfStatsDaysLeft1").html(window.crowdfundingStats.TOTALS.daysleft);
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
            //calculates the necessary perks to be sold for minimum amount
            var perk10Supporters = Math.ceil((window.crowdfundingStats.TOTALS.minimum - window.crowdfundingStats.TOTALS.totalincome) / window.crowdfundingStats["PERK10"].price);
            $("#spanPerk10NeededSupport").html(perk10Supporters);
            //sets the minimum value to assign to input box. This can be hacked. CHECKED ON SERVER SIDE.
            $("#" + "div" + toTitleCase(prop) + "customDonationAmount").attr("min", window.crowdfundingStats[prop].price);
            $("#" + "div" + toTitleCase(prop) + "customDonationAmount").attr("title", "Introduce una cantidad mayor de €" + window.crowdfundingStats[prop].price + ".00");
            var placeHolder = parseInt(window.crowdfundingStats[prop].price, 10) + 10;
            $("#" + "div" + toTitleCase(prop) + "customDonationAmount").attr("placeholder", "p.ej. €" + placeHolder);
        }
    }
}

$(document).ajaxSuccess(function(evnt, xhr, settings) {
    //Discriminate different options
    switch (settings.url) {
        case "https://raw.githubusercontent.com/ENEUE/eneue.github.io/gh/presupuesto.js":
            budgetSuccess(xhr);
            break;
        default:
            statsInit();
            break
    }
});

//*************************************************************CUSTOM FUNCTIONS MAILCHIMPER MAIN*********************************************

function mailChimper() {


}
//*************************************************************CUSTOM FUNCTIONS CROWDFUNDING MAIN*********************************************

$("#cfTabsContainer1").tabs({
    heightStyle: "content",
    collapsible: false,
    active: 0
});

$("#cfFAQs1").accordion({
    heightStyle: "content",
    collapsible: true,
    active: false,
    icons: {
        "header": "ui-icon-plus",
        "activeHeader": "ui-icon-minus"
    }
});

//*************************************************************CUSTOM FUNCTIONS PERKS************************************************************

//Capitalizes first letter, lower case the rest
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

//Hides social div if not interested in raffle

$(".perkDisregard").on("click", function() {
    $(this).parent().hide();
});

//Toggles content of headerMain
$(".perkDesc .perkToggle span").on("click", function() {
    window.perkToggleButton = $(this).attr("id");
    window.perkToggleState = !window.perkToggleState;
    var $el,
        $ps,
        $up,
        initialHeight,
        minHeight,
        totalHeight;

    totalHeight = 0;
    minHeight = 54;
    $el = $(this);

    $p = $el.parent();
    $up = $p.parent();
    initialHeight = $up.height();
    if (initialHeight == minHeight) {
        $elems = $up.children();
        $last = $elems.last();

        // measure how tall inside should be by adding together heights of all inside paragraphs (except read-more paragraph)
        $elems.each(function() {
            totalHeight += $(this).outerHeight();
        });
        $up.css({
            // Set height to prevent instant jumpdown when max height is removed
            "height": $up.height()
        }).animate({
            "height": totalHeight
        });
        $el.html("Leer menos");

        return false;
    } else {
        $up.css({
            // Set height to prevent instant jumpdown when max height is removed
            "height": initialHeight
        }).animate({
            "height": minHeight
        });
        $el.html("Leer mas");

        // prevent jump-down
        return false;

    }

});


//Closes spinner while waiting stripe charge information
function closeWaitDiv(id) {
    id = "#" + id;
    $(id).hide();
}
//************************************************************* STRIPE MAIN FUNCTION*********************************************

//Declares the Stripe Checkout Handler and configures it
var handler = StripeCheckout.configure({
    key: 'pk_test_AfqpiD3DBLtXD8u39JwGErf8',
    //***************************************************************IMPORTANT!!!!!!!------CHECK IMAGE STORAGE AND PARAMETERS FOR CHECKOUT**********
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

                window.perkTokenBeenCalled = false;
                window.perkButtonEnd = true;
                window.beenShared = false;
                $("#" + window.containerID).find(".perkCustomButton").html("Finalizar");
                $("#" + window.containerID).find(".perkPostFlight").show();

                //Call to mailchimper

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
$(".perkSelect").click(function() {
    window.containerID = $(this).parents(".perkContenedor").attr("id");
    perkAccordion(window.containerID);
    $("#" + window.containerID).css("border", "2px solid #AB0096");
    $("#" + window.containerID).css("box-shadow", "2px 2px 8px 1px #766896");

    $("#" + window.containerID).find(".perkCustomDonationAmount").on('input', function() {
        var amount = $(this).val();


    });

    window.amount = $(this).siblings(".perkSend").find(".perkCustomDonationAmount").val();
    if (parseInt(window.amount, 10) >= 15) {
        //        $("#" + window.containerID).find(".perkSocial").show();
    }
    $("#" + window.containerID).find(".perkToggle").css("pointer-events", "auto");
    $(".perkContenedor").css("height", "auto");
    $(this).css("display", "none");
    $(this).parent().find(".perkCustomButton").html("Continuar");
    $(this).parent().find(".perkDelivery").css("border-bottom", "dashed 1px lightgrey");
    $(this).parent().find(".perkCustomDonationAmount").css("display", "block");
    $(this).parent().find(".perkCustomButton").show("blind", {
        easing: "easeInOutSine",
        duration: 500
    });
    $(this).parent().find(".perkCustomDonationAmount").show("blind", {
        easing: "easeInOutSine",
        duration: 500
    });


});

//Resets perk with ID blocks to the initial state
function perkBlocksReset(id) {
    if (window.perkToggleState) {

        $("#" + id).find("#" + window.perkToggleButton).trigger("click");
        $("#" + id).find("#" + window.perkToggleButton).html("Leer más");

    }


    $("#" + id).find(".perkCustomDonationAmount").hide();
    //    $("#" + id).find(".perkPreFlight").hide();
    $("#" + id).find(".perkPostFlight").hide();
    if (parseInt($("#" + id).find(".perkCustomDonationAmount").attr("min"), 10) >= 15) {

    } else {

    }

    $("#" + id).find(".perkCustomButton").html("Seleccionar");
    $("#" + id).find(".perkDelivery").css("border-bottom", "none");
    $("#" + id).find(".perkButton").css("display", "none");
    $("#" + id).find(".perkToggle").css("pointer-events", "none");
    $("#" + id).find(".perkSelect").css("display", "block");

}

$(".perkSelect").hover(function() {
    var parentHeight = $(this).parent().css("height");
    var parentWidth = $(this).parent().css("width");
    $(this).css("height", parentHeight);
    $(this).css("width", parentWidth);
});

// BUT the one clicked
function perkAccordion(id) {
    var siblings = $("#" + id).siblings();
    siblings.css("border", "none");
    siblings.css("box-shadow", "none");
    siblings.each(function(i) {
        perkBlocksReset($(this).attr("id"));
    });
}

// Close Checkout on page navigation
$(window).on('popstate', function() {
    handler.close();
});

//checks if user has closed stripe window before submit
$(document).on("DOMNodeRemoved", ".stripe_checkout_app", close);

function close() {

}

//PARSER FUNCTIONS (GET DATA FROM GOOGLE SHEETS SERVER)***************************************************************************************
//Trust Parser Main function
function trustParser() {

    // ID of the Google Spreadsheet
    var spreadsheetID = '1-X6Qag93mSiGUHNXpm4TzxAPU1TNKHa9eYLaA75LVRc';

    // Make sure it is public or set to Anyone with link can view
    var url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetID + '/od6/public/basic?alt=json';
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    //Main function. Retrieves JSON feed, checks status from server, displays and formats the contents
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            var out = "";
            //Loops through all the elements in myArr.feed.entry (entry is the container of data)
            var long = myArr.feed.entry.length;
            for (var i = 0; i < long; i++) {
                //nth item contents
                var content = myArr.feed.entry[i].content.$t;

                //checks if there's an empty data cell in "xcargo"
                var noCargo = content.search("xcargo");
                if (noCargo > -1) {
                    //Divides in two parts on xcita
                    var division = content.split(", xcita: ");
                    var firstChunk = division[0];
                    //deletes xcargo in the string
                    firstChunk = firstChunk.replace("xcargo:", "");
                    var secondChunk = division[1];
                }
                //incase there's an empty cell in xcargo
                else {
                    firstChunk = "";
                    secondChunk = content.replace("xcita:", "");
                }

                //Formats the html output
                out += '<div class = "cfTrustItem"><p class = "eneueName">' + myArr.feed.entry[i].title.$t + '</p><p class = "eneuePosition">' + firstChunk + '</p><p class = "eneueQuote">' + secondChunk + '</p></div>';
            }
            //puts content on the html of the page
            document.getElementById("cfTrustContainer1").innerHTML = out;
            //Slick (Carrousel)
            $('.cfTrustContainer').slick({
                autoplay: true,
                autoplaySpeed: 8000,
                infinite: true,
                slidesToShow: 1,
                fade: true
            });

        }
        //in case Google Sheets is unpublished or unavailable, fallback to Github iframe, the same as <noscript>
        else if (xmlhttp.readyState == 4 && xmlhttp.status !== 200) {
            var iframe = "<iframe src=\"http://eneue.github.io/resources/trust.html\" frameborder=\"0\"></iframe>";
            document.getElementById("#cfTrustContainer1").innerHTML = iframe;

        }
    };
}

var url_gauge = "https://raw.githubusercontent.com/ENEUE/eneue.github.io/gh/presupuesto.js";
$.ajax({
    type: 'GET',
    dataType: 'text', //use jsonp data type in order to perform cross domain ajax
    crossDomain: true,
    url: url_gauge
});