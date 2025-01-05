var loadedMySQLEvents = [];
var mysqlEventInterval = null;

$(document).ready(function() {
    console.log("Document ready. mysql_events:", mysql_events);
    processMySQLEvents(mysql_events);
    if (mysqlEventInterval) {
        console.log("Clearing previous mysqlEventInterval");
        clearInterval(mysqlEventInterval);
    }
    console.log("Setting mysqlEventInterval for 1s");
    mysqlEventInterval = setInterval(function() {
        console.log("Interval tick: Calling updateMySQLEventsTime and sortMySQLEventsTable");
        updateMySQLEventsTime('c_events', storage);
        sortMySQLEventsTable();
    }, 1000);
});

function processMySQLEvents(events) {
    console.log("processMySQLEvents called with events:", events);
    loadedMySQLEvents = events;
    buildMySQLEventsTable('c_events', storage);
    console.log("Calling EventsFilter('all', storage) to show all");
    EventsFilter('all', storage);
    console.log("Finished processMySQLEvents");
}

function buildMySQLEventsTable(divId, storageName) {
    console.log("buildMySQLEventsTable called with divId:", divId, "storageName:", storageName);
    var table = $('#' + divId);
    var tbody = table.find('tbody');
    console.log("Found table:", table, "Found tbody:", tbody);
    tbody.html('');
    var currentFilter = sessionStorage.getItem(storageName+"-event-list-show");
    console.log("Current filter from sessionStorage:", currentFilter);
    if(!currentFilter) {
        currentFilter = 'all';
        sessionStorage.setItem(storageName+"-event-list-show",'all');
        console.log("No filter found, set to 'all'");
    }

    console.log("Iterating loadedMySQLEvents:", loadedMySQLEvents);
    for(var i=0; i<loadedMySQLEvents.length; i++) {
        var evt = loadedMySQLEvents[i];
        var typeClass = evt.type;

        // If the type is Elite then its boss
        if (typeClass === 'elite') {
            typeClass = 'boss';
        }
        console.log("Event:", evt.event_name, "original type:", evt.type, "using typeClass:", typeClass);
        
        var styleStatus = (currentFilter === 'all' || currentFilter === typeClass) ? '' : 'style="display:none;"';
        console.log("For event:", evt.event_name, "typeClass:", typeClass, "styleStatus:", styleStatus);

        // Assign a unique ID to each row so we can select it later by this ID
        var tr = '<tr class="event-all all ' + typeClass + '" '+styleStatus+' id="event-'+i+'">' +
                 '<td class="sortnr">0</td>' +
                 '<td></td>' +
                 '<td class="event-timer"></td>' +
                 '</tr>';
        tbody.append(tr);
        console.log("Appended TR for event:", evt.event_name, "with classes: event-all all", typeClass,"and id:event-"+i);
    }
    console.log("Finished buildMySQLEventsTable");
}

function updateMySQLEventsTime(divId, storageName) {
    console.log("updateMySQLEventsTime called with divId:", divId, "storageName:", storageName);
    var d = new Date();
    var time = d.getHours()*3600 + d.getMinutes()*60 + d.getSeconds();
    console.log("Current time (seconds):", time);

    for(var i=0; i<loadedMySQLEvents.length; i++) {
        var line = loadedMySQLEvents[i];
        console.log("Processing event:", line.event_name, "Type:", line.type, "Times:", line.event_times);
        var times = line.event_times;
        var j;
        for (j = 0; j < times.length; j++) {
            var t = times[j].split(':');
            var sec = parseInt(t[0])*3600 + parseInt(t[1])*60;
            if (sec > time) {
                console.log("Next time found at index:", j, "value:", times[j]);
                break;
            }
        }
        j = j % times.length;
        var nextT = times[j];
        var tt = nextT.split(':');
        var nextSec = parseInt(tt[0])*3600 + parseInt(tt[1])*60;
        var diff = nextSec - time;
        if (diff < 0) diff += 86400;
        console.log("For event:", line.event_name, "nextT:", nextT, "diff:", diff);
        var totalsecondy = diff;
        var h = parseInt(diff / 3600);
        diff -= h*3600;
        var m = parseInt(diff / 60);
        var s = diff - m*60;
        var countdown = h+':'+("0"+m).slice(-2)+':'+("0"+s).slice(-2);
        console.log("Countdown for", line.event_name, countdown);

        // Instead of using eventRows and eq(i), select by unique id assigned during table creation
        var row = $('#event-' + i);
        if(row.length > 0) {
            console.log("Updating row with id: event-"+i+" for event:", line.event_name);
            row.find('.sortnr').text(totalsecondy);

            if (h===0 && totalsecondy<=300) {
                console.log("Event", line.event_name, "less than 5 minutes -> time-on");
                row.find('.event-timer').html('<span class="time-on">'+countdown+'</span>');
            } else {
                console.log("Event", line.event_name, "more than 5 minutes -> time-off");
                row.find('.event-timer').html('<span class="time-off">'+countdown+'</span>');
            }

            var fullText = nextT+' - '+line.event_name+' - '+line.description;
            console.log("Setting event text:", fullText);
            var truncated = '<span class="event-text" data-fulltext="'+fullText+'">'+fullText+'</span>';
            row.find('td:nth-child(2)').html(truncated);
        } else {
            console.log("No row found with id: event-"+i+" for event:", line.event_name,". Check filtering or indexing logic.");
        }
    }
    console.log("Finished updateMySQLEventsTime");
}

function sortMySQLEventsTable() {
    console.log("sortMySQLEventsTable called");
    var tbl = document.getElementById("c_events");
    if (!tbl) {
        console.log("No table with id c_events found.");
        return;
    }
    if (!tbl.tBodies || !tbl.tBodies[0]) {
        console.log("No tbody found inside #c_events.");
        return;
    }
    var tBody = tbl.tBodies[0];
    console.log("Sorting rows...");
    var store = [];
    for (var i = 0, len = tBody.rows.length; i < len; i++) {
        var row = tBody.rows[i];
        var sortnr = parseFloat(row.cells[0].textContent || row.cells[0].innerText);
        if (!isNaN(sortnr)) {
            store.push([sortnr, row]);
            console.log("Storing row at index:", i, "with sortnr:", sortnr);
        }
    }
    store.sort(function(x, y) {
        return x[0] - y[0];
    });
    for (var i = 0, len = store.length; i < len; i++) {
        tBody.appendChild(store[i][1]);
    }
    console.log("Finished sortMySQLEventsTable");
}
