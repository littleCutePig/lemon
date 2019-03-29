var gulp = require("gulp");
var webserver = require("gulp-webserver");
var sass = require("gulp-sass");

gulp.task("webserver",function(){
	return gulp.src('./')
	.pipe(webserver({
		open:true,
		port:8080,
		livereload:true,
		proxies:[
			{source:"/api/getIcon",target:"http://localhost:3000/api/getIcon"},//获取所有icon
			{source:"/api/user",target:"http://localhost:3000/api/user"}, //登录接口
			{source:"/api/col_bill",target:"http://localhost:3000/api/col_bill"}, // 获取用户账单信息
			{source:"/api/remove_bill",target:"http://localhost:3000/api/remove_bill"},//删除账单
			{source:"/api/getIcon",target:"http://localhost:3000/api/getIcon"},
			{source:"/api/getClassify",target:"http://localhost:3000/api/getClassify"},//查询分类接口
			{source:"/api/addBill",target:"http://localhost:3000/api/addBill"},//添加账单
		]
	}))
})

gulp.task('sass',function(){
	return gulp.src('./src/css/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('./src/css/'))
})

gulp.task('watch',function(){
	return gulp.watch('./src/css/*.scss',gulp.series('sass'));
})

//开发环境
gulp.task('dev',gulp.series('sass',"webserver","watch"))

//线上环境

