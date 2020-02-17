var questionBank=new Array;
var wordArray=new Array;
var previousGuesses=new Array;
var currentWord;
var currentClue;
var wrongAnswerCount;


$.getJSON('answers.json', function(data) {
for(i=0; i<data.wordlist.length; i++){
questionBank[i]=new Array;
questionBank[i][0] = data.wordlist[i].word;
questionBank[i][1] = data.wordlist[i].clue;
}
titleScreen();
})

function titleScreen(){

	$('#gameContent').append('<div id="gameTitle">HANGMAN</div><div id="startButton" class="button">BEGIN</div>');
	$('#startButton').on("click",function (){gameScreen()});

}

function gameScreen(){
	$('#gameContent').empty();
	$('#gameContent').append('<div id="pixHolder"><img id="hangman" src="img/man.png"></div>');
    $('#gameContent').append('<div id="wordHolder"></div>');
    $('#gameContent').append('<div id="clueHolder"></div>');
    $('#gameContent').append('<div id="guesses">Previous guesses:</div>');
    $('#gameContent').append('<div id="feedback"></div>');

	getWord();
	var numberOfTiles=currentWord.length;
	wrongAnswerCount=0;
	previousGuesses=[];

	for(i=0;i<numberOfTiles;i++){
    	$('#wordHolder').append('<div class="tile" id=t'+i+'></div>');
    }

    $('#clueHolder').append("HINT: "+currentClue);

	$(document).on("keyup",handleKeyUp);
}

function getWord(){
	var rnd=Math.floor(Math.random()*questionBank.length);
	currentWord=questionBank[rnd][0];
	currentClue=questionBank[rnd][1];
	questionBank.splice(rnd,1);
	wordArray=currentWord.split("");
}

function handleKeyUp(event) {
	if(event.keyCode>64 && event.keyCode<91){
		var found=false;
		var previouslyEntered=false;
		var input=String.fromCharCode(event.keyCode).toLowerCase();

		for(i=0;i<previousGuesses.length;i++){
        	if(input==previousGuesses[i]){
        		previouslyEntered=true;
        	}
        }

		if(!previouslyEntered){
			previousGuesses.push(input);

			for(i=0;i<wordArray.length;i++){

				if(input==wordArray[i]){
                	found=true;
                	$('#t'+i).append(input);
                }

			}

			if(found){checkAnswer();}
			else{wrongAnswer(input);}
		}
	}
}

function checkAnswer(){
	var currentAnswer="";
	for(i=0;i<currentWord.length;i++){
		currentAnswer+=($('#t'+i).text());
	}
	if(currentAnswer==currentWord){
		victoryMessage();
	};
}

function wrongAnswer(a){
	wrongAnswerCount++;
	var pos=(wrongAnswerCount*-75) +"px"
	$('#guesses').append("  "+a);
	$('#hangman').css("left",pos);
	if(wrongAnswerCount==6){
		defeatMessage();}
}
function victoryMessage(){
	$(document).off("keyup", handleKeyUp);
	$('#feedback').append("CORRECT!<br><br><div id='replay' class='button'>CONTINUE</div>");
    $('#replay').on("click",function (){
    	if(questionBank.length>0){
    		gameScreen()}
    		else{finalPage()}
    });
}

function defeatMessage(){
    $(document).off("keyup", handleKeyUp);
    $('#feedback').append("You're Dead!<br>(answer = "+ currentWord +")<div id='replay' class='button'>CONTINUE</div>");
    $('#replay').on("click",function (){
    	if(questionBank.length>0){
    	gameScreen()}
    	else{finalPage()}
	});
}

function finalPage(){
    $('#gameContent').empty();
    $('#gameContent').append('<div id="finalMessage">You have finished all the words in the game!</div>');
}
