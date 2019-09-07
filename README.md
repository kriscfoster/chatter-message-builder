# chatter-post-builder

Helps to build Salesforce chatter feed elements (includes rich-text support) which are supported by the Salesforce Chatter API ☁️

## Install
```shell
npm install chatter-post-builder
```

## Usage
```javascript
const chatterPostBuilder = require('./chatter-post-builder.js');

const simplePost = chatterPostBuilder.build('Hello World!');
/*
{
  body: {
    messageSegments: [
      {
        type: "Text",
        text: "Hello World!"
      }
    ]
  },
  feedElementType : 'FeedItem',
  subjectId: 'me'
}
*/

console.log('This section is a work in progress!');
```
