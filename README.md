# chatter-post-builder

Helps to build Salesforce chatter feed elements (includes rich-text support) which are supported by the Salesforce Chatter API ☁️

## Install
```shell
npm install chatter-post-builder
```

## Usage
### plain-text post to group with mention
```javascript
const chatterPostBuilder = require('./chatter-post-builder.js');
const groupId = '005D00000016Qxp';
const mentions = ['005B0000000Ek1S'];

const simplePost = chatterPostBuilder.build('Hello World!', groupId, mentions);
/*
{
  body: {
    messageSegments: [
      {
        type: "Text",
        text: "Hello World!"
      },
      {
        type: "Mention",
        id: "005B0000000Ek1S"
      }
    ]
  },
  feedElementType : 'FeedItem',
  subjectId: '005D00000016Qxp'
}
*/

console.log('This section is a work in progress!');
```
