// TO DO:
// improve data snapshot for wind direction (high/low aren't very descriptive/applicable)
// frequent 504 error on retrieving tower data?
// temperature mapping is off (graphing degrees about 20° higher than they should be)
// display somewhere the actual time range of the data, since tower data isn't always recent?
// is the time axis labeled correctly? according to the numbering along the bottom, it seems most recent values
//   should be to the right. but according to the  timestamps, the most recent values are on the left.



var bottomBarTemplate = $('#handlebars-data-bar').html(),
    bottomBarTemplateScript = Handlebars.compile(bottomBarTemplate),
    sidebarTemplate = $('#handlebars-snapshot').html(),
    sidebarTemplateScript = Handlebars.compile(sidebarTemplate);


function updateBottomBar() {
  var bottomBarData = {},
      lastIdx = sensorValues["temperature_f"].length - 1,
      time = new Date().toLocaleTimeString();

  bottomBarData.temperature_f = Math.round(sensorValues["temperature_f"][lastIdx]);
  var tempCels = (sensorValues["temperature_f"][lastIdx] - 32) / 1.8;
  bottomBarData.temperature_c = formatCelsiusTemp(Number(Math.round(tempCels + 'e1') + 'e-1'));
  bottomBarData.windspeed = sensorValues["wind_speed_mph"][lastIdx];
  bottomBarData.pressure = sensorValues["pressure_pa"][lastIdx];
  bottomBarData.rainfall = sensorValues["rain_in"][lastIdx];
  bottomBarData.time = time.replace(time.substring(5, 8), "");

  var compiledHTML = bottomBarTemplateScript(bottomBarData);
  $('.data-bar .data').empty();
  $('.data-bar .data').append(compiledHTML);
}

function updateSidebar() {
  var sidebarData = {},
      currentCat = dropdown.elt.value,
      lastIdx = sensorValues[currentCat].length - 1;

  sidebarData.current = sensorValues[currentCat][lastIdx];
  sidebarData.high = Math.max(...sensorValues[currentCat]);
  sidebarData.low = Math.min(...sensorValues[currentCat]);
  sidebarData.unit = optionsInfo[currentCat].unit;

  var compiledHTML = sidebarTemplateScript(sidebarData);
  $('.data-snapshot').empty();
  $('.data-snapshot').append(compiledHTML);

  $('#data-category').html(optionsInfo[currentCat].text);
  $('#data-description').html(optionsInfo[currentCat].description);
}

function formatCelsiusTemp(temp) {
  temp = temp.toString();
  var decimalIndex = temp.indexOf('.');
  return temp.slice(0, decimalIndex) + "<span class='decimal'>" + temp.slice(decimalIndex) + "</span>";
}

function formatDateTime(timeStr) {
  var regex   = /([0-9]*)-([0-9]*)-([0-9]*)T([0-9]{2}):([0-9]{2})/,
      groups  = regex.exec(timeStr),    // ["2016-10-17T07:20", "2016", "10", "17", "07", "20"]
      month   = groups[2],
      day     = groups[3],
      year    = groups[1],
      hour    = groups[4],
      minute  = groups[5],
      ampm;

  if (parseInt(hour) < 12) {
    ampm = "am";
  }
  else {
    hour = (parseInt(hour) - 12).toString();
    ampm = "pm";
  }

  return 1(month + "/" + day + "/" + year + " " + hour + ":" + minute + ampm);
}
