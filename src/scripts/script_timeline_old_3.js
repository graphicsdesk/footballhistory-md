import scrollama from 'scrollama';
import { select, event } from 'd3-selection';

/**
 * Resizer script to toggle multiple artboards for responsiveness. Adapted from:
 * https://github.com/newsdev/ai2html/blob/gh-pages/_includes/resizer-script.html
 */


x
let width, height;
let vbWidth, vbHeight;
const vbMinX = 0;
const vbMinY = 0;
let viewBox;

  // using d3 for convenience
  var main = d3.select('main');
  var scrolly = main.select('#scrolly');
  var sticky = scrolly.select('#sticky-thing');
  var article = scrolly.select('article');
  var step = article.selectAll('.step');
  

  // some stuff for custom date formats

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.","Sept.", "Oct.", "Nov.", "Dec."]

  // using UTC dates bc otherwise there's weird timezone stuff 
  function getFormattedDate(date) {
    const formattedDate = `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
    return formattedDate;
  }




   width = document.body.clientWidth;
   height = window.innerHeight;
   vbWidth = Math.max(750, width);
   vbHeight = height;

   viewBox = `${vbMinX} ${vbMinY} ${vbWidth} ${vbHeight}`;
/* Updates graphic elements when window resizes */


 // updateGraphic();

// Define the dimensions and margins of the SVG
//width = 800;
//height = 100;
const margin = {top: 20, right: 70, bottom: 30, left: 40};

// Define the timeline data
const events = [
  {date: new Date('1961-11-18'), label: 'Columbia wins first Ivy League Title', segment:'start',link: 'https://cdn.pixabay.com/photo/2017/05/11/16/40/emoji-2304720_1280.png'},
  {date: new Date('1983-10-22'), label: 'Start of 44-game losing streak', segment:'end'},
  {date: new Date('1984-09-22'), label: 'Lawrence A. Wien Stadium opens', segment:'start',link: 'https://cdn.pixabay.com/photo/2016/08/21/18/48/emoticon-1610518_1280.png'},
  {date: new Date('1988-10-08'), label: 'End of 44-game losing streak', segment:'end',link: 'https://i.pinimg.com/originals/a2/5c/19/a25c198273a072fc9a608ee01a3bff80.png'},
  {date: new Date('1996-11-23'), label: 'Last winnning season for 21 years', segment:'na',link:'https://t4.ftcdn.net/jpg/05/91/75/69/360_F_591756994_RWtNuVkWDKEIer7eozEne5xe3rZo2QbD.jpg'},
  {date: new Date('2012-11-10'), label: 'Start of 24-game winless streak', segment:'na', link: 'https://cdn.pixabay.com/photo/2016/04/01/00/28/face-1298202_640.png'},
  {date: new Date('2014-02-23'), label: 'Al Bagnoli arrive as head coach', segment:'start',link: 'https://cdn.pixabay.com/photo/2017/05/11/16/40/emoji-2304720_1280.png'},
  {date: new Date('2017-11-18'), label: 'First winning season since 1996', segment:'end', link:'https://st.depositphotos.com/1001911/1222/v/450/depositphotos_12221489-stock-illustration-big-smile-emoticon.jpg'},
  {date: new Date('2023-08-04'), label: 'Mark Fabish arrives as interim head coach', segment:'start',link:'https://i.pinimg.com/736x/3b/54/30/3b543046fc90ac07131e54d4c3dde292.jpg'},
  {date: new Date('2023-12-02'), label: 'John Poppe announced as head coach for 2024 season', segment:'end',link: 'https://cdn.pixabay.com/photo/2017/05/11/16/40/emoji-2304720_1280.png'},
  {date: new Date('2024-11-23'), label: 'Columbia wins second Ivy League Title', segment:'na',link: 'https://cdn.pixabay.com/photo/2017/05/11/16/40/emoji-2304720_1280.png'}

  
  
  
];

// find days bt two dates
function daysBetween(date1, date2) {
  const oneDay = 1000 * 60 * 60 * 24 // milliseconds in a day
  return Math.floor((date2 - date1) / oneDay);
}

// find weeks bt two dates
function weeksBetween(date1, date2) {
  const oneWeek = 1000 * 60 * 60 * 24 * 7; // milliseconds in a week
  return Math.floor((date2 - date1) / oneWeek);
}

// loop thru events
for (let i = 0; i < events.length; i++) {
  console.log(events);

  // create yAddtn if undefined (get error later otherwise)
  if (events[i]["yAddtn"] === undefined) {
    events[i]["yAddtn"] = Math.floor(Math.random() * (90 - 50) + 50);
  }

  if (i > 0) {
    // calculate min required spacing based on the date difference
    const weekDiff = weeksBetween(events[i - 1].date, events[i].date);
    const minSpacing = weekDiff > 1 ? 0 : 20; // No minimum spacing if more than 1 week apart (otherwise, min is 20)

   
    let valid = false; // valid if greater than previous event and more than 20 away
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts++;

      // Generate a new yAddtn value
      const newYAddtn =  20 + Math.floor(Math.random() * (90 - 50) + 50);

      //console.log(newYAddtn);
      if (weekDiff < 1 && newYAddtn >= events[i - 1]["yAddtn"] + minSpacing) {
        events[i]["yAddtn"] = newYAddtn;
        valid = true;
        break;
      }
    }


    if (!valid) {
      console.warn(`Failed to find a valid yAddtn for event ${i} after ${maxAttempts} attempts`);
    }
  }
}

console.log(events);


// Create the SVG container
const svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  const arrowPoints = [[0, 0], [0, 20], [20, 10]];
// Append marker definitions for arrows
svg.append('defs')
.append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 9) // Adjust this as needed
    .attr('refY', 5)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z') // Arrowhead shape
    .attr('fill', 'black');



   
    var imageElement = svg.selectAll('image')

// Define scales
const x = d3.scaleTime()
    .domain(d3.extent(events, d => d.date))
    .range([margin.left, width - margin.right]);

// Define a constant y value for all segments
const y = height / 2;

// Function to create curved path
function createCurvedPath(d, xVal) {
    const startX = x(d.date); // Adjust as needed
    const startY = y + 10; // Adjust as needed
    const endX = x(d.date) - 40;
    const endY = y + d.yAddtn - 5;
    
    if(typeof xVal !== "undefined") {
      return d3.line()
        .curve(d3.curveBasis)
        .x(d => d[0])
        .y(d => d[1])([
            [xVal, startY],
            [xVal, endY],
            [xVal - 40, endY]
        ]);
    }
    return d3.line()
        .curve(d3.curveBasis)
        .x(d => d[0])
        .y(d => d[1])([
            [startX, startY],
            [startX, endY],
            [endX, endY]
        ]);
}

let textYPositions = {};

// Function to adjust text positions based on overlaps
function detectOverlaps() {
  const textElements = svg.selectAll('text.label');
  const bbox = textElements.nodes().map(node => node.getBBox());

    // Clear previously stored positions
    textYPositions = {};
  // Adjust positions based on overlap detection
  for (let i = 0; i < bbox.length; i++) {
    textYPositions[i] = bbox[i].y + bbox[i].height / 2; // Store the center y position of the text

      for (let j = i + 1; j < bbox.length; j++) {
          if (doRectanglesOverlap(bbox[i], bbox[j])) {
            
          const  newY = bbox[j].y + bbox[j].height + 10 ;
         
              // Example adjustment: shift text down to avoid overlap
              d3.select(textElements.nodes()[j])
                .attr('y', bbox[j].y + bbox[j].height + 10); // Shift down
                return newY;//
          }
      }
  }
}



// Function to check if two rectangles overlap
function doRectanglesOverlap(bbox1, bbox2) {
  return !(bbox1.x > bbox2.x + bbox2.width ||
           bbox1.x + bbox1.width < bbox2.x ||
           bbox1.y > bbox2.y + bbox2.height ||
           bbox1.y + bbox1.height < bbox2.y);
}

// Initial call to draw elements and handle overlaps
drawInitialElements();



// Function to update the view to focus on a specific event

function updateView(eventIndex, moveText) { 

 

  //  console.log("update");
    const selectedEvent = events[eventIndex];
  //  console.log('event',selectedEvent);
    const eventDate = selectedEvent.date;

    // Define a range around the selected event
    const focusRange = 1000 * 60 * 60 * 24 * 7; // 7 days in milliseconds


    // center selected event
    const startDate = new Date(eventDate.getTime() - focusRange / 2);
    const endDate = new Date(eventDate.getTime() + focusRange / 2);
    const xScaleDomain = [startDate, endDate];
    //const xScaleDomain = [eventDate, new Date(eventDate.getTime() + focusRange)];
   
    
    // Update the x scale domain
    x.domain(xScaleDomain);

    const newX = d3.scaleTime()
    .domain(xScaleDomain)
    .range([margin.left, width - margin.right]);



    // Redraw the lines, circles, and labels based on the new scale
    svg.selectAll('.line')
        .transition()
        .duration(2000)
        .attr('x1', (d, i) => newX(events[i].date))
        .attr('y1', y)
        .attr('x2', d => newX(d.date))
        .attr('y2', y);
        
    /*
        svg.selectAll('.red-line')
        .transition()
        .duration(2000)
        .attr('x1', (d, i) => newX(events[i].date))
        .attr('y1', y)
        .attr('x2', d => newX(d.date))
        .attr('y2', y);

       */

      svg.selectAll('circle')
        .transition()
        .duration(2000)
        .attr('cx', d => newX(d.date));

        /*
        svg.selectAll('image').transition()
        .duration(2000)
        .attr('x', d => newX(d.date)-45);
*/
        // this below does something interesting. it's not exactly right, but it looks cool (image stays in place until next one).
        // might want to mess with it a bit
        
        if(events[eventIndex].link ) {
          console.log(events[eventIndex])
          svg.selectAll('image').transition()
          .duration(2000)
          .attr('x', d => newX(d.date)-45);}

        
        if(events[eventIndex].segment =='na') {
          svg.selectAll('image').transition()
          .duration(2000)
          .attr('x', d => newX(d.date)-45);}
          
        

          
            svg.selectAll('text.label') // different attrs based on if there's an arrow or not
            .transition()
            .duration(2000)
            .attr('x', d => newX(d.date)-45)

            svg.selectAll('text.date') // different attrs based on if there's an arrow or not
            .transition()
            .duration(2000)
            .attr('x', d => newX(d.date))
            /*
            .attr('text-anchor',  d => {
              const align = d.segment === 'end' ? 'end' : 'middle';
    return align;
            })
                .attr('x',  d => {
                  const xPos = d.segment === 'end' ? newX(d.date) - 45 : newX(d.date);
        return xPos;
                })
                */
                /*
                .attr('y',  d => {
                  const yPos = d.segment === 'end' ? y+55 : y + Math.floor(Math.random()*(90-30)+30);
        return yPos;
                })
                */
              //  .on('end', detectOverlaps); // NEED TO FIX SO IT DOESN'T UPDATE AGAIN

                /*
                 const align = d.segment === 'end' && d.event_no === '2' ? 'end' : 'middle';
              return align;
            })
                .attr('x',  d => {
                  const xPos = d.segment === 'end' && d.event_no === '2' ? newX(d.date) - 45 : newX(d.date);
        return xPos;
                })
                .attr('y',  d => {
                  const yPos = d.segment === 'end' && d.event_no === '2' ? y+55 : y+30;
        return yPos;
                })
                .on('end', detectAndHandleTextOverlaps);
                
*/
                

                
               ;
      

   

    // Draw curved arrows pointing to circles
    svg.selectAll('path.curved-arrow')
    .transition()
    .duration(2000)
      .attr('d', d => createCurvedPath(d, newX(d.date))); // TBH I THINK IT'S UNNECESSARY TO DO THIS WHOLE NEWX THING BC IT'S ALWAYS GOING TO BE THE WINDOW WIDTH/2

       // update date
  //dateText.text(getCenterDate().toDateString());

  /*
  // COULD DO THIS INSTEA OF HAVING THE WHOLE GETCENTERDATE FUNCITON:
  dateText.text(x.invert(newX(eventDate)).toDateString());
*/

//dateText.text(x.invert(document.body.clientWidth/2).toDateString());
  


//dateText.text(x.invert(newX(eventDate)).toDateString());
console.log("event 1",events[eventIndex].date);
console.log("event 2",events[eventIndex+1].date);

//if(eventIndex >0) {updateCounter(events[eventIndex].date);}

}
//TESTING COUNTER
var testDate = x.invert(Math.ceil(document.body.clientWidth/2));

//let currDate = testDate;
//dateText.text(d3.timeDay.offset(testDate, 0).toDateString());

// Function to update counter display
/*
function updateCounter(newDate) {
  dateText.text(getFormattedDate(newDate));
}
*/

// Start counter update
function startCounter(date1,date2) {
  let currDate = date1;
  const interval = setInterval(() => {
    if(currDate >= date2) {
      clearInterval(interval);
      return;
    }
  
      currDate = d3.timeDay.offset(currDate, 1);
      updateCounter(currDate);
  }, 2000/daysBetween(date1,date2)); // Update every x seconds
  console.log(currDate);
  }
  



/*
function updateDateText() {
  dateText.text(x.invert(document.body.clientWidth/2).toUTCString());



}
*/
//setInterval(updateDateText,10);


function getCenterDate() {
  // Calculate the center of the view on the x-axis
  const centerX = width / 2;
  
  // Get the date corresponding to the center position
  const centerDate = x.invert(centerX);
  
  // Output the date at the center
  console.log("Date at the center:", centerDate);
  
  return centerDate;
}

/*
// add a thing that counts the date
const dateText = svg.append('text')
.attr('class', 'date-text')
.attr('x', width / 2)
.attr('y', y-(.9*y)) // Position the text element at the top
.attr('text-anchor', 'middle')
.attr('font-size', '16px')
.classed('roboto',true)
.attr('fill', 'black')
.text(''); // Initial empty text

*/
// Draw the initial SVG elements
function drawInitialElements() {


  

    // Draw the lines connecting events
    svg.selectAll('line.line')
        .data(events.slice(1))
        .enter().append('line')
        .attr('class', 'line')
        .attr('x1', (d, i) => x(events[i].date))
        .attr('y1', y)
        .attr('x2', d => x(d.date))
        .attr('y2', y)
        .attr('id', (d, i) => `line-${i+1}`);
/*
        svg.selectAll('line.red-line')
        .data(events.slice(1))
        .enter().append('line')
        .attr('class', 'red-line')
        .attr('x1', (d, i) => x(events[i].date))
        .attr('y1', y)
        .attr('x2', d => x(d.date))
        .attr('y2', y)
        .attr('id', (d, i) => `red-line-${i+1}`);
*/
        
   

    // Draw the events as circles
    svg.selectAll('circle')
        .data(events)
        .enter().append('circle')
        .attr('cx', d => x(d.date))
        .attr('cy', y)
        .attr('r', 5)
        .attr('class', 'event')
        .attr('id', (d, i) => `circle-${i+1}`);

    // Add event labels
    svg.selectAll('text.label')
        .data(events)
        .enter().append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.date))
        .attr('y', d => y + d.yAddtn) // hacky way of making sure the text doesn't overlap
        .text(d => d.label)
        .classed('roboto-light',true)
        .attr('id', (d, i) => `label-${i+1}`)
        .attr('text-anchor', 'end'); // right align the text;

        svg.selectAll('text.date')
        .data(events)
        .enter().append('text')
        .attr('class', 'date')
        .attr('x', d => x(d.date))
        .attr('y', d => y -(0.9*y)) // hacky way of making sure the text doesn't overlap
        .text(d => getFormattedDate(d.date))
        .classed('roboto-bold',true)
        .attr('id', (d, i) => `date-${i+1}`)
        .attr('text-anchor', 'middle'); // right align the text;


     // Draw curved arrows pointing to circles
    svg.selectAll('path.curved-arrow')
        .data(events)
        .enter().append('path')
        .attr('class', 'curved-arrow')
        .attr('d', d => createCurvedPath(d))
        .style('fill', 'none')  // Ensure the path is not filled
        .style('stroke', 'black')  // Set the stroke color
        .style('stroke-width', 2)  // Set the stroke width
        .attr('marker-start', 'url(#arrowhead)')
         .attr('id', (d, i) => `arrow-${i+1}`);  

         
  
svg.selectAll('image')
.data(events.filter(event => event.link))
.enter()
.append('image')
   // .attr('visibility','hidden')
    .attr("x",width/2-100)  // X position
    .attr('xlink:href', d => d.link) // FIGURE OUT HOW TO MAKE IT NOT HAVE THIS AT FIRST
    .attr("y", y-110)  // Y position
    .attr("width", 100)  // Width of the image
    .attr("height", 100)
    .attr('id', (d, i) => `image-${i+1}`);  
  
  
   
}


function updateImage(imageLink) {
  imageElement.attr("xlink:href", imageLink) // URL to your PNG image
}

// Draw the initial elements
drawInitialElements();


    // initialize the scrollama
    var scroller = scrollama();

  
    
    function handleStepEnter(response) {
        if(response.direction=='down') {
             // Call the appropriate step function based on the scroll index
        stepFunctionsDown[response.index]();
        }
        else if(response.direction=='up') {
            stepFunctionsUp[response.index]();
        }
        // Update the sticky element's class
        sticky.attr('class', 'step-' + response.index);
        console.log('index',response.index);
        return response;
       
    }
    
    function handleStepExit(response) {
        if (response.index == 0 && response.direction == 'up') {
           // sticky.attr('class', 'none');
            svg.selectAll("circle").classed('hidden', true,); 
            //svg.selectAll(".line").classed('hidden', true,); 
            updateView(0);

        }
    }

    function setup() {
        updateView(0);
        d3.selectAll('#sticky-thing').classed('hidden',true);
        svg.selectAll("circle").classed('hidden', true,); 
        svg.selectAll(".line").classed('hidden', false,); 
        svg.selectAll("image").classed('hidden', true,); 

       // svg.selectAll("line").classed('line', true,); 

      //  svg.selectAll("text").classed('hidden', true,); 
      //  svg.selectAll("text").classed('hidden', true,); 
        svg.selectAll("svg").classed('draw', false,); 
      
    }

    
  

    // populate stepFunctions
    var stepFunctionsDown = [
        
        
      ];

      for (let i =0; i < events.length+2;i++) {
        svg.selectAll(`#label-${i}`).classed('hidden',true);
        svg.selectAll(`#arrow-${i}`).classed('hidden',true);

        stepFunctionsDown.push(function() {
          updateView(i-1);
          if(events[i].segment != 'end') {
            console.log('not end')}
            
            console.log('hi')
           
       // svg.selectAll('circle').attr('class', (d, j) => j === i ? 'event highlighted-event' : 'event');
       // svg.selectAll('line').attr('class', (d, j) => j === i ? 'line highlighted' : 'line').classed('draw',true).classed('visible',true);
       //svg.selectAll(`#circle-${i}`).attr('class', (d, j) => j === i ? 'event highlighted-event' : 'event');
       svg.selectAll(`#circle-${i}`).classed('event highlighted-event',true).classed('hidden',false);
       svg.selectAll(`#circle-${i-1}`).classed('highlighted-event',false).classed('hidden',false);
       svg.selectAll(`#label-${i}`).classed('fade_in',true).classed('visible',true)
       svg.selectAll(`#arrow-${i}`).classed('fade_in',true).classed('visible',true); // WANT TO MAKE THIS APPEAR EARLIER/LATER THAN OTHERS
        svg.selectAll(`#label-${i}`).classed('fade_in',true).classed('visible',true)
     
        svg.selectAll(`#image-${i}`).classed('visible',true);
        

        /*
        if(events[i].link) {
          updateImage(events[i].link);
          imageElement.attr('visibility','visible');
        }
        */
        /*
        else {
          imageElement.attr('visibility','hidden');
        }
        */
       if(events[i-1].segment == 'start') {
     //   console.log(events[i-1]);
       // svg.selectAll(`#line-${i}`).classed('draw line highlighted visible',true).classed('hidden',false);
       // svg.selectAll(`#red-line-${i}`).classed('draw highlighted visible',true).classed('hidden',false);


       }

       if(events[i].segment == 'end') { // i+1 bc the first event has no arrow associated whoops
        
        console.log("end");

       }


       /*
       svg.selectAll(`.line-${i}`).each(function(d, j) {
        // Determine if the current element should be highlighted
        const isHighlighted = j === i;
    
        // Apply classes based on the condition
        d3.select(this)
          .classed('line', true) // Always apply 'event'
          .classed('draw line highlighted visible', isHighlighted) // Apply 'highlighted-event' if isHighlighted is true
          .classed('hidden', !isHighlighted); // Apply 'hidden' if isHighlighted is false
          console.log('hello');
          console.log(j === i);
      });
      */
      

     

      // svg.selectAll(`.line-${i}`).attr('class', (d, j) => j === i ? 'draw line highlighted visible' : 'line hidden');
          });
          
      }

     /* for (let i =0; i < events.length;i++) {
        stepFunctions.push(step_ + i);
      }*/

//console.log(stepFunctionsDown);

var stepFunctionsUp = [
        
        
];

svg.selectAll('.highlighted')
.attr('y', y+100)

for (let i =0; i < events.length;i++) {
  stepFunctionsUp.push(function() { // NEED TO GIGURE OUT WHY IT DOESNT SHOW LAST EVENT
   
      updateView(i-1);
  //svg.selectAll('circle').attr('class', (d, j) => j === i ? 'event highlighted-event' : 'event');
  //svg.selectAll('line').attr('class', (d, j) => j === i ? 'line highlighted' : 'line').classed('draw',false).classed('visible',false);
  svg.selectAll(`#circle-${i}`).classed('event highlighted-event',true).classed('hidden',false);
       svg.selectAll(`#circle-${i-1}`).classed('highlighted-event',false).classed('hidden',false);
       svg.selectAll(`#label-${i}`).classed('fade-in',true); // WANT TO MAKE THIS APPEAR EARLIER/LATER THAN OTHERS
       svg.selectAll(`#image-${i+1}`).classed('visible',false);



       //svg.selectAll('line').attr('class', (d, j) => j === i ? 'draw line highlighted visible' : 'line');


       //svg.selectAll(`#line-${i}`).classed('line visible',true).classed('hidden',false);

      // svg.selectAll(`#red-line-${i}`).classed('red-line visible',true).classed('hidden',false);

       //svg.selectAll(`#line-${i+1}`).classed('highlighted',false).classed('hidden',false);
       //svg.selectAll(`#red-line-${i+1}`).classed('highlighted',false).classed('hidden',false);

/*
       if(events[i-1].segment == 'end') {
        console.log(events[i-1]);
        svg.selectAll(`#line-${i}`).classed('draw line highlighted visible',true).classed('hidden',false);


       }*/
    });
}

    

// Create scrollable sections
const steps = d3.select('#scroll-steps')
    .selectAll('div')
    .data(events)
    .enter().append('div')
    .attr('class', 'step')
    .text(d => d.label);

// Initialize scrollama
function init() {
    setup();
    scroller
      .setup({
        step: '#scrolly article .step',
        offset: 0.98,
        debug: false,
      })
      .onStepEnter(handleStepEnter)
      .onStepExit(handleStepExit);

    // Setup resize event listener
    window.addEventListener('resize', scroller.resize);
}

// Kick things off
init();



