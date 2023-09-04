const express = require('express');
const router = express.Router();

const { getNameByMail } = require('../models/database');
const { checkOld } = require('../controllers/signinchk.js');
const { checkNew } = require('../controllers/signupchk.js');
// *********************************************************
// GET ROUTES
router.get('/', (req, res) => {
  if (req.session.showname) {
    return res.redirect('/member');
  } else {
    return res.render('home');
  }
});

router.get('/member', (req, res) => {
  if (req.session.showname) {
    const memberName = req.session.showname;
    res.render('member', { memberName });
  } else {
    return res.redirect('/');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  return res.redirect('/');
});

// *********************************************************
// Sign-In POST ROUTE
router.post('/signin', async (req, res, next) => {
  try {
    // check signin(OLD) info input
    const { oldemail } = req.body;
    const { oldpwd } = req.body;

    const oldresult = await checkOld(oldemail, oldpwd);

    // send response for signin(OLD) input
    if (oldresult && oldresult !== "found") {
      return res.send(oldresult);
    } else if (oldresult === "found") {
      // if login success then store the name to session
      const nameobj = await getNameByMail(oldemail);
      req.session.showname = nameobj.name;
      return res.send("/member");
    }
  } catch (err) {
    next(err);
  }
});

// *********************************************************
// Sign-Up POST ROUTE
router.post('/signup', async (req, res, next) => {
  try {
    // console.log("signup: ", req.body);
    
    // check signup(NEW) info input
    const { newname } = req.body;
    const { newemail } = req.body;
    const { newpwd } = req.body;
    const { newpconf } = req.body;

    let newresult;
    if (newpwd !== newpconf) {
      // check if pwds match
      newresult = 'pwdsnotmatch';
      return newresult;
    } else {
      newresult = await checkNew(newname, newemail, newpwd);
    }
    
    // send response for signup(NEW) input
    // newresult: return object afterward
    if (newresult.status && newresult.status !== "new") {
      return res.send(newresult.status);
    } else if (newresult.status === "new") {
      // if signup success then store the name to session
      req.session.showname = newresult.name;
      return res.send("/member");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
