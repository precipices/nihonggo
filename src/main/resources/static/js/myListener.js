/**
 * 监听器集
 */
$(function() {
	$("#btn-begin").click(function() {
		//得到要提问的假名命令
		var sum=0;
		$("#div-checkboxs").find("input").each(function(){
			if($(this).is(":checked")){
				sum+=parseInt($(this).val());
			}
		});
		// 设置焦点
		$("#answer").focus();
		//启动五十音处理器
		var e = myMachine.start(sum);
		//修改提问div
		$("#question").html("请写出假名对应的罗马音<br/>下一个："+e.question);
	});
	$("#answer").keyup(function() {
		//检测回车键是否按下
		if (event.keyCode == 13) {
			//五十音处理器指向下一个假名
			var result = myMachine.next($("#answer").val().trim());
			if(result.isEnd==1){
				//结束
				$("#question").html(result.msg);
			}else{
				//下一个
				$("#question").html(result.msg+"<br/>下一个："+result.e.question);
			}
			//清空回答框
			$("#answer").val("")
		}
	});
});