/**
 * 自定义工具集
 */

/**
 * 洗牌算法
 */
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
/**
 * 复制对象
 * 这种方法只适用于纯数据json对象的深度克隆,会忽略值为function以及undefied的字段，而且对date类型的支持也不太友好。
 */
function CloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// 获取文本宽度
function getWidth(text,template) {
	var sensor = $('<span>' + text + '</span>').css({
		display : 'none',
		"font-size":template.css("font-size")
	});
	$('body').append(sensor);
	var width = sensor.width();
	sensor.remove();
	return width;
}