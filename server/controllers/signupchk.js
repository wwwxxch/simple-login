const {
  chkmail,
  createUser
} = require('../models/database');

const regmail = /^[\-\w\.]+@([\-\w]+\.)+[\-\w]{2,}$/;
const regpwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;

async function checkNew (input_name, input_mail, input_pwd) {
  const upd_inname = input_name.trim();
  const upd_inmail = input_mail.trim();
  const upd_inpwd = input_pwd.trim();
  const getmail = await chkmail(upd_inmail);
  let returnval = Object.create(null);

  // name & email & password cannot be blank
  if (!upd_inname || !upd_inmail || !upd_inpwd ||
      upd_inname.length === 0 || upd_inmail.length === 0 || upd_inpwd.length === 0) {
    returnval.status = "blank";
  // check email pattern
  } else if (!regmail.test(input_mail)) {
    returnval.status = "w_mail_format";
  // check pwd pattern
  } else if (!regpwd.test(input_pwd)) {
    returnval.status = "w_pwd_format";
  // check if this mail has been exsited in database
  } else if (getmail === undefined) {
    const newRec = await createUser(upd_inname, upd_inmail, upd_inpwd);
    const { name } = newRec;
    returnval = { status: "new", name };
  } else {
    returnval.status = "tosignin";
  }
  return returnval;
}

module.exports = {
  checkNew
};
