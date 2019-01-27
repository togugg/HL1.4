const fs = require('fs')
const request = require('request')

request({
    url: "http://localhost:3000/api/SampleParticipant/24",
    method: "get",
}, function (error, response, body) {
        if (!error && response.statusCode === 200) {
	    body = JSON.parse(body)
            console.log(body)
	    contents_in_base64 = body.firstName
	    fs.writeFileSync('./fileB64.pdf',contents_in_base64,{encoding:'base64'})
        }
        else {
            console.log("error: " + error)
            console.log("response.statusCode: " + response)
        }
    })


//fs.writeFileSync('./fileB64',contents_in_base64,{encoding:'base64'})
