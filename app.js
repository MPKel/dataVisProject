
$(document).ready(function(){

  let emailData = [
    { entry_id: "6829", title: "Mapping Experiences: It’s the Destination and the Journey", sendDate: 1531329455, engDate: "07/11/2018", fileName: "mappingExperiences.csv"},
    {entry_id: "4812", title: "Sharing our Stories: Designing and Reviewing UX Portfolios", sendDate: 1531495771, engDate: "07/13/2018", fileName: "sharingOurStories.csv"},
    {entry_id: "4997", title: "Measuring The Customer Experience Using Top Tasks", sendDate: 1531919432, engDate: "07/18/2018", fileName: "measuringTheCustomerExperience.csv"},
    {entry_id: "3303", title: "A User-centered Approach to Product Planning and Visioning", sendDate: 1531329455, engDate: "07/20/2018", fileName: "aUserCenteredApproach.csv"},
    {entry_id: "10715", title: "IA lense(for test purposes)", sendDate: 1536765928, engDate: "09/12/2018", fileName: "testText.tsv"}

  ];




let finalData = [];



let activeIndex;

  $('input[type=radio]').click(function(){
        setActiveIndex(this.value)
    });

    let drawData = [
          {
              date: "",
              tally: "",
              entryId: ""
          }

      ];






function convertToDateTime(num) {
  if(num % 2 != 0) {
    num * -1
    return  Math.round(num / 86400000);
  }
  else{
    return  Math.round(num / 86400000);
  }


}



function getStats() {
  let today = Math.floor(Date.now()/1000);
  let sendDate = emailData[activeIndex].sendDate;
  let dateDiff = today - sendDate;
  //set max number of days to 6 weeks
  let numberDays = convertToDateTime(dateDiff * 1000) <= 42 ? convertToDateTime(dateDiff * 1000) : 42 ;
  drawData = [
        {
            date: "",
            tally: "",
            entryId: ""
        }

    ];


  // console.log(new Date(1536710400000));


//use JavaScrip Set() to hold user_id # results. (sets only hold unique values, so no double counting anyone)
  const priorWatchesTotal = new Set();
  const priorWatchesHalf = new Set();
  const sinceWatchesTotal = new Set();
  const sinceWatchesHalf = new Set();

//
// for (let item of set1) {
//   console.log(set1.size);
//   // expected output: 42
//   // expected output: 13
// }



  function setPageView() {

    $("#email__title").html(emailData[activeIndex].title);
    $("#email__date").html(emailData[activeIndex].engDate);
    $(".length-of-time").html(numberDays);

     $("#prior-watches").html(priorWatchesTotal.size);
     $("#prior-half").html(priorWatchesHalf.size);

     $("#since-watches").html(sinceWatchesTotal.size);
     $("#since-half").html(sinceWatchesHalf.size);


  //    for (let item of sinceWatchesTotal) {
  //      console.log(item);
  //      // expected output: 42
  //      // expected output: 13
  //    }
  //
  }



  //Read data from text file
  $.get(emailData[activeIndex].fileName, function(data) {

     //container for input split by new lines
     holder = data.split("\n");

     // loop through each individual line of stats
     for(let i = 0; i < holder.length-1; i++) {
       let tempHolder = holder[i].split("\t");




       //if watch_type is "endat##" remove 'endat' and turn the remaining number-string into an int
       if(tempHolder[3].startsWith("endat")) {
         tempHolder[3] = parseInt(tempHolder[3].replace("endat", ""));
       }

         //if the watchDate was BEFORE the SendDate AND the sendDate minus the watchDate is less than or equal to the difference between today and the sendDate
         if((tempHolder[6] < sendDate) && (convertToDateTime( (sendDate - tempHolder[6]) * 1000 ) <= numberDays)) {
             if( (tempHolder[3] === "half") || (tempHolder[3] === "finished") || (tempHolder[3] >= 50) ){
               priorWatchesHalf.add(tempHolder[1]);
             }
             if( tempHolder[3] != "start" && tempHolder[3] != "onwatch" &&  typeof(tempHolder[3]) === "string"){
                 priorWatchesTotal.add(tempHolder[1]);

                 let liveIndex = drawData.map(function(e) { return e.date; }).indexOf(new Date(tempHolder[6] * 1000).toDateString());
                   if(liveIndex == -1) {
                     drawData.push({
                         date: new Date(tempHolder[6] * 1000).toDateString(),
                         tally: 1,
                         entryId: tempHolder[1]
                     });
                   }
                   else if(drawData[liveIndex].entryId !== tempHolder[1]){
                      drawData[liveIndex].tally += 1;
                   }


               }
             else if (tempHolder[3] > 0) {
               priorWatchesTotal.add(tempHolder[1]);

               let liveIndex = drawData.map(function(e) { return e.date; }).indexOf(new Date(tempHolder[6] * 1000).toDateString());
                 if(liveIndex == -1) {
                   drawData.push({
                       date: new Date(tempHolder[6] * 1000).toDateString(),
                       tally: 1,
                       entryId: tempHolder[1]
                   });
                 }
                 else if(drawData[liveIndex].entryId !== tempHolder[1]){
                    drawData[liveIndex].tally += 1;
                 }

             }

         }
         //if the watchDate was AFTER the SendDate AND the watchDate minus the sendDate is less than or equal to the difference between today and the sendDate
         else if( (tempHolder[6] >= sendDate) && (convertToDateTime( (tempHolder[6] - sendDate) * 1000) <= numberDays))   {

             if( (tempHolder[3] === "half") || (tempHolder[3] === "finished") || (tempHolder[3] >= 50) ){
               sinceWatchesHalf.add(tempHolder[1]);
             }

             if( tempHolder[3] != "start" && tempHolder[3] != "onwatch" &&  typeof(tempHolder[3]) === "string"){
                 sinceWatchesTotal.add(tempHolder[1]);

                 let  liveIndex = drawData.map(function(e) { return e.date; }).indexOf(new Date(tempHolder[6] * 1000).toDateString());
                 if(liveIndex == -1) {
                   drawData.push({
                       date: new Date(tempHolder[6] * 1000).toDateString(),
                       tally: 1,
                       entryId: tempHolder[1]
                   });
                 }
                 else if(drawData[liveIndex].entryId !== tempHolder[1]){
                    drawData[liveIndex].tally += 1;
                 }


             }
            else if (tempHolder[3] > 0) {
              sinceWatchesTotal.add(tempHolder[1]);

            let liveIndex = drawData.map(function(e) { return e.date; }).indexOf(new Date(tempHolder[6] * 1000).toDateString());
              if(liveIndex == -1) {
                drawData.push({
                    date: new Date(tempHolder[6] * 1000).toDateString(),
                    tally: 1,
                    entryId: tempHolder[1]
                });
              }
              else if(drawData[liveIndex].entryId !== tempHolder[1]){
                 drawData[liveIndex].tally += 1;
              }

            }

        } //end of after-send-date check
     }
    //end tallying for-loop


// console.log(activeIndex);



//
drawData.shift();

drawData.forEach(function(d, index) {
  d.count = index;
});


console.log(drawData);




// console.log(drawData)
     //Update numbers on the front end
     setPageView();
     d3.select("#uniqueSVG").empty();
    newDraw(sendDate);




   }, "text");







}

//find the index of the email being selected
function setActiveIndex(num) {
  d3.select("#uniqueSVG").empty();
  activeIndex = emailData.map(function(e) { return e.entry_id; }).indexOf(num);
  getStats();

}



//alt draw SECTION
function newDraw(incdate) {
  d3.select("#uniqueSVG").selectAll("*").remove();
  var margin = {top: 40, right: 30, bottom: 50, left: 30},
      width = 760 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;


  // var x = d3.scaleTime()
  //     .range([0, width]);


      var x = d3.scaleTime()
    .domain(d3.extent(drawData, function(d) { return d.date; }))
    .rangeRound([margin.left, width - margin.right]);
  //
  var y = d3.scaleLinear()
      .range([height, 0]);

  var xAxis = d3.axisBottom(x).ticks(10);

  var yAxis = d3.axisLeft(y)
      .ticks(5);

  // var tip = d3.tip()
  //   .attr('class', 'd3-tip')
  //   .offset([-10, 0])
  //   .html(function(d) {
  //     return "<strong>Tally:</strong> <span style='color:red'>" + d.tally + "</span>";
  //   });

  var svg = d3.select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // svg.call(tip);



  // x.domain([d3.min(drawData, function(d) { return new Date(type(d.date)); }), d3.max(drawData, function(d) { return new Date(type(d.date)); })]);
  y.domain([d3.min(drawData, function(d) { return d.tally > 1 ? d.tally : 0; }), d3.max(drawData, function(d) { return d.tally; })]);
  //




  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "start");;
  // //
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(180)")
    .attr("y", -36)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("test1!");

  svg.selectAll(".bar")
    .data(drawData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", x( new Date(type(d.date)) )  )
    .attr("width", (width / drawData.length ))
    .attr("shape-rendering", "auto")
    // .attr("width", function(d) { return d.bandwidth()  })
    .attr('y', function(d) { return y(d.tally); } )
    .attr('height', function(d,i){ return height - y(d.tally); })
    // .attr("y", function(d) { return y(d.tally) + y(d.tally) - height;})
    // .attr("height", function(d) { return height - y(d.tally); })
    .attr("fill", function(d) {
      if (new Date(type(d.date)) < new Date(incdate * 1000)) {
        return "red";
      }
      else {
        return "blue";
      }
    })
    .on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .9);
       div.html(d.date + "<br/>" + "Watches: " + d.tally + "<br/>" + "Days Before/After: " + convertToDateTime(new Date(type(d.date)) - new Date(incdate * 1000)) )
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       });



    // .on('mouseover', tip.show)
    // .on('mouseout', tip.hide);


  function type(d) {
    d.date = +d.date;
    return d;
  }
}

















});
