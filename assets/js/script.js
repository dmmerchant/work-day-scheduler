var currentdayEl = $('#currentDay')
var hourBlocksArea = $('#hourBlocks')



var currentDay = moment().format("dddd, MMMM Do, YYYY");
var currentTime = moment().format("H");
var selectedDay = moment().format("MM/DD/YY")
var storedSchedules = [];




currentdayEl.text(currentDay);

function getStoredSchedule() {
    storedSchedules = JSON.parse(localStorage.getItem("allStoredSchedules"));
    if (!storedSchedules) {
        storedSchedules = [];
        createBlankSchedule();
    }
}


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
getStoredSchedule()

function createHourBlocks() {
    var todaySchedules = storedSchedules.filter(schedules => {
        return schedules.day == selectedDay});
    if (!todaySchedules) {
        createBlankSchedule();
        return createHourBlocks();
    };
    for (var i = 8; i < 17; i++){ 
        var thisHourDetails = todaySchedules.find(hourDetails => hourDetails.hour === i)
        var state = getHourState(i)
        var hourBlockEl = $('<form>', {
            id: "08",
            class: "row time-block"
        })
        var hourBlockHourEl = $('<label>',{
            class: "col-2 hour",
        });
        var hourBlockInputEl = $('<textarea>',{
            class: "col " + state,
            placeholder: "Nothing Scheduled"
        });
        var hourBlockBttnEl = $('<button>',{
            class: "col-1 saveBtn"
        });
        $('<i class="fa fa-save"></i>').appendTo(hourBlockBttnEl)
        hourBlockHourEl.text(moment(i, "HH").format("h:mm A"))
        hourBlockHourEl.attr("time",i)
        hourBlockInputEl.val(thisHourDetails.detail)
        hourBlockHourEl.appendTo(hourBlockEl)
        hourBlockInputEl.appendTo(hourBlockEl)
        hourBlockBttnEl.appendTo(hourBlockEl)
        hourBlockEl.appendTo(hourBlocksArea)
    }
      
}

function getHourState(number) {
    if (number < currentTime) {
        return "past"
    } else if (number == currentTime) {
        return "present"
    } else {
        return "future"
    }
}


function saveItem(event) {
    event.preventDefault();
    var target = $(event.target)
    if (event.target.matches(".fa")) {
        target = $(event.target).parent();
    }
    var taskoutput = target.parent().children('textarea').val()
    var timeoutput = target.parent().children('label').attr("time")
    var indexUpdate = storedSchedules.findIndex(thisDetail => thisDetail.hour == timeoutput && thisDetail.day === selectedDay)
    storedSchedules[indexUpdate].detail = taskoutput;
    localStorage.setItem("allStoredSchedules", JSON.stringify(storedSchedules))
    target.parent().children('textarea').css("border","none")

}
function itemChanged(event) {
    $(event.target).css("border","1px solid red")
}
hourBlocksArea.on('click','.saveBtn',saveItem);
hourBlocksArea.on('change','textarea',itemChanged);

createHourBlocks()