const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid").v1;

//create a user schema
const UserSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      maxlength: 20,
      required: true,
    },
    lName: {
      type: String,
      maxlength: 16,
      required: true,
    },
    email: {
      type: String,
      maxlength: 40,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    dob: {
      type: Date,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

//virtual fields
UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(() => {
    return this._password;
  });

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", UserSchema);
