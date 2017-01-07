class Message {
     constructor(user, txt, starNode, replyID) {
        this.replyID = replyID;
        this.user = user;
        this.txt = txt;
        this.starNode = starNode;
    
    }
    star() {
        this.starNode.click();
        console.log("Message starred: " + this.removePing());
    }
    toMarkdown() {

    }
    removePing(){
     return this.txt.replace("<span class=mention>", "").replace("</span>", "").replace("@BaldBantha", "");
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
var reqPing = false;
var ignoreOwn = true;
var modules = new Set();
var outputOk = true;

function chat(msg, reply, botTag) {
    reply = reply || false;
    botTag = botTag || true;
    if(outputOk){
    tag = botTag? " **[BOT]** ": "";
    document.getElementById('input').value = reply + tag + msg.replace(/<\/?i>/g, "*").replace('<span class=\"mention\">', '').replace('</span>', '');
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
    var messageL = message.removePing().toLowerCase();

    if (reqPing && messageL.includes("@" +
            name.toLowerCase()) != true)
        return;
    if (message.removePing() == prevMessage.removePing()){
        return;
    }
    for (let module of modules) module(message);

}

function start() {
    addSources();
    setInterval(loop, 5000);
}

function addModule(callback) {
    modules.add(callback);
    console.log("Module added: " + callback);
}





function admin(input){
    if(input.user === owner){
     if(input.removePing().split(' ')[0].toLowerCase() === "/stop"){
         chat("Standby mode activated",input.replyID, true);
         outputOk = false;
     }
     if(input.removePing().split(' ')[0].toLowerCase() === "/start"){
         chat("Standby mode disabled, bot is active",input.replyID, true);
         outputOk = true;
     } 
    }
    
}

function addSources(){
    var nlpSrc = document.createElement('script');
    nlpSrc.setAttribute('src', 'https://npmcdn.com/nlp_compromise@latest/builds/nlp_compromise.min.js');
    document.head.appendChild(nlpSrc);
}
function partOfSpeech(input){
  
    nlp = window.nlp_compromise;
 
    
        if(input.removePing().includes("++pos")){
         input.txt = input.txt.replace("++pos", "");
         var subject = nlp.text(input.removePing()).tags().join(" ").replace(/\,/g, " ");
         chat(subject, input.replyID, true);
        
    }
}
function conjugate(input){
    if(input.removePing().includes("++conj")){
        input.txt = input.txt.replace("++conj", "");
        if(input.removePing().split(" ").index > 1){
            chat("Error: more than one argument provided. Please provide one (1) argument. ", input.replyID);
        } else {
            chat(JSON.stringify(nlp.verb(input.removePing()).conjugate()), input.replyID);
        }
       
    }
}
function helpMod(input){
    if(input.removePing().toLowerCase().includes("++help")){
        chat("Hello! I am a chatbot belonging to " +
         owner +
         ".\n Commands:\n ++pos: prints the parts of speech of the rest of the message.\n ++help: display this help message.",
         input.replyID, true);
        
    }
    
}
addModule(helpMod);
addModule(partOfSpeech);

start();