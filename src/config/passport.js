import passport from "passport";
import { userServices } from "../services/user.services.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { hashData, compareData } from "../utils/utils.js";
import config from "./config.js";

// local
passport.use(
    "signup",
    new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            const { first_name, last_name } = req.body;
            if (!first_name || !last_name || !email || !password) {
                return done(null, false);
            }
            const existingUser = await userServices.findByEmail(email);
            if (existingUser) {
                return done(null, false, { message: "Email is already registered" });
            }
            try {
                const hashedPassword = await hashData(password);
                const createdUser = await userServices.createOne({
                    ...req.body,
                    password: hashedPassword
                })
                return done(null, createdUser)
            } catch (error) {
                done(error)
            }
        }
    )
);

passport.use(
    "login",
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            if (!email || !password) {
                return done(null, false)
            }
            try {
                const user = await userServices.findByEmail(email);
                if (!user) {
                    done(null, false, { message: "Incorrect email or password." });
                }
                const isPasswordValid = await compareData(password, user.password);
                if (!isPasswordValid) {
                    return done(null, false, { message: "Incorrect email or password." });
                }
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

// github

passport.use(
    "github",
    new GithubStrategy(
        {
            clientID: config.client_id,
            clientSecret: config.client_secret,
            callbackURL: "http://localhost:8080/api/sessions/callback",
            scope: ["user:email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                if (
                    profile._json &&
                    profile.emails[0].value &&
                    profile._json.name &&
                    profile._json.name.includes(" ")
                ) {
                    const nameParts = profile._json.name.split(" ");
                    const infoUser = {
                        first_name: nameParts[0],
                        last_name: nameParts.slice(1).join(" "),
                        email: profile.emails[0].value,
                        password: " ",
                        isGitHub: true,
                    };
                    const userDB = await userServices.findByEmail(profile.emails[0].value);
                    if (userDB) {
                        if (userDB.isGitHub) {
                            return done(null, userDB);
                        } else {
                            return done(null, false);
                        }
                    }
                    const createdUser = await userServices.createOne(infoUser);
                    return done(null, createdUser);
                } else {
                    console.error("Set github email or name public in your configuration:", profile.emails[0].value, profile._json.name);
                    return done(null, false);
                }
            } catch (error) {
                console.error("Error in passport github strategy", error);
                return done(error);
            }
        }
    )
);

// JWT Strategy

const fromCookies = (req) => {
    return req.cookies.token;
}

passport.use(
    "jwt",
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
            secretOrKey: config.secret_jwt,
        },
        async function (jwtPayload, done) {
            done(null, jwtPayload);
        }
    )
);



// Serialize & Deserialize

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userServices.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});