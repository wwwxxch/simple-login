/* ------------------------------------------------------------------- */
// Show SignIn form or SignUp form
const $showmsg = $('#reminder');
const $showinstr = $('#instruction');
const $signinClick = $('.show-signin');
const $signupClick = $('.show-signup');
const $signindiv = $('#sign-in');
const $signupdiv = $('#sign-up');

// CLICK SignIn BUTTON
$signinClick.click(() => {
  // show SignIn(OLD) form & hide SignUp(NEW) form
  $signindiv.css('display', 'flex');
  $signupdiv.css('display', 'none');

  $showinstr.css('display', 'block');
  $showinstr.text('SIGN-IN');

  $showmsg.css('display', 'block');
  $showmsg.text('');

  $('.oldemail').val('');
  $('.oldpwd').val('');
});

// CLICK SignUp BUTTON
$signupClick.click(() => {
  // show SignUp(NEW) form & hide SignIn(OLD) form
  $signupdiv.css('display', 'flex');
  $signindiv.css('display', 'none');

  $showinstr.css('display', 'block');
  $showinstr.text('SIGN-UP');

  $showmsg.css('display', 'block');
  $showmsg.text('');

  $('.newname').val('');
  $('.newemail').val('');
  $('.newpwd').val('');
  $('.pwdconf').val('');
});

/* ------------------------------------------------------------------- */
// Submit inputs via AJAX & CLICK event
const $oldClick = $('.oldsubmit');
const $newClick = $('.newsubmit');

function clickfunc (typ) {
  // pass input value via json format
  let params;
  // send post request to different routes
  let url;
  // email & pwd patterns
  const regmail = /^[\-\w\.]+@([\-\w]+\.)+[\-\w]{2,}$/;
  const regpwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;

  // set parameters & validate input value before sending request
  // 1.type === 'old'
  if (typ === 'old') {
    const inputval_olde = $('.oldemail').val();
    const inputval_oldp = $('.oldpwd').val();

    if (inputval_olde.length === 0 || inputval_oldp.length === 0) {
      $showmsg.text('E-mail and Password cannot be blank. Please try again.');
      return;
    }

    params = {
      oldemail: inputval_olde,
      oldpwd: inputval_oldp
    };
    url = '/signin';
  // 2.type === 'new'
  } else if (typ === 'new') {
    const inputval_newn = $('.newname').val();
    const inputval_newe = $('.newemail').val();
    const inputval_newp = $('.newpwd').val();
    const inputval_newpconf = $('.pwdconf').val();

    if (inputval_newn.length === 0 || inputval_newe.length === 0 || inputval_newp.length === 0) {
      $showmsg.text('All fields are required. Please try again.');
      return;
    } else {
      if (!regmail.test(inputval_newe) && inputval_newe.length !== 0) {
        $showmsg.text('Invalid email.');
        return;
      }
      if (!regpwd.test(inputval_newp) && inputval_newp.length !== 0) {
        $showmsg.text('Invalid password.');
        return;
      }
      if (inputval_newp !== inputval_newpconf) {
        $showmsg.text('Passwords do not match.');
        return;
      }
    }

    params = {
      newname: inputval_newn,
      newemail: inputval_newe,
      newpwd: inputval_newp,
      newpconf: inputval_newpconf
    };
    url = '/signup';
  };

  // AJAX
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const serverres = xhr.responseText;

      // **SignIn (OLD) - action based on server response
      if (typ === 'old') {
        // case 1 blank
        if (serverres === 'blank') {
          $showmsg.text('E-mail and Password cannot be blank. Please try again.');
        // case 2 pwd wrong
        } else if (serverres === 'pwdwrong') {
          $showmsg.text('Your email and password do not match. Please try again.');
        // case 3 email not in database
        } else if (serverres === 'notindb') {
          $showmsg.text('Your email has not been registered. Please click SignUp.');
        // case 4 email pwd matched in database
        } else if (serverres.includes('member')) {
          alert('Login Successful!');
          location.replace(`${serverres}`);
        }

      // **SignUp (NEW) - action based on server response
      } else if (typ === 'new') {
        // case 1 blank
        if (serverres === 'blank') {
          $showmsg.text('All fields are required. Please try again.');
        // case 2 wrong mail format
        } else if (serverres === 'w_mail_format') {
          $showmsg.text('Invalid email.');
        // case 3 wrong pwd format
        } else if (serverres === 'w_pwd_format') {
          $showmsg.text('Invalid password.');
        // case 4 pwds not matched
        } else if (serverres === 'pwdsnotmatch') {
          $showmsg.text('Passwords do not match.');
        // case 5 new email
        } else if (serverres.includes('member')) {
          alert('Signup Successful!');
          location.replace(`${serverres}`);
        // case 6 email found in database
        } else if (serverres === 'tosignin') {
          $showmsg.text('Your email has been registered. Please click SignIn.');
        };
      }
    }
  };
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(params));
}

$oldClick.click((e) => {
  e.preventDefault();
  clickfunc('old');

  $('.oldemail').val('');
  $('.oldpwd').val('');
});
$newClick.click((e) => {
  e.preventDefault();
  clickfunc('new');

  $('.newemail').val('');
  $('.newpwd').val('');
  $('.pwdconf').val('');
});
