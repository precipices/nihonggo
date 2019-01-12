/**
 * 监听器集
 */
$(function() {
	$("#btn-begin").click(function() {
		// 得到五十音数组
		$("#answer").focus();
		var e = myMachine.start();
		$("#question").html("请写出假名对应的罗马音<br/>下一个："+e.question);
	});
	$("#answer").keyup(function() {
		if (event.keyCode == 13) {
			var result = myMachine.next($("#answer").val().trim());
			if(result.isEnd==1){
				$("#question").html(result.msg);
			}else{
				$("#question").html(result.msg+"<br/>下一个："+result.e.question);
			}
			$("#answer").val("")
		}
	});
});