function drawPlots(where, noPlots){
	for(var i = 0; i < noPlots; i++){
		domElms[where].innerHTML += "<div class='plot' data-plot='"+i+"' ></div>";
	}	
}
function drawCard(where, plot, card, cardIndex){ 
	
	const newNocde = document.createElement("div");
	domElms[where].querySelector('[data-plot="'+plot+'"]' ).appendChild(newNocde);
	newNocde.dataset.plot = plot;
	newNocde.dataset.arr = where;
	newPos = newNocde.getBoundingClientRect();
	if(card.visible){
		newNocde.classList.add("card", card.suit.color);
		newNocde.innerHTML = card.suit.img + " "+ displayNo(card.number) +" "+ card.suit.img;		
	}else{
		newNocde.classList.add("card", "back");
	}
	
	card.position.x = newPos.x;
	card.position.y = newPos.y;
 
}
function updateCardPos(){
	
}
function GenCards(suit){
	return (Array.from({length:13},(e,i)=>{
		return {
			cid: suit.sid + (i+1),
			visible: false,
			suit: suit,
			number: (i+1),
			moving: false,
			position:{
				x:0,
				y:0
			}
		};
	}));
};
function displayNo(no){
	if(no == 1){ 
		return "A";
	}else if(no == 11){
		return "J";
	}else if(no == 12){
		return "Q";
	}else if(no == 13){
		return "K";
	}else{
		return no;
	}
}
function shuffle(arr){
    var j, x, index;
    for (index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
    }
    return arr;
}
function mdArray(depth){//Make multi dimensional array
	var arr = [];
	for(var h = 0; h < depth; h++){
		arr[h] = [];
	}
	return arr;
}
function reIndex(arr){
	return Object.values(arr);
}
document.addEventListener("DOMContentLoaded", function() {
	const suits = {
		spade:{sid: 100, name:'spade', img:'♠',color:'black'}, 
		club:{sid: 200, name:'club', img:'♣',color:'black'},
		heart:{sid: 300, name:'heart', img:'♥',color:'red'},
		diamond:{sid: 400, name:'diamond', img:'♦',color:'red'}
	};
	 
	mouseHolding = false;
	movingCard = '';
	domElms = {
		table: document.getElementById('table'),
		draw: document.getElementById('draw'),
		sorted: document.getElementById('sorted')
	}
	deckArrs = {
		deck: shuffle( //generates all decks and cards then shuffles
			[].concat( GenCards(suits.club), 
			GenCards(suits.spade), 
			GenCards(suits.heart), 
			GenCards(suits.diamond) )
		),
		sorted: mdArray(4),
		table: mdArray(7)
	}
	deckArrs['table'].forEach((el, i)=>{
		for(var x = 0; x < (i+1); x++){
			el.push( deckArrs['deck'].pop() );
		}
		el[el.length - 1].visible = true;
	});	

	/*Draws the cards in each area*/
	drawPlots('table', 7);
	drawPlots('draw', 1);
	drawPlots('sorted', 4);

	deckArrs['table'].forEach((plot, plotIndex)=>{
		plot.forEach((card, cardIndex)=>{
			drawCard('table', plotIndex, card, cardIndex);
		});
	});
	
	
	cards = document.querySelectorAll('.card:not(.back)');
	cards.forEach((card, i) => {
		card.addEventListener('mousedown',(e) => {
			movingCard = card;
			movingCard.plot = card.dataset.plot;
			movingCard.arr = card.dataset.arr;
			movingCard.style.position = "absolute";
			//movingCard.style.top = e.clientY;
			//movingCard.style.left = e.clientX;
			mouseHolding = true;
		});
	});
	/**/
});

document.addEventListener("mousemove", (e) => {
	if(mouseHolding && movingCard != ''){
		movingCard.style.top  = e.clientY;
		movingCard.style.left  = e.clientX;
	}
});

document.addEventListener('mouseup',() => {
	mouseHolding = false;
	/*Loop over all plots where you can drop cards*/
	var alltablePlots = document.querySelectorAll('#table .plot');
	var allsortedPlots = document.querySelectorAll('#sorted .plot');
	var cardPos = movingCard.getBoundingClientRect()
	
	/*come back to this for loop because the foreach cant be broken !!*/
	/*
	for(plot of alltablePlots ){
		var plotPos = plot.getBoundingClientRect();
		if(cardPos.x  >= plotPos.x
		&& cardPos.x <= plotPos.x + plotPos.width 
		&& cardPos.y >= plotPos.y
		&& cardPos.y <= plotPos.y + plotPos.height 
		){
		//	console.log(plot,'in '+i);
			console.log(plot)
			break;
		}
	}*/
	alltablePlots.forEach((plot,i)=>{
		var plotPos = plot.getBoundingClientRect();

		if(cardPos.x  >= plotPos.x
		&& cardPos.x <= plotPos.x + plotPos.width 
		&& cardPos.y >= plotPos.y
		&& cardPos.y <= plotPos.y + plotPos.height 
		){
			
		var tmpMovingCard = deckArrs[ movingCard.dataset.arr ][movingCard.dataset.plot][ deckArrs[movingCard.dataset.arr][movingCard.dataset.plot].length-1 ];
		var tmpCard = deckArrs['table'][i][ deckArrs['table'][i].length-1 ];
			
			if(tmpMovingCard.suit.color == 'red' && tmpCard.suit.color == 'black'  ||
			tmpMovingCard.suit.color == 'black' && tmpCard.suit.color == 'red'
			){
				if(tmpMovingCard.number + 1 == tmpCard.number){
					document.querySelector('#table .plot[data-plot="'+movingCard.dataset.plot+'"]')
					
					var child = document.querySelector('#table .plot[data-plot="'+movingCard.dataset.plot+'"]').lastElementChild;
					 
					document.querySelector('#table .plot[data-plot="'+i+'"]').appendChild(child);
					
					deckArrs['table'][i].push( deckArrs[ movingCard.dataset.arr ][movingCard.dataset.plot].pop() );

				}else{
					console.log('1ignore');
				}
				
			}else{
				console.log('2ignore');
			}
 
		}
		
	});
	
	movingCard.style.position = "static";
	deckArrs[movingCard.dataset.arr][ parseInt(movingCard.dataset.plot) ][parseInt(movingCard.dataset.cid)];
	//console.log(movingCard.getBoundingClientRect());
});
