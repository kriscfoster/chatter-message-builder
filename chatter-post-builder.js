module.exports = {
  buildPost(text='', group='me', mentions=[]) {
    const message = {
      body: {
        messageSegments: [],
      },
      feedElementType : 'FeedItem',
      subjectId: group
    };

    const textSegments = createTextSegments(text);
    const mentionsSegments = createMentionsSegments(mentions);
    const messageSegments = textSegments.concat(mentionsSegments);
    message.body.messageSegments = messageSegments;
    return message;
  }
}

function createTextSegments(text) {
  const textSegments = [];
  const formattedText = text
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<strong>/g, '|*$*|bold start|*$*|')
    .replace(/<\/strong>/g, '|*$*|bold end|*$*|');

  const segs = formattedText.split('|*$*|');

  segs.forEach((seg) => {
    if (seg === 'bold start') {
      textSegments.push({
        "type" : "MarkupStart",
        "markupType" : "Bold"
      });
    } else if (seg === 'bold end') {
      textSegments.push({
        "type" : "MarkupEnd",
        "markupType" : "Bold"
      });
    } else {
      textSegments.push({
        type : 'Text',
        text : seg
      });
    }
  });

  return textSegments;
}

function createMentionsSegments(mentions) {
  const mentionsSegments = [];
  mentions.forEach((mentionId) => {
    mentionsSegments.push({
      type: 'Mention',
      id: mentionId,
    })
  });

  return mentionsSegments;
}
