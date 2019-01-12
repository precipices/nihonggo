/**
 * 前后端交互的ajax集
 */
// 得到五十音json数组，并调用回调函数callback处理
function getFiftyKana(callback) {
	$.ajax({
		url : "json/fifty.txt",
		type : "get",
		// async : false,
		success : function(data) {
			callback(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("连接失败，没有获取到五十音值！" + XMLHttpRequest.status + " "
					+ XMLHttpRequest.readyState + " " + textStatus);
		},
	});
}