// Verifyer config
var Configuration = {
	Title: "Node.js JD Verify",
	Version: '1.0.0'
};

// Just for fun, ASCII art FTW! ;)
var figlet = require('figlet');

// Get Arguments
var ARGS = require('shell-arguments');


if(ARGS.help || ARGS.h){
	console.log(figlet.textSync(' Help', {font: 'Small'}));
	console.log();
	console.log(' ##############################################################################');
	console.log();

	console.log(" Welcome to " + Configuration.Title + " " + Configuration.Version + "v help");
	console.log();

	console.log(" --help -> Opens up help");
	console.log(' --seed_hash "<seed_hash>"');
	console.log(' --sseed "<server seed>"');
	console.log(' --cseed "<client seed>"');
	console.log(' --nonce "<roll nonce>"');

	console.log(' --range');
	console.log('     --rangeSTART "<number (default: 1)>"');
	console.log('     --rangeSTOP "<number (default: 10)>"');

	return;
}


var HashSSEED = ARGS.seed_hash || "c91ff6eb1cb1e983b3849d3c31bb0e26b69260b93642c21de92c924342b05b81";
var SSEED = ARGS.sseed || "3s2XMXmXGNkQS0plOkQBcjoAiKVHVKXc.rBIVMhpkpbLRxVgFcr_eTVSPfiHDisq";
var CSEED = ARGS.cseed || "626434374532319526612686";
var nonce = ARGS.nonce || 1;
var expected_result = ARGS.result;

console.log(); // Because \n is soooo... 2015 ;) (Kids don't do it this way)
console.log(figlet.textSync(Configuration.Title, {font: 'Small'}));
console.log();
console.log(' ################################# Using Data #################################');
console.log();
console.log("  SEED HASH : " + HashSSEED);
console.log("       SEED : " + SSEED);
console.log("      CSEED : " + CSEED);
console.log("      nonce : " + nonce);
if(expected_result){
console.log('Roll number : ' + expected_result);
}
console.log();
console.log(' ##############################################################################');
console.log();


// Get crypto module
var crypto = require('crypto');

// Check if sseed hash coresponds to sseed
var hash = crypto.createHash('sha256').update(SSEED).digest('hex');
if(hash === HashSSEED){
	console.log(" (Y) Server seed hash VERIFIED! ");
	console.log("   - It means that server seed hash coresponds to given server seed.\n");
}else{
	console.log(" (X) Server seed hash NOT VERIFIED! ");
	console.log("   - It means that server seed hash DOES NOT coresponds to given server seed.\n");
}

// Generate results
var msg = CSEED + ':' + nonce;
var hash = crypto.createHmac('sha512', SSEED).update(msg).digest('hex');

// console.log('HMAC IS: ' + hash); // Debug HMAC result
var result = GetResultFromHash(hash);

if(expected_result){
	if(expected_result.toString() === (result / 10000).toString()){
		console.log(" (Y) Result VERIFIED! ");
		console.log("   - It means that roll was provably fair.\n");
	}else{
		console.log(" (X) Result NOT VERIFIED! ");
		console.log("   - It means that roll was NOT provably fair.");
		console.log("   - Well... bad news for you my friend, somebody is cheating.");
		console.log("   - Double check your data, maybe you just miss-typed something.\n");
	}
}

console.log("                       --> ROLL Result is: " + (result / 10000) + ' <--' );
console.log();



/*
// Testing all fffff... hash to see if the result will be 4095
hash = "";
for(var i = 0; i < 128; i++){
	hash = hash + 'f';
}
*/

if(ARGS.range){
	console.log(' ############################################################################## ');

	var StartRange = ARGS.rangeSTART || 1;
	var StopRange = ARGS.rangeSTOP || 10;
	
	console.log(' Range from: ['+StartRange+', '+StopRange+']');
	console.log();

	// For generating many results...
	for(var i = parseInt(StartRange, 10); i <= parseInt(StopRange, 10); i++){
		var msg = CSEED + ':' + i;
		var hash = crypto.createHmac('sha512', SSEED).update(msg).digest('hex');
		var result = GetResultFromHash(hash);
		console.log(result / 10000);
	}
	console.log();
}


// Generates result from hash!
function GetResultFromHash(hash){
	var hash_chunks = hash.match(/.{1,5}/g); // Chunks hash string into 25 blocks of 5 and 26th block of 3 (128 chars in total).
	//console.log('Hash CHUNKS: ' + hash_chunks ); // Debug, to see all the chunks.
	var result = 0; // Set result to 0.
	for(var i = 0; i <= 25; i++){
		result = parseInt(hash_chunks[i], 16); // Converts HEX into DEC result range [0, 1048575].
		//console.log("VALUE: " + result); // Debug to see the DEC result.
		if(result < 1000000){ // If result is smaller than 1M we proceed to the next chunk until last witch is [0, 4095].
			break; // Exit loop
		}
	}
	return result;
}

//var hexString = number.toString(16);
//var yourNumber = parseInt(hexString, 16);



console.log(' ##############################################################################');
console.log("  - This script is created by JD mod (77) <@Titanium>");
console.log("  - If you want to buy me a coffee: xTitanMrVpRYitDxrNiL7MkUjb6cSnjjF3 (CLAM)");
console.log("  - For more info about script can be found by using --help argument.");