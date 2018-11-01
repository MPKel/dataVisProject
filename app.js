
$(document).ready(function(){

  let emailData = [
    { entry_id: "6829", title: "Mapping Experiences: It’s the Destination and the Journey", sendDate: 1531329455, engDate: "07/11/2018", fileName: "s6829.csv"},
    {entry_id: "4812", title: "Sharing our Stories: Designing and Reviewing UX Portfolios", sendDate: 1531495771, engDate: "07/13/2018", fileName: "s4812.csv"},
    {entry_id: "4997", title: "Measuring The Customer Experience Using Top Tasks", sendDate: 1531919432, engDate: "07/18/2018", fileName: "s4997.csv"},
    {entry_id: "3303", title: "A User-centered Approach to Product Planning and Visioning", sendDate: 1531329455, engDate: "07/20/2018", fileName: "s3303.csv"},
    {entry_id: "10715", title: "IA lense(for test purposes)", sendDate: 1536765928, engDate: "09/12/2018", fileName: "testText.tsv"},
    {entry_id: "7566", title: "The Experience Is The Product", sendDate: 1540315821, engDate: "10/23/2018", fileName: "s7566.csv"},
    {entry_id: "10824", title: "How to Avoid a Runaway Redesign(testing purposes)", sendDate: 1539882079, engDate: "10/18/2018", fileName: "runawayRedesign.csv"},
    {entry_id: "8882", title: "Onboarding for Behavior Change", sendDate: 1539181239, engDate: "10/10/2018", fileName: "s8882.csv"},
    {entry_id: "4697", title: "A Tour of Today’s Online Style Guides", sendDate: 1538786602, engDate: "10/05/2018", fileName: "s4697.csv"},
    {entry_id: "5495", title: "Balancing Continuous Discovery and Delivery", sendDate: 1538386496, engDate: "10/01/2018", fileName: "s5495.csv"},
    {entry_id: "5061", title: "Using Visual Models to Solve Big Design Problems", sendDate: 1538171900, engDate: "9/28/2018", fileName: "s5061.csv"},
    {entry_id: "1439", title: "Orchestrating Experiences: Strategy & Design for Complex Product Ecosystems", sendDate: 1537171439, engDate: "9/17/2018", fileName: "s1439.csv"},
    {entry_id: "99", title: "Give Your Users a Seat at the Table: The Characteristics of Effective Personas", sendDate: 1536944964, engDate: "9/14/2018", fileName: "s99.csv"},
    {entry_id: "14", title: "Building Robust Personas in 30 Days or Less", sendDate: 1536570679, engDate: "9/10/2018", fileName: "s14.csv"},
    {entry_id: "7561", title: "Collaborative Design Discovery: Four Essential Techniques", sendDate: 1536069272, engDate: "9/4/2018", fileName: "s7561.csv"},
    {entry_id: "8706", title: "Finding The Narrative In Numbers: Making The Most of Metrics", sendDate: 1535737752, engDate: "8/31/2018", fileName: "s8706.csv"}
  ];


  $('nav li ul').hide().removeClass('fallback');
$('nav li').hover(
  function () {
    $('ul', this).stop().slideDown(100);
  },
  function () {
    $('ul', this).stop().slideUp(1100);
  }
);

let activeIndex;

  $('.select_button').click(function(){
        setActiveIndex(this.value)
    });





let drawArray = [
      {
          date: "",
          watchTally: 0,
          halfTally: 0
      }

  ];








var buildDateArray = function(send, dif) {

    var startDate = new Date(send).setDate(new Date(send).getDate() - dif);
    var endDate = new Date(send).setDate(new Date(send).getDate() + dif);


    var arr = new Array();
    var dt = new Date(startDate);
    while (dt <= endDate) {
        arr.push({  date: new Date(dt).toDateString(),
                    watchTally: 0,
                    halfTally: 0,
                   });
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
}




const _MS_PER_DAY = 1000 * 60 * 60 * 24;


//function to find the difference between dates in number of days
// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
}








function getStats() {
  let today = Math.floor(Date.now()/1000);
  let sendDate = emailData[activeIndex].sendDate;

  let dateDiff = dateDiffInDays( new Date(Date.now()), new Date(sendDate * 1000) );
  console.log(dateDiff);



  //set max number of days to 6 weeks
  let numberDays = dateDiff <= 42 ? dateDiff : 42;
  drawArray = buildDateArray((sendDate * 1000), numberDays );
  console.log(drawArray);


  //arrays to hold userIDs so each user can only watch a video once, one array for each watch type
  let userArrayWatches = [];
  let userArrayHalfs = [];





//use JavaScrip Set() to hold user_id # results. (sets only hold unique values, so no double counting anyone)
  const priorWatchesTotal = new Set();
  const priorWatchesHalf = new Set();
  const sinceWatchesTotal = new Set();
  const sinceWatchesHalf = new Set();




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
         if(( new Date(new Date(tempHolder[6] * 1000).toDateString()) <  new Date(new Date(sendDate * 1000).toDateString()) ) && ( dateDiffInDays( new Date(sendDate * 1000), new Date(tempHolder[6] * 1000) ) <= numberDays )) {
             if( (tempHolder[3] === "half") || (tempHolder[3] === "finished") || (tempHolder[3] >= 50) ){
               priorWatchesHalf.add(tempHolder[1]);

               let halfIndex = userArrayHalfs.indexOf(tempHolder[1]);
                 if(halfIndex == -1) {
                   let liveIndex = drawArray.map(function(e) { return e.date; }).indexOf(new Date(tempHolder[6] * 1000).toDateString());
                   drawArray[liveIndex].halfTally += 1;
                   userArrayHalfs.push(tempHolder[1]);
                 }



             }
             if( tempHolder[3] != "start" && tempHolder[3] != "onwatch" &&  typeof(tempHolder[3]) === "string"){
                 priorWatchesTotal.add(tempHolder[1]);


                 let watchesIndex = userArrayWatches.indexOf(tempHolder[1]);
                   if(watchesIndex == -1) {
                     let liveIndex = drawArray.map(function(e) { return e.date; }).indexOf(new Date(tempHolder[6] * 1000).toDateString());
                     drawArray[liveIndex].watchTally += 1;
                     userArrayWatches.push(tempHolder[1]);
                  }


               }
             else if (tempHolder[3] > 0) {
               priorWatchesTotal.add(tempHolder[1]);
               let watchesIndex = userArrayWatches.indexOf(tempHolder[1]);
                 if(watchesIndex == -1) {
                   let liveIndex = drawArray.map(function(e) { return e.date; }).indexOf(new Date(tempHolder[6] * 1000).toDateString());
                   drawArray[liveIndex].watchTally += 1;
                   userArrayWatches.push(tempHolder[1]);
                }




             }

         }
         //if the watchDate was AFTER the SendDate AND the watchDate minus the sendDate is less than or equal to the difference between today and the sendDate
         else if( ( new Date(new Date(tempHolder[6] * 1000).toDateString()) >= new Date(new Date(sendDate * 1000).toDateString()) ) && (dateDiffInDays( new Date(tempHolder[6] * 1000), new Date(sendDate * 1000)) <= numberDays))   {

             if( (tempHolder[3] === "half") || (tempHolder[3] === "finished") || (tempHolder[3] >= 50) ){
               sinceWatchesHalf.add(tempHolder[1]);

               let halfIndex = userArrayHalfs.indexOf(tempHolder[1]);
                 if(halfIndex == -1) {
                   let liveIndex = drawArray.map(function(e) { return e.date; }).indexOf(new Date(tempHolder[6] * 1000).toDateString());
                   drawArray[liveIndex].halfTally += 1;
                   userArrayHalfs.push(tempHolder[1]);
                 }


             }

             if( tempHolder[3] != "start" && tempHolder[3] != "onwatch" &&  typeof(tempHolder[3]) === "string"){
                 sinceWatchesTotal.add(tempHolder[1]);

                 let watchesIndex = userArrayWatches.indexOf(tempHolder[1]);
                   if(watchesIndex == -1) {
                     let liveIndex = drawArray.map(function(e) { return e.date; }).indexOf(new Date(tempHolder[6] * 1000).toDateString());
                     drawArray[liveIndex].watchTally += 1;
                     userArrayWatches.push(tempHolder[1]);
                  }



             }
            else if (tempHolder[3] > 0) {
              sinceWatchesTotal.add(tempHolder[1]);

              let watchesIndex = userArrayWatches.indexOf(tempHolder[1]);
                if(watchesIndex == -1) {
                  let liveIndex = drawArray.map(function(e) { return e.date; }).indexOf(new Date(tempHolder[6] * 1000).toDateString());
                  drawArray[liveIndex].watchTally += 1;
                  userArrayWatches.push(tempHolder[1]);
               }


            }

        } //end of after-send-date check
     }
    //end tallying for-loop






//
drawArray.shift();




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
      width = 800,
      height = 400;


  var x = d3.scaleTime()
      .range([0, width]);


    //   var x = d3.scaleTime()
    // .domain(d3.extent(drawData, function(d) { return d.date; }))
    // .rangeRound([margin.left, width - margin.right]);
  //
  var y = d3.scaleLinear()
      .range([height, 0]);

  var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%m/%d"));

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



  x.domain([d3.min(drawArray, function(d) { return new Date(d.date); }), d3.max(drawArray, function(d) { return new Date(d.date); })]);
  y.domain([0, d3.max(drawArray, function(d) { return d.watchTally; })]);
  //




  var toolIt = d3.select("body").append("div")
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
    .style("text-anchor", "end");

  svg.selectAll(".full")
    .data(drawArray)
    .enter().append("rect")
    .attr("class", "full")
    .attr("x", function(d) {return x( new Date(type(d.date)) ) }  )
    .attr("shape-rendering", "auto")
    .attr( "width",  (width/drawArray.length))
    // .attr("width", function(d) { return d.bandwidth()  })
    .attr('y', function(d) { return y(d.watchTally); } )
    .attr('height', function(d,i){ return height - y(d.watchTally); })
    // .attr("y", function(d) { return y(d.watchTally) + y(d.watchTally) - height;})
    // .attr("height", function(d) { return height - y(d.watchTally); })
    .attr("style", "outline: thin solid black;")
    .attr("fill", function(d) {
      if( new Date(type(d.date)).getMonth() === new Date(incdate * 1000).getMonth() ) {
          if( new Date(type(d.date)).getDate() >= new Date(incdate * 1000).getDate() ) {
            return "green";
          }
          else {
            return "lightblue";
          }
      }
      else if( new Date(type(d.date)).getMonth() > new Date(incdate * 1000).getMonth() ) {
        return "green";
      }
      else  {
        return "lightblue";
      }
    })
    .on("mouseover", function(d) {
       toolIt.transition()
         .duration(200)
         .style("opacity", .9);
       toolIt.html(d.date + "<br/>" + "Watches: " + d.watchTally + "<br/>" + "Days Before/After: " + dateDiffInDays( new Date(type(d.date)), new Date(incdate * 1000)) )
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       toolIt.transition()
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
