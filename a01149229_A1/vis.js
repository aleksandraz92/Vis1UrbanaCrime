d3.csv("urbana_crimes.csv", function (data) {


        var svg = d3.select("body").append("svg")
            .attr("height", 500)
            .attr("width", 900);



        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        // https://www.quora.com/What-are-the-latitude-and-longitude-of-the-U-S-A  Variable which gives us Longitude and Latitude for USA
        var longitudeAmericaR = -124.75;
        var longitudeAmericaL = -66.95;
        var latitudeAmericaT = 25.84;
        var latitudeAmericaB = 49.38;

        // Urbana Longitude and Latitude from .csv file
        var UrbanaLatitude = 40.10;
        var UrbanaLongitude = -88.21;

        //Scaling
        var longitudeScale = d3.scaleLinear()
            .domain([longitudeAmericaR, longitudeAmericaL])
            .range([0, 900]);

        var latitudeScale = d3.scaleLinear()
            .domain([latitudeAmericaB, latitudeAmericaT])
            .range([0, 500]);

        var latitudeArray = [];
        var longitudeArray = [];
        var nameString = [];
        var arresteeSexArray=[];
        var n = 0;


        data.forEach((element) => {
            var mappedArresteeHomeCity = element['ARRESTEE HOME CITY - MAPPED'];
            if (mappedArresteeHomeCity != null) {
                var coordinatesAsString = mappedArresteeHomeCity.substr(mappedArresteeHomeCity.indexOf('(') + 1).slice(0, -1);
                var coordinates = coordinatesAsString.split(/,/);
                var coordinatesAsFloats = [];

                coordinates.forEach((el) => {


                    // coordinatesAsFloats.push(parseFloat(el));
                    coordinatesAsFloats.push(el.trim());
                });


//in Range so it can display?
                if ((coordinatesAsFloats[0] > latitudeAmericaT && coordinatesAsFloats[0] < latitudeAmericaB) || (coordinatesAsFloats[1] > longitudeAmericaL && coordinatesAsFloats[1] < longitudeAmericaR) && !isNaN(coordinatesAsFloats[0]) && !isNaN(coordinatesAsFloats[1])) {
                    latitudeArray[n] = coordinatesAsFloats[0];
                    longitudeArray[n] = coordinatesAsFloats[1];
                    arresteeSexArray[n]=element['ARRESTEE SEX'];
                    nameString[n] = element['ARRESTEE HOME CITY'];

                    n++;
                }
            }

        });
        var CityCord = [];
        for (var i = 0; i < latitudeArray.length; i++) {
            CityCord[i] = {latitude: latitudeArray[i], longitude: longitudeArray[i], name: nameString[i], gender:arresteeSexArray[i] };
        }

        svg.selectAll("line")
            .data(CityCord)
            .enter()
            .append("line")
            .attr("x1", longitudeScale(UrbanaLongitude))

            .attr("y1", latitudeScale(UrbanaLatitude))

            .attr("x2", function (d) {
                return longitudeScale(d.longitude);
            })
            .attr("y2", function (d) {
                return latitudeScale(d.latitude);
            })
            .style("stroke", function(d) { switch (d.gender) {
                case "FEMALE": return "red";
                case "MALE": return "black";
                default : return "steelblue";}
            })


           // .style("stroke", "steelblue")
            .style("stroke-width", 0.2)

          
        svg.selectAll("circle")
            .data(CityCord)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return longitudeScale(d.longitude);
            })
            .attr("cy", function (d) {
                return latitudeScale(d.latitude);
            })
            .attr("r", 1)
            .style("fill", function(d) { switch (d.gender) {
                case "FEMALE": return "red";
                case "MALE": return "black";
                default : return "steelblue";}
            })
  //// quelle : http://bl.ocks.org/d3noob/a22c42db65eb00d4e369 mouseover
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.name + "<br/>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0)
            });


        //Add the labels
        /* svg.selectAll("text")
             .data(CityCord)
             .enter()
             .append("text")
             .attr("x", function (d) {
                 return longitudeScale(d.longitude);
             })
             .attr("y", function (d) {
                 return latitudeScale(d.latitude);
             })
             .text(
                 function (d) {
                     return d.name;
                 })
             .attr("font-family", "sans-serif")
             .attr("font-size", "5px")
             .attr("fill", "black");




  */


        var xAxis = d3.axisBottom();
        xAxis.scale(longitudeScale);
        var xAxisGroup = svg.append("g")
            .call(xAxis);


        var yAxis = d3.axisRight();
        yAxis.scale(latitudeScale);
        var yAxisGroup = svg.append("g")
            .call(yAxis);


    })
    ;
