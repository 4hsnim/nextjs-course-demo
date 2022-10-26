import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "박민영",
//     image:
//       "http://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2021/06/21/06bb13f2-dd29-40ba-a82c-3a2b98c5a6ba.jpg",
//     address: "삼양로 566, 도봉구, 서울",
//     description: "내 미래 여자친구",
//   },
//   {
//     id: "m2",
//     title: "아이유",
//     image: "https://img.hankyung.com/photo/202209/01.31260167.1.jpg",
//     address: "청와대길 1234, 용산구, 서울",
//     description: "내 미래 여자친구2",
//   },
// ];

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
};

// getStaticProps 사전렌더링(preRender)을 가능하게 해준다.
// getStaticProps가 있으면 nextjs는 컴포넌트 함수를 실행하지 않고 먼저 getStaticProps함수를 먼저 실행한다.
// 먼저 필요한 데이터를 받아들인다.
// getStaticProps는 클라이언트측에서 절대 실행되지 않는다.
// 이 함수는 빌드 프로세스 중에 실행된다.
// props 프로퍼티를 먼저 객체안에 설정한다.
// 먼저 props데이터를 받는다.
// 두번째 렌더링 사이클에서 데이터를 받는게 아니다.
// 첫번째 렌더링 사이클에서 데이터를 받는다.
// getStaticProps는 요청과 응답에 접속하지 않는다.
// 캐시를 사용한다..
// 페이지를 여러번 프리 제너레이터할 필요가 없다.

// 문제점
// 데이터에 최신정보는 없을 수도 있다.
// 왜냐하면 미리 사전에 렌더링을 해놓기 떄문이다.

// revalidate 뒤에는 초가 붙음. 10초마다 갱신?해준다는 말같음
// 그래서 위의 문제점을 해결할 수 있다.

export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://Lim:effort30226@cluster0.jeoaywb.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

// getSeverSideProps는 빌드프로스세스중에는 실행되지 않는다.
// 하지만 deploy(배포)후 서버에서 실행된다.
// 요청(request)가 들어올때 마다 새로운 데이터를 요청한다.
// getSeverSideProps는 요청과 응답에 접속한다.
// getSeverSideProps가 모든 것을 해결해주기 때문에 좀 더 나아보일 수 있다.
// 하지만 인증과 같은 경우에는 getStaticProps가 나음
// 데이터가 자주 바뀌는 경우에는 getSeverSideProps는가 낫다.

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // fetch data from an API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export default HomePage;
