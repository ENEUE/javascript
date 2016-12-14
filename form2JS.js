//Declare app url
var redirectDomain = "https://script.google.com/macros/s/AKfycbzICEw1n1BrsBsCgPMDL1VQ7bS9ka7O49s1pS4zkTLbM4g_CRNr/exec";
//Declare all the response codes in an array
var responseCodes = ["1F4", "3F8", "5DC", "7D0", "9C4", "BB8", "6D6", "FA0", "DAC"];
//Declare text contents for html sections
var BODY_TEXT = ["<p>¡Gracias por actualizar tus datos! Te acabamos de enviar un email con los datos que nos has facilitado y un enlace para que los valides. Por último, si lo deseas y aún no lo has hecho, <strong>ahora puedes hacer una nueva aportación al proyecto.</strong></p><br><p><strong>IMPORTANTE: Si decides completar tu aportación se te asignará el nuevo obsequio que reemplazará al que tuvieras previamente asignado. Por ejemplo, si tu obsequio era el libro de P. Gray y decides completar con €10, tu nuevo obsequio sería \"Los náufragos de Tonga\". Para tener los dos tendrías que completar con €25.</strong></p>", 
"Se ha producido un error en la transacción. Pronto nos pondremos en contacto contigo."];
var CONTRIBUTION_DATA = "<p>Estos son los datos que constan en nuestros registros sobre tu aportación:</p><br><p>Correo electrónico: <strong><span class = \"perkEmailShow\"></span></strong></p><p>Número de referencia: <strong><span class = \"perkLocalizerShow\"></span></strong></p><p>El día <span class = \"perkDate\"></span> a las <span class = \"perkTime\"></span> realizaste una donación de €<strong><span class = \"perkAmountShow\"></span></strong> para la producción de un documental sobre educación. Elegiste como obsequio \"<strong><span class = \"perkTitleShow\"></span></strong>\". <strong><span class = \"perkDesigShow\"></span></strong> La fecha estimada de entrega es: <strong><span class = \"perkDeliveryShow\"></span></strong>.</p>";

var UPDATED_DATA = "<p>Estos son los datos que nos has facilitado:<p><br><p>Nombre: <strong><span class = \"perkFirstNameShow\"></span></strong></p><p>Apellidos: <strong><span class = \"perkLastNameShow\"></span></strong></p><p>DNI: <strong><span class = \"perkIdShow\"></span></strong></p><p>Email: <strong><span class = \"perkEmailShow\"></span></strong></p><p>Cómo figurarás en los créditos: <strong><span class = \"perkCreditsShow\"></span></strong></p><p>Dirección postal de envío: <strong><span class = \"perkAddressShow\"></span></strong></p><p>Ciudad: <strong><span class = \"perkCityShow\"></span></strong></p><p>Código postal: <strong><span class = \"perkZipShow\"></span></strong></p><p>Provincia: <strong><span class = \"perkProvinceShow\"></span></strong></p>";
var WARNING = "<p>¡Todavía no has validado los datos que nos has facilitado! Por favor <strong>haz click en el enlace que te acabamos de enviar por email</strong> para que podamos hacerte entrega de tu obsequio. ¡Gracias!</p>";
var PERKS = "<p>Diego, <strong>¿te gustaría implicarte aun más en este proyecto?</strong> Ahora tienes la posibilidad de hacerlo. Al elegir colaborar con alguna de estas aportaciones que hemos personalizado para ti, nos ayudarás a mejorar aún más el documental \"Corriendo por las olas\". Gracias de antemano.</p>";


//Declares query to be sent to the server app
var query = window.updateCustomerDataQuery + "&email=" + window.eneueSupporterEmail + "&localizer=" + window.eneueTransactionLocalizer + "&register=" + window.eneueTransactionRegistry + "&valid=" + window.eneueValidated;
//Replaces + signs for white spaces
query = query.replace(/\+/g, " ");
//Encode query in base64
var eQuery = window.btoa(unescape(encodeURIComponent(query)));
//Build query payload
var Query = {
  e: eQuery
};
//Call server
var request = $.ajax({
  type: 'get',
  url: redirectDomain,
  jsonpCallback: 'updateCustomerAdvanced',
  contentType: "application/json",
  dataType: 'jsonp',
  data: Query
});
$('.perkWait').show();


//Process answer from server
request.done(function(resultJson) {
  $('.perkWait').hide();
  switch(resultJson.responsecode) {
    //Server has completed the updated successfully
    case responseCodes[3]:
    //Perk information is shown first
    //Call function to append contents to perks section
    var perksSectionClass = "eneuePerks";
    var jsonPerks = resultJson.perksJSON;
    jsonPerks = JSON.parse(jsonPerks);
    $(perksSectionClass).html('<br>');
    generatePerks(jsonPerks, perksSectionClass);
    var bodyText = BODY_TEXT[0]; 
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
    var timestampMonth =timestampDate.getMonth() + 1;
    var timestampYear =timestampDate.getFullYear();
    var timestampHour =(timestampDate.getHours() < 10 ? '0':'') + timestampDate.getHours();
    var timestampMin = (timestampDate.getMinutes() < 10 ? '0':'') + timestampDate.getMinutes();
    window.eneueDateStampFormatted = timestampDay + "/" + timestampMonth + "/" + timestampYear;
    window.eneueTimeStampFormatted = timestampHour + ":" + timestampMin;
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
    //Show sections
    $(".eneueUpdatedData").show();
    $(".eneuePerks").show();
    break;
    //There's been a problem in the transaction
    case responseCodes[7]:

    break;
    case responseCodes[8]:
      var presentedText ="<p>El servidor está ocupado en estos momentos. Vuelve a intentarlo pasados unos minutos</p>";
        $(".eneueBodyText").html(presentedText);
        $(".eneueBodyText").show();
 
    break;

}
});