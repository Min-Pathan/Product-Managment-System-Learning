const User = require("../models/user");

const getallUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.json({ err: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    if (!id) {
      return res.json({ err: "invalid user" });
    }
    const userExists = await User.findOne({id:id})
        if(!userExists)
        {
            return res.json({error:"User not found"})
        }
    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.json({
      msg: "User updated",
      data: user,
    });
  } catch (err) {
    res.json({ err: err.message });
  }
};


const userDelete = async(req, res)=>{
    try{
        const id = req.params.id;
        const userExists = await User.findOne({id:id})
        if(!userExists)
        {
            return res.json({error:"User not found"})
        }
        const deletedUser = await User.findOneAndDelete({id: parseInt(id)})
        res.json({
            msg:"deleted successfully"
        })
    }
    catch(error){
        res.json({error:error.message})
    }
}

const getUserById = async (req, res)=>{
    try
    {
        const id = req.params.id;
        const user = await User.findById(id);
          if (!user) {
      return res.json({ msg: "User not found" });
    }

        res.json({
            data:user
        })
    }
    catch(error){
        res.json({error:error.message})
    }
}

module.exports = { getallUsers, updateUser, userDelete, getUserById};
