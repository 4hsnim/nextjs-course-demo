import { MongoClient } from "mongodb";

// api/new-meetup
// POST /api/new-meetup

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    // cluster랑 연결
    // Lim:effort30226은 아이디:비밀번호
    // meetups은 원하는 폴더명?
    const client = await MongoClient.connect(
      "mongodb+srv://Lim:effort30226@cluster0.jeoaywb.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    const db = client.db();

    const meetupsCollection = db.collection("meetups");
    const result = await meetupsCollection.insertOne(data);
    console.log(result);

    client.close();

    res.status(201).json({ message: "Meetup is inserted!" });
  }
}

export default handler;
