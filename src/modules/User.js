class User {
  constructor() {
    if (!User.instance) {
      User.instance = this;
    }
    return User.instance;
  }
}

export default new User();
