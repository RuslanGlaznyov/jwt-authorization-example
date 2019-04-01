const request = require("supertest");
const chai = require('chai');
const mongoose = require('mongoose');


const chaiexp = chai.expect;


const app = require("../app");
const issueToken = require("./helpers/issueToken");
const userModel = require("../user/user.model");

describe("users tests", function() {

    beforeEach(async () => {
        await userModel.create({
            login: "test",
            password: "test"
        });
    });

    afterEach(async () => {
        mongoose.connection.db.dropDatabase();
    });

    it("should create new user", async () => {
        await request(app)
            .post("/user")
            .send({login: 'test_login', password: 'test_password'})
            .expect(201)
            .expect(res => {
                chaiexp(res.body).to.have.all.keys("_id", "login", "password");
            })
    });

    it("should get all users", async () => {
        const user = await userModel.findOne({login: "test"}).exec();
        const authLine = `Bearer ${issueToken({ id: user._id })}`;
        await request(app)
            .get("/user")
            .set('Authorization', authLine)
            .expect(200)
            .expect(res => {
                chaiexp(res.body).to.be.an('array');
            })
    });
});




