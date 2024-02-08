import { expect } from "chai";
import supertest from "supertest";
import app from "../index.js";

const request = supertest(app);

let authToken;
const authenticateAndGetToken = (credentials, callback) => {
  request
    .post("/api/sessions/login")
    .send(credentials)
    .end((err, response) => {
      if (err) {
        callback(err, null);
        return;
      }
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("token").that.is.a("string");
      authToken = response.body.token;

      callback(null, authToken);
    });
};

// [GET] 🌐/api/products
describe("Products Router", () => {
  it("should return a list of products", (done) => {
    request.get("/api/products").end((err, response) => {
      if (err) {
        done(err);
        return;
      }

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("products").that.is.an("array");
      expect(response.body.message).to.equal("Products found");

      done();
    });
  });
});

// [GET] 🌐/api/products/:id
describe("Product by ID Router", () => {
  it("should return a specific product by ID", (done) => {
    const productId = "65c322c2ec71713a9571d075";
    request.get(`/api/products/${productId}`).end((err, response) => {
      if (err) {
        done(err);
        return;
      }
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("product").that.is.an("object");
      expect(response.body.message).to.equal("Product found");
      done();
    });
  });
});

// [GET] 🌐/api/products/faker/mockingproducts
describe("Authentication and Mocking Products Router", () => {
  it("should authenticate and return a valid token", (done) => {
    const credentials = {
      email: "test@hotmail.com",
      password: "test",
    };
    authenticateAndGetToken(credentials, (err, token) => {
      if (err) {
        done(err);
        return;
      }
      authToken = token;
      done();
    });
  });

  it("should return mocked products with a valid JWT token", (done) => {
    expect(authToken).to.be.a("string");
    request
      .get("/api/products/faker/mockingproducts")
      .set("Cookie", `token=${authToken}`)
      .end((err, response) => {
        if (err) {
          done(err);
          return;
        }
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("message").that.is.a("string");
        expect(response.body).to.have.property("mocking").that.is.an("array");

        done();
      });
  });
});

// [POST] 🌐/api/products/
describe("Create Product Router", () => {
  let authToken;
  const ownerId = "65c19103b447a904c524f208";

  before((done) => {
    const credentials = {
      email: "test@hotmail.com",
      password: "test",
    };
    request
      .post("/api/sessions/login")
      .send(credentials)
      .end((err, response) => {
        if (err) {
          done(err);
          return;
        }
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("token").that.is.a("string");
        authToken = response.body.token;
        done();
      });
  });

  it("should create a new product with valid object ID for owner", (done) => {
    const productData = {
      title: "Smartphone",
      description: "A high-end smartphone with cutting-edge features.",
      price: 799.99,
      thumbnail: "https://via.placeholder.com/150",
      code: "TECH001",
      stock: 48,
      category: "Smartphones",
      owner: ownerId,
    };

    request
      .post("/api/products/")
      .set("Cookie", `token=${authToken}`)
      .send(productData)
      .end((err, response) => {
        if (err) {
          done(err);
          return;
        }
        try {
          expect(response.status).to.equal(201);
          expect(response.body).to.be.an("object");
          expect(response.body).to.have.property("message").that.is.a("string");
          expect(response.body.message).to.equal(
            "Product created successfully"
          );
          expect(response.body)
            .to.have.property("product")
            .that.is.an("object");
          done();
        } catch (error) {
          done(error);
        }
      });
  }).timeout(10000);
  after((done) => {
    done();
  });
});

// [POST] 🌐/api/products/:cid/products/:pid
describe("Add Product to Cart Router", () => {
  let authToken;
  let cid;
  let pid;

  before((done) => {
    const credentials = {
      email: "user@hotmail.com",
      password: "user",
    };
    request
      .post("/api/sessions/login")
      .send(credentials)
      .end((err, response) => {
        if (err) {
          done(err);
          return;
        }
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("token").that.is.a("string");
        authToken = response.body.token;
        cid = "65bacd79a746932afa2e68a7";
        pid = "65c322c2ec71713a9571d075";

        done();
      });
  });

  it("should add a product to the user's cart", (done) => {
    const quantity = 2;

    request
      .post(`/api/products/${cid}/products/${pid}`)
      .set("Cookie", `token=${authToken}`)
      .send({ quantity })
      .end((err, response) => {
        if (err) {
          done(err);
          return;
        }

        try {
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          expect(response.body).to.have.property("message").that.is.a("string");
          expect(response.body.message).to.equal("Product added to cart");
          expect(response.body).to.have.property("cart").that.is.an("object");
          done();
        } catch (error) {
          done(error);
        }
      });
  }).timeout(15000);

  after((done) => {
    done();
  });
});

// [DELETE] 🌐/api/products/:pid
describe("Delete Product Router", () => {
  let authToken;
  let productId;

  before((done) => {
    const credentials = {
      email: "test@hotmail.com",
      password: "test",
    };
    request
      .post("/api/sessions/login")
      .send(credentials)
      .end((err, response) => {
        if (err) {
          done(err);
          return;
        }
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("token").that.is.a("string");
        authToken = response.body.token;
        productId = "65c322fbeded4b6daabdfbb6";
        done();
      });
  });

  it("should delete a product with admin or premium user authorization", (done) => {
    request
      .delete(`/api/products/${productId}`)
      .set("Cookie", `token=${authToken}`)
      .end((err, response) => {
        if (err) {
          done(err);
          return;
        }
        try {
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          expect(response.body).to.have.property("message").that.is.a("string");
          expect(response.body.message).to.equal("Product deleted");
          expect(response.body)
            .to.have.property("deletedProduct")
            .that.is.an("object");
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  after((done) => {
    done();
  });
}).timeout(20000);


// [DELETE] 🌐/api/products/:cid/products/:pid
describe("Remove Product from Cart Router", () => {
    let authToken;
    let cid;
    let pid;
  
    before((done) => {
      const credentials = {
        email: "test@hotmail.com",
        password: "test",
      };
      request
        .post("/api/sessions/login")
        .send(credentials)
        .end((err, response) => {
          if (err) {
            done(err);
            return;
          }
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property("token").that.is.a("string");
          authToken = response.body.token;
          cid = "659481e91776f82af5b8fd6f";
          pid = "65c322fbeded4b6daabdfbb6";
  
          done();
        });
    });
  
    it("should remove a product from the user's cart", (done) => {
      request
        .delete(`/api/products/${cid}/products/${pid}`)
        .set("Cookie", `token=${authToken}`)
        .end((err, response) => {
          if (err) {
            done(err);
            return;
          }
  
          try {
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            expect(response.body).to.have.property("message").that.is.a("string");
            expect(response.body.message).to.equal("Product removed from cart");
            expect(response.body).to.have.property("cart").that.is.an("object");
            done();
          } catch (error) {
            done(error);
          }
        });
    }).timeout(15000);
  
    after((done) => {
      done();
    });
  });