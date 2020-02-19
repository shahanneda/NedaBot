const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const profanity = require('@2toad/profanity').profanity;
const songsNameMap = {};
const auth = require('./auth.js');
const songsFolder = auth.songDirectory;
const ytdl = require('ytdl-core');
const request = require('request');


let options  = {
        sayEntirePhrase: true,
        profanityAllowed: false,
        testOption: false,
        testOption: true,
        cmndPrefix: "!"
}
let songVolume = 1;
let  commandList = {
        "join": "Joins the voice channel of the user, use this when wanting to play music. Firstly join the intended voice channel yourself, then run this command.",
        "leave": "Leaves the current voice channel. Before running this command first join the intended voice channel yourself.",
        "play <search phrase or url>": "Either searches for phrase on youtube and picks first result, or plays the url. If you want the next result use the next command.",
        "next": "Skips to the next song out of the results",
        "volume num":"Sets the volume of the song. Number must be a value between 1-100. Can also use shorthand of just vol.",

}
let queue = [];
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
        handleHelp(message);
        handleAudio(message);
        handleVolume(message);
        handleNextSong(message);
        handleQueue(message);
                
});
function handleQueue(message){
        console.log(queue);
        if(message.content === options.cmndPrefix + "skip"){
                nextSongFromQueue(message);
        }

        if(message.content === options.cmndPrefix + "queue" || message.content  === options.cmndPrefix + "q"){
                let output = "These are the songs currently in your queue:\n";
                queue.map(function(song, index){
                      output  += (index+1) + ") " + song.title + "\n";
                });
                sendMessage(message, output);
        }
        else if(message.content.indexOf(options.cmndPrefix + "queue" ) != -1 || message.content.indexOf(options.cmndPrefix + "q") ==-1){
        }
        
        if(message.content.indexOf(options.cmndPrefix + "add") != -1){
                let searchp = message.content.substr(message.content.indexOf(options.cmndPrefix+"add") + options.cmndPrefix.length + 3, message.content.length);
                ytSearchForSong(message, searchp, true);
        }
}
function addToQueue(message, song){
        sendMessage(message, "Added song:\n" + song.title + " to queue position " + (queue.length+1));
        queue.push(song);
}
function handleHelp(message){
        let cmd = options.cmndPrefix;
        let helptext = "```diff\n Welcome to NedaBot help! Here are a list of commands:\n\n";
        for(let key in  commandList){
                if(commandList.hasOwnProperty(key)){
                        helptext += options.cmndPrefix +  key +"\n";
                        helptext += "\t" + commandList[key] + "\n\n";
                }
        }
        helptext += "!options\n\tUsed to get a list of the options and instructions for setting them\n```"
        if(message.content == options.cmndPrefix + "help"){
                message.channel.send(helptext);
        }

}
function indexSongs(){
        fs.readdir(songsFolder, (err, files) => {
                files.forEach((file, i) => {
                        songsNameMap[i+1] = file;
                });
        }); 
}
//var  globalConnection = null;
function handleAudio(message){
        if(message.content.indexOf(options.cmndPrefix + 'song') != -1 || message.content === options.cmndPrefix + 'songs' || message.content == options.cmndPrefix + 'play'){
                sendMessage(message, "Play a song by using the command: " +  options.cmndPrefix + "play <search phrase or here>, for example to play all star from youtube the command is: " + options.cmndPrefix + "play allstar smash mouth \nUse "+options.cmndPrefix + "next to advance to the next search result.");
        }else if(message.content.indexOf(options.cmndPrefix + 'play') != -1){

                let indexOfSong = message.content.substr(message.content.indexOf(options.cmndPrefix + 'play') + 4 + options.cmndPrefix.length ,  message.content.length);
                /*
                if(!isNaN(indexOfSong)){
                        indexOfSong = parseInt(indexOfSong);
                        let songName  = songsNameMap[indexOfSong];
                        sendMessage(message, "Playing " + songName);
                        console.log("song name:" + songName);

                        playSong(message,songName ); 
                }else*/
                if(indexOfSong.indexOf('youtube.com') !=  -1){
                        playSongUrl(message, indexOfSong);
                        request('https://noembed.com/embed?url=' + indexOfSong, { json: true }, (err, res, body) => {
                                if (err) { return console.log(err); }
                                console.log(body.title);
                                sendMessage(message, "Playing: " + body.title);
                        });
                }else{
                        console.log("this got ran");
                        ytSearchForSong(message, indexOfSong); 
                }
        }
        if (message.content === options.cmndPrefix + 'join') {

            if (message.member.voiceChannel) {
              message.member.voiceChannel.join()
                .then(connection => {
                  sendMessage(message, 'I have connected to the voice Channel');
                         //createAudioDispatcher(connection);
                        //
                        playSong(message,"chopin.mp3");
                       // globalConnection = connection;
                })
                .catch(console.log);
            } else {
              sendMessage(message,'You need to join a voice channel first!');
            }
          }

       if (message.content === options.cmndPrefix + 'leave') {
            if (message.member.voiceChannel) {
                message.member.voiceChannel.leave()
                sendMessage(message,'I have left the voice channel');
            } else {
              sendMessage(message,'You need to join a voice channel first!');
            }
          }
}

client.login(auth.key);
var lastIndex = 0;
var lastStr = "";
function handleNextSong(message){
        if(message.content.indexOf(options.cmndPrefix + "next") != -1){
                
                console.log("got here");
                lastIndex++;
                if(lastIndex > 9){
                        lastIndex = 0;
                }
                ytSearchForSong(message,lastStr);
        }
}
function ytSearchForSong(message, str, isQueue){
        lastStr = str;
        const ytsr = require('ytsr');
        let filter;

        ytsr.getFilters(str, function(err, filters) {// this is from ytsr documatiotion
          if(err) throw err;
            filter = filters.get('Type').find(o => o.name === 'Video');
          ytsr.getFilters(filter.ref, function(err, filters) {
                    if(err) throw err;
                    //filter = filters.get('Duration').find(o => o.name.startsWith('Short'));
                    var options = {
                        limit: 10,
                        nextpageRef: filter.ref,
                    }
                    ytsr(null, options, function(err, searchResults) {
                        if(err) throw err;
                        let link = searchResults.items[lastIndex].link;
                            console.log(searchResults);
                                if(searchResults.items[lastIndex].type != 'video'){
                                        lastIndex++; 
                                        if(lastIndex > 9){
                                                lastIndex =0;        
                                        }
                                        ytSearchForSong(message,str);
                                        return;
                                }
                            if(isQueue){
                                addToQueue(message, {title:searchResults.items[lastIndex].title, url:link});
                            }else{
                                sendMessage(message, "Playing " + searchResults.items[lastIndex].title);
                                playSongUrl(message, link);
                            }
                    });
            });
        });

}
function handleVolume(message){
        if(message.content.indexOf(options.cmndPrefix + "vol") != -1){
                let usrVol = ( parseFloat(message.content.split(" ")[1]) / (100* 1.0)); 
                let volume =  usrVol > 1 ? 1 : (usrVol < 0 ? 0 : usrVol) ;
                console.log(volume);
                let clientVoiceConnection =message.guild.voiceConnection;
                songVolume = volume;

                if(!clientVoiceConnection){
                        sendMessage(message, "You need to first connect to a channel and play music before changing the volume! Join the channel yourself, then type " + options.cmndPrefix + "join")
                        return
                }
                if(clientVoiceConnection.dispatcher){
                        clientVoiceConnection.dispatcher.setVolume(volume);
                }
        }
}
function playSong(message, songName){

        let clientVoiceConnection =message.guild.voiceConnection;
        if(!clientVoiceConnection){
                sendMessage(message, "You need to first connect to a channel. Join the channel yourself, then type " + options.cmndPrefix + "join")
                return
        }
        if(clientVoiceConnection.dispatcher){
                clientVoiceConnection.dispatcher.end();

        }


        console.log("Playing song with songname " + songName);
        createAudioDispatcher(clientVoiceConnection, songName);
        clientVoiceConnection.dispatcher.setVolume(songVolume);
}

function playSongUrl(message, url){

        let clientVoiceConnection =message.guild.voiceConnection;
        if(!clientVoiceConnection){
                sendMessage(message, "You need to first connect to a channel. Join the channel yourself, then type " + options.cmndPrefix + "join")
                return
        }

        if(clientVoiceConnection.dispatcher){
                clientVoiceConnection.dispatcher.end();
        }

        const stream = ytdl(url, { filter : 'audioonly' });
        console.log("Playing song with url " + url);
        createAudioDispatcherFromStream(message, clientVoiceConnection, stream);
        clientVoiceConnection.dispatcher.setVolume(songVolume);
}
function nextSongFromQueue(message){
        console.log(queue);
        console.log(queue.length);
        if(queue.length > 0){
                playSongUrl(message, queue[0].url);
                sendMessage(message, "Playing next song from queue: " + queue[0].title);
        }
        else{
                sendMessage(message, "Your queue is empty!! Add songs with !add <search phrase>");
        }
        let song = queue.shift();

}
var lastEndTime = Date.now();
function createAudioDispatcherFromStream(message, connection, stream){
        var dispatcher = connection.playStream(stream);
        dispatcher.on('end', () => {
                console.log("Last end: " + lastEndTime);
                lastEndTime = Date.now();
                console.log(stream + "" + connection);
                
      //          nextSongFromQueue(message);
        });
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
function sendMessage(message, msg){
        message.channel.send("```css\n" + msg + "```");
}
function handleOptions(message){
        let formatedMsg = message.content;
        if(formatedMsg.indexOf("!options") != -1 || formatedMsg.indexOf(options.cmndPrefix + "options" ) != -1){
                let arr = formatedMsg.split(" ");        

                if(arr.length == 1){
                        let listOfOptions = "";
                        for(let option in options){
                                if(options.hasOwnProperty(option)){
                                        listOfOptions += option + ": " + options[option] + "\n";
                                }
                        }
                        message.channel.send("```diff\nWelcome to NedaBot Options!\nHere is list of options and their current values:\n\n" + listOfOptions + "\nIn order to set them run the following command with the following format: \n!options optionName value option2Name value2 option3Name value3 ...\nFor example to set profanityAllowed to false, run !options profanityAllowed false```"); 
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
                                sendMessage(message, "Set option " + option + " to value: " + userValue); 

                                found = true;
                        }
                        if(!found){
                                sendMessage(message, "Option not found!");
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
