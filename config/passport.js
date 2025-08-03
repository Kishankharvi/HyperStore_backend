import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import User from "../models/User.js"
import dotenv from "dotenv"

dotenv.config()

// Ensure environment variables are set
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google OAuth credentials are not set in environment variables.")
}

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id })

        if (user) {
          return done(null, user)
        }

        // Check if user exists with same email
        user = await User.findOne({ email: profile.emails[0].value })

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id
          user.avatar = profile.photos[0].value
          await user.save()
          return done(null, user)
        }

        // Create new user
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          provider: "google",
        })

        await user.save()
        done(null, user)
      } catch (error) {
        done(error, null)
      }
    },
  ),
)

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "your-jwt-secret",
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id).select("-password")
        if (user) {
          return done(null, user)
        }
        return done(null, false)
      } catch (error) {
        return done(error, false)
      }
    },
  ),
)

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id)
})

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password")
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})
