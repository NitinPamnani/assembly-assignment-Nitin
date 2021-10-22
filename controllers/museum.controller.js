
exports.fetchDetails = (req, res) => {
    const date = req.query.date; //milliseconds, to convert to time to month
    const ignored = req.query.ignore; // museum to ignore

    const dataToQueryUpon = require("../data/museum_visitors.json");

    const dateObj = new Date(parseInt(date));
    const monthSearchingFor = dateObj.getMonth();
    const yearSearchingFor = dateObj.getFullYear();
    const filteredData = getDataOfRequiredMonthAndYear(yearSearchingFor, monthSearchingFor, dataToQueryUpon);

    const frameResponse = getResponseBasedOnFilteredData(dateObj, filteredData, ignored);

    res.status(200).send(frameResponse);


}

function getResponseBasedOnFilteredData(dateObj, filteredData, ignoredMuseum) {
    const month = getMonthName(dateObj.getMonth());
    const year = dateObj.getFullYear();
    let response = {
        "attendance": {
            "month": '',
            "year": '',

            "highest": {
                "museum": '',
                "visitors": 0
            },

            "lowest": {
                "museum": '',
                "visitors": 0
            },

            "ignored": {
                "museum": '',
                "visitors": 0
            },

            "total": 0
        }
    }
    let maxCount = -1;
    let maxMuseum = '';
    let minCount = Number.MAX_SAFE_INTEGER;
    let minMuseum = '';

    for (let key in filteredData) {

        if (key !== "month" && key !== ignoredMuseum) {
            const value = parseInt(filteredData[key])
            if (value < minCount) {
                minCount = value;
                minMuseum = key;
            } else if (value >= maxCount) {
                maxCount = value;
                maxMuseum = key;
            }
        }
    }
    response.attendance.year = year;
    response.attendance.month = month;
    response.attendance.highest.museum = maxMuseum;
    response.attendance.highest.visitors = maxCount;
    response.attendance.lowest.museum = minMuseum;
    response.attendance.lowest.visitors = minCount;
    response.attendance.total = maxCount + minCount;
    if (!ignoredMuseum) {
        delete response.attendance.ignored;
    } else {
        response.attendance.ignored.museum = ignoredMuseum;
        response.attendance.ignored.visitors = filteredData[ignoredMuseum];
    }

    return response;
}

function getDataOfRequiredMonthAndYear(year, month, allData) {
    for (entry of allData) {
        const date = new Date(entry.month)
        if (month == date.getMonth() && year == date.getFullYear()) {
            return entry;
        }
    }
    return undefined;
}

function getMonthName(month) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month];
}