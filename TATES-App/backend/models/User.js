// User model (example, not using ORM)
class User {
  constructor({ id, fullName, username, email, password }) {
    this.id = id;
    this.fullName = fullName;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
module.exports = User;
