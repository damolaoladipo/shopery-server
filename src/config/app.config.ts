import dotenv, { config, } from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { ENVType } from "../utils/enum.util";
import ENV from "../utils/env.util";
import errorHandler from "../middlewares/error.mdw";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import path from "path";
import expressSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
// import userAgent from "express-useragent";
import v1Routes from "../routers/routes.router";
import logger from "../utils/logger.util";
import { requestLogger } from "../services/logger.service";




dotenv.config();


const app = express();

app.use(requestLogger)

// body parser
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: false}))

app.use(bodyParser.json({limit: '50mb', inflate: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))

// cookie parser
app.use(cookieParser())

// manage sessions
// app.use(manageSession);

// app.use(session({
//     secret: process.env.SESSION_SECRET || "", 
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false } 
//   }));

// temporaary files directory
app.use(fileUpload({useTempFiles: true, tempFileDir: path.join(__dirname, 'tmp')}))


/**
 * sanitize data
 * secure db against sql injection
 */
app.use(expressSanitize())

// secure response header
app.use(helmet())

// prevent parameter pollution
app.use(hpp())

// enable CORS: communicate with multiple domain
app.use(cors({origin: true, credentials: true}))

app.use ((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*"),
    res.header(
        "Access-Control-Allow-Origin", 
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    ),
    res.header(
        "Access-Control-Allow-Origin",
    "x-acess-token, origin, X-Requested-With, Content-Type, Accept"
    )
    next()

})

app.set('view engine', 'ejs')

app.get("/", (req: Request, res: Response, next: NextFunction) => {

    let enviornemnt = ENVType.DEVELOPMENT

    if (ENV.isProduction()) {
        enviornemnt = ENVType.PRODUCTION
    } else if (ENV.isStaging()) {
        enviornemnt = ENVType.STAGING
    } else if (ENV.isDevelopment()) {
        enviornemnt = ENVType.DEVELOPMENT
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: {
            name: "Shopery API - DEFAULT",
            version: "1.0.0",

        },
        message: 'Shopery api v1.0.0',
        status: 200

    })


})

app.use('/v1', v1Routes)

app.use(errorHandler)

export default app;