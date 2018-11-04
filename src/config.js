export default {
    s3: {
        REGION: "us-west-2",
        BUCKET: "serverless-tutorial-bc"
    },
    apiGateway: {
        REGION: "us-west-2",
        URL: "https://krbln2jeoi.execute-api.us-west-2.amazonaws.com/prod"
    },
    cognito: {
        REGION: "us-west-2",
        USER_POOL_ID: "us-west-2_PKCeItuxz",
        APP_CLIENT_ID: "1q2asupl82uqm2475l9ph05vpp",
        IDENTITY_POOL_ID: "us-west-2:9a9f38b5-5054-451d-91cc-bd8b744a867a"
    }
}