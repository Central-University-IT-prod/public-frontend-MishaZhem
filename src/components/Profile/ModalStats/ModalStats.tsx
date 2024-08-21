import styles from "./ModalStats.module.scss";
import {auth, db} from "../../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { getDocs, collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import 'react-calendar/dist/Calendar.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface props {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
}

const data = [
    {
      name: 'пн',
      You: 0,
    },
    {
      name: 'вт',
      You: 0,
    },
    {
      name: 'ср',
      You: 0,
    },
    {
      name: 'чт',
      You: 0,
    },
    {
      name: 'пт',
      You: 0,
    },
    {
      name: 'сб',
      You: 0,
    },
    {
      name: 'вс',
      You: 0,
    },
];

function ModalStats(props: props) {
  const [user, loading, error] = useAuthState(auth);
  const HabitsCollectionRef = collection(db, "habits");
  const [AllDone, setAllDone] = useState(0);
  const [Width, setWidth] = useState(500);
  const [Data, setData] = useState(data);

  function Close() {
    props.setOpenModal(false);
  }

  async function getInfo() {
        if (window.innerWidth < 650) {
          setWidth(300);
        } else {
          setWidth(500);
        }
        const data = await getDocs(HabitsCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        filteredDocs = filteredDocs.filter((x: any) => x.ForUser.toLowerCase() == user?.email);
        let cntDone = 0;
        let DaysWeek = [0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < filteredDocs.length; i++) {
          cntDone += filteredDocs[i].allDone;
          for (let j = 0; j < filteredDocs[i].history.length; j++) {
            const DateCur = new Date(parseInt(filteredDocs[i].history[j]));
            DaysWeek[DateCur.getDay() - 1]++;
          }
        }
        let ans = [];
        ans.push({name: 'пн', You: DaysWeek[0]});
        ans.push({name: 'вт', You: DaysWeek[1]});
        ans.push({name: 'ср', You: DaysWeek[2]});
        ans.push({name: 'чт', You: DaysWeek[3]});
        ans.push({name: 'пт', You: DaysWeek[4]});
        ans.push({name: 'сб', You: DaysWeek[5]});
        ans.push({name: 'вс', You: DaysWeek[6]});
        setData(ans);
        setAllDone(cntDone);
  }

  useEffect(() => {
    getInfo();
  }, [user, loading]);

  return (
    <div onClick={Close} className={styles.Screen}>
      <div onClick={(e) => e.stopPropagation()} className={styles.CreateHabit}>
          <div className={styles.CreateHabitInputs}>
            <div className={styles.CreateHabitTogether}>
              <h4>График по дням неделям</h4>
                <LineChart
                width={Width}
                height={300}
                data={Data}
                className={styles.Graph}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#FFF" />
                <YAxis stroke="#FFF" />
                <Tooltip />
                <Legend />
                {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} /> */}
                <Line type="monotone" dataKey="You" stroke="#82ca9d" />
                </LineChart>
            </div>
            <div className={styles.CreateHabitTogether}>
              <h4>Всего выполнено привычек: {AllDone}</h4>
            </div>
          </div>
          <button className={styles.In} onClick={Close}>Закрыть</button>
      </div>
    </div>
  );
}

export default ModalStats;
