import User from '../models/User.ts';
import bcrypt from 'bcrypt';

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, phone_number, password, display_name } = req.body;

      // 1. Validate required fields
      if (!username || !password || !display_name) {
        return res.status(400).json({
          success: false,
          error_code: "MISSING_REQUIRED_FIELDS"
        });
      }

      // 2. Validate contact info
      if (!email && !phone_number) {
        return res.status(400).json({
          success: false,
          error_code: "MISSING_CONTACT_INFO"
        });
      }

      // 3. Check duplicate user
      const existingUser = await User.findOne({
        $or: [
          { username },
          ...(email ? [{ email }] : []),
          ...(phone_number ? [{ phone_number }] : [])
        ]
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error_code: "USER_ALREADY_EXISTS"
        });
      }

      // 4. Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 5. Create user
      const newUser = new User({
        username,
        email: email || null,
        phone_number: phone_number || null,
        password_hash: hashedPassword,
        display_name
      });

      const savedUser = await newUser.save();

      // 6. Remove sensitive data
      const { password_hash, ...userInfo } = savedUser._doc;

      // 7. Response
      return res.status(201).json({
        success: true,
        data: {
          user: userInfo
        }
      });

    } catch (error) {
      console.error("Register error:", error);

      return res.status(500).json({
        success: false,
        error_code: "INTERNAL_SERVER_ERROR"
      });
    }
  }
};

export default authController;