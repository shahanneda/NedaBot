const Discord = require('discord.js');
const client = new Discord.Client();
const profanity = require('@2toad/profanity').profanity;
let options  = {
        sayEntirePhrase: true
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
        if(message.author.id === client.user.id) {
                return;// to prevent endless loop
        }
        if(profanity.exists(message.content.toLowerCase())){
                message.channel.send("😡😡😡 HEY!! " + message.author.toString() + "!! Watch your language!!! 😡😡😡");
                message.delete(); 
                return
        }

        handleOptions(message);
        console.log(message.content);
        handlePingPong(message);
        handleHiIAm(message);
});


client.login('Njc4NzM3NDI2MDkyMzkyNDc2.XknJlw.iywsTAgpty_Em2jpVSLJ2svDFx8');

function handleOptions(message){
        let formatedMsg = message.content;
        if(formatedMsg.indexOf("!options") != -1){
                let arr = formatedMsg.split(" ");        

                if(arr.length == 1){
                        let listOfOptions = "";
                        for(let option in options){
                                if(options.hasOwnProperty(option)){
                                        listOfOptions += option + ": " + options[option] + "\n";
                                }
                        }
                        message.channel.send("Welcome to NedaBot Options!\nHere is list of options and their current values:\n" + listOfOptions + "In order to set them run the following command with the following format \n!options optionName value option2Name value2 option3Nane value3 ..."); 
                }

                for(var i =1; i < arr.length; i+=2){
                        let option = arr[i];
                        console.log("Triggering options " + option);
                        if(option in options){// check if options exist
                                let userValue = arr[i+1];
                                if(userValue == "true" || userValue=="false"){
                                        userValue = (userValue == "true")
                                }
                                options[option] = userValue;
                                message.channel.send("Set option " + option + " to value: " + userValue); 

                        }

                }
        }
}

function handlePingPong(message){
        let formatedMsg = message.content.toLowerCase();

        if ( formatedMsg == 'ping') {
              message.channel.send('pong');
        }
        if (formatedMsg ===  "pong"){
                message.channel.send("ping");
        }

}

function handleHiIAm(message){
        let formatedMsg = message.content.toLowerCase();
        
        let triggerPhrases = ["im ", "i'm ", "i am ", "i am a ", "im a ", "i'm a ", "im so ", "i'm so ", "i am so ", "i am a complete ", "im a complete ","i'm a complete ", "im an " , "i am an " , "i'm an "];

        triggerPhrases.reverse();
        triggerPhrases.map(function (phrase, index){
                if(formatedMsg.indexOf(phrase) != -1){
                        formatedMsg = formatedMsg.substr(formatedMsg.indexOf(phrase) + phrase.length, formatedMsg.length);
                        console.log(formatedMsg + " " + phrase);
                        
                        rname = formatedMsg.split(" ");
                        console.log(rname);
                        if(options.sayEntirePhrase){
                                sendHiMessage(message, formatedMsg);
                        }
                        else{
                                sendHiMessage(message, formatedMsg.split(" ")[0]);
                        }
                        formatedMsg = "";
                }
        });
}
function sendHiMessage(messageObject, name){
        name = setCharAt(name, 0, name.charAt(0).toString().toUpperCase());
        let endPhrases = ["I'm NedaBot!", "I am NedaBot! Nice to meet you!", "Nice to meet you, I am NedaBot", "I am THE NEDABOT","Have we met before? Well anyway I am NedaBot.",  "It's a pleasure to work with you!!"];
        
        messageObject.channel.send("Hi "  +  name +"\n" + endPhrases[Math.floor(Math.random() * endPhrases.length)]);

}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}
