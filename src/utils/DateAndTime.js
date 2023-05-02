export function convertMsToHours(millisec) {

    var hours = (millisec / (1000 * 60 * 60)).toFixed(1);
    
    return hours + " Hrs";
}

export function convertMsToDays(millisec) {

    var hours = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
    
    return hours + " Days";
}

export function convertMsToLargestTimeUnit(millisec) {

    var seconds = (millisec / 1000).toFixed(1);

    var minutes = (millisec / (1000 * 60)).toFixed(1);

    var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

    if (seconds < 60) {
            return seconds + " Sec";
    } else if (minutes < 60) {
            return minutes + " Min";
    } else if (hours < 24) {
            return hours + " Hrs";
    } else {
            return days + " Days"
    }
}

export function convertMsToHoursNumber(millisec) {

    var hours = (millisec / (1000 * 60 * 60));
    
    return hours;
}

export function getEmptyTimeArrays() {
    const hoursArray = []
    for (let i = 0; i < 24; i++) {
    let hour = i.toString();
    if (hour.length == 1) {
        hour = '0' + hour;
    }
    let hourObject = {
        "name": i,
        "msPlayed": 0,
        "uniqueListens": 0,
    }
    hourObject['hourOfListen'] = hour;
    hoursArray.push(hourObject);
    }

    const hourData = []
    for (let i = 0; i < 24; i++) {
    hourData.push(
        {
            "hourName": i,
            "msPlayed": 0,
            "uniqueListens": 0,
        }
    );
    }

    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dayData = [];
    for (let i = 0; i < 7; i++) {
        dayData.push(
            {
                "name": dayNames[i],
                "msPlayed": 0,
                "uniqueListens": 0,
            }
        );
    }

    const monthNames = ["January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October", "November", "December"];
    const monthData = [];
    for (let i = 0; i < 12; i++) {
    monthData.push(
            {
                "name": monthNames[i],
                "msPlayed": 0,
                "uniqueListens": 0,
            }
        );
    } 

    return [hoursArray, dayData, monthData]
}