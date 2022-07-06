var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
    console.log('/users/login 호출됨.');
    res.render('users/login', { title: '로그인 폼' });
});

module.exports = router;