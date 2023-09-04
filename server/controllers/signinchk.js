const {
  chkmail,
  chkpair
} = require('../models/database');

async function checkOld (input_mail, input_pwd) {
  const upd_inmail = input_mail.trim();
  const upd_inpwd = input_pwd.trim();
  const getmail = await chkmail(upd_inmail);
  const getpair = await chkpair(upd_inmail, upd_inpwd);
  let returnval = null;

  if (!upd_inmail || !upd_inpwd ||
      upd_inmail.length === 0 || upd_inpwd.length === 0) {
    returnval = "blank";
  } else if (getmail === undefined) {
    returnval = "notindb";
  } else if (getpair === undefined || getpair === false) {
    returnval = "pwdwrong";
  } else if (getpair === true) {
    returnval = "found";
  }
  return returnval;
}

module.exports = {
  checkOld
};
