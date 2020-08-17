const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./StarBlock.js');
const hex2ascii = require('hex2ascii');
const level = require('level');
const chainDB = './chaindata';
const chainDB2 = './chaindata2';
const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const db = level(chainDB, { createIfMissing: true }, function (err, db) {
    if (err instanceof level.errors.OpenError) {
        console.log('failed to open database')
    }
})

// Add data to levelDB with key/value pair
function addDataToLevelDB(key,value){

    return db.put(key, value);
}

// Get data from levelDB with key
function getDataFromLevelDB(key){
    var result = db.get(key);
    return result;
}

let errorLog = [];
var num0fvalidblock=0;
var num0finvalidblock=0;
var invalidblockarray =[];
var validblockarray =[];
var invalidblockarrayheight =[];
var validblockarrayheight =[];
let allblocks = [];
class Blockchain{
    constructor(isim){
        this.ad = isim;
        this.difficulty = 2;
        this.total_chain_height = -1;
        //if chain is empty
        this.addBlock(new BlockClass.StarBlock("GENESIS Block"));
    }

    // get block
    async getBlock(blockHeight){
        const serializedBlock = await getDataFromLevelDB(blockHeight);
        return JSON.parse(serializedBlock)
    }
    // Add new block
    async addBlock(newBlock){
        //console.log("[" +this.ad+ "] before addBlock chain height: " +this.total_chain_height );
        //return newBlock.height;
        newBlock.height = this.total_chain_height + 1;
        if(newBlock.height>0){
            var prevBlock =  await this.getBlock(newBlock.height - 1);
            newBlock.previousBlockHash = prevBlock.hash;
        }
        newBlock.time = new Date().getTime();//.toString().slice(0,-3);
        //var hashHesaplanacakBody = JSON.stringify(newBlock);

        //newBlock.hash = SHA256(hashHesaplanacakBody).toString();
        //newBlock.mineBlock(this.difficulty);
        this.total_chain_height++;
        //newBlock.recall_block = await hashModulo(newBlock.hash, this.total_chain_height);
        //var rn= (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
        //var recall = Math.log10(rn);
        //newBlock.recall_block = rn % this.total_chain_height;
        //console.log("added block height: " + newBlock.height + " hash: " + newBlock.hash.toString() + " recall: " + newBlock.recall_block + " rand: "+rn +" crr tch: "+this.total_chain_height )

        //var recal_arr_size = Math.ceil(Math.log2(this.total_chain_height));
        var recal_arr_size = Math.ceil(Math.sqrt(this.total_chain_height));

        /*var recal_arr_size = 3;//Math.ceil(Math.log2(this.total_chain_height));
        if(newBlock.height===0)
             recal_arr_size = 0;
        else if(newBlock.height===1 )
            recal_arr_size = 1;
        else
            recal_arr_size = 3;
        *///var recal_arr_size = 2;//Math.ceil(Math.log2(this.total_chain_height));
        newBlock.recall_arr.push(newBlock.height);
        recal_arr_size--;
        //let initial_recall_data = {
        var recall_id= newBlock.height-1;//(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) % this.total_chain_height;
        //flag:false,

        newBlock.recall_arr.push(recall_id);
        recal_arr_size--;

        lbl: while (recal_arr_size > 0) {
            let recall_block_height =  (Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER)) % this.total_chain_height;
            recall_block_height = this.total_chain_height - recall_block_height -1;
            let flag = true;
            for (let i = 0; i < newBlock.recall_arr.length; i++) {
                if(recall_block_height === newBlock.recall_arr[i] ){
                    // continue lbl;
                    flag = false;
                }
            }

            if (!flag) {
                continue lbl;
            } else {
                //let recall_data = { recall_id: recall_block_height, //flag:false
                //};
                let recall_data = recall_block_height;
                newBlock.recall_arr.push(recall_data);
            }

            recal_arr_size--;
        }
        // newBlock.recall_arr = tmp_recall_arr;
        ////
        /*var iscurrentblockvalid = (Math.round(Math.random() * Number.MAX_SAFE_INTEGER)) % 200;
        if (iscurrentblockvalid)
        {
            newBlock.isvalid = true;
            validblockarray.push(newBlock);
            num0fvalidblock++;
        }
        else {
            newBlock.isvalid = false;
            invalidblockarray.push(newBlock);
            num0finvalidblock++
        }*/
        //console.log("curr h: "+this.total_chain_height+" Logarithm size: " + newBlock.recall_arr.length + " recall_array: " + JSON.stringify(newBlock.recall_arr) + " isBlockvalid: "+ newBlock.isvalid )
        //console.log("added block height: " + newBlock.height + " hash: " + newBlock.hash.toString() + " recall_arr: " + JSON.stringify(newBlock.recall_arr) )
        allblocks.push(newBlock.height);
        await addDataToLevelDB(newBlock.height, JSON.stringify(newBlock));
        //console.log("Block " + (newBlock.height)+" added to DB");
        return newBlock.height;
    }

    async  updateBlock(key, blok){
        addDataToLevelDB(key, JSON.stringify(blok));
        //console.log("Block " + (key)+" updated to DB");
        return key;
    }

}
let bc = new Blockchain();
const kayitEkle = (name) => bc.addBlock(new BlockClass.StarBlock(name))
var numoftestblocks=50-1;
var numof_grouped_blocks_by_one_node=15;
var invalidity_percentage= 10; //numoftestblocks*invalidity_percentage/100
var enough_invalid=(numoftestblocks/100)*invalidity_percentage;//integer invalid block sayisi


const main = async ()=> {
    /*for (var i = 0; i < numoftestblocks; i++) {
        const data1Result = await kayitEkle("Data"+(i+1));
    }*/
    for (var i = 0; i < numoftestblocks+1; i++) {
        const data = await getDataFromLevelDB(i);
        console.log(data);
    }
    var k=0;
    var j= 0,y=0;
    var catchedarr =[];
    //
    let currentBlock;

    var ii=0;
    for (let i=0;i<=numoftestblocks;i++)
    {
        let s =  await getDataFromLevelDB(i);
        currentBlock = JSON.parse(s);
        currentBlock.isvalid=true;
        await addDataToLevelDB(currentBlock.height, JSON.stringify(currentBlock))
        allblocks[i]=i;
    }
    while( ii< enough_invalid){
        var makethisblockinvalid = (Math.round(Math.random() * Number.MAX_SAFE_INTEGER)) % numoftestblocks;
        let s =  await getDataFromLevelDB(makethisblockinvalid);
        currentBlock = JSON.parse(s);
        if (currentBlock.height < 3)
            continue;

        if(!(invalidblockarrayheight.includes(currentBlock.height)))
        {
            currentBlock.isvalid = false;
            invalidblockarray.push(currentBlock);
            invalidblockarrayheight.push(currentBlock.height);
            //await bc.updateBlock(currentBlock.height, currentBlock);
            await addDataToLevelDB(makethisblockinvalid, JSON.stringify(currentBlock))
            num0finvalidblock++;
            ii++;
        }
    }
    let z = 0;
    while (z <= numoftestblocks){
        if(!invalidblockarrayheight.includes(allblocks[z]))
        {
            let s =  await getDataFromLevelDB(allblocks[z]);
            currentBlock = JSON.parse(s);
            validblockarray.push(currentBlock);
            validblockarrayheight.push(allblocks[z]);
            num0fvalidblock++;
        }
        z++;
    }
    //group blocks by a node
    var groupedblockarray =[];
    for (let i = 0; i < numof_grouped_blocks_by_one_node; i++) {
        var randomformod = Math.floor(Math.random() * numoftestblocks) + 1;
        let s =  await getDataFromLevelDB(randomformod);
        currentBlock = JSON.parse(s);
        if (currentBlock.height < 3)
        {
            i--;
            continue;
        }
        if (!groupedblockarray.includes(randomformod))
        {
            groupedblockarray.push(currentBlock);
        }
    }
    let groupedblockarrayh =[];
    for (var i = 0; i < groupedblockarray.length; i++) {
        groupedblockarrayh[i] = groupedblockarray[i].height;
    }
    //console.log("g height:"+groupedblockarrayh.length+" group block arr: "+groupedblockarrayh);
    //
    //console.log("bozma bitti")
    console.log("num of total blocks: "+ allblocks.length +" numofvalidBlock: "+num0fvalidblock+ " ||numofinvalidBlock: "+ num0finvalidblock+" ||num of block that a node contains: "+groupedblockarrayh.length  );
    //console.log("valid block: " + validblockarrayheight);
    //console.log("invalid block: " + invalidblockarrayheight);
    while(j< groupedblockarray.length)
    {
        //console.log("no of the block j: "+j+" arr l: "+validblockarray[j].recall_arr.length)
        while(k < groupedblockarray[j].recall_arr.length ) {

            while (y < invalidblockarray.length ) {
                //console.log("i am at this block:"+j+ "and my recall arry l is: "+k);
                if (groupedblockarray[j].recall_arr[k] === invalidblockarrayheight[y]) //validblockarray[y].height
                {
                    //console.log("Bu numaralı block: "+validblockarray[j].height+"bunu yakaladı: "+ invalidblockarrayheight[y])
                    if(!catchedarr.includes(invalidblockarrayheight[y]))
                        catchedarr.push(invalidblockarrayheight[y]);
                }
                y++;
            }
            y=0;
            k++;
        }
        k=0;
        j++;
    }
    console.log("% bozukluk oranı: "+(invalidblockarray.length/(allblocks.length))*100)
    console.log("% yakalama orani: "+ (catchedarr.length/invalidblockarray.length)*100)
    console.log("bozuk block sayisi: "+invalidblockarray.length+ " | yaklanan sayi: "+catchedarr.length);

}

main();
module.exports.Blockchain = Blockchain;
