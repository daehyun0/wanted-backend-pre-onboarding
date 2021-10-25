var express = require('express');
const userService = require("../service/user-service");
var router = express.Router();

router.post('/', async function(req, res, next) {
  try {
    const id = req.body.id;
    const password = req.body.password;
    const token = await userService.authenticate(id, password);

    res.cookie('access_token', token);
    res.send(token);
  } catch (e) {
    res.send(e.message);
  }
});

router.post('/logout', async function(req, res) {
  res.cookie('access_token', null);
  res.send();
})

module.exports = router;
