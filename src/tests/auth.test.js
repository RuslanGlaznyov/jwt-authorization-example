const request = require("supertest");
const chai = require('chai');
const mongoose = require('mongoose');


const chaiexp = chai.expect;


const app = require("../app");
const userModel = require("../user/user.model");
const issueToken = require("./helpers/issueToken");

describe("auth tests", function () {
    beforeEach(async () => {
        await userModel.create({
            login: "test",
            password: "test"
        });
    });
    afterEach(async () => {
        mongoose.connection.db.dropDatabase();
    });

    const checkPairToken = (res)=> {
        chaiexp(res.body).to.have.all.keys("token", "refreshToken");
        chaiexp(res.body.token).to.be.an("string");
        chaiexp(res.body.refreshToken).to.be.an("string");
    };

    async function loginHandler() {
        return request(app)
            .post('/auth/login')
            .send({login: 'test', password: 'test'})
            .expect(200)
            .expect(checkPairToken);

    }

    it("User can succesfully login", async () => {
        const loginRes = await loginHandler();
        await request(app)
                .post('/auth/refresh')
                .send({refreshToken: loginRes.body.refreshToken})
                .expect(200)
                .expect(checkPairToken)
    });

    it("User gets 401 on invalid credentials", async () =>{
        await request(app)
            .post('/auth/login')
            .send({
                login: 'INVALID',
                password: 'INVALID'
            })
            .expect(400)
    });

    it("User receives 401 on expired token", async () => {
        const user = await userModel.find({login: 'test'}).exec();
        const expiredToken = issueToken({ id: user._id }, { expiresIn: '1ms' });
        await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${expiredToken}`)
            .expect(401)
            .expect( res => {
                chaiexp(res.body.message).to.equal('token is expired');
            })
    });

    it("User can use refresh token only once", async () => {
        const loginRes = await loginHandler();

        //firstResp
        await request(app)
            .post('/auth/refresh')
            .send({refreshToken: loginRes.body.refreshToken})
            .expect(200)
            .expect(checkPairToken);

        //secondResp
        await request(app)
            .post('/auth/refresh')
            .send({refreshToken: loginRes.body.refreshToken})
            .expect(401);
    });

    it("Refresh tokens become invalid on logout", async () => {
        const loginRes = await loginHandler();
        //logout resp
        await request(app)
            .post('/auth/logout')
            .set('Authorization', `Bearer ${loginRes.body.token}`)
            .expect(200);

        //send invalid refresh token
        await  request(app)
            .post('/auth/refresh')
            .send({refreshToken: loginRes.body.refreshToken})
            .expect(401)
    })

    it("Multiple refresh tokens are valid", async () => {
        const firstLoginResp = await loginHandler();
        const secondLoginResp = await loginHandler();

        chaiexp(firstLoginResp.status).to.equal(200);
        chaiexp(secondLoginResp.status).to.equal(200);

        //first refresh response
        await request(app)
            .post('/auth/refresh')
            .send({refreshToken: firstLoginResp.body.refreshToken})
            .expect(200)
            .expect(checkPairToken);

        //second refresh response
        await request(app)
            .post('/auth/refresh')
            .send({refreshToken: secondLoginResp.body.refreshToken})
            .expect(200)
            .expect(checkPairToken);
    })

});
