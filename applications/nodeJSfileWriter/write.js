const fs = require('fs')
const filepath = './configtxgen'
const request = require('request')
//write "it's" into the file
//fs.writeFileSync(filepath,"it's")

//read the file
const file_buffer  = fs.readFileSync(filepath);
//encode contents into base64
const contents_in_base64 = file_buffer.toString('base64');

requestData = {
		  "$class": "org.example.mynetwork.SampleParticipant",
		  "participantId": 26,
		  "firstName": contents_in_base64,
		  "lastName": "string"
}

console.log(requestData)

request({
    url: "http://localhost:3000/api/SampleParticipant",
    method: "POST",
    json: requestData
}, function (error, response, body) {
        if (!error && response.statusCode === 200) {
        }
        else {

            console.log("error: " + error)
            console.log("response.statusCode: " + response.statusCode)
            console.log("response.statusText: " + response.statusText)
        }
    })


