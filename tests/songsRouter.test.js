const request = require("supertest");
const app = require("../app");
const SongModel = require("../models/song.model");
const { teardownMongoose } = require("../test/mongoose");

/* -- Initialise Mongo In-Memory DB -- */
afterAll(async () => await teardownMongoose());

beforeEach(async () => {
  const songData = [
    {
      id: 1,
      name: "song 1",
      artist: "artist 1",
    },
    {
      id: 2,
      name: "song 2",
      artist: "artist 2",
    },
    {
      id: 3,
      name: "song 3",
      artist: "artist 3",
    },
    {
      id: 4,
      name: "song 4",
      artist: "artist 4",
    },
  ];
  await SongModel.create(songData);
});

afterEach(async () => {
  await SongModel.deleteMany();
});
/* -- End of Initialisation -- */

describe("GET", () => {
  it("GET / should return with 'song'", async () => {
    const response = await request(app).get("/song");

    expect(response.status).toEqual(200);
    //expect(response.text).toEqual("id");
  });

  //test for .toMatchObject
  it("GET /songs/:id should return the correct song", async () => {
    const expectedSong = {
      artist: "artist 2",
      id: 2,
      name: "song 2",
    };

    const { body: actualSong } = await request(app).get("/song/2").expect(200);

    expect(actualSong).toMatchObject(expectedSong);
  });
});

describe("POST", () => {
  it("POST /song should add a song and return a new song object", async () => {
    const newSong = { name: "test song", artist: "test artist" };
    const expectedSong = { id: 5, name: "test song", artist: "test artist" };

    const { body } = await request(app).post("/song").send(newSong).expect(201);

    expect(body).toMatchObject(expectedSong);
  });
});

describe("PUT", () => {
  it("PUT /songs/:id should update the correct song", async () => {
    const updatedSong = {
      name: "song 2",
      artist: "artist 2",
    };
    const expectedSong = {
      id: 2,
      name: "song 2",
      artist: "artist 2",
    };

    const { body } = await request(app)
      .put("/song/2")
      .send(updatedSong)
      .expect(200);

    expect(body).toMatchObject(expectedSong);
  });
});

describe("DELETE", () => {
  it("DELETE /songs/:id should delete the correct song", async () => {
    const deletedSong = { id: 4, name: "song 4", artist: "artist 4" };

    const { body } = await request(app).delete("/song/4").expect(200);

    expect(body).toMatchObject(deletedSong);
  });
});
