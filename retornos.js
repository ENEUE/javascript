/* Author:
* Diego Gutiérrez Marañón ground.contact@gmail.com
*
Rawgit resources:

 Production: https://cdn.rawgit.com/ENEUE/javascript/campaign/retornos.js
 Development: https://rawgit.com/ENEUE/javascript/campaign/retornos.js
*/



//Loads CF data
var cfstatsHttpResponse = getCrowdfundingStats();
//Minumum amount to participate in Raffle
var minAmountRaffle = 45;
//flag to allow for raffle. Set to false to end raffle.
var raffleInProgress = false;

$(document).ready(function() {
    $("#cfFAQs1").accordion({
        heightStyle: "content",
        collapsible: true,
        active: false,
        icons: {
            "header": "ui-icon-plus",
            "activeHeader": "ui-icon-minus"
        }
    });
    //Flag initialization
    window.perkTokenBeenCalled = false;
    window.perkButtonEnd = false;
    window.beenShared = false;
    window.perkToggleState = null;
    //Hides social networking for raffle
    $(".perkSocial").hide();

});

//Get Crowdfunding Data from Google Sheets Json
function getCrowdfundingStats() {
    var spreadsheetID = '1EFRGuZXSTLaGgTqG0Md7DTICMjXBH_2FSGmWIKsP7kg';
    var url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetID + '/od6/public/basic?alt=json';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    //Main function. Retrieves JSON feed, checks status from server, displays and formats the contents
    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var resultJson = JSON.parse(xmlhttp.responseText);
            var out = "";
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
            statsInit();
        }
    };
    return xmlhttp;
}
//Ajax Success function. Runs when Ajax has completed and thrown positive outcome
function statsInit() {
    $("#cfStatsAchieved1").html(window.crowdfundingStats.TOTALS.totalincome);
    $("#cfStatsSupporters1").html(window.crowdfundingStats.TOTALS.solditems);
    $("#cfStatsNeeded1").html(window.crowdfundingStats.TOTALS.ideal);
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
            $("#specialDeliveryAmount" + toTitleCase(prop) + "Urgent").html(window.crowdfundingStats[prop].urgent);
            $("#specialDeliveryAmount" + toTitleCase(prop) + "Certified").html(window.crowdfundingStats[prop].certified);
            //sets the minimum value to assign to input box. This can be hacked. CHECKED ON SERVER SIDE.
            $("#" + "div" + toTitleCase(prop) + "customDonationAmount").attr("min", window.crowdfundingStats[prop].price);
            $("#" + "div" + toTitleCase(prop) + "customDonationAmount").attr("title", "Introduce una cantidad mayor de €" + window.crowdfundingStats[prop].price + ".00");
            var placeHolder = parseInt(window.crowdfundingStats[prop].price, 10) + 10;
            $("#" + "div" + toTitleCase(prop) + "customDonationAmount").attr("placeholder", "p.ej. €" + placeHolder);
        }
    }
    showGauge(0, window.crowdfundingStats.TOTALS.ideal, window.crowdfundingStats.TOTALS.daysleft, window.crowdfundingStats.TOTALS.totalincome, "perks-gauge1");
};

//****************************************************SOCIAL SHARING INITIALIZATION************************************************************

//TWITTER**************************************************************************************************************************************
if (raffleInProgress) {
    window.twttr = (function(d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id))
            return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
        t._e = [];
        t.ready = function(f) {
            t._e.push(f);
        };
        return t;
    }(document, "script", "twitter-wjs"));

    twttr.ready(function(twttr) {
        twttr.events.bind('tweet', function(event) {
            var ID = event.target.parentElement.id;
            //Callback checks if content has been shared
            hasBeenShared(true, ID);
        });
    });

    //FACEBOOK**************************************************************************************************************************************
    window.fbAsyncInit = function() {
        FB.init({
            appId: "994194617270624",
            xfbml: true,
            version: "v2.4"
        });
    };
    (function(d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    function facebookShare(obj) {
        var parentID = obj.id;
        FB.ui({
            //*****************************************************CHECK TEXT!!!!!!!!!!!!!!!!!!!!!!!!!!!*********************************************
            method: 'feed',
            link: 'https://www.facebook.com/estonoesunaescuela/videos/1015089978618765/',
            caption: 'Gracias por compartir este vídeo',
            //            picture: 'http://static1.squarespace.com/static/52bc986be4b097881152c8b1/t/56233d89e4b018ac1dfc9edb/1445150089720/imagina.jpg',
            source: 'http://vimeo.com/user25782127/transformemos-la-escuela/',
            description: 'Hasta el 6 de enero puedes participar en el sorteo de una ilustración original'
        }, (function(parentID) {
            return function(response) {
                hasBeenShared(response, parentID);
            };
        })(parentID));
    }

    //Unveils the raffle selection div and allows selection of raffle items
    function hasBeenShared(response, ID) {
        var perkSocialID = $("#" + ID).closest(".perkSocial").attr("id");
        var raffleID = $("#" + perkSocialID).siblings(".perkRaffle").attr("id");
        var perkNetworksID = $("#" + ID).closest(".perkNetworks").attr("id");
        var perkErrorID = $("#" + perkNetworksID).siblings(".perkNetError").attr("id");
        if (response) {
            $("#" + perkSocialID).hide();
            $("#" + raffleID).show();
            if (window.amount >= minAmountRaffle) {
                window.beenShared = true;
                /*$("#" + raffleID).find(".perkCheckBox").each(function() {
                    $(this).prop("checked", true)
                });
                $("#" + raffleID).find(".perkCheckBox").each(function() {
                    $(this).attr("disabled", false)
                });*/
            }
        } else {
            $("#" + perkNetworksID).hide();
            $("#" + perkErrorID).show();
        }
    }

    //On clicking facebook div display sharing window and trigger callback function
    $(".perkFacebook").on("click", function() {
        facebookShare(this);
    });


}

//*************************************************************CUSTOM FUNCTIONS SOCIAL NETWORKS**************************************************


//Sets the minimum for each perk to fit with special delivery options
$(".specialDelivery").find("input").change(function() {
    var checkBox = $(this).val();
    var value = parseFloat($("#" + window.containerID).find(".perkCustomDonationAmount").val(), 10);
    var amount, min = parseFloat($("#" + window.containerID).find(".perkCustomDonationAmount").attr("min"), 10);
    if (checkBox == "CERTIFICADO") {
        amount = window.certifiedAmount;
    } else {
        amount = window.urgentAmount;
    }
    if (checkBox == "CERTIFICADO" && $(this).prop("checked") == true) {
        $("#" + window.containerID).find("input[name=urgent]").attr("disabled", false);

    } else if (checkBox == "CERTIFICADO" && $(this).prop("checked") == false) {
        if ($("#" + window.containerID).find("input[name=urgent]").prop("checked") == true) {
            amount = amount + window.urgentAmount;
        }
        $("#" + window.containerID).find("input[name=urgent]").prop("checked", false);
        $("#" + window.containerID).find("input[name=urgent]").attr("disabled", true);
    }
    if ($(this).prop("checked") == true) {
        window[checkBox] = true;
        min = Math.round((min + amount) * 100) / 100;
        $("#" + window.containerID).find(".perkCustomDonationAmount").attr("min", min);
        value = Math.round((value + amount) * 100) / 100;
        $("#" + window.containerID).find(".perkCustomDonationAmount").val(value);
    } else {
        window[checkBox] = false;
        min = Math.round((min - amount) * 100) / 100;
        $("#" + window.containerID).find(".perkCustomDonationAmount").attr("min", min);
        value = Math.round((value - amount) * 100) / 100;
        $("#" + window.containerID).find(".perkCustomDonationAmount").val(value);
    }
});

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


//Closes spinner while waiting stripe charge information
function closeWaitDiv(id) {
    id = "#" + id;
    $(id).hide();
}


//Displays again social sharing block
$(".divPerkErrorTry").click(function() {
    $(this).parent().hide();
    $(this).parent().siblings(".perkNetworks").show();
});

//Declares the Stripe Checkout Handler and configures it
var handler = StripeCheckout.configure({
    key: 'pk_live_uWo17rHYl0BXyyKmoMtHM3aS',
    //***************************************************************IMPORTANT!!!!!!!------CHECK IMAGE STORAGE AND PARAMETERS FOR CHECKOUG**********
    image: 'https://estonoesunaescuela.squarespace.com/s/anagrama_peq_color_whitebckgrnd_small.png',
    locale: 'auto',
    currency: "EUR",
    zipCode: true,
    shippingAddress: true,
    billingAddress: false,
    panelLabel: "Dona {{amount}}",
    allowRememberMe: "false",
    token: function(token, args) {
        window.perkTokenBeenCalled = true;
        var redirectDomain = "https://script.google.com/macros/s/AKfycbywnXbEp_nIPvClMVyEgw_YK_IhHgqnAs9-N-sYVjufx1jPCLw/exec";
        var Query = "stripeEmail=" + token.email + "&stripeToken=" + token.id + "&amount=" + window.amountCents + "&itemID=" + window.perkCode + "&beenShared=" + window.beenShared + "&islive=" + token.livemode + "&isCertified=" + window.CERTIFICADO + "&isUrgent=" + window.URGENTE;
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
            $("#" + window.containerID).find(".perkRaffle").hide(); //Social Sharing and Raffle
            $("#" + window.containerID).find(".perkCustomDonationAmount").hide();
            $("#" + window.containerID).find(".perkPreFlight").hide();
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
                if (resultJson.numRaffle) {
                    var chain = "<br>" + resultJson.numRaffle;
                }
                $("#" + window.containerID).find(".perkNumRaffleShow").html(chain);
                $("#" + window.containerID).find(".perkWait").hide();
                $("#" + window.containerID).find(".specialDelivery").hide();
                window.perkTokenBeenCalled = false;
                window.perkButtonEnd = true;
                window.beenShared = false;
                $("#" + window.containerID).find(".perkCustomButton").html("Finalizar");
                $("#" + window.containerID).find(".perkPostFlight").show();

                //Call to mailchimper
                mailChimper(resultJson);
            }
        });
    }
});

//Calls Stripe Checkout for ANY PERK
$(".perkCustomButton").click(function(e) {
    $("#" + window.containerID).find(".perkSocial").hide();
    var checkBoxes = $("#" + containerID).find(".specialDelivery");
    var certifiedCheckbox = checkBoxes.find("input[name=certified]");
    var urgentCheckbox = checkBoxes.find("input[name=urgent]");
    var inputBoxId = $("#" + window.containerID).find(".perkCustomDonationAmount").attr("id");
    var inputBoxMin = parseFloat($("#" + window.containerID).find(".perkCustomDonationAmount").attr("min"), 10);

    if (parseInt($("#" + inputBoxId).val(), 10) < inputBoxMin) {
        $("#" + inputBoxId).val(inputBoxMin);
    }

    if (window.perkButtonEnd == false) {
        window.isCertified = certifiedCheckbox.is(":checked");
        window.isUrgent = urgentCheckbox.is(":checked");
        window.perkCode = $("#" + window.containerID).attr("name");
        window.amount = parseFloat($("#" + window.containerID).find(".perkCustomDonationAmount").val(), 10);
        window.amountCents = window.amount * 100;
        handler.open({
            name: '@noesunaescuela',
            description: window.crowdfundingStats[window.perkCode].description,
            amount: window.amountCents

        });
        $("#" + window.containerID).find(".perkWait").show();
    } else if (window.perkButtonEnd == true) {
        perkBlocksReset(window.containerID);
        window.perkButtonEnd = false;
    }
});

//When clicking on perk selection
$(".perkRadio").click(function(e) {
    $(".perkSend").hide();
    $(".perkPostFlight").hide();
    $(".perkCustomButton").hide();
    $(".perkBody").css("border-bottom", "none");

    window.containerID = e.currentTarget.attributes._parent.value;
    $("#" + window.containerID).siblings().css("border", "none");
    $("#" + window.containerID).siblings().css("box-shadow", "none");
    $("#" + window.containerID).css("border", "2px solid #AB0096");
    $("#" + window.containerID).css("box-shadow", "2px 2px 8px 1px #766896");

    window.perkCode = $("#" + window.containerID).attr("name");
    window.certifiedAmount = parseFloat(window.crowdfundingStats[window.perkCode].certified, 10);
    window.urgentAmount = parseFloat(window.crowdfundingStats[window.perkCode].urgent, 10);
    window.CERTIFICADO = false;
    window.URGENTE = false;
    perkAccordion(window.containerID);
    $("#" + containerID).find(".specialDelivery").show();
    $("#" + containerID).find(".specialDelivery").find("input").each(function() {
        $(this).prop("checked", false);
    });
    $("#" + containerID).find(".specialDelivery").find("input[name=urgent]").attr("disabled", true);
    $("#" + window.containerID).find(".perkCustomDonationAmount").attr("min", parseFloat(window.crowdfundingStats[window.perkCode].price, 10));
    $("#" + window.containerID).find(".perkCustomDonationAmount").val(parseFloat(window.crowdfundingStats[window.perkCode].price));
    $("#" + window.containerID).find(".perkCustomDonationAmount").on('input', function() {
        var amount = $(this).val();
        if (raffleInProgress && (parseInt(amount, 10) >= minAmountRaffle)) {
            $("#" + window.containerID).find(".perkSocial").show();
        } else {
            $("#" + window.containerID).find(".perkSocial").hide();
        }

    });

    window.amount = $("#" + window.containerID).find(".perkCustomDonationAmount").val();

    $(".perkContenedor").css("height", "auto");
    if (raffleInProgress && (parseInt(window.amount, 10) >= minAmountRaffle)) {
        $("#" + window.containerID).find(".perkSocial").show();
    }
    $("#" + window.containerID).find(".perkCustomButton").html("Continuar");
    $("#" + window.containerID).find(".perkBody").css("border-bottom", "dashed 1px lightgrey");
    $("#" + window.containerID).find(".perkCustomDonationAmount").css("display", "block");
    $("#" + window.containerID).find(".perkCustomButton").show();
    $("#" + window.containerID).find(".perkCustomDonationAmount").show();
    $("#" + window.containerID).find(".perkSend").show();

    $("#" + window.containerID).find(".perkPreFlight").show();
});

//Resets perk with ID blocks to the initial state
function perkBlocksReset(id) {
    $("#" + id).find(".perkRaffle").hide();
    $("#" + id).find(".perkCustomDonationAmount").hide();
    $("#" + id).find(".perkPostFlight").hide();
    if ((parseInt($("#" + id).find(".perkCustomDonationAmount").attr("min"), 10) >= minAmountRaffle) && raffleInProgress) {
        $("#" + id).find(".perkSocial").show();
    } else {
        $("#" + id).find(".perkSocial").hide();
    }
    $("#" + id).find(".perkCustomButton").hide();
    $("#" + id).find(".perkBody").css("border-bottom", "none");
    $("#" + id).find(".perkToggle").css("pointer-events", "none");
    $("#" + id).find(".specialDelivery").hide();

}

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

function close() {
    //  alert("close stripe");
    if (window.perkTokenBeenCalled == false) {
        $(".perkWait").hide();
    }
}


//checks if user has closed stripe window before submit
$(document).on("DOMNodeRemoved", ".stripe_checkout_app", close);


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
    $('.eneue-return-link').click(function() {
        parent.history.back();
        return false;
    });
});

//*************************************************************CUSTOM FUNCTIONS MAILCHIMPER MAIN*********************************************

function mailChimper(params) {
    var redirectDomain = "https://script.google.com/macros/s/AKfycbwG-vdUup2QUNsU5uH4QjRN9PJyXriwLiXvrwS_YpMQqBY1-8VR/exec";
    var Query = "email_address=" + params.eMail + "&localizer=" + params.localizer + "&amount=" + params.amount + "&perkID=" + params.perkID;
    var eQuery = window.btoa(unescape(encodeURIComponent(Query)));
    var Query = {
        e: eQuery
    };
    var request = $.ajax({
        type: 'post',
        url: redirectDomain,
        jsonpCallback: 'updateMailChimp',
        dataType: 'jsonp',
        data: Query
    });
}
