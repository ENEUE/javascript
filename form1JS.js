//Array con los nombres del atributo nombre en el formulario 2
var names = ["nombre", "apellidos", "DNI", "creditos", "dir1", "dir2", "ciudad", "cp"];
//Hide or show fields depending on type of @perk & @amount
//Función que configura la obligatoriedad de cada campo
function requiredFields(names, amount, perk) {
    //section-yui_3_17_2_1_1454415124886_124708  id for dirección postal
    //section-yui_3_17_2_1_1454415124886_179740  id for créditos
    //section-yui_3_17_2_1_1454415124886_123767 id for datos personales
    $('#section-yui_3_17_2_1_1454415124886_124708').find('.title').attr('name', 'dirposttitle');
    $('#section-yui_3_17_2_1_1454415124886_179740').find('.title').attr('name', 'creditstitle');
    $('#section-yui_3_17_2_1_1454415124886_123767').find('.title').attr('name', 'personaltitle');

    var threshold = 100;
    var requiredMatrix = [{ "perkID": "PERK5", "personaltitle": 1, "nombre": 1, "apellidos": 1, "DNI": 0, "creditstitle": 0, "creditos": 0, "dirposttitle": 0, "dir1": 0, "dir2": 0, "ciudad": 0, "cp": 0, "select-yui_3_17_2_1_1454415124886_129495-field": 0 },
        { "perkID": "PERK3", "personaltitle": 1, "nombre": 1, "apellidos": 1, "DNI": 0, "creditstitle": 1, "creditos": 1, "dirposttitle": 0, "dir1": 0, "dir2": 0, "ciudad": 0, "cp": 0, "select-yui_3_17_2_1_1454415124886_129495-field": 0 },
        { "perkID": "PERK4", "personaltitle": 1, "nombre": 1, "apellidos": 1, "DNI": 0, "creditstitle": 1, "creditos": 1, "dirposttitle": 0, "dir1": 0, "dir2": 0, "ciudad": 0, "cp": 0, "select-yui_3_17_2_1_1454415124886_129495-field": 0 },
        { "perkID": "PERK20", "personaltitle": 1, "nombre": 1, "apellidos": 1, "DNI": 1, "creditstitle": 1, "creditos": 1, "dirposttitle": 1, "dir1": 1, "dir2": 1, "ciudad": 1, "cp": 1, "select-yui_3_17_2_1_1454415124886_129495-field": 1 },
        { "perkID": "PERK10", "personaltitle": 1, "nombre": 1, "apellidos": 1, "DNI": 1, "creditstitle": 1, "creditos": 1, "dirposttitle": 1, "dir1": 1, "dir2": 1, "ciudad": 1, "cp": 1, "select-yui_3_17_2_1_1454415124886_129495-field": 1 },
        { "perkID": "PERK12", "personaltitle": 1, "nombre": 1, "apellidos": 1, "DNI": 1, "creditstitle": 1, "creditos": 1, "dirposttitle": 1, "dir1": 1, "dir2": 1, "ciudad": 1, "cp": 1, "select-yui_3_17_2_1_1454415124886_129495-field": 1 },
        { "perkID": "PERK22", "personaltitle": 1, "nombre": 1, "apellidos": 1, "DNI": 1, "creditstitle": 1, "creditos": 1, "dirposttitle": 1, "dir1": 1, "dir2": 1, "ciudad": 1, "cp": 1, "select-yui_3_17_2_1_1454415124886_129495-field": 1 },
        { "perkID": "PERK23", "personaltitle": 1, "nombre": 1, "apellidos": 1, "DNI": 1, "creditstitle": 1, "creditos": 1, "dirposttitle": 1, "dir1": 1, "dir2": 1, "ciudad": 1, "cp": 1, "select-yui_3_17_2_1_1454415124886_129495-field": 1 }
    ];

    var required = filterById(requiredMatrix, {
        perkID: perk
    });
    //Check if amount is €100 or greater
    if (amount >= threshold) {
        required[0].nombre = 1;
        required[0].apellidos = 1;
        required[0].DNI = 1;
        required[0].personaltitle = 1;
    }
    delete required[0].perkID;
    $.each(required[0], function(key, value) {
        if (value == 0) {
            $('[name=' + key + ']').parent().hide();
        }
    });

}
//Declare app url
var redirectDomain = "https://script.google.com/macros/s/AKfycbzICEw1n1BrsBsCgPMDL1VQ7bS9ka7O49s1pS4zkTLbM4g_CRNr/exec";
//Declare all the response codes in an array
var responseCodes = ["1F4", "3F8", "5DC", "7D0", "9C4", "BB8", "6D6", "FA0", "DAC"];
//Update @query variable with form data
var query = window.updateCustomerData;
//Declare text contents for html sections
var BODY_TEXT = ["<p><b>Alguno de los datos introducidos es incorrecto.</b> Te hemos enviado un email con los datos correctos. Comprueba tu bandeja de entrada y vuelve a intentarlo recargando la página en tu navegador o pulsando el botón \"reintentar\" que figura a continuación.</p>",
    "<p><b>No existen registros con los datos introducidos</b>. Comprueba que sean correctos y vuelve a intentarlo recargando la página en tu navegador o pulsando el botón \"reintentar\" que figura a continuación.</p>",
    "<p>Para poderte hacer entrega de tu obsequio y para otras cuestiones legales <b>necesitamos que rellenes el siguiente formulario</b>. </p><i>Si tienes alguna duda o crees que algún dato es incorrecto por favor escríbenos a <a href=\"colabora@estonoesunaescuela.org\" target = \"_top\">colabora@estonoesunaescuela.org</a> indicándonos el número de referencia de tu donación o contesta al email que te acabamos de enviar a la dirección que nos has facilitado y pronto nos pondremos en contacto contigo.</i><br>",
    "",
    "",
    "",
    "<p>Tus datos ya se encuentran registrados, pero <b>puedes actualizarlos si lo deseas</b>.</p>",
    "",
    "<p>El servidor está ocupado en estos momentos. Vuelve a intentarlo pasados unos minutos</p>"
];
var CONTRIBUTION_DATA = "<p>Estos son los datos que constan en nuestros registros sobre tu aportación:</p><br><p>Correo electrónico: <strong><span class = \"perkEmailShow\"></span></strong></p><p>Número de referencia: <strong><span class = \"perkLocalizerShow\"></span></strong></p><p>El día <span class = \"perkDate\"></span> a las <span class = \"perkTime\"></span> realizaste una donación de €<strong><span class = \"perkAmountShow\"></span></strong> para la producción de un documental sobre educación. Elegiste como obsequio \"<strong><span class = \"perkTitleShow\"></span></strong>\". <strong><span class = \"perkDesigShow\"></span></strong> La fecha estimada de entrega es: <strong><span class = \"perkDeliveryShow\"></span></strong>.</p>";
var UPDATED_DATA = "<p>Estos son los datos que nos has facilitado:<p><br><p>Nombre: <strong><span class = \"perkFirstNameShow\"></span></strong></p><p>Apellidos: <strong><span class = \"perkLastNameShow\"></span></strong></p><p>DNI: <strong><span class = \"perkIdShow\"></span></strong></p><p>Email: <strong><span class = \"perkEmailShow\"></span></strong></p><p>Cómo figurarás en los créditos: <strong><span class = \"perkCreditsShow\"></span></strong></p><p>Dirección postal de envío: <strong><span class = \"perkAddressShow\"></span></strong></p><p>Ciudad: <strong><span class = \"perkCityShow\"></span></strong></p><p>Código postal: <strong><span class = \"perkZipShow\"></span></strong></p><p>Provincia: <strong><span class = \"perkProvinceShow\"></span></strong></p>";
var WARNING = "<p>¡Todavía no has validado los datos que nos has facilitado! Por favor <strong>haz click en el enlace que te acabamos de enviar por email</strong> para que podamos hacerte entrega de tu obsequio. ¡Gracias!</p>";
var PERKS = "<p>Diego, <strong>¿te gustaría implicarte aun más en este proyecto?</strong> Ahora tienes la posibilidad de hacerlo. Al elegir colaborar con alguna de estas aportaciones que hemos personalizado para ti, nos ayudarás a mejorar aún más el documental \"Corriendo por las olas\". Gracias de antemano.</p>";
//Replace @+ symbol with white spaces
query = query.replace(/\+/g, " ");
//Encode query 
var eQuery = window.btoa(unescape(encodeURIComponent(query)));
//Declare payload for http request
var Query = {
    e: eQuery
};
//Execute http AJAX request with form1 data.
var request = $.ajax({
    type: 'get',
    url: redirectDomain,
    jsonpCallback: 'updateCustomer',
    contentType: "application/javascript",
    dataType: 'jsonp',
    jsonp: false,
    data: Query
});
$('.perkWait').show();

//When request is succesfull
request.done(function(resultJson) {
    $('.perkWait').hide();

    //Actions to follow depending on the response code by the server
    switch (resultJson.responsecode) {
        case responseCodes[0]:
            //Either email or localizer are wrong, but one of them is right. Show message and retry button.
            var presentedText = BODY_TEXT[0];
            $(".eneueBodyText").html(presentedText);
            $(".eneueBodyText").show();
            $("#block-yui_3_17_2_2_1455033745983_13062").show();
            break;
        case responseCodes[1]:
            //There are no registers that corresponds with the user data. Show message and retry button.
            //Show retry button
            var presentedText = BODY_TEXT[1];
            $(".eneueBodyText").html(presentedText);
            $(".eneueBodyText").show();
            $("#block-yui_3_17_2_2_1455033745983_13062").show();
            break;
        case responseCodes[2]:
            //This is the first time data is entered by the user. Prompt transaction data and show form2.
            var presentedText = BODY_TEXT[2];
            window.eneueSupporterEmail = resultJson.email;
            window.eneueTransactionLocalizer = resultJson.localizer;
            window.eneueTransactionRegistry = resultJson.registry;
            window.eneueQuantity = resultJson.quantity;
            window.eneueDelivery = resultJson.delivery;
            window.eneueDesig = resultJson.desig;
            window.eneuePerkID = resultJson.perkID;
            window.eneueTitle = resultJson.title;
            window.eneueTimeStamp = resultJson.timestamp;
            var timestampDate = new Date(resultJson.timestamp);
            var timestampDay = timestampDate.getDate();
            var timestampMonth = timestampDate.getMonth() + 1;
            var timestampYear = timestampDate.getFullYear();
            var timestampHour = (timestampDate.getHours() < 10 ? '0' : '') + timestampDate.getHours();
            var timestampMin = (timestampDate.getMinutes() < 10 ? '0' : '') + timestampDate.getMinutes();
            window.eneueDateStampFormatted = timestampDay + "/" + timestampMonth + "/" + timestampYear;
            window.eneueTimeStampFormatted = timestampHour + ":" + timestampMin;
            //Hide unneccessary fields
            requiredFields(names, window.eneueQuantity, window.eneuePerkID);

            //Update contents in contribution data section
            $(".eneueBodyText").html(presentedText);
            $(".eneueContributionData").html(CONTRIBUTION_DATA);
            $(".perkEmailShow").html(window.eneueSupporterEmail);
            $(".perkLocalizerShow").html(window.eneueTransactionLocalizer);
            $(".perkDate").html(window.eneueDateStampFormatted);
            $(".perkTime").html(window.eneueTimeStampFormatted);
            $(".perkAmountShow").html(window.eneueQuantity);
            $(".perkTitleShow").html(window.eneueTitle);
            $(".perkDesigShow").html(window.eneueDesig);
            $(".perkDeliveryShow").html(window.eneueDelivery);
            //Show text and contribution data
            $(".eneueContributionData").show();
            //Show second Form
            $("#block-yui_3_17_2_21_1454415124886_5895").show();
            break;
            //Cases 3, 4, 5 and 7 are for other forms and are not represented here
        case responseCodes[6]:
            //It's the second time to enter the form and it can either be to purchase new perks or to update information
            //Perk information is shown first
            //Call function to append contents to perks section
            var perksSectionClass = "eneuePerks";
            var jsonPerks = resultJson.perksJSON;
            jsonPerks = JSON.parse(jsonPerks);
            generatePerks(jsonPerks, perksSectionClass);
            //Show Button that reveals form 2 for updates
            $("#block-yui_3_17_2_2_1456637596700_7472").show();
            var bodyText = BODY_TEXT[6];
            var updatedData = UPDATED_DATA;
            var contributionData = CONTRIBUTION_DATA;
            window.eneueSupporterEmail = resultJson.email;
            window.eneueTransactionLocalizer = resultJson.localizer;
            window.eneueTransactionRegistry = resultJson.registry;
            window.eneueQuantity = resultJson.quantity;
            window.eneueDelivery = resultJson.delivery;
            window.eneueDesig = resultJson.desig;
            window.eneuePerkID = resultJson.perkID;
            window.eneueTitle = resultJson.title;
            window.eneueTimeStamp = resultJson.timestamp;
            window.eneueValidated = resultJson.valid;
            window.eneueFName = resultJson.fname;
            window.eneueLName = resultJson.lname;
            window.eneueId = resultJson.id;
            window.eneueCredits = resultJson.creditsPerks;
            window.eneueAddress = resultJson.address;
            window.eneueCity = resultJson.cityPerk;
            window.eneueZip = resultJson.zipPerk;
            window.eneueProvince = resultJson.provincePerk;
            var timestampDate = new Date(resultJson.timestamp);
            var timestampDay = timestampDate.getDate();
            var timestampMonth = timestampDate.getMonth() + 1;
            var timestampYear = timestampDate.getFullYear();
            var timestampHour = (timestampDate.getHours() < 10 ? '0' : '') + timestampDate.getHours();
            var timestampMin = (timestampDate.getMinutes() < 10 ? '0' : '') + timestampDate.getMinutes();
            window.eneueDateStampFormatted = timestampDay + "/" + timestampMonth + "/" + timestampYear;
            window.eneueTimeStampFormatted = timestampHour + ":" + timestampMin;
            //Hide unneccessary fields
            requiredFields(names, window.eneueQuantity, window.eneuePerkID);
            $(".eneueBodyText").html(bodyText);
            $(".eneueUpdatedData").html(updatedData);
            $(".eneueContributionData").html(contributionData);
            $(".perkEmailShow").html(window.eneueSupporterEmail);
            $(".perkLocalizerShow").html(window.eneueTransactionLocalizer);
            $(".perkDate").html(window.eneueDateStampFormatted);
            $(".perkTime").html(window.eneueTimeStampFormatted);
            $(".perkAmountShow").html(window.eneueQuantity);
            $(".perkTitleShow").html(window.eneueTitle);
            $(".perkDesigShow").html(window.eneueDesig);
            $(".perkDeliveryShow").html(window.eneueDelivery);
            $(".perkFirstNameShow").html(window.eneueFName);
            $(".perkLastNameShow").html(window.eneueLName);
            $(".perkIdShow").html(window.eneueId);
            $(".perkCreditsShow").html(window.eneueCredits);
            $(".perkAddressShow").html(window.eneueAddress);
            $(".perkCityShow").html(window.eneueCity);
            $(".perkZipShow").html(window.eneueZip);
            $(".perkProvinceShow").html(window.eneueProvince);
            $(".eneuePerks").show();
            break;
        case responseCodes[8]:
            var presentedText = BODY_TEXT[8];
            $(".eneueBodyText").html(presentedText);
            $(".eneueBodyText").show();
            break;
    }
});
