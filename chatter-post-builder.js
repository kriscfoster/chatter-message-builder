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
    .replace(/<strong>/g, '|*$*||bold start||*$*|')
    .replace(/<\/strong>/g, '|*$*||bold end||*$*|')
    .replace(/<p>/g, '|*$*||paragraph start||*$*|')
    .replace(/<\/p>/g, '|*$*||paragraph end||*$*|')
    .replace(/<u>/g, '|*$*||underline start||*$*|')
    .replace(/<\/u>/g, '|*$*||underline end||*$*|')
    .replace(/<em>/g, '|*$*||italic start||*$*|')
    .replace(/<\/em>/g, '|*$*||italic end||*$*|')
    .replace(/<ol>/g, '|*$*||ordered list start||*$*|')
    .replace(/<\/ol>/g, '|*$*||ordered list end||*$*|')
    .replace(/<ul>/g, '|*$*||unordered list start||*$*|')
    .replace(/<\/ul>/g, '|*$*||unordered list end||*$*|')
    .replace(/<li>/g, '|*$*||list item start||*$*|')
    .replace(/<\/li>/g, '|*$*||list item end||*$*|');

  const segs = formattedText.split('|*$*|');

  segs.forEach((seg) => {
    if (seg === '|bold start|') {
      textSegments.push({
        "type" : "MarkupStart",
        "markupType" : "Bold"
      });
    } else if (seg === '|bold end|') {
      textSegments.push({
        "type" : "MarkupEnd",
        "markupType" : "Bold"
      });
    } else if (seg === '|paragraph start|') {
      textSegments.push({
        "type" : "MarkupStart",
        "markupType" : "Paragraph"
      });
    } else if (seg === '|paragraph end|') {
      textSegments.push({
        "type" : "MarkupEnd",
        "markupType" : "Paragraph"
      });
    }  else if (seg === '|underline start|') {
      textSegments.push({
        "type" : "MarkupStart",
        "markupType" : "Underline"
      });
    } else if (seg === '|underline end|') {
      textSegments.push({
        "type" : "MarkupEnd",
        "markupType" : "Underline"
      });
    }  else if (seg === '|italic start|') {
      textSegments.push({
        "type" : "MarkupStart",
        "markupType" : "Italic"
      });
    } else if (seg === '|italic end|') {
      textSegments.push({
        "type" : "MarkupEnd",
        "markupType" : "Italic"
      });
    }  else if (seg === '|ordered list start|') {
      textSegments.push({
        "type" : "MarkupStart",
        "markupType" : "OrderedList"
      });
    } else if (seg === '|ordered list end|') {
      textSegments.push({
        "type" : "MarkupEnd",
        "markupType" : "OrderedList"
      });
    }   else if (seg === '|unordered list start|') {
      textSegments.push({
        "type" : "MarkupStart",
        "markupType" : "UnorderedList"
      });
    } else if (seg === '|unordered list end|') {
      textSegments.push({
        "type" : "MarkupEnd",
        "markupType" : "UnorderedList"
      });
    }  else if (seg === '|list item start|') {
      textSegments.push({
        "type" : "MarkupStart",
        "markupType" : "ListItem"
      });
    } else if (seg === '|list item end|') {
      textSegments.push({
        "type" : "MarkupEnd",
        "markupType" : "ListItem"
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
