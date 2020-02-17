// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
        if(message.author.id === client.user.id) {
                return;// to prevent endless loop
        }

        console.log(message.content);

        handlePingPong(message);
        handleHiIAm(message, messageArray);
});


client.login('Njc4NzM3NDI2MDkyMzkyNDc2.XknJlw.iywsTAgpty_Em2jpVSLJ2svDFx8');
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

        let messageArray = formatedMsg.split(" ");
        if( messageArray.indexOf("im") != -1){
                messageArray.slcie
        }

        let name  = "";
        if(messageArray[0] == 'im' && messageArray[1] == "a"){
                name = messageArray[2];
                sendHiMessage(message, name);
        }else
        if(messageArray[0] ==  'im' || messageArray[0] == "i'm"){
                name = messageArray[1];   
                sendHiMessage(message, name);
        }else
        if(messageArray[0] == 'i' && messageArray[1] == "am" && messageArray[2] == "a"){
                name = messageArray[3];
                sendHiMessage(message, name);
        }else
        if(messageArray[0] == 'i' && messageArray[1] == "am"){
                name = messageArray[2];
                sendHiMessage(message, name);
        }
}
function sendHiMessage(messageObject, name){
        name = setCharAt(name, 0, name.charAt(0).toString().toUpperCase());
        messageObject.channel.send("Hi "  +  name +"!\nI am NedaBot!");
}
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}
