
		let Game = new Vue({
			el: '#score',
			created() {
				this.timeIncrement();
			},
			data: {
				lifes: 		-1,
				level: 		0,
				scores: 	0,
				time: 		0,
				play: 		true
			},
			computed: {
				scoreStyle(currentBrick){
					if( this.lifes >= 0 && this.play )
			 			return {
			 				left: 	"2%",
		    				top: 	"2%",
		    				width: 	"96%"
						}
						
					return { 
						left: 	"25%", 
						top: 	"25%", 
						width: 	"50%", 
						height: "50%" 
					}
				}		  		
			},
			methods:{
				restart() {
					this.level 		= 0;
					this.lifes 		= 3;
					this.scores 	= 0;
					this.time 		= 0;
					this.play 		= true;

					Bricks.bricksAmount 	= 16;
					Bricks.speed		 	= 5;
					
					Bricks.resetBricks();
					Ball.ballReset();
					this.timeIncrement();
				},
				timeIncrement() {
					if (this.play && this.lifes >= 0){
						this.time++;
						setTimeout(this.timeIncrement, 1000);
					}
				},
				nextLevel() {
					this.level += 1;
					this.lifes = 3;
					this.scores = 0;
					this.time = 0;
					this.play = true;

					Ball.ballReset();

					if(this.level % 3 == 0) 
						Bricks.bricksAmount += 8;
					if(this.level % 2 == 0) 
						Bricks.speed++;

					Bricks.resetBricks();						
					this.timeIncrement();
				}
			}
		});
	
		let Bricks = new Vue({
		  el: '#bricks',
		  created() {
		  	this.enterBricks();
		  },
		  data: {
		  	x: 0.0,
		  	y: 0.0,

		  	margin: 1,
		  	speed: 5,
		  	bricksAmount: 16,
		  	bricks: [],
		  },
		  computed: {
			element() {
				return document.getElementById('bricks');
			},
		  	brickWidth() {
		  		return (this.element.clientWidth - 9) * (this.margin / 8);
		  	},
		  	brickHeight() {
		  		return this.element.clientHeight * 0.1;
		  	},
		  	punched(){

			}
		  },
		  methods: {
		  	style(currentBrick) {
			 	return {	
					 		left: 	`${	currentBrick.x		}px`,
		    				top: 	`${	currentBrick.y		}px`,
		    				width: 	`${	currentBrick.width	}px`,
		    				height: `${	currentBrick.height	}px`
				}
	  		},
		  	setBricks() {
		  		let block 	= this.element;
		  		this.x 		= this.margin;
		  		this.y 		= this.margin;

		  		for (let i = 0; i < this.bricksAmount; i++) {
		  			if (i > 0 && i % 8 == 0) { 
		  				this.y += this.brickHeight + this.margin;
		  				this.x = this.margin;
		  			}
					this.bricks.push({ 
						id: 		i, 
						x: 			this.x, 
						y: 			this.y, 
						width: 		this.brickWidth, 
						height: 	this.brickHeight, 
						credits:	1,
						visible: 	true
					}); 		
			  		this.x += this.brickWidth + this.margin;
		  		}
		  		this.moveSegment();
		  	},
		  	resetBricks() {
				document.getElementById('bricks').style.top = "10%";
		  		this.bricks = [];
		  		this.enterBricks();
		  	},
		  	enterBricks() {
		  		this.setBricks();
  				for (let i = 0; i < this.bricks.length; i++){
					let brick = document.getElementById(this.bricks[i].id);
  					brick.innerHTML = "";
		  			brick.className = "brick";
		  		}
		  	},
		  	moveSegment() {
		  		let claster = document.getElementById('bricks');
				let rocket 	= document.getElementById('rocket');		  
				if (claster.offsetTop + claster.clientHeight >= rocket.offsetTop) 
				  	Game.lifes =- 1;
 		  		if (Game.lifes >= 0 && Game.play)
					setTimeout(this.moveSegment, 1000 / this.speed);
				 claster.style.top = `${claster.offsetTop + 1}px`;
		  	},
		  	correctBricks() {
				let claster 		= document.getElementById('bricks');
				let currBricksArr 	= document.getElementsByClassName('brick');
					this.x = this.margin;
					this.y = this.margin;
				for(let i = 0; i < currBricksArr.length; i++){
					if (this.x >= claster.clientWidth)
						this.x = this.margin;
					currBricksArr[i].style.width 	= `${	(claster.clientWidth - 9)*(this.margin/8)	}px`;
					currBricksArr[i].style.left 	= `${	this.x										}px`;
					this.x += (claster.clientWidth - 9) * (this.margin/8) + this.margin;
				}
		  	},
		  	destroyBrick(b){
				let index = this.bricks.indexOf(b);
				this.blowEffect(this.bricks[index]);
				this.hideBrick(this.bricks[index]);
				let blank = true;
				for (let i = 0; i < this.bricks.length; i++)
					if (this.bricks[i].visible) blank = false;

				if (blank) Game.play = false;
				//this.bricks.splice(index,1);
		  	},
		  	blowEffect(b){
		  		let index = this.bricks.indexOf(b);
		  		let brick = document.getElementById(b.id);
		  		brick.innerHTML = `+${b.credits}`;
		  		Game.scores += b.credits;
		  		brick.className = "brick blowed";
		  		if (index > 0 && index % 8 != 0 && this.bricks[index-1].visible) {
		  			document.getElementById(index-1).className = "brick hited-left";
		  			document.getElementById(index-1).style.top = document.getElementById(index-1).offsetTop - 3 + "px";
		  			setTimeout(function(){
		  			document.getElementById(index-1).className = "brick";
		  			document.getElementById(index-1).style.top = document.getElementById(index-1).offsetTop + 3 + "px";
		  			}, 300);
		  		}
		  		if (index < this.bricks.length-1  && index % 7 != 0 && this.bricks[index+1].visible == true) {
		  			document.getElementById(index+1).className = "brick hited-right";
		  			document.getElementById(index+1).style.top = document.getElementById(index+1).offsetTop - 3 + "px";
					setTimeout(function(){
		  			document.getElementById(index+1).className = "brick";
					document.getElementById(index+1).style.top = document.getElementById(index+1).offsetTop + 3 + "px";
		  		}, 300);
		  		}
		  		if (index > 8 && this.bricks[index-8].visible == true) {
		  			document.getElementById(index-8).className = "brick hited-up";
		  			document.getElementById(index-8).style.top = document.getElementById(index-8).offsetTop - 5 + "px";
		  			setTimeout(function(){
		  			document.getElementById(index-8).className = "brick";
		  			document.getElementById(index-8).style.top = document.getElementById(index-8).offsetTop + 5 + "px";
		  			}, 300);
		  		}
		  		if (index > 8 && index % 8 != 0 && this.bricks[index-9].visible == true) {
		  			document.getElementById(index-9).className = "brick hited-left";
		  			document.getElementById(index-9).style.top = document.getElementById(index-9).offsetTop - 1 + "px";
		  			setTimeout(function(){
		  			document.getElementById(index-9).className = "brick";
		  			document.getElementById(index-9).style.top = document.getElementById(index-9).offsetTop + 1 + "px";
		  			}, 300);
		  		}
		  		if (index > 8 && index % 7 != 0 && this.bricks[index-7].visible == true) {
		  			document.getElementById(index-7).className = "brick hited-right";
		  			document.getElementById(index-7).style.top = document.getElementById(index-7).offsetTop - 1 + "px";
		  			setTimeout(function(){
		  			document.getElementById(index-7).className = "brick";
		  			document.getElementById(index-7).style.top = document.getElementById(index-7).offsetTop + 1 + "px";
		  			}, 300);
		  		} 		
		  	},
		  	hideBrick(brick){
		  		brick.visible = false;
		  	}
		  }
		});

		let Ball = new Vue({
			el: '#ball',
			created() {
				this.move();
			},
			data: {
				x: 50,
				y: 300,
				heigth: 30,
				width: 30,

				landslideX: 2.0,
				landslideY: 3.0,
				slideStep: 0.5,

				right: 1,
				down: true
			},
			computed: {
				element() {
					return document.getElementById('ball');
				},
				style() {
					return {
						left: 	`${this.x}px`,
						top: 	`${this.y}px`
					}
				},
				rocketTrajectory() {
					return Rocket.slideWay;
				}
			},
		  	methods: {
		  		ballReset() {
		  			this.x 	= 50;
					this.y 	= 300;

					this.landslideX 	= 2;
		    		this.landslideY 	= 3;
		    		this.slideStep 		= 0.5;
		    		this.down 			= true;
		    		this.right 			= 1;

					this.move();
				},
				move() {
					if (Game.lifes >= 0 && Game.play){
						this.checkCollision();
						if (this.right == 1) 
								this.x += this.landslideX;
						if (this.right == -1) 
								this.x -= this.landslideX;
						if (this.down) 
								this.y += this.landslideY; 
						else 
								this.y -= this.landslideY;
						setTimeout(this.move, 1);
					}
				},
				checkCollision() {
					let rocket = Rocket.element; // document.getElementById('playrocket');
						if (this.x >= document.body.clientWidth - 30) { 
							this.right = -1; 
							this.beatEffect();
							}
						else if (this.x <= 1) {
							this.right = 1; 
							this.beatEffect();
						}
						if (this.y >= document.body.clientHeight - 30) {
							this.down = false; 
							this.beatEffect(); 
							Game.lifes--;
						}
						else if (this.y <= 1) {
							this.down = true; 
							this.beatEffect();
						}
					if (this.x + 15 >= rocket.offsetLeft && this.x + 15 <= rocket.offsetLeft + rocket.clientWidth && 
						this.y + 30 >= rocket.offsetTop && this.y <= rocket.offsetTop + 30) {
						this.down = false;
						this.correctTrajectoryWay();
						this.beatEffect();
					}
					this.hitBrick();
				},
				correctTrajectoryWay() {		
					if(this.right == -1 && this.rocketTrajectory == -1 || this.right == 1 && this.rocketTrajectory == 1)
						this.landslideX += this.slideStep; 
					else if (this.right == -1 && this.rocketTrajectory == 1 || this.right == 1 && this.rocketTrajectory == -1)
						this.landslideX -= this.slideStep;
					else {
						if (this.rocketTrajectory != 0) {
							this.right = this.rocketTrajectory;
							this.landslideX += this.slideStep; 
						}	 	
					}
					if (this.landslideX == 0) 
						this.right = 0;
				},
				hitBrick() {
					let blockSegment = document.getElementById('bricks');
					for (let i = 0; i < Bricks.bricks.length; i++) {
						//let brick = document.getElementById(bricks.bricks[i].id);
						let brick = Bricks.bricks[i];
						if (
							brick.visible
							&&
							this.y >= brick.y + blockSegment.offsetTop
							&& 
							this.y <= brick.y + brick.height + blockSegment.offsetTop
							&& 
							this.x >= brick.x + blockSegment.offsetLeft
							&&  
							this.x <= brick.x + brick.width + blockSegment.offsetLeft
							)
						{	
							this.down = !this.down;
							this.beatEffect();
							Bricks.destroyBrick(brick);
						}
					}
				},
				beatEffect() {
					this.element.className = "ball beat";
					setTimeout(() => {
						this.element.className = "ball";
					}, 100);
				}
		  }
		});

		let Rocket = new Vue({
			el: '#rocket',
			data: {
				x:			50,
				// width: 	400,
				slideWay: 	0,
				prevPos: 	0,

				touch: 		false,
				touchPos: 	0
			},
			computed: {
				element() {
					return document.getElementById('rocket');
				},
				style() {
			 		return {	
						 left: 	`${this.x}px`, 
						 width: `${this.width}px`
					}
		  		},
		  		width() {
		  			return  document.body.clientWidth / 4;
				}
			},
			methods: {
				setPosition(e) {
					this.x = e.pageX - this.width / 2;
					if (this.x < 0) {
						this.x = 0;
					}
					else if (this.x + this.width > document.body.clientWidth) {
						this.x = document.body.clientWidth - this.width;
					}
					this.checkWay();
		  			this.prevPos = this.x;
				},
				checkWay() {
					let r = Rocket.element;
		  			if (this.x > this.prevPos + 15) { 
						this.slideWay = 1; r.className = "right";
					}
		  			else if (this.x < this.prevPos - 15) { 
						this.slideWay = -1; r.className = "left";
					}
		  			else { 
						this.slideWay = 0; r.className = "static";
					}
		  		},	
		  		touchRocket(e) {
					let r = Rocket.element;
					let touchobj = e.changedTouches[0]; 		// reference first touch point (ie: first finger)
					startx = parseInt(touchobj.clientX); 		// get x position of touch point relative to left edge of browser
					
					if (startx >= this.x && startx <= this.x + r.clientWidth) {
						this.touchPos = startx - this.x;
						this.touch = true;
					} else {
						this.touch = false;
					}
					e.preventDefault();  
		  		},
		  		dragRocket(e) {
		  			let touchobj = e.changedTouches[0];
		  			if ( this.touch ) {
						  this.x = parseInt(touchobj.clientX) - this.touchPos;
					}
		  			if ( this.x < 0 ) {
						  this.x = 0;
					}
					else if ( this.x + this.width > document.body.clientWidth ) {
						  this.x = document.body.clientWidth - this.width;
					}
		  			this.checkWay();
		  			this.prevPos = this.x;
					e.preventDefault();
		  		},
			}
		});

		addEventListener('mousemove', Rocket.setPosition, false);
		addEventListener('resize', Bricks.correctBricks, false );
		addEventListener('touchstart', Rocket.touchRocket, false);
    	addEventListener('touchmove', Rocket.dragRocket, false);