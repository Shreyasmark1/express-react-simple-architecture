import process from "process";
import z from "zod";

const envVariables = {
    port: process.env.PORT,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    transactionTokenSecret: process.env.TRANSACTION_TOKEN_SECRET,
    dbUrl: process.env.DB_URL,
    storage: {
        s3: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            bucket: process.env.S3_BUCKET_NAME,
            region: process.env.S3_REGION
        },
        cloudinary: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            apiSecret: process.env.CLOUDINARY_API_SECRET
        },
        local: {
            fileUploadDirectory: process.env.LOCAL_FILE_UPLOAD_DIRECTORY
        }
    },
    sms: {
        tfa: {
            url: process.env.TFA_SMS_URL,
            senderId: process.env.TFA_SMS_SENDER_ID,
            apiKey: process.env.TFA_SMS_API_KEY,
            templates: {
                otp: process.env.TFA_SMS_OTP_TEMPLATE,
            }
        }
    },
    isProd: process.env.IS_PROD,
};

const envSchema = z.object({
    port: z.coerce.number().positive(),
    accessTokenSecret: z.string().nonempty(),
    transactionTokenSecret: z.string().nonempty(),
    dbUrl: z.string().nonempty(),
    storage: z.object({
        s3: z.object({
            accessKeyId: z.string().nonempty(),
            secretAccessKey: z.string().nonempty(),
            bucket: z.string().nonempty(),
            region: z.string().nonempty()
        }),
        cloudinary: z.object({
            cloudName: z.string().nonempty(),
            apiKey: z.string().nonempty(),
            apiSecret: z.string().nonempty()
        }),
        local: z.object({
            fileUploadDirectory: z.string().nonempty()
        })
    }),
    sms: z.object({
        tfa: z.object({
            url: z.string().nonempty(),
            senderId: z.string().nonempty(),
            apiKey: z.string().nonempty(),
            templates: z.object({
                otp: z.string().nonempty(),
            })
        })
    }),
    isProd: z.enum(["true", "false", ""])
        .optional()
        .transform((val) => val === "true"),
});

// not safe parcing so the program ends before staring
export const EnvVariables = envSchema.parse(envVariables);

// uncomment this to bypass env validation in development
// export const EnvVariables = envVariables;