// JavaScript Document
var chess=document.getElementById('chess');
var context=chess.getContext('2d');
var over=false;
var me=true;
//存储棋盘棋子的状态；使之不能重复落子
var chessboard=[];

//赢法数组
var wins=[];

//赢法的统计数组
var mywin=[];
var comwin=[];

for(var i=0;i<15;i++){
	chessboard[i]=[];
	for(var j=0;j<15;j++){
		chessboard[i][j]=0;
	}
}

for(var i=0;i<15;i++){
	wins[i]=[];
	for(var j=0;j<15;j++){
		wins[i][j]=[];
	}
}
//赢法种类的索引
var count=0;
//赢法数组的填充
//横线的赢法
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		//wins[i][j]代表在棋盘上的点
		//wins[0][0][0]=true
		//wins[0][1][0]=true
		//wins[0][2][0]=true
		//wins[0][3][0]=true
		//wins[0][4][0]=true
		
		//wins[0][1][1]=true
		//wins[0][2][1]=true
		//wins[0][3][1]=true
		//wins[0][4][1]=true
		//wins[0][5][1]=true
		for(var k=0;k<5;k++){
			wins[i][j+k][count]=true;
		}
		count++;
	}
}
//竖线
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[j+k][i][count]=true;
		}
		count++;
	}
}
//斜线
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count]=true;
		}
		count++;
	}
}
//反斜线
for(var i=0;i<11;i++){
	for(var j=14;j>3;j--){
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count]=true;
		}
		count++;
	}
}

for(var i=0;i<count;i++){
	mywin[i]=0;
	comwin[i]=0;
}

//画棋盘
context.strokeStyle="#bfbfbf";

for(var i=0;i<15;i++){
	context.moveTo(15+i*30,15);
	context.lineTo(15+i*30,435);
	context.moveTo(15,15+i*30);
	context.lineTo(435,15+i*30);

	context.stroke();
}

function onestep(i,j,me){
	context.beginPath();
	context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
	context.closePath();
	var gradient=context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
	//黑白棋区分
	if(me){
		gradient.addColorStop(0,"#0a0a0a");
		gradient.addColorStop(1,"#636766");
	}else{
		gradient.addColorStop(0,"#d1d1d1");
		gradient.addColorStop(1,"#f9f9f9");
	}

	context.fillStyle=gradient;
	context.fill();
}

//落子
chess.onclick=function(e){
	if(over){
		return;
	}
	if(!me){
		return;
	}
	var x=e.offsetX,
		y=e.offsetY,
		i=Math.floor(x/30),
		j=Math.floor(y/30);
		
	if(chessboard[i][j]==0){
		onestep(i,j,me);
		chessboard[i][j]=1;
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				mywin[k]++;
				comwin[k]=6;//设置异常的值，排除计算机赢的情况	
				if(mywin[k]==5){
					alert("你赢了！");
					over=true;
				}
			}
		}
		if(!over){
			me=!me;
			computerAI();
		}
	}
}

function computerAI(){
	var myscore=[];
	var comscore=[];
	var Max=0;
	var u=0,v=0;
	
	for(var i=0;i<15;i++){
		myscore[i]=[];
	    comscore[i]=[];
		for(var j=0;j<15;j++){
			myscore[i][j]=0;
	   		comscore[i][j]=0;
		}
	}
	
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(chessboard[i][j]==0){
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(mywin[k]==1){
							myscore[i][j]+=200;
						}else if(mywin[k]==2){
							myscore[i][j]+=400;
						}else if(mywin[k]==3){
							myscore[i][j]+=2000;
						}else if(mywin[k]==4){
							myscore[i][j]+=10000;
						}
						
						if(comwin[k]==1){
							comscore[i][j]+=220;
						}else if(comwin[k]==2){
							comscore[i][j]+=420;
						}else if(comwin[k]==3){
							comscore[i][j]+=2200;
						}else if(comwin[k]==4){
							comscore[i][j]+=20000;
						}
					}
				}
				
				if(myscore[i][j]>Max){
					Max=myscore[i][j];
					u=i;
					v=j;
				}else if(myscore[i][j]==Max){
					if(comscore[i][j]>comscore[u][v]){
						u=i;
						v=j;
					}
				}
				
				if(comscore[i][j]>Max){
					Max=comscore[i][j];
					u=i;
					v=j;
				}else if(comscore[i][j]==Max){
					if(myscore[i][j]>myscore[u][v]){
						u=i;
						v=j;
					}
				}
			}
		}
	}
	
	onestep(u,v,false);
	chessboard[u][v]=2;
	for(var k=0;k<count;k++){
		if(wins[u][v][k]){
			comwin[k]++;
			mywin[k]=6;//设置异常的值，排除计算机赢的情况	
			if(comwin[k]==5){
				alert("电脑赢了！");
				over=true;
			}
		}
	}
	if(!over){
		me=!me;
	}
}

if (chess && chess.getContext) {
var chessContext = chess.getContext('2d');
var chessBuffer = document.createElement('canvas');
chessBuffer.width = chess.width;
chessBuffer.height = chess.height;
var chessBufferContext = chessBuffer.getContext('2d');
}