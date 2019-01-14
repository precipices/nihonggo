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
}
// 五十音处理机
var FiftyMachine = function() {
	var clock = new Clock(); // 计时器
	var point = 0; // SoundGroup的指针
	var failedNum = 0; // 不及格的假名的数量
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
		point = 0;// 指针清零
		failedNum = 0;// 不及格数量清零
		this.initSoundGroup(command);// 初始化音节数组
		this.ShuffleSoundGroup();// 重新洗牌
		clock.close();// 关闭计时
		clock.start();// 开始计时
		return this.SoundGroup[point];
	}
	// 测试下一个假名
	this.next = function(answer) {
		var result = {
				isEnd : -1
		};// 返回值
		if(clock.isRunning==0){
			return result;
		}
		var time = clock.stop();// 关闭上一次计时
		this.SoundGroup[point].time = time;// 将时间计入假名元素中
		var flag=false;
		if(""+answer!=""+this.SoundGroup[point].answer){// 检查假名是否正确
			result.msg= "错误！"+this.SoundGroup[point].question+"应该是："+this.SoundGroup[point].answer;
		}else if (point >= this.SoundGroup.length - 1) {// 检查是否最后一个假名
			result.isEnd = 1;
			// 开始计算平均耗时
			var sum = 0;
			for (var i = 0; i < this.SoundGroup.length; i++) {
				sum += this.SoundGroup[i].time;
			}
			var avg = sum / this.SoundGroup.length/100;
			avg=avg.toFixed(2);
			result.msg = "结束！<br/>平均用时：" + avg + "<br/>不及格假名数："
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
			this.SoundGroup.push(this.SoundGroup[point]);
		}
		// 重新开始计时
		clock.start();
		result.e = this.SoundGroup[point];
		result.isEnd=0;
		return result;
	}
}