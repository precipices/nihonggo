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
}
// 五十音处理机
var FiftyMachine = function() {
	var clock = new Clock(); // 计时器
	var point = 0; // ShuffleArray的指针
	var failedNum = 0; // 不及格的假名的数量
	this.Data = new Object(); // 载入的五十音json数据
	this.ArrayData = []; // 五十音顺序数组，元素为Element
	this.ShuffleArray = []; // 五十音乱序数组，元素为TimingElement
	this.level = 150; // 速度水平，时间超过level则该假名需重新听写
	// 初始化,得到五十音图的json数组
	this.init = function(data) {
		// 载入json数据
		this.Data = JSON.parse(data)
		// 存入Element
		for (var i = 0; i < this.Data.Rome.length; i++) {
			var e = new Element();
			e.Rome = this.Data.Rome[i];
			e.Hirag = this.Data.Hirag[i];
			e.Katak = this.Data.Katak[i];
			this.ArrayData.push(e);
		}
	}
	// 得到洗牌数组并洗一次牌
	this.getShuffleArray = function() {
		var random = parseInt(Math.random() * this.Data.Hirag.length);
		return Shuffle(this.ShuffleArray);
	}
	this.start = function() {
		point = 0;// 指针清零
		failedNum = 0;// 不及格数量清零
		// 初始化洗牌数组
		for (var i = 0; i < this.ArrayData.length; i++) {
			var e = new TimingElem();
			e.question = this.ArrayData[i].Hirag;
			e.answer = this.ArrayData[i].Rome;
			this.ShuffleArray.push(e);
			e = new TimingElem();
			e.question = this.ArrayData[i].Katak;
			e.answer = this.ArrayData[i].Rome;
			this.ShuffleArray.push(e);
		}
		this.getShuffleArray();// 重新洗牌
		clock.start();// 开始计时
		return this.ShuffleArray[point];
	}
	this.next = function(answer) {
		var time = clock.stop();// 关闭上一次计时
		alert(time);
		this.ShuffleArray[point].time = time;// 将时间计入假名元素中
		var result = {
			isEnd : 0
		};// 返回值
		var flag=false;
		if(""+answer!=""+this.ShuffleArray[point].answer){// 检查假名是否正确
			result.msg= "错误！"+this.ShuffleArray[point].question+"应该是："+this.ShuffleArray[point].answer;
		}else if (point >= this.ShuffleArray.length - 1) {// 检查是否最后一个假名
			result.isEnd = 1;
			// 开始计算平均耗时
			var sum = 0;
			for (var i = 0; i < this.ShuffleArray.length; i++) {
				sum += ShuffleArray[i].time;
			}
			var avg = sum / ShuffleArray.length;
			result.msg = "结束！<br/>平均用时：" + result.avg + "<br/>不及格假名数："
					+ failedNum;
			return result;
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
			if(time<this.level)
				flag=true;
		}
		point++;// 指针后移
		if (!flag){// 有错误或用时不及格，将假名后移
			failedNum++;
			this.ShuffleArray.push(this.ShuffleArray[point]);
		}
		// 重新开始计时
		clock.start();
		result.e = this.ShuffleArray[point];
		return result;
	}
}