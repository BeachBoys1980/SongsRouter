const request = require("supertest");
const app = require("../app");

describe("MOVIES EXERCISE", () => {
  it("POST /movies should return a new movie object", async () => {
    const newMovie = { movieName: "Lion King" };

    const response = await request(app)
      .post("/movies")
      .send(newMovie)
      .expect(201);

    expect(response.body).toMatchObject(newMovie);
  });

  it("GET /movies should return a new movie object in an array", async () => {
    const expectedMovies = [{ id: 1, movieName: "Lion King" }];
    const response = await request(app).get("/movies").expect(200);

    expect(response.body).toEqual(expectedMovies);
  });

  it("GET /movies/:id should return correct movie object", async () => {
    const expectedMovies = { movieName: "Lion King" };
    const response = await request(app).get("/movies/1").expect(200);
  });
});
