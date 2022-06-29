"use strict";

var Service, Characteristic, HomebridgeAPI;
const { HomebridgeDummyVersion } = require('./package.json');

const request = require('request');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  HomebridgeAPI = homebridge;
  homebridge.registerAccessory("homebridge-infobip-call", "InfobipTTS", InfobipTTS);
}

function InfobipTTS(log, config) {
  this.log = log;
  this.name = config.name;
  this.stateful = config.stateful;
  this.time = config.time ? config.time : 1000;
  this.APIKey = config.APIKey;
  this.CalledNumber = config.CalledNumber;
  this.CallingNumber = config.CallingNumber;
  this.TTSText = config.TTSText;

  this.timer = null;
  this._service = new Service.Switch(this.name);
  
  this.informationService = new Service.AccessoryInformation();
  this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Homebridge')
      .setCharacteristic(Characteristic.Model, 'Infobip TTS Switch')
      .setCharacteristic(Characteristic.FirmwareRevision, HomebridgeDummyVersion)
      .setCharacteristic(Characteristic.SerialNumber, 'Infobip-' + this.name.replace(/\s/g, '-'));
  
  this.cacheDirectory = HomebridgeAPI.user.persistPath();
  this.storage = require('node-persist');
  this.storage.initSync({dir:this.cacheDirectory, forgiveParseErrors: true});
  
  this._service.getCharacteristic(Characteristic.On)
    .on('set', this._setOn.bind(this));

  if (this.reverse) this._service.setCharacteristic(Characteristic.On, true);

  if (this.stateful) {
	var cachedState = this.storage.getItemSync(this.name);
	if((cachedState === undefined) || (cachedState === false)) {
		this._service.setCharacteristic(Characteristic.On, false);
	} else {
		this._service.setCharacteristic(Characteristic.On, true);
	}
  }
}

InfobipTTS.prototype.getServices = function() {
  return [this.informationService, this._service];
}

InfobipTTS.prototype._setOn = function(on, callback) {

  this.log("Setting switch to " + on);

  if (on && !this.reverse && !this.stateful) {
    if (this.resettable) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(function() {
      this._service.setCharacteristic(Characteristic.On, false);
    }.bind(this), this.time);

    this.log.info('Sending Infobip API request');

 //var url = "http://10.116.118.127:8000";
 var url = "http://xr5elq.api.infobip.com/tts/3/advanced";

 var JSONObject = {
  "messages": [
    {
      "from": this.CallingNumber,
      "destinations": [
        {
          "to": this.CalledNumber
        }
      ],
      "text": this.TTSText,
      "language": "en",
      "voice": {
        "name": "Joanna",
        "gender": "female"
      },
      "speechRate": 1
    }
  ]
};

request({
  url: url,
  method: "POST",
  json: true,
  headers: {
    'Authorization': "App " + this.APIKey
  },
  body: JSONObject
}, function (error, response, body){
  if(error) { 
    console.error("-->X Error while communicating with Infobip API:  " + error);
  }
  console.error("-->V Sending Infobip API request successful");
  console.log(body);
  //console.log(response.statusCode);
});

  } else if (!on && this.reverse && !this.stateful) {
    if (this.resettable) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(function() {
      this._service.setCharacteristic(Characteristic.On, true);
    }.bind(this), this.time);
  }
  
  if (this.stateful) {
	this.storage.setItemSync(this.name, on);
  }
  
  callback();
}
