import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetails = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
};

// 동적으로 경로설정
export async function getStaticPaths() {
  // MongoDB 연결
  const client = await MongoClient.connect(
    "mongodb+srv://Lim:effort30226@cluster0.jeoaywb.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  // find는 모든 meetups에 엑세스 할 수 있게 해준다.
  // ID만 포함하고 다른 필드 값은 포함하지 않는다.
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup

  const meetupId = context.params.meetupId;
  // MongoDB 연결
  const client = await MongoClient.connect(
    "mongodb+srv://Lim:effort30226@cluster0.jeoaywb.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  // ID일치하는 것 하나만 찾기
  // MongoDB에서 _id는 이상한 객체로 저장이 되어있음
  // 정확하게 찾기 위해서는 ObjectId()를 사용해야한다.
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
