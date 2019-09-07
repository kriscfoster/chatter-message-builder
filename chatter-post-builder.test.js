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
  });
});
