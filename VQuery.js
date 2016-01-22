function myAddEvent(obj, sEv, fn)
{
	if(obj.attachEvent)//ie独有
	{
		obj.attachEvent('on'+sEv, function (){
			if(false==fn.call(obj))
			{
				event.cancelBubble=true;//去除冒泡，
				return false;//撤销默认事件
			}
		});
	}
	else
	{
		obj.addEventListener(sEv, function (ev){//ff,chrome  ev为ff兼容
			if(false==fn.call(obj))
			{
				ev.cancelBubble=true;
				ev.preventDefault();
			}
		}, false);
	}
}

function getByClass(oParent, sClass)//选择父级下的带class的子集元素
{
	var aEle=oParent.getElementsByTagName('*');
	var aResult=[];
	var i=0;
	
	for(i=0;i<aEle.length;i++)
	{
		if(aEle[i].className==sClass)
		{
			aResult.push(aEle[i]);
		}
	}
	
	return aResult;
}

function getStyle(obj, attr)//获取样式，obj.style.attr只能获取行间样式
{
	if(obj.currentStyle)
	{
		return obj.currentStyle[attr];
	}
	else
	{
		return getComputedStyle(obj, false)[attr];
	}
}

function VQuery(vArg)
{
	//用来保存选中的元素
	this.elements=[];
	
	switch(typeof vArg)
	{
		case 'function'://$(function(){})
			//window.onload=vArg;
			myAddEvent(window, 'load', vArg);//用绑定事件的方法可以写多个$(function(){})
			break;
		case 'string':
			switch(vArg.charAt(0))
			{
				case '#':	//ID
					var obj=document.getElementById(vArg.substring(1));
					
					this.elements.push(obj);
					break;
				case '.':	//class
					this.elements=getByClass(document, vArg.substring(1));
					break;
				default:	//tagName
					this.elements=document.getElementsByTagName(vArg);
			}
			break;
		case 'object'://$(this)
			this.elements.push(vArg);
	}
}

VQuery.prototype.click=function (fn)
{
	var i=0;
	
	for(i=0;i<this.elements.length;i++)
	{
		myAddEvent(this.elements[i], 'click', fn);
	}
	
	return this;//可以执行链式操作
};

VQuery.prototype.show=function ()
{
	var i=0;
	
	for(i=0;i<this.elements.length;i++)
	{
		this.elements[i].style.display='block';
	}
	
	return this;
};

VQuery.prototype.hide=function ()
{
	var i=0;
	
	for(i=0;i<this.elements.length;i++)
	{
		this.elements[i].style.display='none';
	}
	
	return this;
};

VQuery.prototype.hover=function (fnOver, fnOut)
{
	var i=0;
	
	for(i=0;i<this.elements.length;i++)
	{
		myAddEvent(this.elements[i], 'mouseover', fnOver);
		myAddEvent(this.elements[i], 'mouseout', fnOut);
	}
	
	return this;
};

VQuery.prototype.css=function (attr, value)
{
	if(arguments.length==2)	//设置样式
	{
		var i=0;
		
		for(i=0;i<this.elements.length;i++)
		{
			this.elements[i].style[attr]=value;
		}
	}
	else	//获取样式
	{
		if(typeof attr=='string')
		{
		//return this.elements[0].style[attr];
			return getStyle(this.elements[0], attr);
		}
		else  //json格式
		{
			for(i=0;i<this.elements.length;i++)
			{
				var k='';
				
				for(k in attr)
				{
					this.elements[i].style[k]=attr[k];
				}
			}
		}
	}
	
	return this;
};

VQuery.prototype.attr=function (attr, value)
{
	if(arguments.length==2)//设置属性
	{
		var i=0;
		
		for(i=0;i<this.elements.length;i++)
		{
			this.elements[i][attr]=value;
		}
	}
	else   //获取属性
	{
		return this.elements[0][attr];
	}
	
	return this;
};

VQuery.prototype.toggle=function ()
{
	var i=0;
	var _arguments=arguments;//注意
	
	for(i=0;i<this.elements.length;i++)
	{
		addToggle(this.elements[i]);
	}
	
	function addToggle(obj)
	{
		var count=0;
		myAddEvent(obj, 'click', function (){
			_arguments[count++%_arguments.length].call(obj);//执行相对应的函数
		});
	}
	
	return this;
};

VQuery.prototype.eq=function (n)
{
	return $(this.elements[n]);
};

function appendArr(arr1, arr2)//把集合转为数组
{
	var i=0;
	
	for(i=0;i<arr2.length;i++)
	{
		arr1.push(arr2[i]);
	}
}

VQuery.prototype.find=function (str)
{
	var i=0;
	var aResult=[];
	
	for(i=0;i<this.elements.length;i++)
	{
		switch(str.charAt(0))
		{
			case '.':	//class
				var aEle=getByClass(this.elements[i], str.substring(1));
				
				aResult=aResult.concat(aEle);//把元素添加到数组里去
				break;
			default:	//标签
				var aEle=this.elements[i].getElementsByTagName(str);
				
				//aResult=aResult.concat(aEle);
				appendArr(aResult, aEle);
		}
	}
	
	var newVquery=$();
	
	newVquery.elements=aResult;把数组变为一个对象的属性，拥有方法，执行链式操作
	
	return newVquery;
};

function getIndex(obj)
{
	var aBrother=obj.parentNode.children;
	var i=0;
	
	for(i=0;i<aBrother.length;i++)
	{
		if(aBrother[i]==obj)
		{
			return i;
		}
	}
}

VQuery.prototype.index=function ()
{
	return getIndex(this.elements[0]);
};

VQuery.prototype.bind=function (sEv, fn)
{
	var i=0;
	
	for(i=0;i<this.elements.length;i++)
	{
		myAddEvent(this.elements[i], sEv, fn);
	}
};

VQuery.prototype.extend=function (name, fn)
{
	VQuery.prototype[name]=fn;//扩展
};

function $(vArg)
{
	return new VQuery(vArg);
}






