{
var arr = [];

var i=0;
while (i<5)
{
    let new_data = {
        recall_id:0,
        damaged:false,
    };
    new_data.recall_id=i;
    arr.push(new_data)
    i++;
    console.log(item)
}
var item = arr.find(item=>item.recall_id === this.new_data.recall_id)
}
console.log(JSON.stringify(arr))