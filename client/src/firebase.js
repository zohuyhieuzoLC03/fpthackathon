// Import the functions you need from the SDKs you need
import axios, { Axios } from "axios";
import { initializeApp } from "firebase/app";
import { getAuth } from  "firebase/auth";
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, query, where, orderBy, startAt, endAt } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAL3vF0Q7yG0Gk62X_VduL6TXt_SbSxOXg",
  authDomain: "hackathon-2-dd10c.firebaseapp.com",
  projectId: "hackathon-2-dd10c",
  storageBucket: "hackathon-2-dd10c.appspot.com",
  messagingSenderId: "1006305813709",
  appId: "1:1006305813709:web:cea76eca19004d1954f584",
  measurementId: "G-XF0RNYY2D2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const getDocumentById = async (documentId, dbName) => {
  try {
    const docRef = doc(db, dbName, documentId);
    const documentSnapshot = await getDoc(docRef);

    if (documentSnapshot.exists()) {
      const data = documentSnapshot.data();
      console.log(data);
      console.log("Succesfully get document", documentId);
      return data;
    } else {
      console.log("Document not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};

//them data vao firebase
const addDataToFirestore = async (m_name, m_data, m_tag, m_isPublic, dbName) => {
  const minValue = 10;
  const maxValue = 200;
  const randomLike = Math.floor(Math.random() * (maxValue - minValue) + minValue);
  const randomDislike = Math.floor(Math.random() * (maxValue - minValue) + minValue);
  try {
    const collectionRef = collection(db, dbName);
    const currentTimeStamp = new Date().getTime();
    let m_uid = null;
    if (auth.currentUser === null) {
      m_uid = null;
    } else {
      m_uid = auth.currentUser.uid;
    }
    const docRef = await addDoc(collectionRef, {
      name: m_name,
      data: m_data,
      uid: m_uid,
      timestamp: currentTimeStamp,
      isPublic: m_isPublic,
      tag: m_tag,
      like: randomLike,
      dislike: randomDislike
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};


// xoa data khoi firebase
const deleteDataFromFirestore = async (id, dbName) => {
  try {
    const collectionRef = collection(db, dbName);
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((doc) => {
      if (doc.id === id) {
        deleteDoc(doc(db, dbName, id));
      }
    });
    console.log("Document deleted with ID: ", id);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

const checkDoneQuizTodayByTimestamp = async (uid) => {
  try {
    const collectionRef = collection(db, "scoreOfQuizzes");
    const querySnapshot = await getDocs(collectionRef);
    const today = new Date();
    const todayTimeStamp = today.getDate();
    let isDoneQuizToday = false;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.uid === uid) {
        const date = new Date(data.timestamp);
        const dateTimeStamp = date.getDate();
        if (todayTimeStamp === dateTimeStamp) {
          isDoneQuizToday = true;
        }
      }
    });
    return isDoneQuizToday;
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};




const updateScoreAndTimestampOfScoreOfQuizzes = async (uid, score) => {
  try {
    const collectionRef = collection(db, "scoreOfQuizzes");
    const querySnapshot = await getDocs(collectionRef);
    let isUpdate = false;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.uid === uid) {
        isUpdate = true;
        if(!checkDoneQuizTodayByTimestamp(uid)) {
          const docRef = doc(db, "scoreOfQuizzes", doc.id);
          updateDoc(docRef, {
            score: score,
            timestamp: new Date().getTime()
          });
        }
        else {
          console.log("You have done quiz today")
        }
      }
    });
    if(!isUpdate) {
      const docRef = await addDoc(collectionRef, {
        uid: uid,
        score: score,
        timestamp: new Date().getTime()
      });
      console.log("Document written with ID: ", docRef.id);
    }
  } catch (error) {
    console.error("Error getting document: ", error);
  }
};

const getRankingOfAllUsers = async () => {
  try {
    const collectionRef = collection(db, "scoreOfQuizzes");
    let queryRef = collectionRef;
    const querySnapshot = await getDocs(queryRef);
    let ranking = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      ranking.push({
        userID: data.uid,
        displayName: getUserNameByUidFromAuthOfFirebase(data.uid),
        picture: "https://qpet.vn/wp-content/uploads/2023/03/avatar-meo-cute-5.jpg",
        score: data.score
      });
    });
    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, 10);
    console.log(ranking);
    return ranking;
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};



const getTotalScoreOfUser = async (uid) => {
  try {
    const collectionRef = collection(db, "scoreOfQuizzes");
    let queryRef = collectionRef;
    if (uid !== undefined) {
      queryRef = query(queryRef, where("uid", "==", uid));
    }
    const querySnapshot = await getDocs(queryRef);
    let totalScore = 0;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalScore += data.score;
    });
    return totalScore;
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};

const addDailyQuizToFirestore = async (m_data) => {
  try {
    const collectionRef = collection(db, "DailyQuiz");
    const currentTimeStamp = new Date().getTime();
    const docRef = await addDoc(collectionRef, {
      data: m_data,
      timestamp: currentTimeStamp
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const getNewestQuizInFirestore = async () => {
  try {
    const collectionRef = collection(db, "DailyQuiz");
    const querySnapshot = await getDocs(collectionRef);
    let newestQuiz = null;
    let newestTimeStamp = 0;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.timestamp > newestTimeStamp) {
        newestTimeStamp = data.timestamp;
        newestQuiz = data.data;
      }
    });
    return newestQuiz;
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};

const checkDoneQuiz = async (uid, quizId) => {
  try {
    const collectionRef = collection(db, "scoreOfQuizzes");
    const querySnapshot = await getDocs(collectionRef);
    let isDone = false;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.uid === uid && data.quizId === quizId) {
        isDone = true;
      }
    });
    return isDone;
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};

// filter query

const getDataFromFirestoreByFilters = async (name, isPublic, tag, uid, startTime, endTime, dbName) => {
  try {
    const collectionRef = collection(db, dbName);

    if(name === "")
    {
      name = undefined;
    }

    let queryRef = collectionRef;
    if (name !== undefined) {
      queryRef = query(queryRef, where("name", "==", name));
    }

    if (isPublic !== undefined) {
      queryRef = query(queryRef, where("isPublic", "==", isPublic));
    }

    if (tag !== undefined && tag !== "All") {
      queryRef = query(queryRef, where("tag", "==", tag));
    }

    if (startTime !== undefined && endTime !== undefined) {
      queryRef = query(queryRef, where("timestamp", ">=", startTime), where("timestamp", "<=", endTime));
    }
    else if( startTime !== undefined) {
      queryRef = query(queryRef, where("timestamp", ">=", startTime));
    }
    else if( endTime !== undefined) {
      queryRef = query(queryRef, where("timestamp", "<=", endTime));
    }

    if (uid !== undefined)
    {
      queryRef = query(queryRef, where("uid", "==", uid))
    }

    const querySnapshot = await getDocs(queryRef);

    const dataWithFilters = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dataWithFilters.push({
        id: doc.id,
        name: data.name,
        data: data.data,
        uid: data.uid,
        timestamp: data.timestamp,
        isPublic: data.isPublic,
        like: data.like,
        dislike: data.dislike,
        tag: data.tag
      });
    });
    // console.log(dataWithFilters);
    return dataWithFilters;
  } catch (error) {
    console.error("Error getting data by filters: ", error);
    return [];
  }
};

const getCurrentUser = () => {
  try {
    return auth.currentUser;
  } catch (error) {
    console.error("Error getting current user: ", error);
    return null;
  }
};

const getCurrentUserEmail = () => {
  try {
    const currentUser = getCurrentUser();
    return currentUser ? currentUser.email : null;
  } catch (error) {
    console.error("Error getting current user email: ", error);
    return null;
  }
};

const getUserNameByUidFromAuthOfFirebase = (uid) => {
  try {
    if(uid === "UEV2LpvEqKUocGOKlJamComMU4Y2")
      return "Test1";
    else if(uid === "a2UK9uEixRRfdhqb3LBPUhQXhWU2")
      return "Nguyen Huy Hieu";
    else if (uid === "nuDxvWZIfqQ3zn1LvBX8I2YQSoQ2")
      return "Nguyen Tuan Duc";
    else if (uid === "9fA4KtyWtQNGfkC7kmKgilQg1WB3")
      return "Nguyen Thi Oanh";
    else if (uid === "songXmSv6LfIZ5gB5ux8klDJU5E3")
      return "Do Duc Huy"
    else if (uid === "9m05jejIMIcILf8nhHWfC4cV0UG2")
      return "Nguyen Tien Hung";
    else if (uid === "gGbGBNjBACSZYWfA1yKDlYkGcOm2")
      return "Cristiano Ronaldo";
    else if (uid === "U3HauttitqSW18Y14E1OUH2Zjn32")
      return "Lionel Messi";
    else if (uid === "WGn2OJFN9ZZO4PEuWPrDLfrujgR2")
      return "Neymar Jr";
    else if (uid === "OmseK5vOFDegFsgFw2AfmZtJs2v2")
      return "Kylian Mbappe";
    else if (uid === "e5MhsLdueQXy3kDfaQHmJg7Xg262")
      return "Mohamed Salah";
    else 
      return "Anonymous"; 
  } catch (error) {
    console.error("Error getting user name by uid: ", error);
    return null;
  }
};

// get specific item with id
const getDataFromFirestoreById = async (id, dbName) => {
  try {
    const docRef = doc(db, dbName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        data: data.data,
        uid: data.uid,
        timestamp: data.timestamp,
        isPublic: data.isPublic,
        like: data.like,
        dislike: data.dislike,
        tag: data.tag
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};



const getLikenDislike = async (mID) => {
  try {
    // count number of document with where isLike field is true
    const querySnapshot = await getDocs(collection(db, "LikeStatus"));
    const isLikeCount = querySnapshot.docs.filter((doc) => (doc.data().isLike === true && doc.data().mapID === mID)).length;
    const isDislikeCount = querySnapshot.docs.filter((doc) => (doc.data().isLike === false && doc.data().mapID === mID)).length;
    return { isLikeCount, isDislikeCount };
  }
  catch (error) {
    console.error("Error getting like and dislike: ", error);
    return null;
  }
};


const setLikeStatus = async (mID, isLike) => {
  try {
    const collectionRef = collection(db, "LikeStatus");
    const docRef = await addDoc(collectionRef, {
      mapID: mID,
      isLike: isLike,
      uid: auth.currentUser.uid
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.log("Error adding document: ", error);
  }
};

export { auth, db, getDocumentById, addDataToFirestore, getCurrentUserEmail, getCurrentUser, getDataFromFirestoreByFilters, getLikenDislike, setLikeStatus, getDataFromFirestoreById,
   getNewestQuizInFirestore, checkDoneQuiz, addDailyQuizToFirestore, getRankingOfAllUsers, updateScoreAndTimestampOfScoreOfQuizzes };