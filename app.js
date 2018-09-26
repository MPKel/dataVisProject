
$(document).ready(function(){

  let emailData = [
    { entry_id: "6829", title: "Mapping Experiences: It’s the Destination and the Journey", sendDate: 1531329455, engDate: "07/11/2018", fileName: "mappingExperiences.txt"},
    {entry_id: "4812", title: "Sharing our Stories: Designing and Reviewing UX Portfolios", sendDate: 1531495771, engDate: "07/13/2018", fileName: "sharingOurStories.txt"},
    {entry_id: "4997", title: "Measuring The Customer Experience Using Top Tasks", sendDate: 1531919432, engDate: "07/18/2018", fileName: "measuringTheCustomerExperience.txt"},
    {entry_id: "3303", title: "A User-centered Approach to Product Planning and Visioning", sendDate: 1531329455, engDate: "07/20/2018", fileName: "aUserCenteredApproach.txt"},
    {entry_id: "10715", title: "IA lense(for test purposes)", sendDate: 1536765928, engDate: "09/12/2018", fileName: "testText.tsv"}

  ];




let activeIndex;

  $('input[type=radio]').click(function(){
        setActiveIndex(this.value)
    });








function convertToDateTime(num) {
  return  Math.round(num / 86400000);
}



function getStats() {
  let today = Math.floor(Date.now()/1000);
  let sendDate = emailData[activeIndex].sendDate;
  let dateDiff = today - sendDate;
  //set max number of days to 6 weeks
  let numberDays = convertToDateTime(dateDiff * 1000) <= 42 ? convertToDateTime(dateDiff * 1000) : 42 ;

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

       if(tempHolder[3].startsWith("endat")) {
         tempHolder[3] = parseInt(tempHolder[3].replace("endat", ""));
       }

         //if the watchDate was BEFORE the SendDate AND the sendDate minus the watchDate is less than or equal to the difference between today and the sendDate
         if((tempHolder[6] < sendDate) && (sendDate - tempHolder[6] <= dateDiff)) {
             if( (tempHolder[3] === "half") || (tempHolder[3] === "finished") || (tempHolder[3] >= 50) ){
               priorWatchesHalf.add(tempHolder[0]);
             }
             if( tempHolder[3] != "start" && tempHolder[3] != "onwatch" &&  typeof(tempHolder[3]) === "string"){
                 priorWatchesTotal.add(tempHolder[0]);
               }
             else if (tempHolder[3] > 0) {
               priorWatchesTotal.add(tempHolder[0]);
             }

         }
         //if the watchDate was AFTER the SendDate AND the watchDate minus the sendDate is less than or equal to the difference between today and the sendDate
         else if( (tempHolder[6] >= sendDate) && (tempHolder[6] - sendDate <= dateDiff) ) {

             if( (tempHolder[3] === "half") || (tempHolder[3] === "finished") || (tempHolder[3] >= 50) ){
               sinceWatchesHalf.add(tempHolder[0]);
             }

             if( tempHolder[3] != "start" && tempHolder[3] != "onwatch" &&  typeof(tempHolder[3]) === "string"){
                 sinceWatchesTotal.add(tempHolder[0]);
             }
            else if (tempHolder[3] > 0) {
              sinceWatchesTotal.add(tempHolder[0]);
            }

        } //end of after-send-date check
     }
    //end tallying for-loop

     //Update numbers on the front end
     setPageView();


   }, "text");



}

//find the index of the email being selected
function setActiveIndex(num) {
  activeIndex = emailData.map(function(e) { return e.entry_id; }).indexOf(num);
  getStats();
}


//D3 SECTION
function d3Draw() {
  var svg = d3.select("svg"),
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("testText.csv", function(d) {
    d.date = +d.date;
    return d;
  }, function(error, data) {
    if (error) throw error;

    x.domain(data.map(function(d) { return new Date(d.date); }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10, "days"));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10, "%"))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.date); })
        .attr("y", function(d) { return y(d.member_id); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.date); });
  });

}




















});
