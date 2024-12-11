const User = require('../data-access/AdminModel');

const authController = {
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;


      const user = await User.findOne({ email });

      if (user && user.password === password) {

        req.session.isLoggedIn = true;
        req.session.userId = user._id; 

        return res.redirect('/home');
      }

      req.flash('errorMessage', 'Invalid email or password!');
      return res.redirect('/');
    } catch (error) {
      console.error('Error logging in:', error);
      req.flash('errorMessage', 'Internal Server Error');
      return res.redirect('/');
    }
  },
};

module.exports = authController;
