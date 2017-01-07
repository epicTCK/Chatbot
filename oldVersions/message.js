class Message {
  constructor(user, txt, starNode, replyID) {
    this.replyID = replyID;
    this.user = user;
    this.txt = txt;
    this.starNode = starNode;
    console.log("Message created: " + this.txt);
  }
  star() {
    this.starNode.click();
    console.log("Message starred: " + this.txt);
  }
  toMarkdown() {
    
  }

}