<?php
$storage = 'web';

$mysqli = new mysqli("localhost", "dashboard_user", "dashboard123", "dashboard");
if ($mysqli->connect_error) {
    die("Erro ao conectar no MySQL: " . $mysqli->connect_error);
}

$result = $mysqli->query("SELECT event_name, event_times, description, type FROM events");
$events = [];
while($row = $result->fetch_assoc()) {
    $row['event_times'] = json_decode($row['event_times'], true);
    $events[] = $row;
}
$mysqli->close();
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>TMO</title>
<link rel="shortcut icon" href="assets/dashboard/images/favicon.ico"/>
<link rel="stylesheet" href="assets/dashboard/css/style.css" type="text/css">
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
<script>
var storage = '<?php echo $storage; ?>';
var url = 'http://localhost/';
var servername = 'MyServer';
var mysql_events = <?php echo json_encode($events); ?>;
</script>
<script type="text/javascript" src="assets/dashboard/js/jquery-3.5.1.min.js"></script>
<script type="text/javascript" src="global.js"></script>
<script type="text/javascript" src="mysql1.js"></script>
</head>
<body>
    <div class="dashboard">
        <div id="header">
            <a href="#" id="button-users" onclick="goUsersList('<?php echo $storage; ?>');" class="button-top active"></a>
            <a href="#" id="button-events" onclick="goEventsList('<?php echo $storage; ?>');" class="button-top"></a>
            <a href="#" id="button-news" onclick="goNewsList();" class="button-top"></a>
            <a href="#" id="button-streamers" onclick="goStreamersList();" class="button-top"></a>
        </div>
        <div id="container">
            <div id="users-list">
                <table id="load-characters"></table>
            </div>
            <div id="events-list">
                <div class="events-list-button"></div>
                <a id="button-evt" href="#" onclick="EventsFilter('event', '<?php echo $storage; ?>');" class="button-event">Events</a>
                <a id="button-boss" href="#" onclick="EventsFilter('boss', '<?php echo $storage; ?>');" class="button-event">Boss</a>
                <a id="button-inv" href="#" onclick="EventsFilter('inv', '<?php echo $storage; ?>');" class="button-event">Invasion</a>
                <a id="button-all" href="#" onclick="EventsFilter('all', '<?php echo $storage; ?>');" class="button-event active">All</a>
                <table style="margin-top: 25px;" id="c_events">
                    <tbody></tbody>
                </table>
            </div>
            <iframe id="career-frame" class="career-frame" src="" style="display: none; border: 0px; max-width: 240px; min-width: 240px; width: 240px; max-height: 233px; height: 233px; min-height: 233px; background: #1d1818 url(https://i.imgur.com/xN8cm3x.jpg) no-repeat top left;"></iframe>
            <div id="news-list">
                <table>
                    <tr>
                        <td>
                            <div>
                                <table>
                                    <tr>
                                        <td style="color: #4bc749;">[News]</td>
                                        <td rowspan="2"><button onclick="if(window.chrome&&window.chrome.webview){window.chrome.webview.postMessage({functionId:4,args:['https://example.com/news']});}">+</button></td>
                                    </tr>
                                    <tr>
                                        <td><p style="width:160px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;line-height: 11px;" title="Test Title">TEST</p></td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div id="streamers-list">
                <script type="text/javascript">
                    LoadStreamers();
                </script>
            </div>
            <div id="settings-list" style="display: none;">
                <table>
                    <tr>
                        <td colspan="2" align="left"><h3>Client Settings</h3><hr /></td>
                    </tr>
                    <tr>
                        <td>New Effects</td>
                        <td>
                            <label class="switch">
                            <input type="checkbox" id="new-effect" onclick="if(window.chrome&&window.chrome.webview){window.chrome.webview.postMessage({functionId:11,args:[]});}">
                                <span class="slider round"></span>
                            </label>
                        </td>
                    </tr>
                    <tr><td colspan="2"><br /></td></tr>
                    <tr>
                        <td colspan="2" align="left"><h3>Alerts Settings</h3><hr /></td>
                    </tr>
                    <tr>
                        <td>Events</td>
                        <td>
                            <label class="switch" onclick="if(window.chrome&&window.chrome.webview){window.chrome.webview.postMessage({functionId:12,args:['Sorry, this feature is under development!','Error']});}">
                            <input type="checkbox" disabled checked>
                                <span class="slider round"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td>Streamers</td>
                        <td>
                            <label class="switch" onclick="if(window.chrome&&window.chrome.webview){window.chrome.webview.postMessage({functionId:12,args:['Sorry, this feature is under development!','Error']});}">
                            <input type="checkbox" disabled checked>
                                <span class="slider round"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td>Others</td>
                        <td>
                        <label class="switch" onclick="if(window.chrome&&window.chrome.webview){window.chrome.webview.postMessage({functionId:12,args:['Sorry, this feature is under development!','Error']});}">
                        <input type="checkbox" disabled checked>
                            <span class="slider round"></span>
                        </label>
                        </td>
                    </tr>
                    <tr>
                        <td>General</td>
                        <td>
                            <label class="switch" onclick="if(window.chrome&&window.chrome.webview){window.chrome.webview.postMessage({functionId:12,args:['Sorry, this feature is under development!','Error']});}">
                            <input type="checkbox" disabled checked>
                                <span class="slider round"></span>
                            </label>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div id="footer">
            <a href="#" onclick="if(window.chrome&&window.chrome.webview){window.chrome.webview.postMessage({functionId:4,args:['http://localhost/']});}" class="button-down">Site</a>
            <a href="#" onclick="if(window.chrome&&window.chrome.webview){window.chrome.webview.postMessage({functionId:4,args:['https://discord.com/']});}" class="button-down"></a>
            <a href="#" onclick="if(window.chrome&&window.chrome.webview){window.chrome.webview.postMessage({functionId:4,args:['http://localhost/guides']});}" class="button-down">Helper</a>
        </div>
    </div>
</body>
</html>
