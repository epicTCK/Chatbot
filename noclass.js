
class Message {
    constructor(user, txt, starNode, replyID) {
        this.replyID = replyID;
        this.user = user;
        this.txt = txt;
        this.starNode = starNode;
    
    }
    star() {
        this.starNode.click();
        console.log("Message starred: " + this.txt);
    }
    toMarkdown() {

    }

}
/* Copyright(c) 2016 Caleb Gentry alias epicTCK
 * Permission is hereby granted, free of charge,
 * to any person obtaining a copy  of this software
 * and associated documentation files(the "Software"),
 * to deal in the Software  without restriction,
 * including without limitation the rights to use,
 * copy, modify, merge, publish,  distribute, sublicense,
 * and / or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS  OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT  OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var name = "Bald Bantha";
var owner = "Bald Bantha";
var ignoreOwn = true;
var modules = new Set();
var outputOk = true;

function chat(msg, reply, botTag) {
    reply = reply || false;
    botTag = botTag || true;
    if(outputOk){
    tag = botTag? "**[BOT]** ": "";
    tag = reply? reply + " " + tag: tag;
    document.getElementById('input').value = tag + msg.replace(/<\/?i>/g, "*").replace('<span class=\"mention\">', '').replace('</span>', '');
    document.getElementById("sayit-button").click();
    console.log("message sent: " + msg);
    }
}

function getMessage(number) {
    var containers = document.getElementsByClassName("monologue");
    var container = containers[containers.length - number];
    var message = new Message(
        container.getElementsByClassName("username")[0].innerHTML,
        container.getElementsByClassName("content")[0].innerHTML,
        container.getElementsByClassName("stars")[0].children[0],
        ":" + container.getElementsByClassName("message")[0].id.split("-").pop()
    );
  
    return message;
}

function loop() {

    var message = getMessage(1);
    var prevMessage = getMessage(2);

    if (message.user == name && ignoreOwn) {
        return;
    }
    var messageL = message.txt.toLowerCase();

   
    if (message.txt == prevMessage.txt){
        return;
    }
    for (let module of modules) module(message);

}

function start() {
    setInterval(loop, 5000);
}

function addModule(callback) {
    modules.add(callback);

}




function xkcd(input) {

    if (input.txt.includes("xkcd")) {
        var split = input.txt.split(" ");
        var num = split[split.indexOf("xkcd") + 1];
        var url = "http://www.xkcd.com/" + num;
        if (/^\d+$/.test(num)) {
            chat(url, input.replyID, false);
        } else {
            chat("Invalid input ", input.replyID, true ); //thnx to downgoat on PPCG chat
        }
    }
}
function avocad(input){
    if(input.txt.toLowerCase().includes("avocad")){
        chat("https://authoritynutrition.com/wp-content/uploads/2014/09/avocado-sliced-in-half.jpg", input.replyID,false);
    }
}

function admin(input){
    if(input.user === owner){
     if(input.txt.split(' ')[0].toLowerCase() === "/stop"){
         chat("Standby mode activated",input.replyID, true);
         outputOk = false;
     }
     if(input.txt.split(' ')[0].toLowerCase() === "/start"){
         chat("Standby mode disabled, bot is active",input.replyID, true);
         outputOk = true;
     } 
    }
    
}
function whatThink(input){
    var triggers = [
        "what do you think of",
        "what do you think about",
        "what are your thoughts on",
        "What do u think of",
        "what do u think about",
        "what r ur thoughts on",
        "what are ur thoughts on",
        "what r your thoughts on"
    ];
    var responses = [
        " is a wonderful person.",
        " is great!",
        " has a big ego. ",
        " is somewhere I would want to go",
        " would make a great headline!",
        " is wrong.",
        " is dumb."
    ];
    for(let sentance of triggers){ 
        if(input.txt.toLowerCase().includes(sentance)){
            var x = 0;
            if(input.txt.toLowerCase().includes("alex a.")){x = 5;}
            if(input.txt.toLowerCase().includes("avocad")){x=1;}
            if(x === 0){x =Math.floor(Math.random()*6);}
            
           chat("I think "+  input.txt.toLowerCase().replace(sentance, "") + responses[x] ,input.replyID);
        }
    }
}
function greeting(input){
    var triggers1 = [
        "what's up",
        "whats up",
        "how are you",
        "how r u",
        "how are u",
        "how r you"
    ];
    var triggers2 = [
        "hello",
        "hi",
        "hai",
        "hey"
    ];
 
    for(let sentance of triggers1){
        if(input.txt.toLowerCase().includes(sentance)){

        }
    }
}

addModule(avocad);
addModule(xkcd);
addModule(admin);
addModule(whatThink);