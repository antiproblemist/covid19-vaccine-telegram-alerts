const express = require("express");
const axios = require("axios");
const moment = require('moment-timezone');
const redis = require("redis");

require('dotenv').config();

client = redis.createClient(process.env.REDIS_URL)

const app = express();

app.get("/", function(req, res) {
    
    url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${process.env.DISTRICT_ID}&date=${moment.tz('Asia/Kolkata').format('DD-MM-YYYY')}`;
    
    axios.get(url, {
        headers: {
            "accept-language": "hi_IN",
        }
    })
    .then(function (json) {
      json.data && json.data.centers && json.data.centers !== undefined &&  json.data.centers.map(center => {
        center.sessions && center.sessions !== undefined && center.sessions.map(session => {
            if(session.available_capacity_dose1 > 0 || session.available_capacity_dose2 > 0) {
                client.get(session.session_id, (err, reply) => {
                    console.log("Cache Value: ", reply)
                    if (!reply) {
                        client.set(session.session_id, moment().toISOString(), 'EX', 60 * 60);
                        let vaccine_fees = ""
                        if (center.vaccine_fees && center.vaccine_fees!==undefined) {
                            center.vaccine_fees.map(fees => {
                                vaccine_fees += `Price for ${fees.vaccine} Rs. ${fees.fee}\r\n`
                            })
                        }
                        const message = `${session.vaccine} available at ${center.district_name} ${center.pincode} for ${session.min_age_limit}+\r\n\r\nDate: ${session.date}\r\nCenter name: ${center.name}\r\nAddress: ${center.address}\r\nDose 1 available: ${session.available_capacity_dose1}\r\nDose 2 available: ${session.available_capacity_dose2}\r\nTiming: ${center.from} to ${center.to}\r\nFee Type: ${center.fee_type}\r\n${vaccine_fees}\r\n\r\Schedule now https://selfregistration.cowin.gov.in (Keep Aadhar/PAN Card/Driving License handy)`
        
                        axios.post(
                        `https://api.telegram.org/bot${process.env.BOT_KEY}/sendMessage`,
                        {
                            chat_id: process.env.CHAT_ID,
                            text: message
                        }
                        )
                        .then(response => {
                            res.end("messages sent");
                        })
                        .catch(err => {
                            res.end("Error :" + err);
                        });
                    }
                })
            }
        })
      })
    })
    .catch(function(reason) {
        console.log(reason)
     });
    res.end("ok");
})

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log("Express server listening on port", port);
});