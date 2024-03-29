function random_hash() {
  let x = "0123456789abcdef", hash = '0x'
  for (let i = 64; i > 0; --i) {
    hash += x[Math.floor(Math.random()*x.length)]
  }
  return hash
}

function get_token_data() {
    return {
	"hash": random_hash(),
	"tokenId": "123000456"
    } 
}

class Random {
  constructor(seed) {
    this.seed = seed
  }
  random_dec() {
    /* Algorithm "xor" from p. 4 of Marsaglia, "Xorshift RNGs" */
    this.seed ^= this.seed << 13
    this.seed ^= this.seed >> 17
    this.seed ^= this.seed << 5
    return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000
  }
  random_num(a, b) {
    return a+(b-a)*this.random_dec()
  }
  random_int(a, b) {
    return Math.floor(this.random_num(a, b+1))
  }
  random_bool(p) {
    return this.random_dec() < p
  }
    random_normal(a,b) {
	let gaussian_interval = [a,b]
	let mean = (gaussian_interval[1]+gaussian_interval[0])/2
	let sd   = (gaussian_interval[1]-mean)/3 //99.7%
	//use the box mueller approach below
	let x1 = this.random_num(0,1) 
	let x2 = this.random_num(0,1)	
	let y = (Math.sqrt(-2*Math.log(x1)))*Math.cos(2*Math.PI*x2)
	return y*sd + mean 	

  }
  random_choice(list) {
    return list[Math.floor(this.random_num(0, list.length * 0.99))]
  }
}

export function get_params() {
    let tokenData = get_token_data()
    let seed = parseInt(tokenData.hash.slice(0, 16), 16)
    let R = new Random(seed)
    let params  = {
	'Radius' : R.random_num(0.4, 0.9) ,
	'Velocity'     : R.random_normal(0,1) ,
	'OrbiterSize'     : R.random_normal(0,5) ,
	'SunSize'     : R.random_num(0,15) , 		
	'Path'      : R.random_bool(0.1) ,
	'Time'      : R.random_num(20000,100000), 
	'CoarseGravity'        : R.random_num(0,11),
	'FineGravity'        : R.random_num(-0.03,0.03),
	'PreciseGravity'        : R.random_num(-0.03,0.03),
    }
    return params 
} 
