export default async ({project,frame,rect,text}) => {
 const p=await project({dir:"/home/user/summit-book",size:"800x520",fps:24,background:"#1a1712"});
 const gold="#e7b877", navy="#1f3358", paper="#faf8f3";
 const opacity=(times)=>[{property:"opacity",keyframes:times.map(([at,value])=>({at,value})),easing:"ease-in-out"}];
 const open=[{at:0,value:0},{at:.6,value:0},{at:1.65,value:1},{at:4.75,value:1},{at:5.6,value:0},{at:6,value:0}];
 const title=(s,x,y,size,color,width=190)=>text(s,{x,y,width,height:100,fontFamily:"Inter",fontWeight:700,fontSize:size,lineHeight:1.2,color});
 const left=frame({name:"left-page",x:154,y:73,width:240,height:350,layout:"none",background:paper,radius:3,motion:{timeline:{at:.6,sequence:[{from:{scaleX:.02,opacity:0},to:{scaleX:1,opacity:1},duration:1.05},{to:{scaleX:1,opacity:1},duration:3.1},{to:{scaleX:.02,opacity:0},duration:.85}]}}},[
  text("01 / RECOVER THE CALL",{x:25,y:24,width:200,fontFamily:"Inter",fontSize:10,fontWeight:700,letterSpacing:.5,color:"#b07d3c"}),
  rect({x:24,y:74,width:193,height:60,color:gold,opacity:.65,mask:{x:0,y:0,width:1,height:60},animate:[{property:"maskWidth",from:1,to:193,at:2.0,duration:.7}]}),
  title("Missed-call\ntexts",25,76,25,navy),
  text("Sorry we missed your call.\nChoose a time for your visit:",{x:25,y:164,width:195,fontFamily:"Inter",fontSize:14,lineHeight:1.6,color:"#655e52"}),
  rect({x:25,y:230,width:180,height:40,color:navy,radius:5}),
  text("Book a visit",{x:35,y:242,width:160,fontFamily:"Inter",fontSize:14,fontWeight:700,color:paper,align:"center"}),
  text("A clear next step\nwhile you stay on the job.",{x:25,y:292,width:190,fontFamily:"Inter",fontSize:12,lineHeight:1.5,color:"#655e52"})
 ]);
 const right=frame({name:"right-page",x:395,y:73,width:240,height:350,layout:"none",background:paper,radius:3},[
  text("02 / WIN THE ESTIMATE",{x:25,y:24,width:200,fontFamily:"Inter",fontSize:10,fontWeight:700,letterSpacing:.5,color:"#b07d3c"}),
  rect({x:24,y:74,width:193,height:62,color:gold,opacity:.65,mask:{x:0,y:0,width:1,height:62},animate:[{property:"maskWidth",from:1,to:193,at:2.85,duration:.7}]}),
  title("Turn estimates\ninto jobs",25,76,25,navy),
  text("DAY 1      Text the homeowner\nDAY 4      Follow up by email\nDAY 10    Ask for a decision",{x:25,y:168,width:193,height:100,fontFamily:"Inter",fontSize:12,lineHeight:2.2,color:"#655e52"}),
  rect({x:25,y:284,width:180,height:1,color:"#d6cabb"}),
  text("Stop when they reply,\napprove, or opt out.",{x:25,y:298,width:193,fontFamily:"Inter",fontSize:12,lineHeight:1.5,color:"#655e52"})
 ]);
 const cover=frame({name:"cover",x:395,y:66,width:246,height:365,layout:"none",background:navy,radius:6,shadow:{x:14,y:17,blur:22,color:"#00000066"},motion:{timeline:{sequence:[{from:{x:0,scaleX:1,opacity:1},to:{x:0,scaleX:1,opacity:1},duration:.65},{to:{x:-116,scaleX:.04,opacity:1},duration:.65},{to:{x:-120,scaleX:.04,opacity:0},duration:.25},{to:{x:-120,scaleX:.04,opacity:0},duration:3.45},{to:{x:-116,scaleX:.04,opacity:1},duration:.2},{to:{x:0,scaleX:1,opacity:1},duration:.65},{to:{x:0,scaleX:1,opacity:1},duration:.15}]}}},[
  rect({x:10,y:0,width:2,height:365,color:"#e7b87733"}),
  text("SUMMIT SOLUTIONS",{x:28,y:36,width:190,fontFamily:"Inter",fontSize:11,fontWeight:700,letterSpacing:1,color:gold}),
  title("Speed-to-Lead\nPlaybook",28,104,28,paper,195),
  rect({x:28,y:218,width:48,height:3,color:gold}),
  text("Recover missed calls.\nWin more of your quotes.",{x:28,y:246,width:190,fontFamily:"Inter",fontSize:14,lineHeight:1.55,color:"#e9e3d8"}),
  text("FREE GUIDE",{x:28,y:326,width:190,fontFamily:"Inter",fontSize:10,fontWeight:700,letterSpacing:1,color:gold})
 ]);
 p.compose(frame({name:"book",width:800,height:520,layout:"none",animate:[{property:"offsetX",keyframes:[{at:0,value:-120},{at:.6,value:-120},{at:1.65,value:0},{at:4.75,value:0},{at:5.6,value:-120},{at:6,value:-120}],easing:"ease-in-out"}]},[left,right,rect({x:392,y:73,width:3,height:350,color:"#b9aa95"}),cover]),{dur:6,name:"playbook-open-and-highlight"});
 await p.frame(3.8,"renders/poster.png");
 await p.render("renders/playbook.mp4",{bitrate:700000,concurrency:2,shards:2});
};
