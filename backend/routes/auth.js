const express = require('express')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')
fetchuser
const JWT_SEC = 'edcmba123'
// Create a User using: POST "/api/auth/createuser". Doesn't require Auth
router.post(
  '/createuser',
  [
    body('name', 'Enter A Valid Name').isLength({ min: 3 }),
    body('email', 'Enter A Valid Email').isEmail(),
    body('password', 'Password must be of 5 charachters').isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Check if email already exists
    try {
      let user = await User.findOne({
        email: req.body.email,
      })
      if (user) {
        return res.status(400).json({ error: 'Sorry, Email Already exists' })
      }
      const salt = await bcrypt.genSalt(10)
      secPass = await bcrypt.hash(req.body.password, salt)

      // Create A New User
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      })

      const data = {
        user: {
          id: user.id,
        },
      }
      const authToken = jwt.sign(data, JWT_SEC)
      console.log({ authToken })
      res.json(user)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Some Error Occured')
    }
  },
)

// Authenticate A User using POST"api/auth/Login"

router.post(
  '/login',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', "Password can't be empty").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    try {
      let user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ error: 'Enter Valid Credentials' })
      }

      const Password_cmp = await bcrypt.compare(password, user.password)
      if (!Password_cmp) {
        return res.status(400).json({ error: 'Enter Valid Credentials' })
      }

      // Sending A Payload
      const data = {
        user: {
          id: user.id,
        },
      }
      const authToken = jwt.sign(data, JWT_SEC)
      res.json(authToken)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Internal Server Error Occured')
    }
  },
)

// Route 3 : Get User Details

router.post('/getuser', fetchuser,async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    res.send(user);
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Internal Server Error Occured')
  }
})
module.exports = router
