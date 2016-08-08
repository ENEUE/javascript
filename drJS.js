  //Declare app url
  var redirectDomain = "https://script.google.com/macros/s/AKfycbzICEw1n1BrsBsCgPMDL1VQ7bS9ka7O49s1pS4zkTLbM4g_CRNr/exec";
  //Declare all the response codes in an array
  var responseCodes = ["1F4", "3F8", "5DC", "7D0", "9C4", "BB8", "6D6", "FA0", "DAC"];

  /*  Transaction  */
  //Flag initialization
  window.perkTokenBeenCalled = false;
  window.perkButtonEnd = false;
  window.perkToggleState = null;

  //Capitalizes first letter, lower case the rest
  function toTitleCase(str) {
      return str.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
  }

  //Closes spinner while waiting stripe charge information
  function closeWaitDiv(id) {
      id = "#" + id;
      $(id).hide();
  }

  //Resets perk with ID blocks to the initial state
  function perkBlocksReset(id) {
      $("#" + id).find(".perkCustomDonationAmount").hide();
      $("#" + id).find(".perkPostFlight").hide();
      $("#" + id).find(".perkCustomButton").hide();
      $("#" + id).find(".perkBody").css("border-bottom", "none");
      $("#" + id).find(".perkToggle").css("pointer-events", "none");
  }

  // Close Checkout on page navigation
  $(window).on('popstate', function() {
      handler.close();
  });

  //checks if user has closed stripe window before submit
  $(document).on("DOMNodeRemoved", ".stripe_checkout_app", close);

  //Stripe declaration
  var handler = StripeCheckout.configure({
      key: 'pk_test_AfqpiD3DBLtXD8u39JwGErf8',
      image: 'https://estonoesunaescuela.squarespace.com/s/anagrama_peq_color_whitebckgrnd_small.png',
      locale: 'auto',
      currency: "EUR",
      panelLabel: "Dona {{amount}}",
      allowRememberMe: "false",
      receipt_email: window.eneueSupporterEmail,
      token: function(token, args) {
          window.perkTokenBeenCalled = true;
          var Query = "stripeEmail=" + token.email + "&stripeToken=" + token.id + "&amount=" + window.amountCents + "&itemID=" + window.perkCode + "&localizer=" + window.eneueTransactionLocalizer + "&islive=" + token.livemode;
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
          //Show Ajax spinner
          $('.eneueBodyText').hide();
          $('.eneueContributionData').hide();
          $('.eneueUpdatedData').hide();
          $('.eneuePerks').hide();
          $('.perkWait').show();
          request.done(function(resultJson) {
              //Hide Ajax spinner
              $('.perkWait').hide();
              //Check if lock has been acquired
              var date = new Date();
              var n = date.toLocaleDateString();
              var t = date.toLocaleTimeString();
              var now = "El día " + n + " a las " + t;
              var beenHacked = false;
              var beenLocked = false;
              if (resultJson.responsecode == responseCodes[8]) {
                  beenLocked = true;
              }
              if (beenHacked) {
                  $('.eneueSuccessAjax').html('Se ha producido un error en el servidor. Inténtelo más tarde.');
              } else if (beenLocked) {
                  $('.eneueSuccessAjax').html('El servidor está ocupado en este momento. Vuelve a intentarlo en un minuto.');
              } else {
                  window.amountR = resultJson.amount / 100;
                  window.last4 = resultJson.last4;
                  window.eMail = resultJson.eMail;
                  window.localizer = resultJson.localizer;
                  $('.eneueSuccessAjax').find(".perkAmountShow").html(window.amountR);
                  $('.eneueSuccessAjax').find(".perkUlt4Show").html(window.last4);
                  $('.eneueSuccessAjax').find(".perkEmailShow").html(window.eMail);
                  $('.eneueSuccessAjax').find(".perkLocalizerShow").html(window.localizer);
                  $('.eneueSuccessAjax').find(".perkDate").html(now);
                  var chain = "<br>No has concursado en la rifa";
                  window.perkTokenBeenCalled = false;
                  window.perkButtonEnd = true;
                  window.beenShared = false;
                  $('.eneueSuccessAjax').show();
                  $("#block-yui_3_17_2_2_1455033745983_13062").show();
                  mailChimper(resultJson);
              }
          });
      }
  });

  //When clicking on perk selection
  $(document).on('click', '.perkRadio', function(e) {
      $(".perkSend").hide();
      $(".perkPostFlight").hide();
      $(".perkCustomButton").hide();
      $(".perkBody").css("border-bottom", "none");
      window.containerID = e.currentTarget.attributes._parent.value;
      $("#" + window.containerID).siblings().css("border", "none");
      $("#" + window.containerID).siblings().css("box-shadow", "none");
      $("#" + window.containerID).css("border", "2px solid #AB0096");
      $("#" + window.containerID).css("box-shadow", "2px 2px 8px 1px #766896");
      $("#" + window.containerID).find(".perkCustomDonationAmount").on('input', function() {
          var amount = $(this).val();
      });
      window.amount = $("#" + window.containerID).find(".perkCustomDonationAmount").val();
      $(".perkContenedor").css("height", "auto");
      $("#" + window.containerID).find(".perkCustomButton").html("Continuar");
      $("#" + window.containerID).find(".perkBody").css("border-bottom", "dashed 1px lightgrey");
      $("#" + window.containerID).find(".perkCustomDonationAmount").css("display", "block");
      $("#" + window.containerID).find(".perkCustomButton").show();
      $("#" + window.containerID).find(".perkCustomDonationAmount").show();
      $("#" + window.containerID).find(".perkSend").show();
      $("#" + window.containerID).find(".perkPreFlight").show();
  });
  //When clicking on pay button
  $(document).on('click', '.perkCustomButton', function(e) {
      var perkRoot = window.containerID;
      perkRoot = perkRoot.replace('div', '');
      var inputBoxId = $("#" + window.containerID).find(".perkCustomDonationAmount").attr("id");
      var inputBoxMin = parseInt($("#" + window.containerID).find(".perkCustomDonationAmount").attr("min"), 10);
      if (parseInt($("#" + inputBoxId).val(), 10) < inputBoxMin) {
          $("#" + inputBoxId).val(inputBoxMin);
      }
      if (window.perkButtonEnd == false) {
          window.amount = $("#" + window.containerID).find(".perkCustomDonationAmount").val();
          window.amountCents = window.amount * 100;
          window.perkCode = $("#" + window.containerID).attr("name");
          window.perkDescription = $('#' + window.containerID).find('span#span' + perkRoot + 'Description').text();
          handler.open({
              name: '@noesunaescuela',
              description: window.perkDescription,
              amount: window.amountCents
          });
      } else if (window.perkButtonEnd == true) {
          perkBlocksReset(window.containerID);
          window.perkButtonEnd = false;
      }
  });

  $(document).ready(function() {
      //Asigna atributo "name" a todos los campos para que lo pueda interceptar serialize
      var names = ["nombre", "apellidos", "DNI", "creditos", "dir1", "dir2", "ciudad", "cp"];
      //Esconde el segundo formulario
      $("#block-yui_3_17_2_21_1454415124886_5895").hide();
      //Esconde el botón de recargar
      $("#block-yui_3_17_2_2_1455033745983_13062").hide();
      //Esconde el botón de mostrar formulario 2
      $("#block-yui_3_17_2_2_1456637596700_7472").hide();
      //Hide html sections that shouldn't be visible on load 
      $(".updateFormContainer").hide();
      $(".updateFormNoData").hide();
      $(".eneueContributionData").hide();
      $(".eneuePerks").hide();
      $(".eneueUpdatedData").hide();
      //Asigna atributo "name" al campo "localizer" para que lo pueda interceptar serialize
      $("#block-yui_3_17_2_22_1454415124886_463220").find("form").find("input.text").attr('name', 'localizer');
      //Intercepta los datos enviados desde el primer formulario
      $("#block-yui_3_17_2_22_1454415124886_463220").find("form").submit(function(e, data) {
          $theForm = $(this);
          window.updateCustomerData = $theForm.serialize();
      });
      $("#block-yui_3_17_2_21_1454415124886_5895").find("form").find("input.text").each(function(i) {
          $(this).attr('name', names[i])
      });
      //Intercepta los datos enviados desde el segundo formulario
      $("#block-yui_3_17_2_21_1454415124886_5895").find("form").submit(function(e, data) {
          $theForm = $(this);
          window.updateCustomerDataQuery = $theForm.serialize();
      });
      //End of Document Ready
  });

  //Cuando se pulsa el botón con id @block-yui_3_17_2_2_1455033745983_13062 se recarga la página en el navegador
  $("#block-yui_3_17_2_2_1455033745983_13062").find("a").click(function(e) {
      e.preventDefault();
      location.reload(true);
  });
  //Clicking on this button shows form 2 and present data id="block-yui_3_17_2_2_1456637596700_7472"
  $("#block-yui_3_17_2_2_1456637596700_7472").find("a").click(function(e) {
      e.preventDefault();
      $("#block-yui_3_17_2_21_1454415124886_5895").show();
      $(".eneueContributionData").show();
      $(".eneueUpdatedData").show();
      $("#block-yui_3_17_2_2_1456637596700_7472").hide();
  });

  //Filtering function. Filters @arr considering @criteria in object form
  function filterById(arr, criteria) {
      return arr.filter(function(obj) {
          return Object.keys(criteria).every(function(c) {
              return obj[c] == criteria[c];
          });
      });
  }

  //Creates a DOM object from an array of objects @perksJson [{delivery=xxx, perkAmount=n, description=abc, perkID=abc, soldItems=n, perkTitle=zzz},...]
  function generatePerks(perksJson, classDef) {
      //Check perksJson is not an empty array
      if (perksJson.length > 0) {
          $(classDef).html('<br>');
          var mainContainerSection = $("." + classDef);
          var containerSection = $('<section/>')
              .addClass("outPerks")
              .appendTo(mainContainerSection);
          var containerArticle = $("<article/>")
              .addClass("perksContainerBody")
              .attr('id', 'newPerksOnTheBlock')
              .appendTo(containerSection);
          var containerHeader = $("<header/>")
              .appendTo(containerArticle);
          //Declare array with static values por Perks (description, delivery, conditions) !!Update if necessary
          var perkCFValues = [{
              'perkID': "PERK5",
              perkDescription: "No quieres regalos, ni que tu nombre aparezca en ningún sitio. Te entendemos. Por eso queremos permitirte la posibilidad de que puedas donar a esta campaña y que se respete tu voluntad. Por encima de €3 tú eliges cuánto.",
              perkConditions: "",
              perkDelivery: ""
          }, {
              'perkID': "PERK3",
              perkDescription: "Todos los viajes comienzan con un pequeño paso. Te queremos agradecer que hayas iniciado el tuyo con nosotras publicando tu nombre en la web del documental.",
              perkConditions: "",
              perkDelivery: "Entrega prevista para "
          }, {
              'perkID': "PERK4",
              perkDescription: "Si eres de las que te quedas en la sala de cine mirando los créditos cuando ya se ha ido todo el mundo estás de suerte. En la siguiente línea podrías salir tú.",
              perkConditions: "",
              perkDelivery: "Entrega prevista para "
          }, {
              'perkID': "PERK20",
              perkDescription: "<strong>El libro que inspiró nuestro viaje y revolucionó nuestra visión de la educación.</strong> Su autor, Peter Gray, es catedrático de Psicología, y un defensor infatigable y tremendamente lúcido de una educación que responda de verdad a las necesidades de los niños y jóvenes.<br><br>Recibirás como regalo por tu donación \"Aprender en libertad\" y además tu nombre saldrá en los agradecimientos de la web y en los créditos del documental.<br><br>280 páginas aprox., traducción al español del original en edición de bolsillo con tapas blandas e impreso en papel ecológico.",
              perkConditions: "Sólo para España. Gastos de envío <em>incluidos</em>.",
              perkDelivery: "Entrega prevista para "
          }, {
              'perkID': "PERK10",
              perkDescription: "Cuando conocimos esta historia supimos que <strong>de niños hubiéramos querido que alguien nos la contara.</strong> \"Los náufragos de Tonga\" es una edición exclusiva de un cuento escrito por Ana García-Castellano e ilustrado por Alicia Borges.<br><br>Recibirás como regalo por tu donación \"Los náufragos de Tonga\", y además tu nombre saldrá en los agradecimientos de la web y en los créditos del documental.<br><br>Tapas duras, 32 páginas, impreso en papel ecológico a todo color.",
              perkConditions: "Sólo para España. Gastos de envío <em>incluidos</em>.",
              perkDelivery: "Entrega prevista para "
          }, {
              'perkID': "PERK22",
              perkDescription: "Los dos libros que te presentamos son <strong>ediciones que no se encuentran actualmente en el mercado</strong>, y que editaremos exclusivamente para esta campaña. Ambos narran historias reales que dan un giro a la concepción tradicional de la infancia y la educación.<br><br>Recibirás como regalo por tu donación los dos libros que editamos, \"Los náufragos de Tonga\" y \"Aprender en libertad\", y tu nombre aparecerá en los agradecimientos de la web así como en los créditos del documental.",
              perkConditions: "Sólo para España. Gastos de envío <em>incluidos</em>.",
              perkDelivery: "Entrega prevista para "
          }];

          //Update post flight section
          //Declares post flight section
          var postFlightSection = $('.eneueSuccessAjax');

          //Adds the post flight section
          var perkSection = $("<section/>")
              .appendTo(postFlightSection);
          div = $('<div/>')
              .addClass('divPerkResponse')
              .appendTo(perkSection);
          p = $('<p/>')
              .addClass('perkCenterFont')
              .appendTo(div);
          $('<strong/>')
              .text('¡Muchas gracias!')
              .appendTo(p);
          $('<br/>')
              .after('Este proyecto no existiría sin tu ayuda.')
              .appendTo(p);
          p = $('<p/>')
              .text('En las próximas horas recibirás un email en la dirección que nos indicaste al autorizar el cargo en tu tarjeta. Si transcurridas 72h no lo has recibido comprueba tu bandeja de spam, podría estar ahí. En caso de que no esté escríbenos a:')
              .addClass('perkFontSmall')
              .appendTo(div);
          $('<br/>')
              .appendTo(p);
          $('<br/>')
              .appendTo(p);
          $('<a/>')
              .attr('href', 'mailto:colabora@estonoesunaescuela.org')
              .attr('target', '_top')
              .text('colabora@estonoesunaescuela.org')
              .appendTo(p);
          $('<br/>')
              .appendTo(p);
          $('<p/>')
              .text('indicándonos el número de referencia de tu donación y nos pondremos en contacto contigo.')
              .appendTo(p);
          $('<br/>')
              .appendTo(p);
          $('<strong/>')
              .text('IMPORTANTE: Si con tu nueva contribución has superado los €25 en total, por favor vuelve a rellenar el formulario, ya que es posible que sea necesario que nos facilites nuevos datos, como la dirección de envío, por ejemplo.')
              .appendTo(p);
          p = $('<p/>')
              .appendTo(div);
          $('<span/>')
              .addClass('perkDate')
              .appendTo(p)
          p = $('<p/>')
              .text('Has realizado una donación adicional de €')
              .appendTo(div);
          strong = $('<strong/>')
              .appendTo(p);
          $('<span/>')
              .addClass('perkAmountShow')
              .appendTo(strong);
          $('<span/>')
              .text(' para la producción de un documental sobre educación con los siguientes datos:')
              .appendTo(p);
          p = $('<p/>')
              .text('Correo electrónico:')
              .appendTo(div);
          strong = $('<strong/>')
              .appendTo(p);
          $('<span/>')
              .addClass('perkEmailShow')
              .appendTo(strong);
          p = $('<p/>')
              .text('Tarjeta de crédito: **** **** **** ')
              .appendTo(div);
          strong = $('<strong/>')
              .appendTo(p);
          $('<span/>')
              .addClass('perkUlt4Show')
              .appendTo(strong);
          p = $('<p/>')
              .text('Número de referencia (conviene que lo anotes): ')
              .appendTo(div);
          strong = $('<strong/>')
              .appendTo(p);
          $('<span/>')
              .addClass('perkLocalizerShow')
              .appendTo(strong);
          //Update the json object with @perkCFValues   
          for (var i = 0; i < perksJson.length; i++) {
              //Gets the extra values for each perk
              var perkCFvalue = filterById(perkCFValues, {
                  perkID: perksJson[i].perkID
              });
              //Extract number of perk
              var perkID = perksJson[i].perkID;
              var perkIDNumber = perkID.replace("PERK", "");
              //Adds main section for each perk
              var sectionPerkN = $("<section/>")
                  .addClass("perkContenedor clearfix")
                  .attr('id', 'divPerk' + perkIDNumber)
                  .attr('name', 'PERK' + perkIDNumber)
                  .appendTo(containerHeader);
              //Adds the header
              var perkHeader = $("<header/>")
                  .addClass('headerMain')
                  .attr('id', 'divPerk' + perkIDNumber + 'HeaderMain')
                  .appendTo(sectionPerkN);
              var perkSubHeader = $("<header/>")
                  .addClass('header')
                  .attr('id', 'divPerk' + perkIDNumber + "Header")
                  .appendTo(perkHeader);
              var div = $('<div/>')
                  .addClass('perkTitle')
                  .attr('id', 'divPerk' + perkIDNumber + 'Title')
                  .appendTo(perkSubHeader);
              var h4 = $('<h4/>')
                  .appendTo(div);
              $('<input/>')
                  .attr('type', 'radio')
                  .attr('name', 'perkRadio')
                  .attr('_parent', 'divPerk' + perkIDNumber)
                  .attr('id', 'togglePerk' + perkIDNumber)
                  .addClass('perkRadio')
                  .appendTo(h4);
              var label = $('<label/>')
                  .attr('for', 'togglePerk' + perkIDNumber)
                  .text('Dona €')
                  .appendTo(h4);
              //I have my concerns with this....
              $('<span/>')
                  .attr('id', 'spanPerk' + perkIDNumber + 'Price')
                  .text(perksJson[i].perkAmount)
                  .appendTo(label);
              $('<span/>')
                  .text(' o más | ')
                  .appendTo(label);
              $('<span/>')
                  .attr('id', 'spanPerk' + perkIDNumber + 'Description')
                  .text(perksJson[i].perkTitle)
                  .appendTo(label);
              div = $('<div/>')
                  .addClass('perkStats')
                  .attr('id', 'divPerk' + perkIDNumber + 'Stats')
                  .appendTo(perkSubHeader);
              var p = $('<p/>')
                  .appendTo(div);
              $('<span/>')
                  .attr('id', 'spanPerk' + perkIDNumber + "SoldItems")
                  .text(perksJson[i].soldItems)
                  .appendTo(p);
              $('<span/>')
                  .text(' apoyos')
                  .appendTo(p);

              //Adds the SubSection
              var section = $('<section/>')
                  .addClass('perkBody')
                  .attr('id', 'divPerk' + perkIDNumber + 'Body')
                  .appendTo(perkHeader);
              div = $('<div/>')
                  .addClass('perkDesc')
                  .attr('id', 'divPerk' + perkIDNumber + 'Desc1')
                  .appendTo(section);
              $('<p/>')
                  .html(perkCFvalue[0].perkDescription)
                  .appendTo(div);
              div = $('<div/>')
                  .addClass('perkDelivery')
                  .attr('id', 'divPerk' + perkIDNumber + 'Delivery')
                  .appendTo(section);
              var p = $('<p/>')
                  .text(perkCFvalue[0].perkDelivery)
                  .appendTo(div);
              $('<span/>')
                  .text(perksJson[i].delivery)
                  .attr('id', 'spanPerk' + perkIDNumber + 'Delivery')
                  .appendTo(p);
              $('<br/>')
                  .appendTo(p);
              $('<span/>')
                  .html(perkCFvalue[0].perkConditions)
                  .appendTo(p);
              //Adds the footer
              var perkFooter = $("<footer/>")
                  .addClass('perkSend perkDivHidden')
                  .attr('id', 'divPerk' + perkIDNumber + 'Send')
                  .appendTo(sectionPerkN);
              header = $('<header/>')
                  .addClass('perkAmount')
                  .attr('id', 'divPerk' + perkIDNumber + 'Amount')
                  .appendTo(perkFooter);
              $('<label/>')
                  .attr('for', 'divPerk' + perkIDNumber + 'customDonationAmount')
                  .addClass('amountLabel')
                  .text('Cantidad €')
                  .appendTo(header);
              $('<input/>')
                  .addClass('perkCustomDonationAmount perkDivHidden')
                  .attr('type', 'number')
                  .attr('id', 'divPerk' + perkIDNumber + 'customDonationAmount')
                  .attr('step', '5')
                  .attr('name', 'perkAmount')
                  .attr('pattern', '[0-9]*')
                  .attr('min', perksJson[i].perkAmount)
                  .attr('title', 'Introduce una cantidad mayor de €' + perksJson.perkAmount)
                  .attr('placeholder', 'p.ej. € ' + (perksJson[i].perkAmount + 10))
                  .appendTo(header);
              $('#' + 'divPerk' + perkIDNumber + 'customDonationAmount').val(perksJson[i].perkAmount);
              $('<div/>')
                  .addClass('perkCustomButton perkButton perkBUttonDisplayNone perkPointer')
                  .attr('id', 'divPerk' + perkIDNumber + 'CustomButton')
                  .appendTo(perkFooter);
          }
      }
  }

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
          jsonpCallback: 'returningCharge',
          dataType: 'jsonp',
          data: Query
      });
  }
