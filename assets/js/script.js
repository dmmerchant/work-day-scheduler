//Screen Element Variables
var currentdayEl = $('#currentDay')
var hourBlocksArea = $('#hourBlocks')


//Global Variables
var currentDay = moment().format("dddd, MMMM Do, YYYY");
var currentTime = moment().format("H");
var selectedDay = moment().format("MM/DD/YY")
var storedSchedules = [];

//Set the current Day
currentdayEl.text(currentDay);



//Get stored data.
function getStoredSchedule() {
    storedSchedules = JSON.parse(localStorage.getItem("allStoredSchedules"));
    //On first run, create an array for the day.
    if (!storedSchedules) {
        storedSchedules = [];
        createBlankSchedule();
    }
}

//Creates a blank schedule for the selected day.
function createBlankSchedule() {
    storedSchedules.push({day: selectedDay, hour:8, detail: "" })
    storedSchedules.push({day: selectedDay, hour:9, detail: "" })
    storedSchedules.push({day: selectedDay, hour:10, detail: "" })
    storedSchedules.push({day: selectedDay, hour:11, detail: "" })
    storedSchedules.push({day: selectedDay, hour:12, detail: "" })
    storedSchedules.push({day: selectedDay, hour:13, detail: "" })
    storedSchedules.push({day: selectedDay, hour:14, detail: "" })
    storedSchedules.push({day: selectedDay, hour:15, detail: "" })
    storedSchedules.push({day: selectedDay, hour:16, detail: "" })
    localStorage.setItem("allStoredSchedules", JSON.stringify(storedSchedules)) 
}

//Creates the hour blocks. Filters all stored data for items for selectedDay. Loops through and inputs the details into the appropriate hour block.
function createHourBlocks() {
    var todaySchedules = storedSchedules.filter(schedules => {
        return schedules.day == selectedDay});
    //If there is stored data but not from the selected date, add a empty day for the selected date
    if (!todaySchedules) {
        createBlankSchedule();
        return createHourBlocks();
    };
    for (var i = 8; i < 17; i++){
        //this finds the specific details for that hour
        var thisHourDetails = todaySchedules.find(hourDetails => hourDetails.hour === i)
        //call the getHourState function to check if the block is past current or present
        var state = getHourState(i)
        //This is the parent hour block element
        var hourBlockEl = $('<form>', {
            id: "08",
            class: "row time-block"
        });
        //This is the element where the hour will display
        var hourBlockHourEl = $('<label>',{
            class: "col-2 hour",
        });
        //This is the element where the user's hour details will display, along with the ability to update.
        var hourBlockInputEl = $('<textarea>',{
            class: "col " + state,
            placeholder: "Nothing Scheduled"
        });
        //This is the save button, to store the changes the user makes
        var hourBlockBttnEl = $('<button>',{
            class: "col-1 saveBtn"
        });
        //this is the save icon within the save button
        $('<i class="fa fa-save"></i>').appendTo(hourBlockBttnEl);

        //utilizes the i to format a proper time stamp
        hourBlockHourEl.text(moment(i, "HH").format("h:mm A"));
        //stores the i as an element to be used when saving
        hourBlockHourEl.attr("time",i);
        //update the detail block
        hourBlockInputEl.val(thisHourDetails.detail);
        //Append the elements to the hour block
        hourBlockHourEl.appendTo(hourBlockEl);
        hourBlockInputEl.appendTo(hourBlockEl);
        hourBlockBttnEl.appendTo(hourBlockEl);
        //Append to the screen
        hourBlockEl.appendTo(hourBlocksArea);
    }
      
}

//checks whether the time is current or past
function getHourState(number) {
    if (number < currentTime) {
        return "past";
    } else if (number == currentTime) {
        return "present";
    } else {
        return "future";
    }
}

//update the saved data
function saveItem(event) {
    event.preventDefault();
    var target = $(event.target);
    if (event.target.matches(".fa")) {
        target = $(event.target).parent();
    }
    var taskoutput = target.parent().children('textarea').val();
    var timeoutput = target.parent().children('label').attr("time");
    //find the index in the array of all saved data. Must do this as to not clear out other information.
    var indexUpdate = storedSchedules.findIndex(thisDetail => thisDetail.hour == timeoutput && thisDetail.day === selectedDay);
    storedSchedules[indexUpdate].detail = taskoutput;
    localStorage.setItem("allStoredSchedules", JSON.stringify(storedSchedules));

    //removes the notification that the data is unsaved
    target.parent().children('textarea').css("border","none");
    target.parent().children('textarea').css("border-left", "1px solid black");
}

//This is to notify that the user has unsaved data
function itemChanged(event) {
    $(event.target).css("border","1px solid red");

}

//Start Up Routine
getStoredSchedule()
createHourBlocks()

//Event Listeners
hourBlocksArea.on('click','.saveBtn',saveItem);
hourBlocksArea.on('change','textarea',itemChanged);
