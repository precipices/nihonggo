/**
 * 自定义工具集
 */

//洗牌算法
function Shuffle(array){
	for(var i=array.length-1;i>=0;i--){
		var e=parseInt(Math.random()*i);
		var temp=array[i];
		array[i]=array[e];
		array[e]=temp;
	}
	return array;
//	for(var j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
//    return array;
}
