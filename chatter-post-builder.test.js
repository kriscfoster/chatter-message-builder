const chatterPostBuilder = require('./chatter-post-builder.js');

describe('chatter-message-builder.js >', () => {
  const groupId = '005D00000016Qxp';
  const userId1 = '005B0000000Ek1S';
  const userId2 = '005T0000000mzCy';

  describe('plain-text message building >', () => {
    test('should construct feed item object with defaults', () => {
      const message = chatterPostBuilder.buildPost();
      expect(message).toHaveProperty('body');
      expect(message.body).toHaveProperty('messageSegments');
      expect(Array.isArray(message.body.messageSegments)).toBe(true);
      expect(message.subjectId).toEqual('me');
    });

    test('should construct feed item object with text segment', () => {
      const message = chatterPostBuilder
        .buildPost('This is plain text');
      const { messageSegments } = message.body;
      expect(messageSegments.length).toEqual(1);

      expect(messageSegments[0].type).toEqual('Text');
      expect(messageSegments[0].text).toEqual('This is plain text');
    });

    test('should override default group', () => {
      const message = chatterPostBuilder
        .buildPost('This is plain text', groupId);
      expect(message.subjectId).toEqual(groupId);
    });

    test('should append @mention to messageSegments', () => {
      const message = chatterPostBuilder
        .buildPost('This is plain text', null, [userId1]);
      const { messageSegments } = message.body;
      expect(messageSegments.length).toEqual(2);
      expect(messageSegments[0].type).toEqual('Text');
      expect(messageSegments[0].text).toEqual('This is plain text');
      expect(messageSegments[1].type).toEqual('Mention');
      expect(messageSegments[1].id).toEqual(userId1);
    });

    test('should append multiple @mentions to messageSegments', () => {
      const message = chatterPostBuilder
        .buildPost('This is plain text', null, [userId1, userId2]);
      const { messageSegments } = message.body;
      expect(messageSegments.length).toEqual(3);
      expect(messageSegments[0].type).toEqual('Text');
      expect(messageSegments[0].text).toEqual('This is plain text');
      expect(messageSegments[1].type).toEqual('Mention');
      expect(messageSegments[1].id).toEqual(userId1);
      expect(messageSegments[2].type).toEqual('Mention');
      expect(messageSegments[2].id).toEqual(userId2);
    });
  });

  describe('rich-text message building >', () => {

    test('should replace <br/> tags with \\n', () => {
      const message = chatterPostBuilder
        .buildPost('a<br/>b<br />c<br>d');
      const { messageSegments } = message.body;
      expect(messageSegments.length).toEqual(1);
      expect(messageSegments[0].type).toEqual('Text');
      expect(messageSegments[0].text).toEqual('a\nb\nc\nd');
    });

    test('should create Bold segments for each <strong> tag', () => {
      const message = chatterPostBuilder
        .buildPost('This <strong>is</strong> important');
      const { messageSegments } = message.body;
      expect(messageSegments.length).toEqual(5);
      expect(messageSegments[0].type).toEqual('Text');
      expect(messageSegments[0].text).toEqual('This ');
      expect(messageSegments[1].type).toEqual('MarkupStart');
      expect(messageSegments[1].markupType).toEqual('Bold');
      expect(messageSegments[2].type).toEqual('Text');
      expect(messageSegments[2].text).toEqual('is');
      expect(messageSegments[3].type).toEqual('MarkupEnd');
      expect(messageSegments[3].markupType).toEqual('Bold');
      expect(messageSegments[4].type).toEqual('Text');
      expect(messageSegments[4].text).toEqual(' important');
    });

    test('should create paragraph segments for each <p> tag', () => {
      const message = chatterPostBuilder
        .buildPost('This <p>is</p> important');
      const { messageSegments } = message.body;
      expect(messageSegments.length).toEqual(5);
      expect(messageSegments[0].type).toEqual('Text');
      expect(messageSegments[0].text).toEqual('This ');
      expect(messageSegments[1].type).toEqual('MarkupStart');
      expect(messageSegments[1].markupType).toEqual('Paragraph');
      expect(messageSegments[2].type).toEqual('Text');
      expect(messageSegments[2].text).toEqual('is');
      expect(messageSegments[3].type).toEqual('MarkupEnd');
      expect(messageSegments[3].markupType).toEqual('Paragraph');
      expect(messageSegments[4].type).toEqual('Text');
      expect(messageSegments[4].text).toEqual(' important');
    });

    test('should create underline segments for each <u> tag', () => {
      const message = chatterPostBuilder
        .buildPost('This <u>is</u> <u>very</u> important');
      const { messageSegments } = message.body;
      expect(messageSegments.length).toEqual(9);
      expect(messageSegments[0].type).toEqual('Text');
      expect(messageSegments[0].text).toEqual('This ');
      expect(messageSegments[1].type).toEqual('MarkupStart');
      expect(messageSegments[1].markupType).toEqual('Underline');
      expect(messageSegments[2].type).toEqual('Text');
      expect(messageSegments[2].text).toEqual('is');
      expect(messageSegments[3].type).toEqual('MarkupEnd');
      expect(messageSegments[3].markupType).toEqual('Underline');
      expect(messageSegments[4].type).toEqual('Text');
      expect(messageSegments[4].text).toEqual(' ');
      expect(messageSegments[5].type).toEqual('MarkupStart');
      expect(messageSegments[5].markupType).toEqual('Underline');
      expect(messageSegments[6].type).toEqual('Text');
      expect(messageSegments[6].text).toEqual('very');
      expect(messageSegments[7].type).toEqual('MarkupEnd');
      expect(messageSegments[7].markupType).toEqual('Underline');
      expect(messageSegments[8].type).toEqual('Text');
      expect(messageSegments[8].text).toEqual(' important');
    });

    test('should create Italic segments for each <em> tag', () => {
      const message = chatterPostBuilder
        .buildPost('This <em>is</em> important');
      const { messageSegments } = message.body;
      expect(messageSegments.length).toEqual(5);
      expect(messageSegments[0].type).toEqual('Text');
      expect(messageSegments[0].text).toEqual('This ');
      expect(messageSegments[1].type).toEqual('MarkupStart');
      expect(messageSegments[1].markupType).toEqual('Italic');
      expect(messageSegments[2].type).toEqual('Text');
      expect(messageSegments[2].text).toEqual('is');
      expect(messageSegments[3].type).toEqual('MarkupEnd');
      expect(messageSegments[3].markupType).toEqual('Italic');
      expect(messageSegments[4].type).toEqual('Text');
      expect(messageSegments[4].text).toEqual(' important');
    });

    test('should create OrderedList segments for each <ol> tag', () => {
      const message = chatterPostBuilder
        .buildPost('This <ol></ol> important');
      const { messageSegments } = message.body;
      expect(messageSegments.length).toEqual(5);
      expect(messageSegments[0].type).toEqual('Text');
      expect(messageSegments[0].text).toEqual('This ');
      expect(messageSegments[1].type).toEqual('MarkupStart');
      expect(messageSegments[1].markupType).toEqual('OrderedList');
      expect(messageSegments[2].type).toEqual('Text');
      expect(messageSegments[2].text).toEqual('');
      expect(messageSegments[3].type).toEqual('MarkupEnd');
      expect(messageSegments[3].markupType).toEqual('OrderedList');
      expect(messageSegments[4].type).toEqual('Text');
      expect(messageSegments[4].text).toEqual(' important');
    });

    test('should create ListItem segments for each <li> tag', () => {
      const message = chatterPostBuilder
        .buildPost('This <ol><li>very</li></ol> important');
      const { messageSegments } = message.body;
      expect(messageSegments.length).toEqual(9);
      expect(messageSegments[0].type).toEqual('Text');
      expect(messageSegments[0].text).toEqual('This ');
      expect(messageSegments[1].type).toEqual('MarkupStart');
      expect(messageSegments[1].markupType).toEqual('OrderedList');
      expect(messageSegments[2].type).toEqual('Text');
      expect(messageSegments[2].text).toEqual('');
      expect(messageSegments[3].type).toEqual('MarkupStart');
      expect(messageSegments[3].markupType).toEqual('ListItem');
      expect(messageSegments[4].type).toEqual('Text');
      expect(messageSegments[4].text).toEqual('very');
      expect(messageSegments[5].type).toEqual('MarkupEnd');
      expect(messageSegments[5].markupType).toEqual('ListItem');
      expect(messageSegments[6].type).toEqual('Text');
      expect(messageSegments[6].text).toEqual('');
      expect(messageSegments[7].type).toEqual('MarkupEnd');
      expect(messageSegments[7].markupType).toEqual('OrderedList');
      expect(messageSegments[8].type).toEqual('Text');
      expect(messageSegments[8].text).toEqual(' important');
    });

    test('should create UnorderedList segments for each <ul> tag', () => {
      const message = chatterPostBuilder
        .buildPost('This <ul><li>very</li><li>much</li></ul> important');
      const { messageSegments } = message.body;
      expect(messageSegments.length).toEqual(13);
      expect(messageSegments[0].type).toEqual('Text');
      expect(messageSegments[0].text).toEqual('This ');
      expect(messageSegments[1].type).toEqual('MarkupStart');
      expect(messageSegments[1].markupType).toEqual('UnorderedList');
      expect(messageSegments[2].type).toEqual('Text');
      expect(messageSegments[2].text).toEqual('');
      expect(messageSegments[3].type).toEqual('MarkupStart');
      expect(messageSegments[3].markupType).toEqual('ListItem');
      expect(messageSegments[4].type).toEqual('Text');
      expect(messageSegments[4].text).toEqual('very');
      expect(messageSegments[5].type).toEqual('MarkupEnd');
      expect(messageSegments[5].markupType).toEqual('ListItem');
      expect(messageSegments[6].type).toEqual('Text');
      expect(messageSegments[6].text).toEqual('');
      expect(messageSegments[7].type).toEqual('MarkupStart');
      expect(messageSegments[7].markupType).toEqual('ListItem');
      expect(messageSegments[8].type).toEqual('Text');
      expect(messageSegments[8].text).toEqual('much');
      expect(messageSegments[9].type).toEqual('MarkupEnd');
      expect(messageSegments[9].markupType).toEqual('ListItem');
      expect(messageSegments[10].type).toEqual('Text');
      expect(messageSegments[10].text).toEqual('');
      expect(messageSegments[11].type).toEqual('MarkupEnd');
      expect(messageSegments[11].markupType).toEqual('UnorderedList');
      expect(messageSegments[12].type).toEqual('Text');
      expect(messageSegments[12].text).toEqual(' important');
    });
  });
});
