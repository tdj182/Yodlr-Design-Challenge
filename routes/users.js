var express = require('express');
var router = express.Router();
var _ = require('lodash');
var logger = require('../lib/logger');
var log = logger();

var users = require('../init_data.json').data;
var curId = _.size(users) + 1;

/* GET users listing. */
router.get('/', function(req, res) {
  try{
    let tempUsers = _.toArray(users)
    return res.render('admin.html', {tempUsers})
  } catch (e) {
    res.json({error: "Testing gone wrong"});
  }
});

/* Create a new user */
router.post('/', function(req, res) {
  var user = req.body;
  user.id = curId++;
  if (!user.state) {
    user.state = 'pending';
  }
  users[user.id] = user;
  log.info('Created user', user);
  return res.redirect(`/users/${user.id}`)
});

/* Get a specific user by id */
router.get('/:id', function(req, res, next) {
  var user = users[req.params.id];
  if (!user) {
    return next();
  }
  return res.render('user.html', {user})
});

/* Delete a user by id */
router.delete('/:id', function(req, res) {
  var user = users[req.params.id];
  delete users[req.params.id];
  res.status(204);
  log.info('Deleted user', user);
  res.json(user);
});

/* Search */
router.get('/search', function(req, res) {
  var searchTerm = req.query.searchTerm.toLowerCase();
  let matchedUsers = _.toArray(users).filter(user => {
    if (user.firstName.toLowerCase().includes(searchTerm) || user.lastName.toLowerCase().includes(searchTerm)) return user
  })
  let tempUsers = matchedUsers
  return res.render('admin.html', {tempUsers})
  res.json(matchedUsers);
})

/* Update a user by id */
router.put('/:id', function(req, res, next) {
  var user = req.body;
  if (user.id != req.params.id) {
    return next(new Error('ID paramter does not match body'));
  }
  users[user.id] = user;
  log.info('Updating user', user);
  res.json(user);
});

router.get('/add', function (req, res, next) {
  try{
    return res.render('signup.html')
  } catch (e) {
    res.json({error: "Testing gone wrong"});
  }
})


module.exports = router;
