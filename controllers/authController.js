const User= require('../models/User');
const {sendConfirmationEmail}=require('../utils/emailService');
const crypto = require('crypto');


const signup = async (req, res) => {
    try {
      const { username, email, password } = req.body;

     // Create confirmation token
      const confirmationToken = crypto.randomBytes(32).toString('hex');
      const confirmationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  
    const user=await User.create({
        username,email,password,
        confirmationToken,
        confirmationTokenExpires
       
    });

      // Send confirmation email
      await sendConfirmationEmail(email, confirmationToken);
  
      res.status(201).json(
        { 
        message: 'User created successfully. Please check your email to confirm your account.', 
        payload:{
            user
        } 
        }
    );
    } catch (error) {
       
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: 'Validation Error', errors });
        }

        // Handle duplicate email error (unique constraint)
        if (error.code === 11000 && error.keyPattern?.email) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
  };


  const confirmEmail = async (req, res) => {
    try {
      const { token } = req.params;
  
      const user = await User.findOne({
        confirmationToken: token,
        confirmationTokenExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired confirmation token' });
      }
  
      user.isEmailConfirmed = true;
      user.confirmationToken = undefined;
      user.confirmationTokenExpires = undefined;
      await user.save();
  
      res.json({ message: 'Email confirmed successfully' });
    } catch (error) {
      console.error('Email confirmation error:', error);
      res.status(500).json({ error: 'Error confirming email' });
    }
  };

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
  
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Check if email is confirmed
      if (!user.isEmailConfirmed) {
        return res.status(401).json({ error: 'Please confirm your email before logging in' });
      }
  
      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Generate JWT
      const token= await user.getJWTToken();
  
      res.json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Error logging in' });
    }
  };
  

  const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password -confirmationToken -confirmationTokenExpires');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Error fetching profile' });
    }
  };

  module.exports={signup,confirmEmail,getProfile,login};


  
  