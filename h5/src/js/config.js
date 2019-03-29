require.config({
	paths:{
		"mui":"libs/mui.min" ,//以当前config文件去找对应的js文件
		"picker":"libs/mui.picker.min", //
		"poppicker":"libs/mui.poppicker" //
	},
	shim: {
        "picker": { //picker在mui执行完成之后再执行
            deps: ['mui'],  //deps数组，表明该模块的依赖性
        },
		 "poppicker": { //picker在mui执行完成之后再执行
		    deps: ['mui'], //deps数组，表明该模块的依赖性
		}
    }
})