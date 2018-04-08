var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/lessonList', function(req, res) {
    var db = req.db;
    var collection = db.get('EasyList');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});
router.post('/addlesson', function(req,res){
    var db=req.db;
    var collection=db.get('EasyList');
    collection.insert(req.body, function (err,result) {
        res.send(
            (err==null) ? {msg: ''} :{msg: err}
        );
        
    });
});

router.delete('/deletelesson/:id',function(req,res){
    var db=req.db;
    var collection=db.get('EasyList');
    var userToDelete=req.params.id;
    collection.remove({'_id':userToDelete},function(err){
        res.send((err===null)?{msg:''} :{msg:'error: ' + err});


    });
});
router.put('/updatelesson/:id',function (req,res) {
    var db=req.db;
    var collection=db.get('EasyList');
    var lessonToUpdate=req.params.id;
    collection.update(
        {'_id':lessonToUpdate},
        req.body,function (err, result) {
            res.send(
                (err==null)?{msg: ''} :{msg :err}
            );
            
        });
    
});

module.exports = router;
