const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
        if(message.author.id === client.user.id) {
                return;// to prevent endless loop
        }

        console.log(message.content);
        handlePingPong(message);
        handleHiIAm(message);
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
        let formatedMsg = message.content.toLowerCase();
        
        let triggerPhrases = ["im", "i'm", "i am", "i am a", "im a", "i'm a", "im so", "i'm so", "i am so"];

        triggerPhrases.map(function (phrase, index){
                if(formatedMsg.indexOf(phrase) != -1){
                        formatedMsg = formatedMsg.substr(formatedMsg.indexOf(phrase) + phrase.length+1, formatedMsg.length);
                        rname = formatedMsg.split(" ");
                        sendHiMessage(message, rname[0]);
                }
        });
}
function sendHiMessage(messageObject, name){
        name = setCharAt(name, 0, name.charAt(0).toString().toUpperCase());
        messageObject.channel.send("Hi "  +  name +"!\nI am NedaBot!");
}
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}
