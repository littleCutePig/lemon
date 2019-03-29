require(['config'], function() {
	require(['mui'], function(mui) {

		//全局变量
		var uId = localStorage.getItem('uId');
		var tabDefault = document.querySelector(".tab-list .active").innerHTML;
		var windowYear = new Date().getFullYear(); //系统年
		var windowMonth = new Date().getMonth() + 1; //系统月
		var windowDay = new Date().getDate(); //系统日
		//系统的年月日
		var timer = windowYear + '-' + (windowMonth > 10 ? windowMonth : '0' + windowMonth) + '-' + (windowDay > 10 ?
			windowDay : '0' + windowDay);
		var icon = '';
		var intro = '';
		var type = '';
		var moneyText = document.querySelector('.money'); //金额显示
		console.log(windowDay)
		//分类图标的业务逻辑
		function init() {
			getClass(tabDefault);
			tab();
			keyboard();
			getType();
			addBill();
			document.querySelector('.choose-time').innerHTML = timer;
		}

		function keyboard() {


			var keyText = document.querySelectorAll('.keywords li span'); //取到按钮集合

			for (var i = 0; i < keyText.length; i++) {
				keyText[i].onclick = function() {

					if (this.innerHTML == "X") {
						if (moneyText.innerHTML == '0.00') {
							moneyText.innerHTML = moneyText.innerHTML; //显示当前显示金额
						} else {
							moneyText.innerHTML = moneyText.innerHTML.length == 1 ? "0.00" : moneyText.innerHTML.substr(0, moneyText.innerHTML
								.length - 1);
						}
					} else if (moneyText.innerHTML == '0.00') {
						moneyText.innerHTML = this.innerHTML; //点击显示金额
					} else if (moneyText.innerHTML.indexOf('.') != -1 && this.innerHTML == '.') {
						moneyText.innerHTML = moneyText.innerHTML; //显示当前显示金额
					} else if (moneyText.innerHTML.indexOf('.') != -1 && moneyText.innerHTML.split('.')[1].length == 2) {
						moneyText.innerHTML = moneyText.innerHTML; //显示当前显示金额
					} else {
						moneyText.innerHTML += this.innerHTML; //点击显示金额
					}

				}
			}


		}


		function tab() {
			mui('.tab-list').on('tap', '.tab-list span', function() {
				var listTab = document.querySelectorAll('.tab-list span');
				for (var i = 0; i < listTab.length; i++) {
					listTab[i].classList.remove('active');
				}
				this.classList.add('active');
				getClass(this.innerHTML);
			})
		}

		function getClass(tabText) {
			console.log(uId);
			mui.ajax('/api/getClassify', {
				data: {
					uid: uId,
					type: tabText
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					var str = '';
					data.data.forEach(function(item) {
						str +=
							`
							<div class="type-icon">
								<dl>
									<dt>
										<span class="${item.icon}"></span>
									</dt>  
									<dd>${item.intro}</dd>
								</dl>
							</div>
						`
					})
					document.querySelector('.list').innerHTML = str;
					clickIcon();
				}
			});
		}

		function clickIcon() {
			var dlAction = document.querySelectorAll('.list dl');
			mui('.list').on('tap', ".list dl", function() {
				for (var i = 0; i < dlAction.length; i++) {
					dlAction[i].classList.remove("active");
				}
				this.classList.add("active");
				icon = this.children[0].children[0].className;
				intro = this.children[1].innerHTML;
			})

		}

		//
		function getType() {
			type = document.querySelector(".tab-list .active").innerHTML;
		}

		function addBill() {
			document.querySelector('.ok').addEventListener('tap', function() {
				getType(); //获取当前收支类型
				console.log(uId + "-" + moneyText.innerHTML + "-" + type + "-" + icon + "-" + intro + "-" + timer)
				if (!uId || !moneyText.innerHTML || !type || !icon || !intro || !timer ) {
					mui.alert('参数为空！');
				} else {
					mui.ajax('/api/addBill', {
						data: {
							uid: uId,
							type: type,
							money: moneyText.innerHTML,
							timer:timer,
							icon: icon,
							intro: intro
						},
						dataType: 'json', //服务器返回json格式数据
						type: 'post', //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						success: function(data) {
							mui.alert(data.msg,function(){
								window.location.href = '../../index.html';
							})
							
						},
						error: function(xhr, type, errorThrown) {

						}
					});
				}
				// 			
			})


		}
		init();

	})
})
