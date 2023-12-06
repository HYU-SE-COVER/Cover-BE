const express = require('express');

const router = express.Router();

const fs = require('fs');
const path = require('path');

const uuid = require('uuid');
const devicesPath = path.join(__dirname, '..', 'data', 'devices.json');

router.get('/', function(req, res) {
    res.send('blank');
});

router.get('/home', function(req, res) {
    const fileData = fs.readFileSync(devicesPath);
    res.send(fileData);
});

router.post('/togglepower/:id', function(req, res) {
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

router.post('/registerdevice/:devicetype', function(req, res) {
    const deviceType = req.params.devicetype;
    console.log(deviceType);

    const fileData = fs.readFileSync(devicesPath);
    const registeredDevices = JSON.parse(fileData);
    
    if (deviceType == 0) {
        registeredDevices.push({
            "name": "전등",
            "onoff": "꺼짐",
            "state": "",
            "deviceImg": 0,
            "networkImg": 1,
            "isActive": false,
            "id": uuid.v4()
        })
    }
    if (deviceType == 1) {
        registeredDevices.push({
            "name": "에어컨",
            "onoff": "꺼짐",
            "state": "23°C 냉방",
            "deviceImg": 1,
            "networkImg": 2,
            "isActive": false,
            "id": uuid.v4()
        });
    }
    else if (deviceType == 4) {
        registeredDevices.push({
            "name": "와인 셀러",
            "onoff": "꺼짐",
            "state": "16°C",
            "deviceImg": 4,
            "networkImg": 0,
            "isActive": false,
            "id": uuid.v4()
        });
    }

    fs.writeFileSync(devicesPath, JSON.stringify(registeredDevices));
    res.send('device registered');
});

router.get('/get/:id', function(req, res) {
    const deviceType = req.params.id;
    const fileData = fs.readFileSync(devicesPath);
    const registeredDevices = JSON.parse(fileData);

    for (const item of registeredDevices) {
        if (item.deviceImg == deviceType) {
            console.log(item);
            return res.send(item);
        }
    }
    res.send(null);
});

router.post('/update/:id', function(req, res) {
    const { state, sliderValue } = req.body;
    console.log(state, sliderValue);

    const deviceType = req.params.id;
    const fileData = fs.readFileSync(devicesPath);
    const registeredDevices = JSON.parse(fileData);
    
    for (const item of registeredDevices) {
        if (item.deviceImg == deviceType) {
            item.isActive = state;
            item.onoff = state ? '켜짐' : '꺼짐';
            item.state = item.state.replace(/\d+/, sliderValue);       
            console.log(item);
            return res.send(item);
        }
    }
    res.send('failed');
});

module.exports = router;