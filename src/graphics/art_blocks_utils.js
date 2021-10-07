

export function random_hash() {
  let x = "0123456789abcdef", hash = '0x'
  for (let i = 64; i > 0; --i) {
    hash += x[Math.floor(Math.random()*x.length)]
  }
  return hash
}


export function get_token_data() {
    let dta =  {
	"hash": random_hash(),
	"tokenId": "123000456"
    }
    //console.log("abu[token]:: " + dta.hash ) ;
    return dta 
}

export class Random {
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
  random_choice(list) {
    return list[Math.floor(this.random_num(0, list.length * 0.99))]
  }
}

export function getRNG() { 
    let tokenData = get_token_data() 
    let seed = parseInt(tokenData.hash.slice(0, 16), 16)
    
    if (window.tokenData) {
	window.tokenData.push([tokenData,seed]) 
    } else {
	window.tokenData = [[tokenData,seed]] 
    }
    return  new Random(seed)
} 


export function getRandomParams() {
    let R = getRNG() ; 
    return {
	'iterations' : R.random_num(2000, 10000) ,
	'dot_sz'     : R.random_num(0,6) , 
	'lines'      : R.random_bool(0.1) ,
	'center_sz'  : 4 ,
	'acc_scale'  : R.random_num(0.1,10) 
    } 
} 
