// Populate the Metro Area dropdown using the values stored in an external CSV
var dropdown = $("#metro-area-dropdown");

$.ajax({
  type: "GET",
  url: "https://raw.githubusercontent.com/datacult/Gloo-He-Gets-Us/main/msa-values.csv",
  dataType: "text",
  success: function (data) {
    // handle the csv data and append each item to the dropdown list
    var valuesArray = data.split("\n");
    $.each(valuesArray, function (index, value) {
      if (value.trim() !== "") {
        dropdown.append($("<a />").attr('href', '#').text(value.trim()).addClass(["dropdown-link", "body-regular", "light", "w-dropdown-link"]));
      }
    });

    // update the default title to All Metro Areas
    $("#metro-area-text").text("All Metro Areas");

    // add event listener to dropdown after values have been added
    $("#metro-area-dropdown a").on("click", function (event) {

      // make the dropdown close after a selection is made
      $(".w-dropdown").trigger("w-close");
      event.preventDefault();

      // grab the selected item, update the dropdown text and create a filter object
      var selectedLink = $(this).text();
      $("#metro-area-text").text(selectedLink);

      console.log("Selected : " + selectedLink);
      var filter = [{ "column": "MSA", "operand": "IN", "values": [selectedLink] }]

      // loop through all iframes on the page and update the src with the filter
      $('iframe:not(.No-metro)').each(function () {
        if ($(this).attr("src").search("domo") != -1) {
          var src = $(this).attr("src").split("?")[0];

          var updatedSrc = src + "?pfilters=" + encodeURIComponent(JSON.stringify(filter));
          $(this).attr("src", updatedSrc);
        }
      });
    });
  }
});