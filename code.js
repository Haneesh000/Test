const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const email = req.body.email;
    const firstName = req.body.fname;
    const lastName = req.body.lname;

    const data = {
        members: [
            {
                email_address: email,
                staus: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
            },
        ],
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/xxxxxxxxx";

    const options = {
        method: "POST",
        auth: "xxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us9",
    };

    const request = https.request(url, options, (response) => {
        console.log(response.statusCode);
        if (response.statusCode == 200) {
            res.sendFile(__dirname+"/success.html");
        } else {
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 5500, () => {
    console.log("Server is started at port 5500");
});

// API Key xxxxxxxxxxxxxxxxxxxx-us9
// Audience Id xxxxxxxxx
