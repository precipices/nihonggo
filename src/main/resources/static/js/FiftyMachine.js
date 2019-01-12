/**
 * 处理五十音图的类集
 */
//包含单个对应的罗马音、平片假名的一个元素
var Element=function(){
	this.Rome = "a";
	this.Hirag = "あ";
	this.Katak = "ア";
}
//五十音处理机
var FiftyMachine = function() {
	this.Rome = 0;
	this.Hirag = 0;
	this.Katak = 0;
	this.Data = new Object();
	this.ArrayData=[];
	this.ShuffleArray=[];
	//初始化,得到五十音图的json数组
	this.init=function(data){
		//载入json数据
		this.Data=JSON.parse(data)
		//存入Element
		for(var i=0;i<this.Data.Rome.length;i++){
			var e=new Element();
			e.Rome=this.Data.Rome[i];
			e.Hirag=this.Data.Hirag[i];
			e.Katak=this.Data.Katak[i];
			this.ArrayData.push(e);
		}
		//复制到洗牌数组
		this.ShuffleArray=this.ArrayData.slice(0,this.ArrayData.length);
	}
	//得到洗牌组数并洗一次牌
	this.getShuffleArray = function() {
		var random = parseInt(Math.random() * this.Data.Hirag.length);
		return Shuffle(this.ShuffleArray);
	}
}