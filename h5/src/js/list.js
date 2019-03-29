require(['config'], function() {
	require(['mui', 'picker', 'poppicker'], function(mui, picker, poppicker) {

		//全局
		var page = 0,
			pageSize = 5,
			newData = [],
			picker = new mui.PopPicker(),
			dtPicker = new mui.DtPicker({
				type:"month"
			}),
			windowYear = new Date().getFullYear(), //获取年
			windowTimer = windowYear + "-" + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date()
				.getMonth() + 1);


		//上拉加载
		//pullRefresh 上拉插件
		mui.init({
			pullRefresh: {
				container: '#pullrefresh',
				up: {
					height: 500, //可选.默认50.触发上拉加载拖动距离
					contentrefresh: "努力加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
					contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
					callback: getPageBill //函数不加（）
				}
			}
		});

		function init() {
			login(); //用户登录
			// getPageBill(); //第一次加载
			remove(); //删除账单效果
			onClick(); //点击年月显示弹出框
			windowTime();
			onClickMonth();

		}
		//显示当前时间
		function windowTime(year) {
			console.log("年" + year);
			document.querySelector('.month').innerHTML = windowTimer;
			if (year == 'year') {
				document.querySelector('.month').innerHTML = windowYear;
			} else {
				document.querySelector('.month').innerHTML = windowTimer;
			}

		}
		//点击年或月
		function onClick() {
			document.querySelector('.yearText').addEventListener('tap', function() {
				picker.setData([{
					value: 'year',
					text: '年'
				}, {
					value: 'month',
					text: '月'
				}]);
				picker.show(function(selectItems) {
					console.log(selectItems[0].text); //智子
					console.log(selectItems[0].value); //zz 
					document.querySelector('.yearText').innerHTML = selectItems[0].text;
					if (selectItems[0].value == 'year') {
						windowTime(selectItems[0].value)
					} else {
						windowTime(selectItems[0].value)
					}

				})
			})
		}
		//点击日期
		function onClickMonth() {
			document.querySelector('.month').addEventListener('tap', function() {
				dtPicker.show(function(selectItems) {
					console.log(selectItems.y); //{text: "2016",value: 2016} 
					console.log(selectItems.m); //{text: "05",value: "05"} 
				})
			})

		}

		function login() {
			mui.ajax('/api/user', {
				data: {
					name: 'jack',
					pwd: '123'
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					//获取到用户ID，赋值给账单接口
					getPageBill(data.data[0]._id);
					//显示到页面上，当前用户名
					document.querySelector('.titleName').innerHTML = data.data[0].name;

				}
			});
		}


		//请求数据（上拉加载）
		function getPageBill(uid) {
			page++;
			setTimeout(function() {
				mui.ajax('/api/col_bill', {
					data: {
						uid: uid,
						timer: "2019-02",
						page: page, //页数
						pageSize: pageSize
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					success: function(data) {
						if (data.data.length === 0) {
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为false有数据。
						} else {
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); //参数为false有数据。
						}
						newData = [...newData, ...data.data];

						var str = "";
						newData.forEach(function(item) {
							str +=
								`<li class="mui-table-view-cell">
						<div class="mui-slider-right mui-disabled">
							<a class="mui-btn mui-btn-red" data-id="${item._id}">删除</a>
						</div>
						<div class="mui-slider-handle">
						<span class="${item.icon}"></span>
						<span class="${item.type == '收入' ? 'green' : 'red'}">${item.money}</span>
							${item.type}
							${item.timer}
							
						</div>
					</li>`
						})
						document.querySelector('.list').innerHTML = str;
					},
					error: function(xhr, type, errorThrown) {

					}
				});

			}, 1500);
		}

		//滑动删除效果
		function remove() {
			mui('.list').on('tap', '.mui-btn', function(event) {
				var elem = this;
				var li = elem.parentNode.parentNode;
				mui.confirm('确认删除该条记录？', 'Hello MUI', btnArray, function(e) {
					if (e.index == 0) {
						li.parentNode.removeChild(li);
						var removeID = elem.getAttribute('data-id');

						//删除账单 接口
						removeBill(removeID);
					} else {
						setTimeout(function() {
							mui.swipeoutClose(li);
						}, 0);
					}
				});
			});
			var btnArray = ['确认', '取消'];
		}
		//删除账单
		function removeBill(removeID) {
			mui.ajax('/api/remove_bill', {
				data: {
					id: removeID
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					mui.alert(data.msg);
				}
			});
		}

		init() //执行开始函数
	})
})
