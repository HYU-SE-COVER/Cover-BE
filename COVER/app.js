const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

app.use(express.urlencoded({extended: false}));

const userPath = path.join(__dirname, 'data', 'users.json');
const devicesPath = path.join(__dirname, 'data', 'devices.json');

app.get('/', function(req, res) {
    res.send('blank');
});

app.get('/home', function(req, res) {
    const fileData = fs.readFileSync(devicesPath);
    res.send(fileData);
});

app.post('/togglepower/:id', function(req, res) {
    const deviceId = req.params.id;

    const fileData = fs.readFileSync(devicesPath);
    const registeredDevices = JSON.parse(fileData);
    console.log(registeredDevices);
    for (const item of registeredDevices) {
        if (item.id == deviceId) {
            console.log(item);
            if (item.onoff === '켜짐') {
                item.onoff = '꺼짐';
                item.isActive = !item.isActive;
            }
            else {
                item.onoff = '켜짐';
                item.isActive = !item.isActive;
            }
            break;
        }
    }
    fs.writeFileSync(devicesPath, JSON.stringify(registeredDevices));
    res.send(registeredDevices);
});

app.post('/registerdevice', function(req, res) {
    res.send('device registered');
});

app.listen(5000);