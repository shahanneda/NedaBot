const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const profanity = require('@2toad/profanity').profanity;
const songsFolder = '/Users/shahan/Documents/Website Projects/NedaBot/songs/';
const songsNameMap = {};
let options  = {
        sayEntirePhrase: true,
        profanityAllowed: false,
        testOption: false,
        testOption: true
}

client.once('ready', () => {
	console.log('Ready!');
        indexSongs();
});

client.on('message', message => {
        if(message.author.id === client.user.id) {
                return;// to prevent endless loop
        }
        if(options.profanityAllowed == false &&  profanity.exists(message.content.toLowerCase())){
                message.channel.send("😡😡😡 HEY!! " + message.author.toString() + "!! Watch your language!!! 😡😡😡");
                message.delete(); 
                return
        }

        handleOptions(message);
        console.log(message.content);
        handlePingPong(message);
        handleHiIAm(message);

        handleAudio(message);
});
function indexSongs(){
        fs.readdir(songsFolder, (err, files) => {
                files.forEach((file, i) => {
                        songsNameMap[i+1] = file;
                });
        }); 
}
//var  globalConnection = null;
function handleAudio(message){
        if(message.content === 'nb song' || message.content === 'nb songs'){
                fs.readdir(songsFolder, (err, files) => {
                        let text = "Here is a list of available songs:\n\n";
        
                        files.forEach((file, i) => {

                                text += (i+1) + ") " + file + "\n";
                                songsNameMap[i+1] = file;

                        });

                        message.channel.send(text + "\nPlay a song by typing:\nnb song num\nWhere num is the number of the song.");
                }); 
        }else if(message.content.indexOf('nb song') != -1){
                let indexOfSong = message.content.substr(message.content.indexOf('nb song') + 7,  message.content.length);
                indexOfSong = parseInt(indexOfSong);
                let songName  = songsNameMap[indexOfSong];
                message.channel.send("Playing " + songName);
                console.log("song name:" + songName);

                playSong(message,songName ); 
        }
        if (message.content === 'nb join') {

            if (message.member.voiceChannel) {
              message.member.voiceChannel.join()
                .then(connection => {
                  message.reply('I have connected to the voice Channel');
                         //createAudioDispatcher(connection);
                        //
                        playSong(message,"chopin.mp3");
                       // globalConnection = connection;
                })
                .catch(console.log);
            } else {
              message.reply('You need to join a voice channel first!');
            }
          }

       if (message.content === 'nb leave') {
            if (message.member.voiceChannel) {
                message.member.voiceChannel.leave()
                message.reply('I have left the voice channel');
            } else {
              message.reply('You need to join a voice channel first!');
            }
          }
}

client.login('Njc4NzM3NDI2MDkyMzkyNDc2.XknJlw.iywsTAgpty_Em2jpVSLJ2svDFx8');

function playSong(message, songName){
        let clientVoiceConnection =message.guild.voiceConnection;
        if(!clientVoiceConnection){
                message.channel.send("You need to first connect to a channel. Join the channel yourself, then type nb join");
                return
        }
        if(clientVoiceConnection.dispatcher){
                clientVoiceConnection.dispatcher.end();
        }
        console.log("Playing song with songname " + songName);
        createAudioDispatcher(clientVoiceConnection, songName);
}

function createAudioDispatcher(connection, songName){
        var dispatcher = connection.playFile(songsFolder + songName);
        dispatcher.on('end', () => {
                dispatcher = connection.playFile(songsFolder + songName);
        });

        dispatcher.on('error', e => {
                console.log(e);
        });

        dispatcher.setVolume(0.5);
        dispatcher.setVolume(1); 

        console.log(dispatcher.time);
}
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
                        message.channel.send("```diff\nWelcome to NedaBot Options!\nHere is list of options and their current values:\n\n" + listOfOptions + "\nIn order to set them run the following command with the following format: \n!options optionName value option2Name value2 option3Name value3 ...```"); 
                }

                for(var i =1; i < arr.length; i+=2){
                        let option = arr[i];
                        console.log("Triggering options " + option);
                        let found = false;
                        if(option in options){// check if options exist
                                let userValue = arr[i+1];
                                if(userValue == "true" || userValue=="false"){
                                        userValue = (userValue == "true")
                                }
                                options[option] = userValue;
                                message.channel.send("Set option " + option + " to value: " + userValue); 

                                found = true;
                        }
                        if(!found){
                                message.channel.send("Option not found!");
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
        
        let triggerPhrases = ["im ", "i'm ","i’m ", "i am ", "i am a ", "im a ", "i'm a ", "i’m a " , "im so ", "i'm so ", "i’m so ", "i am so ", "i am a complete ", "im a complete ","i'm a complete ", "i’m a complete ", "im an " , "i am an " , "i'm an ", "i’m an "];

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
