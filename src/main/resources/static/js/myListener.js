/**
 * 监听器集
 */
$(function() {
	$("#btn-begin").click(function() {
		//得到要提问的假名范围
		var command=0;
		$("#div-checkboxs").find("input").each(function(){
			if($(this).is(":checked")){
				command+=parseInt($(this).val());
			}
		});
		//得到要问答的数量
		var num=$("#numScope").val();
		// 设置焦点
		$("#answer").focus();
		//清空成绩表
		$("#gradeDiv").html("");
		//启动五十音处理器
		var e = myMachine.start(command,num);
		//修改提问div
		$("#question").html("请写出假名对应的罗马音<br/>下一个："+e.question);
	});
	$("#answer").keyup(function() {
		//检测回车键是否按下
		if (event.keyCode == 13) {
			//五十音处理器指向下一个假名
			var result = myMachine.next($("#answer").val().trim());
			if(result.isEnd==-1){//并未点击开始
				$("#question").html("请点击开始按钮<br/>写出假名对应的罗马音,回车进行下一个的问答,超时或写错会添加到队列后重新问答");
			}else if(result.isEnd==0){//下一个问答开始
				$("#question").html(result.msg+"<br/>下一个："+result.e.question);
			}else if(result.isEnd==1){//最后一个问答结束
				//结束,得到并显示成绩单
				var gradeMsg=result.gradeMsg;
				$("#question").html("结束！<br/>平均用时：" + gradeMsg.avg + "<br/>错误假名数：" + gradeMsg.misNum+ "<br/>超时假名数：" + gradeMsg.overNum);
				var gradesTable=result.gradeMsg.gradesTable;
				$("#gradeDiv").html(gradesTable);
				$("#gradeDiv").find("table").addClass("table table-striped table-bordered");
			}
			//清空回答框
			$("#answer").val("");
		}
	});
	$("#timeScope").on("change",function(){
		myMachine.level=parseInt($(this).val());
	});
});