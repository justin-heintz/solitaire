globalMoving = false;
globalCard = false;
gcs = [];
globalOffset = {};
globalOffsetOld = {};
class card{
	constructor(number, color, suit, visible = false ) {
		this.number = number;
		this.color = color;
		this.suit = suit;
		this.visible = visible;
		this.posOld = {};
		this.cardId = this.makeId();
		this.el = this.createEl();
		this.plot = -1;
		this.plotOrder = -1;
		this.draw();

		this.el.addEventListener("mousedown", (e) => {
			if(this.visible){
				globalMoving = true;
				globalCard = this;
				globalOffsetOld = {
					x:this.el.offsetLeft,
					y:this.el.offsetTop
				};
				globalOffset = {
					x:(this.el.offsetLeft - e.clientX),
					y:(this.el.offsetTop - e.clientY)
				}
				
				if(Object.keys(table[this.plot]).length != this.plotOrder){
					Object.keys(table[this.plot]).forEach((k,i)=>{
						if(i >= this.plotOrder){
						gcs.push( table[this.plot][k].el);
						console.log(k,i);
						}
					});
					
				}
				console.log(/*Object.keys(table[this.plot]).length == this.plotOrder,*/ 'plot length: '+Object.keys(table[this.plot]).length , 'order: '+this.plotOrder)
			}else{
				if(this.plotOrder == Object.keys(table[this.plot]).length){
					this.visible = true;
					this.el.style.color = this.color;
					this.el.innerHTML = this.suit + " " + this.converNo() + " " + this.suit;
					this.el.classList.remove('back');					
				
				}
			}
		});
	}
	makeId(length=5) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}	
	createEl(){
		var el = document.createElement("div");
		el.style.position = 'absolute';
		el.style.top = 0;
		el.style.left = 0
		el.dataset.cardId = this.cardId;
		el.classList.add('card');
		return el;
	}
	converNo(){
		if(this.number == 1){ 
			return "A";
		}else if(this.number == 11){
			return "J";
		}else if(this.number == 12){
			return "Q";
		}else if(this.number == 13){
			return "K";
		}else{
			return this.number;
		}
	}
	draw(where){
		document.getElementById('board').appendChild(this.el);
	}
}
function shuffle(ar){
	var j, x, index;
	for (index = ar.length - 1; index > 0; index--) {
		j = Math.floor(Math.random() * (index + 1));
		x = ar[index];
		ar[index] = ar[j];
		ar[j] = x;
	}
	return ar;
}
function overlaps(a, b) {
	if (a.x >= b.x + b.width || b.x >= a.x + a.width ){ return false;}
	if (a.y >= b.y + b.height || b.y >= a.y + a.height){ return false;}
	return true;
}
function reIndex(){//reset plot zindex
	table.forEach((plot,i)=>{
		Object.keys(plot).forEach((key,i)=>{
			plot[key].el.style.zIndex = i;
			console.log(key,i)
		});
	});
}
document.addEventListener("DOMContentLoaded", function() {
	deck = [];
	draw = [];
	table = [{},{},{},{},{},{},{},];
	sorted = [[],[],[],[]];
 
	for(i=1; i<=13; i++){ deck.push(new card(i,'Red','♥')); }
	for(i=1; i<=13; i++){ deck.push(new card(i,'Red','♦')); }
	for(i=1; i<=13; i++){ deck.push(new card(i,'Black','♠')); }
	for(i=1; i<=13; i++){ deck.push(new card(i,'Black','♣')); }
 
	deck = shuffle(deck);
	
	for(plot=0; plot<7; plot++){
		for(i=0; i<plot+1; i++){
			var tmp = deck.pop()
			table[plot][tmp.cardId] = tmp;
			table[plot][tmp.cardId].el.style.top = `calc(50% +  ${20 * (i+1)}px )`;
			table[plot][tmp.cardId].el.style.left = (150 * (plot+1));
			table[plot][tmp.cardId].el.style.zIndex  = i;
			table[plot][tmp.cardId].plot = plot;
			table[plot][tmp.cardId].plotOrder = i+1;
			if(i == plot){
				table[plot][tmp.cardId].visible = true;
				table[plot][tmp.cardId].el.style.color = table[plot][tmp.cardId].color;
				table[plot][tmp.cardId].el.innerHTML = table[plot][tmp.cardId].suit + " " + table[plot][tmp.cardId].converNo() + " " + table[plot][tmp.cardId].suit;
			}else{
				table[plot][tmp.cardId].el.classList.add('back');
			}
		}
	}	
});
document.addEventListener("mousemove", (e) => {
	if(globalMoving){
		globalCard.el.style.top  = (e.clientY + globalOffset.y);
		globalCard.el.style.left = (e.clientX + globalOffset.x);
		globalCard.el.style.zIndex = 100;
		
		gcs.forEach((el,i)=>{
			el.style.top  = (e.clientY + globalOffset.y) +(20 *i);	
			el.style.left = (e.clientX + globalOffset.x);
			el.style.zIndex = 100+i;
		});
		
	}
});	
document.addEventListener("mouseup", (e) => {
	if(globalCard != false){
		var globalCardRect = globalCard.el.getBoundingClientRect();
		var resetPos = true;
		
		table.forEach((plot,i)=>{
			Object.keys(plot).forEach((keys)=>{
				var plotRect = plot[keys].el.getBoundingClientRect();
				if(
				plot[keys].visible && 
				keys != globalCard.el.dataset.cardId &&
				globalCard.color != plot[keys].color && 
				overlaps(plotRect, globalCardRect) 
				){
					//console.log(plot[keys]);
					if(globalCard.number == plot[keys].number-1 || 
						globalCard.number == 13
					){
						resetPos = false;	
						delete table[globalCard.plot][globalCard.cardId]
						plot[globalCard.cardId] = globalCard;
						plot[globalCard.cardId].plot = i;
						plot[globalCard.cardId].plotOrder = Object.keys(plot).length;
						plot[globalCard.cardId].el.style.top = `calc(50% +  ${20 * (Object.keys(plot).length)}px )`;
						plot[globalCard.cardId].el.style.left = (150 * (i+1));
						reIndex();
					}
				}

			});
		});
		
		if(resetPos){
			globalCard.el.style.left = globalOffsetOld.x;
			globalCard.el.style.top  = globalOffsetOld.y;	
		}
	}
	globalMoving = false;
	globalCard = false;
	gcs = [];
});	
