import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // to make it omptimize for searching
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,

      index: true, // to make it omptimize for searching

      trim: true,
    },
    avatar: {
      type: String, //cloudinary url for the image
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url for the image
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true } //for created at and updated at fields
);

//encrypting the password (middleware, i.e used with next())
//.pre lets you make the changes just before saving into the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); //to check if the password is modified

  this.password = await bcrypt.hash(this.password, 10); //10 here represents the rounds fo algorithm to be used to encrypt the password
  next();
});

//addin custom methods( you can write any method you want)
//and then injecting those method into your schema
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); //will return true or false
};

userSchema.methods.generateAccessToken = function () {
  //jwt sign creates a jwt token bases on payload, token-secret and expiry date
  jwt.sign(
    {
      //payload
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    //token secret form .env
    process.env.ACCESS_TOKEN_SECRET,
    {
      //expiry from .env
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

//RefreshToken works the same as AccessToken
userSchema.methods.generateRefreshToken = function () {
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
