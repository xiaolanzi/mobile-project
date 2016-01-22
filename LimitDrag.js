function LimitDrag(id)//限制在可视区内运动，继承了Drag_demo.js
{
	Drag.call(this, id);
}

//LimitDrag.prototype=Drag.prototype;

for(var i in Drag.prototype)
{
	LimitDrag.prototype[i]=Drag.prototype[i];//对象为引用传递，所以这里采用赋值的方法值不会同步影响
}

LimitDrag.prototype.fnMove=function (ev)
{
	var oEvent=ev||event;
	var l=oEvent.clientX-this.disX;
	var t=oEvent.clientY-this.disY;
	
	if(l<0)
	{
		l=0;
	}
	else if(l>document.documentElement.clientWidth-this.oDiv.offsetWidth)//屏幕的宽度-div的宽度
	{
		l=document.documentElement.clientWidth-this.oDiv.offsetWidth;
	}
	
	if(t<0)
	{
		t=0;
	}
	else if(t>document.documentElement.clientHeight-this.oDiv.offsetHeight)
	{
		t=document.documentElement.clientHeight-this.oDiv.offsetHeight;
	}
	
	this.oDiv.style.left=l+'px';
	this.oDiv.style.top=t+'px';
};
