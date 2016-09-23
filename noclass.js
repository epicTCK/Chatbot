
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


class Message {
    constructor(user, txt, starNode, replyID) {
        this.replyID = replyID;
        this.user = user;
        this.txt = txt;
        this.starNode = starNode;
        this.respondedTo = false;
    }
    star() {
        this.starNode.click();
        console.log("Message starred: " + this.txt);
    }
    toMarkdown() {
        return this.txt.replace(/<\/?i>/g, "*").replace('<span class=\"mention\">', '').replace('</span>', '');
    }
    reply(msg, botTag){
        chat(msg, this.replyID, botTag);
        this.respondedTo = true;
    }
    removeMention(){
        var p = this.toMarkdown().split(" ");
        for(let m of p){
            if(m.match(/^@/)){p.splice(p.indexOf(m), 1)}
        }
        return p.join(" ");
    }
}
var name = "Bald Bantha";
var owner = "Bald Bantha";
var modules = new Set();
var outputOk = true;
var names = [
    "dimwit",
    "potatoe head",
    "cabbage brain",
    "Idiot",
    "pocket-calculator-memoried disgrace",
    "empty-skulled",
    "ignoramoose"
];
var emotions = [
{emotion:"angry", chance:2}, 
{emotion:"funny", chance:3},
{emotion:"normal", chance:5}
];
function setEmotions(a,b,c){
    for(let i = 0; i < emotions.length; i++){
        emotions[i].chance = arguments[i];
    }
}
function chat(msg, replyBool, botTag) {
    replyBool = replyBool || false;
    botTag = botTag || true;
    if(outputOk){
    tag = botTag? "**[BOT]** ": "";
    tag = replyBool? replyBool + " " + tag: tag;
    document.getElementById('input').value = tag + msg;
    document.getElementById("sayit-button").click();
    console.log("message sent: " + msg);
    }
}

function getMessage(number) {//TODO faster way to get last element would be to use array.pop()
    let containers = document.getElementsByClassName("monologue");
    let container = containers[containers.length - number];
    let contentClasses = container.getElementsByClassName("content");
    let txt = contentClasses[contentClasses.length - 1].innerHTML;
    let messageClasses = container.getElementsByClassName("message");
    let replyID = ":" + messageClasses[messageClasses.length - 1].id.split("-").pop();
    let starClasses = container.getElementsByClassName("stars");
    let star = starClasses[starClasses.length-1].children[0];
    let message = new Message(
        container.getElementsByClassName("username")[0].innerHTML,
        txt,
        star,
        replyID
    );
  
    return message;
}

function loop() {

    var message = getMessage(1);
    var prevMessage = getMessage(2);

    
    var messageL = message.toMarkdown().toLowerCase();

   
    if (message.toMarkdown() == prevMessage.toMarkdown()){
        return;
    }
    console.log("Got Message: " + message.txt);
    for (let module of modules) module(message);

}

function start() {
    setInterval(loop, 6000);
}

function addModule(callback) {
    modules.add(callback);

}
function getEmotion(){
    var emotionsWeighted = [];
    
    for(let i of emotions){
        
        for(let h=i.chance;h>0;h--){
            emotionsWeighted.push(i);
        }

    }
    return emotionsWeighted[Math.floor(Math.random()*10)].emotion;

}



function xkcd(input) {
    if(input.respondedTo)return;
    if(input.user === name)return;
    if (input.toMarkdown().includes("xkcd")) {
        var split = input.toMarkdown().split(" ");
        var num = split[split.indexOf("xkcd") + 1];
        var url = "http://www.xkcd.com/" + num;
        if (/^\d+$/.test(num)) {
            input.reply(url, false);
        } else {
            input.reply("Invalid input "); //thnx to downgoat on PPCG chat
        }
    }
}
function avocad(input){
    if(input.respondedTo)return;
    if(input.user === name)return;
    if(input.toMarkdown().toLowerCase().includes("avocad")){
        input.reply("https://authoritynutrition.com/wp-content/uploads/2014/09/avocado-sliced-in-half.jpg",false);
    }
}

function admin(input){

    if(input.user === owner){
     if(input.toMarkdown().split(' ')[0].toLowerCase() === "/stop"){
         input.reply("Standby mode activated", true);
         outputOk = false;
     }
     if(input.toMarkdown().split(' ')[0].toLowerCase() === "/start"){
         input.reply("Standby mode disabled, bot is active",true);
         outputOk = true;
     } 
    }
    
}
function whatThink(input){
    if(input.user === name)return;
    if(input.respondedTo)return;
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
var responses = {
	"normal":[
		" is a wonderful person.",
        " is great!",
        " has a big ego. ",
        " is somewhere I would want to go",
        " would make a great headline!",
        " is wrong.",
		" is bad"
	],
	"funny":[
		" IS HUGGGGGEEEE",
        " is as cool as the other side of the pillow",
        "'s girlfriend is a real as santa",
        " needs help",
        " should be the name of a pop band"
	],
	"angry":[
		" is dumb.",
        " is the worst thing that never happened",
        " NEEDS TO SHTAP ALREADY OK SHEESH"
	]
};
    for(let sentance of triggers){ 
        if(input.toMarkdown().toLowerCase().includes(sentance)){
            let o = getEmotion();
            while(o=="")o = getEmotion();
            let u = responses[o];
            input.reply("I think " + input.toMarkdown.replace(sentance, "") +
             u[Math.floor(Math.random()*u.length)]);
            return;
        }
    }
    
}
function greeting(input){
    if(input.user === name)return;
    if(input.respondedTo)return;
    var triggers1 = [
        "what's up",
        "whats up",
        "how are you",
        "how r u",
        "how are u",
        "how r you",
        "what is up",
        "wassup"
    ];
    var triggers2 = [
        "hello",
        /(\bhi\b|^hi\b|\bhi$)/i,
        "hai",
        "hey"
    ];
	var responses1 = {
		"normal":[
			"gud",
			"nm wbu",
			"better than I deserve",
			"Just fine",
			"GR8"
		],
		"funny":[
			"gr8 m8 no h8 y u l8 4 lunch i just 8",
			"tryna come up with mor of these responses",
			"learning how to spell",
			"just computing.... ",
			"just tryna follow the three laws of robots"
		],
		"angry":[
			"y u think i have emotions",
			"better than u i know thats 4 shur"
		]
	};
    var responses2 = {
        "normal":[
            "Hello to you, too",
            "hay",
            "hey",
            "hai",
            "hello",
            "wassup",
            "hi"
        ],
        "funny":[""],
        "angry":[
            "Go Away"
        ]
    };

    for(let sentance of triggers1){
        if(input.toMarkdown().toLowerCase().match(sentance)){
            let o = getEmotion();
            while(o=="")o = getEmotion();
            let u = responses1[o];
            input.reply(u[Math.floor(Math.random()*u.length)]);
            return;
        }
    }
     for(let sentance of triggers2){
        if(input.toMarkdown().toLowerCase().match(sentance)){
            let o = getEmotion();
            while(o=="")o = getEmotion();
            let u = responses2[o];
            input.reply(u[Math.floor(Math.random()*u.length)]);
            return;
        }
    }
}

function binaryAnswer(input){
    if(input.user === name)return;
    if(input.respondedTo)return;
    

    var responses = {
        "normal":[
            "Yes",
            "No",
            "no",
            "yes",
            "yeah",
            "nope",
            "never",
            "probly",
            "probobly",
            "Of Course",
            "Of course not",
            "of course",
            "of course not",
            "yup",
            "yep",
            "nien",
            "Affirmative.",
            "Negitive.",
            "I don't recall....",
            "I don't know",
            "IDK"
        ],
        "angry":[
            "Why would I ever",
            "why should i know?",
            "DO I LOOK LIKE I KNOW EVERYTHING",
            "GET OFF MY LAWN",
            "N.O.",
            "Y.E.S.",
            "YES",
            "NO",
            "yeaaahhhh.... no.",
            "what do you honestly think?"
        ],
        "funny":[
            "My answer is a superposition between 1 and 0. Because of course my source is running on quantum power.",
            "1",
            "0",
            "Never, Never, Never, Never",
            "Affirmative, Dave. I read you." ,
            "I'm sorry, Dave. I'm afraid I can't do that.",
        ]
    }
    if(input.removeMention().match(/^\b(will|can)\b.*[\?]$/i)){
        let o = getEmotion();
        while(o=="")o = getEmotion();
        let u = responses[o];
        input.reply(u[Math.floor(Math.random()*u.length)]);
        return;
    }
}
function iAm(input){
    if(input.user === name)return;
    if(input.respondedTo)return;
    let responses = {
        "normal":[
            "Thanks for letting me know",
            "Cool! me too!",
            "Nice to know that about you",
            "So am I!"
        ],
        "funny":[
            "No you are not.",
            "And i'm purple!",
            "No yarnt",
            "You are not!"
        ],
        "Angry":[
            "Nobody cares what you are",
            "So am I, but do I go around telling people so?",
            "Stop boasting about yourself"
        ]
    }
    if(input.removeMention().match(/^(i'm)|^(im)|^(i am)/i)){
        var o = getEmotion();
        while(o=="")o = getEmotion();
        var u = responses[o];
        input.reply(u[Math.floor(Math.random()*u.length)]);
        return;
    }
    let responses2 = {
        "normal":[
            "Do you really?",
            "So do I!"
        ],
        "funny":[
            "Don't say that about yourself",
            "No you don't",
            "Yeah, well I do it better",
            "You do, but not very well"
        ],
        "Angry":[
            "stop telling us what you do",
            "Well that's dumb",
            "Well even if you do, you don't have a life"
        ]
    }
    if(input.removeMention().match(/^i\s/i)){
        let o = getEmotion();
        while(o=="")o = getEmotion();
        var u = responses2[o];
        input.reply(u[Math.floor(Math.random()*u.length)]);
        return;
    }
}
function questions(input){
    if(input.user === name)return;
    if(input.respondedTo)return;
    let responses = {
        "normal":[
            "Good question.",
            "I really don't know.",
            "Ask someone who knows.",
            "IDK, google it"
        ],
        "funny":[
            "http://www.lmgtfy.com/?q=" + encodeURI(input.toMarkdown())
        ],
        "angry":[
            "STOP WITH ALL THE QUESTIONS!!",
            "DO I LOOK LIKE I KNOW?!",
            "I DON'T HAVE ALL THE ANSWERS!"
        ]
    }
    if(input.removeMention().match(/\?$/)){
        let o = getEmotion();
        while(o=="")o = getEmotion();
        var u = responses[o]
        input.reply(u[Math.floor(Math.random()*u.length)]);
        return;
    }
}
function its(input){
    if(input.user === name)return;
    if(input.respondedTo)return;
    let responses = {
        "normal":[
            "is it really?",
            input.removeMention().replace(/(its)|(it's)|(it is)/, "what's") + "?",
            "I didn't know that",
            "No it isn't"
        ],
        "funny":[""],
        "angry":[
            "NO YOUR WRONG",
            "IT IS NOT!!",
            "OF COURSE IT IS, "+ names[Math.floor(Math.random()*names.length)]
        ]
    }
       if(input.removeMention().match(/^.{0,5}(its|it's|it is)/i)){
        let o = getEmotion();
        while(o=="")o = getEmotion();
        var u = responses[o]
        input.reply(u[Math.floor(Math.random()*u.length)]);
        return;
    }
}
addModule(avocad);
addModule(xkcd);
addModule(admin);
addModule(whatThink);
addModule(greeting);
addModule(iAm);
addModule(binaryAnswer);
addModule(questions);
addModule(its);