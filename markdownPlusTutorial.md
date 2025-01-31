{{wide}}
# Welcome to Homebrewery and Markdown+

Before diving into a headlong into how, a little bit about what. Per [wikipedia](https://en.wikipedia.org/wiki/Markdown):

```
Markdown[9] is a lightweight markup language for creating formatted text using a plain-text editor. John Gruber created Markdown in 2004 as an easy-to-read markup language.[9] Markdown is widely used for blogging and instant messaging, and also used elsewhere in online forums, collaborative software, documentation pages, and readme files.
```

Let's expand on that. Markdown uses a set of regular text symbols or short combinations of symbols to tell an software how to style the documents when transforming it - usually into an HTML document for web use. One of the principles is that the text must be readable with the document markup in place. 

Since it's creation, Markdown has been used in numerous places. If you use Slack, Discord, or any of a number of forum softwares you are probably already using bits of Markdown. Markdown has also been extended beyond the basic specification by different applications, just as Homebrewery has done. Homebrewery uses the common Github Flavored Markdown (GFM) extension combined with some of our own that we call Markdown+. GFM adds a small set of new features, the most notable of which is tables. Markdown+ extends further by adding deeper layout control, a variables system, and the ability to interface with robust stylesheets. The later is further extended in the Homebrewery system through the use of document themes.

## Markdown Basics

Markdown is a topic that is well covered by a number of books and tutorials, such as the ones you can find at the [Markdown Guide](https://www.markdownguide.org/). Rather than go deep into these concepts, we're going to give you a general overview of the Markup you will most likely use in Homebrewery. 

There are a few places where Markdown has multiple Markups for an element. Those should work in Homebrewery unless we've redefined one of the uses in the [Markdown+](#Markdown+) section.

Elements labeled ***block*** should have a blank line before each entry and are terminated with another blank line. This is particularly important with paragraphs.

|Element|Block?|Description|Example Syntax|Output|
|-------|------|-----------|--------------|------|
|Paragraph|Y|This is the default type of any bit of text.|This is a paragraph.|<p>This is a paragraph.</p>|
|Headings|Y|Markdown has 6 levels of headers, coresponding to the HTML `<H1>` through `<H6>` tags. Headers are formated by placing one `#` per level with 1 being largest, followed by a space and finally the Header| `#### My Header 1`|<H4> My Header 1</H4>|
|Italic|N|This sets marked text to an italic style.|`Look at me! *I'm Italic!*`|Look at me! *I'm Italic!*|
|Bold|N|This sets the marked text to bold. If nested with Italics, both are applied.|`Look at me! **I'm Bold!**`<br/>`Look at me! ***I'm Bold AND Italic!***`|Look at me! **I'm Bold!**<br/>Look at me! ***I'm Bold AND Italic!***|
|Blockquotes|Y|Blockquotes are a special type of paragraph typically used to indicate quoted text. Blockquotes are created by starting each line of the paragraph(s) (and line breaks within the blockquote) with a `>`. Some, but not all inline markup can be used in a Blockquote. | `> I am the first line`<br/>`>`<br/>`> I am the second line.`| {{simulatedBQ I am the first line<br/><br/>I am the second line.}}|
|Ordered Lists|Y|Ordered lists are created by creating a series of lines starting with a number, followed by a period. The numbers do not need to be in order but should start with `1.`. The numbers will be rewritten to reflect the actual line number. Nested lists may be created by adding a tab space before the number.|`1. First Item`<br/>`2. Second Item`<br/>`6. Third Item`|1. First Item<br/>2. Second Item<br/>3. Third Item|
|Unordered (Bulleted) Lists|Y|Bulleted lists are created by preceding each line in the list with either a `-`, `+`, or `*`. Items intended to be in the same list should use the same symbol.| `* Line One`<br/>`* Line Two`<br/>`* Line Three`<br/>|{{simulatedBulletList * Line One<br/>* Line Two<br/>* Line Three}}|
|Links|N|This can be used to create internal or external hyperlink. A link may optionally attach to text and/or have a tooltip.|`(http://homebrewery.naturalcrit.com)`<br/>`[Homebrewery](http://homebrewery.naturalcrit.com)`<br/>`[Homebrewery](http://homebrewery.naturalcrit.com "I like this tool!")`|http://homebrewery.naturalcrit.com<br/>[Homebrewery](http://homebrewery.naturalcrit.com)<br/>[Homebrewery](http://homebrewery.naturalcrit.com "I like this tool!")|
|Images|N|Embed an image in the document. This follows the same pattern as a link preceeded by an exclamation point.|`![Chipmunk](https://s-media-cache-ak0.pinimg.com/736x/4a/81/79/4a8179462cfdf39054a418efd4cb743e.jpg)`<br/>`![Chipmunk](https://s-media-cache-ak0.pinimg.com/736x/4a/81/79/4a8179462cfdf39054a418efd4cb743e.jpg "This is from our welcome document")`|![Chipmunk](https://s-media-cache-ak0.pinimg.com/736x/4a/81/79/4a8179462cfdf39054a418efd4cb743e.jpg)<br/>![Chipmunk](https://s-media-cache-ak0.pinimg.com/736x/4a/81/79/4a8179462cfdf39054a418efd4cb743e.jpg "This is from our welcome document")|

## Github Flavored Markdown AKA GFM

## Markdown+

