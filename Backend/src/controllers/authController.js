import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { email, password, fullName, name } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = await User.create({
      name: fullName || name,
      email,
      password,
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.name,
        isAdmin: user.isAdmin || user.role === "admin",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = user.getSignedJwtToken();
    const isAdmin = user.role === "admin" || user.isAdmin === true;

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.name,
        isAdmin: isAdmin,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred during sign in",
    });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAdmin = user.role === "admin" || user.isAdmin === true;

    res.json({
      _id: user._id,
      id: user._id,
      email: user.email,
      fullName: user.name,
      phoneNumber: user.phoneNumber,
      isAdmin: isAdmin,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    res.json({
      exists: !!user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { email, fullName, phoneNumber } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = email || user.email;
    user.name = fullName || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.name,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};
