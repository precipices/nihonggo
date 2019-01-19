/**
 * 处理五十音图的类集
 */
// 计时器类,单位是1/100秒
var Clock = function() {
	this.time = 0;
	this.id = 0;
	this.isRunning = 0;
	// 开始计时,如果正在计时中则不运行
	this.start = function() {
		if (this.isRunning == 1)
			return 0;
		this.isRunning = 1;
		this.time=0;
		var that=this;
		this.id = setInterval(function() {
			that.time++;
		}, 10);
		return 1;
	}
	// 结束计时,返回计时时间
	this.stop = function() {
		clearInterval(this.id);
		this.isRunning = 0;
		return this.time;
	}
	// 如果正在计时中，关闭计时
	this.close=function(){
		if(this.isRunning == 1)
			clearInterval(this.id);
		this.isRunning = 0;
		return this.time;
	}
}
// 包含单个对应的罗马音、平片假名的一个元素
var Element = function() {
	this.Rome = "a";
	this.Hirag = "あ";
	this.Katak = "ア";
}
// 包含问题回答级用时的一个元素
var TimingElem = function() {
	this.question = "あ";
	this.answer = "a"
	this.time = 0;
	this.isUnqualified=0;//0是合格，1是回答错误，2是回答超时
	// this.mistakeAnswer="";
}
// 五十音处理机
var FiftyMachine = function() {
	var clock = new Clock(); // 计时器
	var point = 0; // SoundGroup的指针
	this.Data = new Object(); // 载入的五十音json数据
	this.FiftyData=[];// 五十音，顺序数组，元素为Element
	this.VocalData=[];// 浊音，顺序数组，元素为Element
	this.DiffData=[];// 拗音，顺序数组，元素为Element
	this.SoundGroup = []; // 音节数组，题目的乱序数组，元素为TimingElement
	this.level = 150; // 速度水平，时间超过level则该假名需重新听写
	// 初始化,得到五十音图的json数组
	this.init = function(data) {
		// 载入json数据
		this.Data = JSON.parse(data);
		// 五十音，存入Element
		for (var i = 0; i < this.Data.FiftyRome.length; i++) {
			var e = new Element();
			e.Rome = this.Data.FiftyRome[i];
			e.Hirag = this.Data.FiftyHirag[i];
			e.Katak = this.Data.FiftyKatak[i];
			this.FiftyData.push(e);
		}
		// 浊音，存入Element
		for (var i = 0; i < this.Data.VocalRome.length; i++) {
			var e = new Element();
			e.Rome = this.Data.VocalRome[i];
			e.Hirag = this.Data.VocalHirag[i];
			e.Katak = this.Data.VocalKatak[i];
			this.VocalData.push(e);
		}
		// 拗音，存入Element
		for (var i = 0; i < this.Data.DiffRome.length; i++) {
			var e = new Element();
			e.Rome = this.Data.DiffRome[i];
			e.Hirag = this.Data.DiffHirag[i];
			e.Katak = this.Data.DiffKatak[i];
			this.DiffData.push(e);
		}
	}
	// 音节数组重新洗牌
	this.ShuffleSoundGroup = function() {
		var random = parseInt(Math.random() * this.SoundGroup.length);
		return Shuffle(this.SoundGroup);
	}
	// 根据参数命令初始化音节数组
	// 五十音平假名,五十音片假名,浊音平假名,浊音片假名,拗音平假名, 拗音片假名
	this.initSoundGroup=function(command){
		this.SoundGroup=[];// 清空音节数组
		if(!command){
			command=1;// 默认加载五十音平假名
		}
		// 判断需要载入的数组
		var list=[];
		if(command%10){// 五十音平假名
			list.push({array:this.FiftyData,type:0});
		}
		if(Math.floor(command%100/10)){// 五十音片假名
			list.push({array:this.FiftyData,type:1});
		}
		if(Math.floor(command%1000/100)){// 浊音平假名
			list.push({array:this.VocalData,type:0});
		}
		if(Math.floor(command%10000/1000)){// 浊音片假名
			list.push({array:this.VocalData,type:1});
		}
		if(Math.floor(command%100000/10000)){// 拗音平假名
			list.push({array:this.DiffData,type:0});
		}
		if(Math.floor(command%1000000/100000)){// 拗音片假名
			list.push({array:this.DiffData,type:1});
		}
		// 载入数组
		for(var j=0;j<list.length;j++){
			var array=list[j].array;
			if(list[j].type==0){
				for (var i = 0; i < array.length; i++) {
					var e = new TimingElem();
					e.question = array[i].Hirag;
					e.answer = array[i].Rome;
					this.SoundGroup.push(e);
				}
			}else{
				for (var i = 0; i < array.length; i++) {
					var e = new TimingElem();
					e.question = array[i].Katak;
					e.answer = array[i].Rome;
					this.SoundGroup.push(e);
				}
			}
		}
		
// for (var i = 0; i < this.FiftyData.length; i++) {
// var e = new TimingElem();
// e.question = this.FiftyData[i].Hirag;
// e.answer = this.FiftyData[i].Rome;
// this.SoundGroup.push(e);
// e = new TimingElem();
// e.question = this.FiftyData[i].Katak;
// e.answer = this.FiftyData[i].Rome;
// this.SoundGroup.push(e);
// }
	}
	// 开始测试
	this.start = function(command) {
		/**
		 * 初始化五十音机器
		 */
		point = 0;// 指针清零
		this.initSoundGroup(command);// 初始化音节数组
		this.ShuffleSoundGroup();// 重新洗牌
		clock.close();// 关闭计时
		/**
		 * 打开计时器，开始重新计时
		 */
		clock.start();// 开始计时
		this.SoundGroup.length=2;
		return this.SoundGroup[point];
	}
	// 测试下一个假名
	this.next = function(answer) {
		/**
		 * 定义返回值对象
		 */
		var result = {
				isEnd : -1// 表示是否最后一个测试的假名，-1表示未开始新的问答队列，1表示是最后一个，0表示不是最后一个
		};
		/**
		 * 判断是否需要测试下一次假名
		 */
		if(clock.isRunning==0){
			return result;
		}
		/**
		 * 对上一个测试的假名进行收尾工作
		 * 1.关闭计时
		 * 2.统计时间
		 * 3.检查假名回答正误,错则判断要重新问答
		 * 4.检查用时是否合格，错则判断要重新问答
		 * 5.若判断要重新问答，则将问题加入队列末尾
		 * 6.合格的话，检查是否最后一个假名，是则计算平均成绩，然后返回
		 */
		var time = clock.stop();// 关闭上一次计时
		this.SoundGroup[point].time = time;// 将时间计入假名元素中
		var flag=false;// 判断假名是否需要重新问答
		if(""+answer!=""+this.SoundGroup[point].answer){// 检查假名是否正确
			this.SoundGroup[point].isUnqualified=1;//错误
			this.SoundGroup[point].misAnswer=answer;//记录下错误回答
			result.msg= answer+"错误！"+this.SoundGroup[point].question+"应该是："+this.SoundGroup[point].answer;
		}else{	// 检查用时是否及格
			if (time < 100) {
				result.msg = "用时" + time / 100 + ",很快!";
			} else if (time < 150) {
				result.msg = "用时" + time / 100 + ",还可以！";
			} else if (time < 200) {
				result.msg = "用时" + time / 100 + ",有点慢！";
			} else if (time < 300) {
				result.msg = "用时" + time / 100 + ",慢！";
			} else {
				result.msg = "用时" + time / 100 + ",太慢了！";
			}
			if(time<this.level)// 如果用时小于及格要求，不用重新问答
				flag=true;
			else
				this.SoundGroup[point].isUnqualified=2;//超时
		}
		if (!flag){// 有错误或用时不及格，将假名添加到问答队列末尾进行重新问答
			var obj=CloneObject(this.SoundGroup[point]);// 复制错误的假名问答信息
			obj.isUnqualified=0;
			this.SoundGroup.push(obj);
		}else if (point >= this.SoundGroup.length - 1) {// 检查是否最后一个假名
			result.isEnd = 1;
			// 开始计算成绩
			var gradeMsg = this.calculateGradeMsg();
			result.gradeMsg=gradeMsg;
// var sum = 0;
// for (var i = 0; i < this.SoundGroup.length; i++) {
// sum += this.SoundGroup[i].time;
// }
// var avg = sum / this.SoundGroup.length/100;
// avg=avg.toFixed(2);
// result.msg = "结束！<br/>平均用时：" + avg + "<br/>不及格假名数："
			return result;
		}
		/**
		 * 对下一个假名的操作
		 * 1.移动指针到下一个假名
		 * 2.重新开始计时
		 * 3.将下一次问答的内容加入返回值对象
		 * 4.将不是最后一个假名的标志量加入返回值对象
		 */
		point++;
		clock.start();
		result.e = this.SoundGroup[point];
		result.isEnd=0;
		
		return result;
	}
	// 计算平均耗时，所有正确回答的用时/正确回答的数量
	/**
	 * 得到成绩单，成绩单包含
	 * 1.平均耗时
	 * 2.错误假名数量
	 * 3.超时假名数量
	 * 4.全部问答信息列表，表格字符串
	 */
	this.calculateGradeMsg=function(){
		/**
		 * 计算平均耗时和错误数量
		 */
		var sum = 0;// 总耗时
		var misNum=0;// 错误数量
		var overNum=0;//超时数量
		for (var i = 0; i < this.SoundGroup.length; i++) {
			var isUnqualified=this.SoundGroup[i].isUnqualified;
			if(isUnqualified==0){// 如果正确且不超时，则统计其时间
				sum += this.SoundGroup[i].time;
			}else if(isUnqualified==1){//错误，则错误数量加一
				misNum++;
			}else if(isUnqualified==2){// 超时，则超时数量加一，且统计其时间
				overNum++;
				sum += this.SoundGroup[i].time;
			}
		}
		var avg = sum / (this.SoundGroup.length-misNum)/100;// 得到平均回答秒数,错误回答不计入内
		avg=avg.toFixed(2);// 保留两位小数
		/**
		 * 生成问答信息列表
		 */
		// class='table table-striped table-bordered'
		var gradesTable="<table><tr><td>问</td><td>答</td><td>用时</td><td>正误</td></tr>";
		for(var i=0;i<this.SoundGroup.length;i++){
			var e=this.SoundGroup[i];
			gradesTable+="<tr><td>"+e.question+"</td><td>"+e.answer+"</td><td>"+e.time/100+"</td>";
			if(e.isUnqualified==1)
				gradesTable+="<td>错误,写成了："+e.misAnswer+"</td></tr>";
			else if(e.isUnqualified==2){
				gradesTable+="<td>超时</td></tr>";
			}else
				gradesTable+="<td></td></tr>";
		}
		gradesTable+="</table>";
		//生成成绩单，并返回
		var gradeMsg={
				avg:avg,
				misNum:misNum,
				overNum:overNum,
				gradesTable:gradesTable
		};
		return gradeMsg;
// result.msg = "结束！<br/>平均用时：" + avg + "<br/>不及格假名数："
	}
}