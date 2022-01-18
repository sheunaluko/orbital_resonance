import {useEffect} from 'react' ; 

import styles from '../styles/Explorer.module.css'

import {
    Link ,
    Marquee,
    loadScript,
    animateCSS,
    server_render ,
    wait_until ,
    Logger ,
    wait, 
} from "./core_imports.js" ; 

import {
    getRNG ,
    getRandomParams,  
} from "./graphics/art_blocks_utils"

import {
    Slider, 
} from "./mui" 
var log = Logger("widgets") ;


//utils
function get_square_size() { return Math.min(window.innerWidth, window.innerHeight) }


//export to window for dev purposes
if (!server_render()){ 
    window.widget_dev = {
	get_square_size , 
    } 
}

// define the sketch 
var ExplorerSketch = function(p) {
    
    var RENDER_DIM = 2400;
    var WIDTH = window.innerWidth;var HEIGHT = window.innerHeight;
    //var DIM = Math.round(0.95*Math.min(WIDTH, HEIGHT));
    var DIM = 0.95*Math.min(WIDTH, HEIGHT) ; 
    var M = DIM / RENDER_DIM;

    let get_drawer = function(params) {
	//generates all points using the same RENDER_DIM 
	let {acc : _acc, acc_fine, acc_ultra_fine,x_start,v_start}  =  params ;
	let a_tot =  _acc + acc_fine  + acc_ultra_fine
	let x_init = (x_start/2)*RENDER_DIM ; //R in pixels
	let v_circular = Math.sqrt(a_tot*x_init) //Circular velocity 
	let v_init = v_circular * params.v_start
	let dt = 0.3 //params.dt; 
	let pos = p.createVector(x_init,0) ;  let vel = p.createVector(0,v_init) ;
	return function() {
	    let acc = p.createVector(0 - pos.x, 0 - pos.y);acc.mult(1/acc.mag());acc.mult(a_tot);
	    let dv  = window.p5.Vector.mult(acc,dt) 
	    vel.add(dv) //updates the velocity vector
	    let dp  = window.p5.Vector.mult(vel,dt) 
	    pos.add(dp);
	    return pos.copy() 	
	}
    }
    
    let get_points = function(params) {let dfn=get_drawer(params);let pts=[];for(var i=0;i<params.iterations;i++){let pt = dfn(); if((i% 3) == 0){pts.push(pt)}};return pts}

    let display_points = async function(pts,init_hash) {

	
	p.fill(0); let old_pos = null;
        let n = -1 ; 
	for (var pos of pts) {

	    if ( hash(params) != init_hash )  {
		console.log("ENDING DRAW!")
		return 
	    } 
	    
	    //scale the pos 
	    pos.x = pos.x*M ; pos.y = pos.y*M ; 
            n += 1 
	    p.ellipse(0,0,params.center_sz)  ;
            p.push() ;
            p.noStroke() ; 
            p.fill(0) ;
	    p.ellipse(pos.x,pos.y , params.dot_sz)
            p.pop() ;
            
	    if (params.lines && old_pos) {
		p.line(old_pos.x,old_pos.y, pos.x,pos.y) ;	    
	    }
	    old_pos = pos.copy()

	    if (params.draw) {
		await wait(params.delay) ; 
	    } 
	} 
    }

    
    let params = {
	'iterations' : 10000,
        'iterationsMin' : 0,
        'iterationsMax' : 90000,
        'iterationsStep' : 50 , 
	'dot_sz'     : 4,
	'dot_szMin'     : 0,
	'dot_szMax'     : 9, 	
	'lines'      : false, 
	'center_sz'  : 4 ,
	'acc'  : 2,
	'accMin'  : 0 ,
	'accMax'  : 11 ,
	'accStep'  : 0.01 ,
	'acc_fine'  : 0 ,
	'acc_fineMin'  : -0.03 ,
	'acc_fineMax'  : 0.03 ,
	'acc_fineStep'  : 0.0001 ,                        
	'acc_ultra_fine'  : 0 ,
	'acc_ultra_fineMin'  : -0.003 ,
	'acc_ultra_fineMax'  : 0.003 ,
	'acc_ultra_fineStep'  : 0.00001 ,
	
        'x_start' : 0.8,
	'x_startMin' : 0.3,
	'x_startMax' : 0.9,
	'x_startStep' : 0.05, 	

        'v_start' : 0.5,
	'v_startMin' : 0,
	'v_startMax' : 1,
	'v_startStep' : 0.05,


	'draw'      : true,
	'delay'      : 0,
	'delayMin'      : 0,
	'delayMax'      : 200,
	'delayStep'      : 1, 			

	/*
        'dt' : 0.1,
	'dtMin' : 0.1,
	'dtMax' : 1,
	'dtStep' : 0.05, 	

        'sp' : 1,
	'spMin' : 1,
	'spMax' : 100,
	'spStep' : 1, 	
	*/ 
	
	
    } 

    p.setup = async function() {
	p.createCanvas(DIM,DIM,p.WEBGL)  ;
	var gui = p.createGui(this, 'Orbital Config');
	gui.addObject(params);
    }

    //var last_param_str = null ;
    var hash = function(p) {
        return JSON.stringify(p)
    }

    var pphash = null  ;
    var p_rev  = 0 ; 

    p.draw = async function() {

        if (pphash == hash(params)) {
            return 
        }

        pphash = hash(params)
	p_rev += 1 ; //update the iteration 
	
        console.log("Rendering new params!") 
        
        p.clear() 
	let pts = await get_points(params) ;
	let _   = await display_points(pts,pphash)
	
    } 
    
}


export function ExplorerWidget()  {
    if (!server_render()) { 
        useEffect( async ()=> {
            console.log("Explorer loaded") ;
	    console.log(window) ;
	    /*
	      dynamically load p5js 
	    */
	    let v = await loadScript("https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js" , ()=>{console.log("Explorer requested p5")}) ; 
	    let timedOut = await wait_until( ()=> window.p5  , 10000, 100) ;
	    if (timedOut) { log("timedout") } else { log("Detected p5")  } ;
	    await loadScript("/src/p5.gui.js" , ()=>{console.log("Explorer requested p5.gui")}) ; 
	    await loadScript("/src/quicksettings.js" , ()=>{console.log("Explorer requested QS")}) ;
	    await wait_until( ()=> window.p5.prototype.createGui  , 10000, 100) ;	    	    
	    if (!server_render()) { 
		window.ep = new window.p5(ExplorerSketch, window.document.getElementById('ExplorerMainContainer'));
	    } 
	})
    }
    return ( <div id="ExplorerMainContainer" className={styles.full_height_flex}>   </div> ) 
}













