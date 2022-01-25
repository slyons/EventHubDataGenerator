const { Worker, isMainThread, parentPort } = require('worker_threads');
const { EventHubClient } = require('@azure/event-hubs');
const fakerSchema = require('json-schema-faker');
const faker = require("@faker-js/faker");

fakerSchema.extend('faker', () => {
    const faker = require('@faker-js/faker')
    faker.custom = {
        pdt: ndays => {
            return Math.floor(faker.date.recent(ndays).getTime() / 1000);
        }
    };
    return faker;
});

var intervalRef = null;

function sendBatch(body) {
    var connectionString = body.connectionstring;
    var eventHubNamespace = body.namespace;
    var messages = body.messages;
    var method = body.method;
    var testmode = body.test;

    console.log(messages);
    console.log(method);

    var client;
    if(!testmode) {
        client = EventHubClient.createFromConnectionString(connectionString, eventHubNamespace);
    }

    var data;
    for (let i = 0; i < messages; i++) {
        var dataJSON = JSON.parse(method);
        data = fakerSchema.generate(dataJSON);
        const eventData = {body: data};
        //console.log(`Sending message: ${eventData.body}`);
        //console.table(dataJSON)
        //console.table(data)
        if(!testmode) {
            client.send(eventData);
        }
    }
    console.table(data);
  
    if(!testmode) {
        client.close();
    }

    console.log("A batch of three events have been sent to the event hub");
    console.log('Successfully pushed data to Azure services [' + connectionString + '/' + eventHubNamespace + ']'); 
}

parentPort.on("message", message => {
    if("stop" in message) {
        if(intervalRef) {
            clearInterval(intervalRef);
            intervalRef = null;
            console.log("Stopped!");
        }
    } else {
        if(intervalRef) {
            clearInterval(intervalRef);
        }
        console.log(`Setting new interval to ${message.interval}`)
        intervalRef = setInterval(() => sendBatch(message), message.interval * 1000);
    }
});