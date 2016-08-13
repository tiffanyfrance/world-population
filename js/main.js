// World Map
d3.csv('world_population.csv', function(error, data) {
	
	var dataset = {};

	for (var i = 0; i < data.length; i++) {
		for (var key in data[i]) {
			if(key !== "Country_Name" && key !== "Country_Code") {
				if(!(key in dataset)) {
					dataset[key] = [];
				}

				var obj = {
					Country_Name: data[i]["Country_Name"],
					Country_Code: data[i]["Country_Code"],
					Population: +data[i][key]
				}

				dataset[key].push(obj)
			}
		}
	}

	datamap(dataset);
});

var datamap = function(dataset) {

	// TODO use for all years
	// for (var key in dataset) {
	// 	for (var i = 0; i < dataset[key].length; i++) {
	// 		console.log(dataset[key][i]);
	// 		console.log(dataset[key][i].Population);
	// 	}
	// }

	var evalColor = [];

	for (var i = 0; i < dataset[2014].length; i++) {
		var row = dataset[2014][i].Population;
		if (!isNaN(row)) {
			evalColor.push(row);
		}
	}

	var maxVal = d3.max(evalColor, function(d) {return d;});
	var minVal = d3.min(evalColor, function(d) {if (d > 0) {return d;}});
	//Create custom ranges instead?
	var paletteScale = d3.scale.linear()
			.domain([minVal,(minVal + maxVal)/10,maxVal])
			.range(['#D1E3ED','#3E9BF0','#338FE3']);

	var fillObj = {};

	// fill dataset in appropriate format
	dataset[2014].forEach(function(d, i) {
		var countryCode = d.Country_Code,
				value = d.Population;

		fillObj[countryCode] = {val: value, fillColor: paletteScale(value), countryCode: countryCode};
	});

	var formatter = d3.format('.2s');

	var map = new Datamap({
		element: document.getElementById("map"),
		projection: 'mercator',
		width: 900,
		height: 650,
		fills: {
			defaultFill: "#D1E3ED"
		},
		data: fillObj,
		geographyConfig: {
			highlightFillColor: '100%',
			highlightBorderColor: '#FDFDFD',
			popupTemplate: function(geo, data) {
					return ['<div class="hoverinfo"><strong>', geo.properties.name,
					'</strong><br>', formatter(data.val), '</div>'].join('');
				}
			}
	});
};
