
		var game = new Vue({
			el: '#score',
			created:function(){
				this.TimeIncrement();
			},
			data:{
				lifes: -1,
				level: 0,
				scores: 0,
				time: 0,
				play: true
			},
			computed:{
				ScoreStyle(currentBrick){
					if(this.lifes>=0 && this.play)
			 	return {
			 				left: "2%",
		    				top: "2%",
		    				width: "96%",
		    				//height: document.clientHeight*0.5 + "px"	
						}
						else{
							return {	
							left: "25%",
		    				top: "25%",
		    				width: "50%",
		    				height: "50%",
						}
					}
				}		  		
			},
			methods:{
				Restart(){
					this.level = 0;
					this.lifes = 3;
					this.scores = 0;
					this.time = 0;
					this.play = true;

					bricks.bricksAmount = 16;
					bricks.speed = 5;
					bricks.ResetBricks();
					ball.BallReset();
					this.TimeIncrement();
				},
				TimeIncrement:function(){
					if (this.play && this.lifes >= 0){
					this.time++;
					setTimeout(this.TimeIncrement, 1000);
					}
				},
				NextLevel(){
					this.level += 1;
					this.lifes = 3;
					this.scores = 0;
					this.time = 0;
					this.play = true;
					ball.BallReset();
					if(this.level % 3 == 0) bricks.bricksAmount += 8;
					if(this.level % 2 == 0) bricks.speed++;
					bricks.ResetBricks();						
					this.TimeIncrement();
				}
			}
		});
	
		var bricks = new Vue({
		  el: '#bricksblock',
		  created: function(){
		  		this.EnterBricks();
		  	},

		  data: {
		  	x: 0.0,
		  	y: 0.0,

		  	margin: 1,
		  	speed: 5,
		  	bricksAmount: 16,
		  	bricks: []
		  
		  },
		  computed: {
		  		brickWidth(){
		  			return (document.getElementById('bricksblock').clientWidth - 9)*(this.margin/8);
		  		},
		  		brickHeight(){
		  			return (document.getElementById('bricksblock').clientHeight * 0.1);
		  		},
		  		Punched(){

				},		
		  },
		  methods: {
		  	Style(currentBrick){
			 	return {	left: currentBrick.X + "px",
		    				top: currentBrick.Y + "px",
		    				width: currentBrick.width + "px",
		    				height: currentBrick.height + "px"
						}
		  		},
		  	SetBricks(){
		  		var block = document.getElementById('bricksblock');
		  		this.x = this.margin;
		  		this.y = this.margin;

		  		for (var i = 0; i < this.bricksAmount; i++){
		  			if (i > 0 && i % 8 == 0) { 
		  				this.y += this.brickHeight + this.margin;
		  				this.x = this.margin;
		  			}
		  		this.bricks.push({ 
		  			id: i, 
		  			X: this.x, 
		  			Y: this.y, 
		  			width: this.brickWidth, 
		  			height: this.brickHeight, 
		  			credits: 1,
		  			visible: true
		  		}); 		
			  		this.x += this.brickWidth + this.margin;
		  		}
		  		this.MoveSegment();
		  	},
		  	ResetBricks(){
		  			document.getElementById('bricksblock').style.top = "10%";
		  			this.bricks = [];
		  			this.EnterBricks();
		  	},
		  	EnterBricks(){
		  		this.SetBricks();
  				for (var i = 0; i < this.bricks.length; i++){
  					document.getElementById(this.bricks[i].id).innerHTML = "";
		  			document.getElementById(this.bricks[i].id).className = "brick";
		  		}
		  	},
		  	MoveSegment(){
		  		var claster = document.getElementById('bricksblock');
		  		var rocket = document.getElementById('playrocket');
		  		if (claster.offsetTop+claster.clientHeight >= playrocket.offsetTop) game.lifes =- 1;
		  		document.getElementById('bricksblock').style.top = claster.offsetTop + 1 +"px";
		  		if (game.lifes >= 0 && game.play == true)
		  		setTimeout(this.MoveSegment, 1000 / this.speed);
		  	},
		  	CorrectBricks(){
			var blockSegment = document.getElementById('bricksblock');
			var currBricksArr = document.getElementsByClassName('brick');
		  		this.x = this.margin;
		  		this.y = this.margin;
			for(var i = 0; i < currBricksArr.length; i++){
				if (this.x >= document.getElementById('bricksblock').clientWidth)
					this.x = this.margin;
					currBricksArr[i].style.width = (blockSegment.clientWidth - 9)*(this.margin/8)+"px";
					currBricksArr[i].style.left = this.x + "px";
					this.x += (blockSegment.clientWidth - 9) * (this.margin/8) + this.margin;
		  		}
		  	},
		  	DestroyBrick(b){
				var index = this.bricks.indexOf(b);
				this.BlowEffect(this.bricks[index]);
				this.HideBrick(this.bricks[index]);
				var blank = true;
				for (var i = 0; i < bricks.bricks.length; i++)
					if (bricks.bricks[i].visible == true) blank = false;

				if (blank) game.play = false;
				//this.bricks.splice(index,1);
		  	},
		  	BlowEffect(b){
		  		var index = this.bricks.indexOf(b);
		  		var brick = document.getElementById(b.id);
		  		brick.innerHTML = "+" + b.credits;
		  		game.scores += b.credits;
		  		brick.className = "brick blowed";
		  		if (index > 0 && index % 8 != 0 && this.bricks[index-1].visible == true) {
		  			document.getElementById(index-1).className = "brick hitedleft";
		  			document.getElementById(index-1).style.top = document.getElementById(index-1).offsetTop - 3 + "px";
		  			setTimeout(function(){
		  			document.getElementById(index-1).className = "brick";
		  			document.getElementById(index-1).style.top = document.getElementById(index-1).offsetTop + 3 + "px";
		  			}, 300);
		  		}
		  		if (index < this.bricks.length-1  && index % 7 != 0 && this.bricks[index+1].visible == true) {
		  			document.getElementById(index+1).className = "brick hitedright";
		  			document.getElementById(index+1).style.top = document.getElementById(index+1).offsetTop - 3 + "px";
					setTimeout(function(){
		  			document.getElementById(index+1).className = "brick";
					document.getElementById(index+1).style.top = document.getElementById(index+1).offsetTop + 3 + "px";
		  		}, 300);
		  		}
		  		if (index > 8 && this.bricks[index-8].visible == true) {
		  			document.getElementById(index-8).className = "brick hitedup";
		  			document.getElementById(index-8).style.top = document.getElementById(index-8).offsetTop - 5 + "px";
		  			setTimeout(function(){
		  			document.getElementById(index-8).className = "brick";
		  			document.getElementById(index-8).style.top = document.getElementById(index-8).offsetTop + 5 + "px";
		  			}, 300);
		  		}
		  		if (index > 8 && index % 8 != 0 && this.bricks[index-9].visible == true) {
		  			document.getElementById(index-9).className = "brick hitedleft";
		  			document.getElementById(index-9).style.top = document.getElementById(index-9).offsetTop - 1 + "px";
		  			setTimeout(function(){
		  			document.getElementById(index-9).className = "brick";
		  			document.getElementById(index-9).style.top = document.getElementById(index-9).offsetTop + 1 + "px";
		  			}, 300);
		  		}
		  		if (index > 8 && index % 7 != 0 && this.bricks[index-7].visible == true) {
		  			document.getElementById(index-7).className = "brick hitedright";
		  			document.getElementById(index-7).style.top = document.getElementById(index-7).offsetTop - 1 + "px";
		  			setTimeout(function(){
		  			document.getElementById(index-7).className = "brick";
		  			document.getElementById(index-7).style.top = document.getElementById(index-7).offsetTop + 1 + "px";
		  			}, 300);
		  		} 		
		  	},
		  	HideBrick(brick){
		  		brick.visible = false;
		  	}

		  }

		});

		var ball = new Vue({
			el: '#playball',
				created: function(){
					this.Move();
				},
			data: {
				message: "true",

				X: 50,
				Y: 300,
				heigth: 30,
				width: 30,

				landslideX: 2.0,
				landslideY: 3.0,
				slideStep: 0.5,

				right: 1,
				down: true
		},
			computed: {
			Style(){
			 	return {	left: this.X + "px",
		    				top: this.Y + "px"	}
		  		},
			RocketTrajectory(){
					return rocket.slideWay;
				}
			  },
		  	methods: {
		  	BallReset(){

		  			this.X = 50;
					this.Y = 300;
					this.landslideX = 2;
		    		this.landslideY = 3;
		    		this.slideStep = 0.5;
		    		this.down = true;
		    		this.right = 1;

					this.Move();
		  	},
		  	Move(){
		  		if (game.lifes >= 0 && game.play == true){
		  		this.CheckCollision();
					if (this.right == 1) this.X += this.landslideX; 
				  		else if (this.right == -1) this.X -= this.landslideX;
					if (this.down == true) this.Y += this.landslideY; 
						else this.Y -= this.landslideY;
			  	setTimeout(this.Move, 1);
			  }
			},
			CheckCollision(){
				var rocket = document.getElementById('playrocket');
					if (this.X >= document.body.clientWidth-30) { 
						this.right=-1; 
						this.BeatEffect();
						}
 					else if (this.X <= 1) {
						this.right=1; 
						this.BeatEffect();
					}
				    if (this.Y >= document.body.clientHeight-30) {
						this.down=false; 
						this.BeatEffect(); 
						game.lifes--;
					}
			  		else if (this.Y <= 1) {
						this.down=true; 
						this.BeatEffect();
					}
				if (this.X + 15 >= rocket.offsetLeft && this.X+15<=rocket.offsetLeft+rocket.clientWidth && 
					this.Y+30 >= rocket.offsetTop && this.Y <= rocket.offsetTop+30) {
				this.down=false;
				this.CorrectTrajectoryWay();
				this.BeatEffect();
				}
				this.HitBrick();
			},
			CorrectTrajectoryWay() {		
				if(this.right == -1 && this.RocketTrajectory == -1 || this.right == 1 && this.RocketTrajectory == 1)
					this.landslideX += this.slideStep; 
				else if (this.right == -1 && this.RocketTrajectory == 1 || this.right == 1 && this.RocketTrajectory == -1)
					this.landslideX -= this.slideStep;
				else {
					if (this.RocketTrajectory != 0){
					this.right = this.RocketTrajectory;
					this.landslideX += this.slideStep; 
					}	 	
				}
				if (this.landslideX == 0) this.right = 0;
			},
			HitBrick(){
				var blockSegment = document.getElementById('bricksblock');
				for(var i = 0; i < bricks.bricks.length; i++){
					//var brick = document.getElementById(bricks.bricks[i].id);
					var brick = bricks.bricks[i];
					if (
						brick.visible == true
						&&
						this.Y >= brick.Y + blockSegment.offsetTop 
						&& 
						this.Y <= brick.Y + brick.height + blockSegment.offsetTop
						&& 
						this.X >= brick.X + blockSegment.offsetLeft
						&&  
						this.X <= brick.X + brick.width + blockSegment.offsetLeft
						)
					{
						this.down = true;
						this.BeatEffect();
						bricks.DestroyBrick(brick);
					}
				}
			},
			BeatEffect(){
			  	document.getElementById('playball').className = "ball beat";
			  	setTimeout(()=>{
					document.getElementById('playball').className = "ball";
				},100);
		  	}
		  }
		});

		var rocket = new Vue({
			el: '#playrocket',
			data: {
			X:50,
			//width: 400,
			slideWay: 0,
			prevPos: 0,

			touch: false,
			touchPos: 0
			},
			computed: {
				Style(){
			 		return	{	left: this.X + "px", width: this.Width + "px"	}
		  		},
		  		Width(){
		  			return  document.body.clientWidth / 4;
		  		}
			},
			methods: {
				SetPosition(e){
					this.X = e.pageX - this.Width / 2;
					if (this.X < 0) this.X = 0;
					else if (this.X + this.Width > document.body.clientWidth) this.X = document.body.clientWidth - this.Width;
					this.CheckWay();
		  			this.prevPos = this.X;
				},
				CheckWay(){
					var r = document.getElementById('playrocket');
		  			if (this.X > this.prevPos + 15) { this.slideWay = 1; r.className = "right";}
		  			else if (this.X < this.prevPos - 15) { this.slideWay = -1; r.className = "left";}
		  			else { this.slideWay = 0; r.className = "static";}
		  		},	
		  		TouchRocket(e){
				var r = document.getElementById('playrocket');
		  		var touchobj = e.changedTouches[0]; 		// reference first touch point (ie: first finger)
        		startx = parseInt(touchobj.clientX); 		// get x position of touch point relative to left edge of browser
        		if (startx >= this.X && startx <= this.X + r.clientWidth) 
        		{
        			this.touchPos = startx - this.X;
        			this.touch = true;
        		}
          		else this.touch = false;
        		e.preventDefault();  
		  		},
		  		DragRocket(e){
		  			var touchobj = e.changedTouches[0];
		  			if (this.touch) this.X = parseInt(touchobj.clientX)-this.touchPos;;
		  			if (this.X < 0) this.X = 0;
					else if (this.X + this.Width > document.body.clientWidth) this.X = document.body.clientWidth - this.Width;
		  			this.CheckWay();
		  			this.prevPos = this.X;
					e.preventDefault();
		  		},
			}
		});

		addEventListener('mousemove', rocket.SetPosition, false);
		addEventListener('resize', bricks.CorrectBricks, false );
		addEventListener('touchstart', rocket.TouchRocket, false);
    	addEventListener('touchmove', rocket.DragRocket, false);