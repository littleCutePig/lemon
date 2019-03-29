require(['config'], function() {
    require(['mui', 'picker', 'poppicker'], function(mui, picker, poppicker) {
        //首页的业务逻辑
        mui.init({
            pullRefresh: {
                container: "#pullrefresh", //待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
                up: {
                    contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
                    contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
                    callback: getBill //必选，通过ajax从服务器获取新数据；函数不能加（）
                }
            }
        });

        //全局变量
        var uId = localStorage.getItem("uId"),
            page = 0, //页数
            pageSize = 5, //条数
            getYear = new Date().getFullYear(), //系统年份
            getMonth = new Date().getMonth() + 1, //系统月份
            timer = getYear + "-" + (getMonth < 10 ? "0" + getMonth : getMonth),
            picker = new mui.PopPicker(), //初始化popPicker组件(弹出选择器)
            dtPicker = new mui.DtPicker({
                type: "month" //指定视图为年-月
            }), //初始化时间选择器
            pickerValue = '', //显示的年/月
            pickerTime = ''

        function init() {
            //funUid(); //判断用户是否已经登录
            login(); //用户登录
            removeList(); //removeList()
            tab(); //tab切换
            month(); //年月选择框
            nowTime(); //取到当前时间
            day(); //年月选择框
            getattr();
            // sech()
        }

        function sech() {
            document.querySelector('.inputText').addEventListener('input', function() {
                console.log(this.value)
                    // 				mui.ajax('',{
                    // 					data:{
                    // 						
                    // 					},
                    // 					dataType:'json',//服务器返回json格式数据
                    // 					type:'post',//HTTP请求类型
                    // 					timeout:10000,//超时时间设置为10秒；
                    // 					success:function(data){
                    // 						
                    // 					},
                    // 					error:function(xhr,type,errorThrown){
                    // 						
                    // 					}
                    // 				});
            })
        }
        //点击年/月
        function month() {
            document.querySelector('.month').addEventListener('tap', function() {
                var _this = this;
                picker.setData([{
                        value: 'year',
                        text: '年'
                    },
                    {
                        value: 'month',
                        text: '月'
                    }
                ]);
                picker.show(function(selectItems) {
                    pickerValue = selectItems[0].text; //取出选择的年月
                    _this.innerHTML = pickerValue; //给点击的年月赋值为选择的年月
                    if (pickerValue == '月') {
                        document.querySelector('.date').innerHTML = timer;
                        getattr(pickerValue);
                    } else {
                        //年

                        document.querySelector('.date').innerHTML = getYear;
                        getattr(pickerValue);
                    }
                })
            })
        }
        //根据选择的年月，变换显示视图
        function getattr(ym) {
            //日期，title
            var yearTitle = document.querySelector("[data-id=title-y]");
            var monthMonth = document.querySelector("[data-id=title-m]");
            //日期，dom元素
            var yearPicker = document.querySelector("[data-id=picker-y]");
            var monthPicker = document.querySelector("[data-id=picker-m]");

            if (ym == '年') {
                monthMonth.style.display = 'none';
                monthPicker.style.display = 'none';
                yearTitle.style.width = "100%";
                yearPicker.style.width = "100%";
            } else {
                monthMonth.style.display = 'inline-block';
                monthPicker.style.display = 'inline-block';
                yearTitle.style.width = "50%";
                yearPicker.style.width = "50%";
            }

        }
        //点击年-月，日期
        function day() {
            document.querySelector('.date').addEventListener('tap', function() {
                dtPicker.show(function(selectItems) {
                    pickerTime = document.querySelector('.date');
                    pickerTime.innerHTML = selectItems.y.value + "-" + selectItems.m.value;
                    console.log(pickerTime.innerHTML);
                    page = 0;
                    document.querySelector(".list").innerHTML = '';
                    getBill(pickerTime.innerHTML);
                })
            })

        }

        //当前时间
        function nowTime() {
            document.querySelector('.date').innerHTML = timer;
        }
        //点击登录
        // 		document.querySelector('.btn-ok').addEventListener("tap", function() {
        // 			login() //登录
        // 		})

        function getBill(pickerTime) {
            //获取账单数据
            page++;
            setTimeout(function() {
                mui.ajax('/api/col_bill', {
                    data: {
                        uid: uId,
                        timer: document.querySelector('.date').innerHTML,
                        page: page,
                        pageSize: pageSize
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 10000, //超时时间设置为10秒；
                    success: function(data) {
                        if (data.data.length === 0) {
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
                            document.querySelector(".tils").style.display = 'block';
                        } else {
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); //参数为false代表没有更多数据了。
                            document.querySelector(".tils").style.display = 'none';
                        }
                        var str = '';
                        data.data.forEach(function(item) {
                            str +=
                                `
							<li class="mui-table-view-cell p-cell">
								<div class="mui-slider-right mui-disabled">
									<a class="mui-btn mui-btn-red" data-id="${item._id}">删除</a>
								</div>
								<div class="mui-slider-handle bill-item">
									<dl>
										<dt>
											<span class="${item.icon}"></span>
										</dt>
										<dd>
											<p>${item.intro}</p>
											<p>${item.timer}</p>
										</dd>
									</dl>
									<span class="${item.type === "支出" ? "red" : "green"}">${item.money}</span>
								</div>
							</li>`
                        })
                        document.querySelector(".list").innerHTML += str;
                    }
                });
            }, 1000)
        }
        //登录
        function login() {
            var inpName = document.querySelector('.inp-name').value;
            var inpPwd = document.querySelector('.inp-pwd').value;
            mui.ajax('/api/user', {
                data: {
                    name: "jack",
                    pwd: "123"
                },
                dataType: 'json', //服务器返回json格式数据
                type: 'post', //HTTP请求类型
                timeout: 10000, //超时时间设置为10秒;
                success: function(data) {

                    var uid = data.data[0]._id;
                    //把用户uid存在缓存中
                    localStorage.setItem("uId", uid);
                    // 					document.querySelector('.login').style.display = "none";
                    // 					document.querySelector('.mui-slide-in').style.display = "block";
                    getBill(timer); //获取用户的账单信息
                }
            });
        }

        //判断用户是否已经登录
        // 		function funUid() {
        // 			if (!uId) {
        // 				//未登录
        // 				document.querySelector('.login').style.display = "block";
        // 				document.querySelector('.mui-slide-in').style.display = "none";
        // 			} else {
        // 				//用户已经登录
        // 				document.querySelector('.login').style.display = "none";
        // 				document.querySelector('.mui-slide-in').style.display = "block";
        // 				getBill() //获取账单
        // 			}
        // 		}


        function deleteBill(id) {
            //删除账单
            // var id = this.getAttribute("data-id");
            mui.ajax('/api/remove_bill', {
                data: {
                    id: id
                },
                dataType: 'json', //服务器返回json格式数据
                type: 'post', //HTTP请求类型
                timeout: 10000, //超时时间设置为10秒；
                success: function(data) {
                    mui.alert(data.msg);
                }
            });
        }
        //左滑删除效果
        function removeList() {
            //拖拽后显示操作图标，点击操作图标删除元素；
            mui('.list').on('tap', '.mui-btn', function(event) {
                var elem = this;
                var li = elem.parentNode.parentNode;
                mui.confirm('确认删除该条记录？', 'Hello MUI', function(e) {
                    li.parentNode.removeChild(li);
                    var id = elem.getAttribute("data-id"); //当前点击取到id
                    //删除账单接口
                    deleteBill(id); //删除账单
                });
            });
        }
        //退出登录
        document.querySelector('.exit').addEventListener("tap", function() {
            //退出
            mui.alert('确定退出', function() {
                localStorage.removeItem("uId");
                //判断用户是否已经登录
                funUid();
            })
        })

        function tab() {
            //tab切换
            mui('.tab').on('tap', '.tab li', function() {
                var li = document.querySelectorAll(".tab li");
                for (var i = 0; i < li.length; i++) {
                    li[i].classList.remove('active');
                }
                this.classList.add("active");
                var tabName = this.innerHTML;
                if (tabName == "图表") {
                    document.querySelector(".p-list").style.display = "none";
                    document.querySelector(".p-eachs").style.display = "block";
                } else {
                    document.querySelector(".p-list").style.display = "block";
                    document.querySelector(".p-eachs").style.display = "none";
                }
            })
        }
        document.querySelector('.addBill').addEventListener("tap", function() {
            window.location.href = './src/page/classify.html'
        })
        init()
    })
})