var currentIndex = 0;
var maxLength = 100;
var nextCutoff = maxLength;
var clicked = false;
var finishedPage = false;
var delay = 100;
var audioElementChooser = 1;

var text = 'This is a Zelda-inspired dialogue engine. Add text here to see it displayed above.\n\
Move to a new line to force a new page.\nLike.\nThis.\n\
Lines can be no more than 100 characters long, but if you want to make long sentences...\n\
...you could always do this.\nUse the + and - buttons to change the font size.\nEnjoy!';

/*
target   - The DOM object to act on
message  - The text we iterate through (a substring of the full text)
index    - Which letter within the message we are examining in this pass (always starts at 0)
interval - How long until function calls itself
 */
var showText = function (target, message, index, interval) {
	if (currentIndex == nextCutoff) {
		var limit = Math.min(text.length, (nextCutoff + maxLength));

		nextCutoff = findEndOfLine(limit);
		finishedPage = true;
		return;
	}

	if (clicked == true) {
		interval = 0;
	}

	$(target).append(message[index++]);
	currentIndex++;
	
	if (message[index] != " ") {
		playSound();		
	}

	setTimeout(function () {
		showText(target, message, index, interval);
	}, interval);
};

var findEndOfLine = function (endIndex) {
	var firstNewLine;

	endIndex = Math.min(endIndex, text.length);
	
	for (i = endIndex; i > currentIndex; i--) {		
		if (text[i] == "\n") {
			firstNewLine = (i + 1);
			continue;
		}
	}

	if (firstNewLine === undefined) {
		return text.length;
	}

	return firstNewLine;
}

var playSound = function() {
	var targetId = "audio-source" + this.audioElementChooser;
	var audio = document.getElementById(targetId);
	audio.volume = 0.1;
	audio.play();

	if (this.audioElementChooser < 3) {
		this.audioElementChooser++;
	} else {
		this.audioElementChooser = 1;
	}
}


function onFontSizeChange(isIncreasing) {
	var fontSize = $("#text_target").css("font-size");
	var fontSizeNum = fontSize.slice(0, -2);
	var newFontSize = isIncreasing ? ++fontSizeNum : --fontSizeNum;
	newFontSize += "px";
	$("#text_target").css("font-size", newFontSize);
}

function onTextInput() {
	var textArray = $("#input-text").val().split("\n");
	
	for(i = 0; i < textArray.length; i++) {
		var line = textArray[i];
		line = line.substring(0, maxLength);
		textArray[i] = line;
	}

	var validatedText = textArray.join("\n");
	$("#input-text").val(validatedText);
}

$(function () {
	$("#input-text").val(text);
	
	$("#triangle_marker").css("display", "block");
	$("#square_marker").css("display", "none");
	
	nextCutoff = findEndOfLine(nextCutoff);
	showText("#text_target", text.substring(0, nextCutoff), 0, delay);

	/* Click */
	$("#dialogue-box").click(function () {
		clicked = true;
		
		var oldText = text;
		text = $("#input-text").val();

		if (oldText != text || currentIndex >= text.length) {
			/* Back to start of string */
			currentIndex = 0;
			nextCutoff = findEndOfLine(maxLength);
		}

		if (nextCutoff >= text.length) {
			$("#triangle_marker").css("display", "none");
			$("#square_marker").css("display", "block");
		} else {
			$("#triangle_marker").css("display", "block");
			$("#square_marker").css("display", "none");
		}

		if (finishedPage == true) {
			$("#text_target").empty();
			clicked = false;
			finishedPage = false;
			showText("#text_target", text.substring(currentIndex, nextCutoff).trim(), 0, delay);
		}
	});
});