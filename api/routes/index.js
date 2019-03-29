var express = require('express');
var router = express.Router();
var Mongo = require('Mongodb-curd');

var db = "1611A";
var col = "lemon_user"; //用户表
var col_bill = "bill_list"; //账单表
var col_classify = "classify"; //分类图标表
var col_iconlist = "icon_list"; //分类图标表

//用户接口
router.post('/api/user', function (req, res, next) {
  var name = req.body.name,
      pwd = req.body.pwd;
  if (!name || !pwd) {
    res.json({ code: 0, msg: '用户名或者密码为空！'})
  } else {
    Mongo.find(db, col, { name: name }, function (result) {
      //console.log(result)//注意,此时是数组类型
      if (result.length > 0) {
        res.json({ code: 3, msg: '改用户已经存在！',data:result})
      } else {
        find(); //添加
      }
    })
  }
  //添加函数
  function find() {
    Mongo.insert(db, col, { name: name, pwd: pwd }, function (result) {
      console.log(result)
      if (result) {
        res.json({ code: 1, msg: '添加成功'})
      } else {
        res.json({ code: 0, msg: '添加失败'})
      }
    })
  }
});


//获取账单接口（可根据时间、收支类型查询，支持分页）注意：分页参数必须传入
router.post('/api/col_bill', function (req, res, next) {
  var uid = req.body.uid,
      timer = new RegExp(req.body.timer),
      page = req.body.page,
      pageSize = req.body.pageSize;
      console.log(req.body)
      if(!uid || !page || !pageSize || !timer){
        res.json({code:0,msg:'缺少参数！'})
      }else{
        Mongo.find(db,col_bill,{"uid":uid,timer:timer},function(result){
          if(!result){
            res.json({code:0,msg:"查找失败！"})
          }else{
            res.json({code:1,data:result})
          }
        },{
          skip:(page-1) * pageSize,
          limit:pageSize,
          sort:{"_id":-1}
        })
      }
});


//删除账单
router.post('/api/remove_bill', function (req, res, next) {
  var id = req.body.id; //_id
  console.log(id);
  Mongo.remove(db,col_bill,{"_id":id},function(result){
    if(!result){
      res.json({code:0,msg:"删除失败！"})
    }else{
      res.json({code:1,msg:"删除成功！"})
    }
  })
});

//添加账单
router.post('/api/addBill', function (req, res, next) {
  var obj = req.body;
  Mongo.insert(db,col_bill,obj,function(result){
    if(!result){
      res.json({code:0,msg:"添加失败！"})
    }else{
      res.json({code:1,msg:"添加成功！"})
    }
  })
});


//添加分类图标
router.post('/api/addClassify', function (req, res, next) {
  var obj = req.body;
  Mongo.insert(db,col_classify,obj,function(result){
    if(!result){
      res.json({code:0,msg:"添加失败！"})
    }else{
      res.json({code:1,msg:"添加成功！"})
    }
  })
});

//查询分类图标
router.post('/api/getClassify', function (req, res, next) {
  var uid = req.body.uid;
  var type = req.body.type;
  Mongo.find(db,col_classify,{uid:uid,type:type},function(result){
    if(!result){
      res.json({code:0,msg:"查询失败！"})
    }else{
      res.json({code:1,data:result})
    }
  })
});

//查询所有图标
router.get('/api/getIcon', function (req, res, next) {
  Mongo.find(db,col_iconlist,function(result){
    if(!result){
      res.json({code:0,msg:"查询失败！"})
    }else{
      res.json({code:1,data:result})
    }
  })
});










module.exports = router;
