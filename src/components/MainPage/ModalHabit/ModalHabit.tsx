import classNames from "classnames";
import styles from "./ModalHabit.module.scss";
import {auth, db} from "../../../config/firebase"
import { getDocs, collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useState } from "react";
import { done } from "../../../assets";
import addNotification from 'react-push-notification';
import { useAuthState } from "react-firebase-hooks/auth";
import DateStore from "../../../store/Date/Date";

interface ModalProps {
  id: string;
  title: string;
  targetValue: number;
  lastResult: number;
  type: boolean;
  getHabitsList: () => Promise<void>;
}

function ModalHabit(props: ModalProps) {
  const [First, setFirst] = useState(false);
  const [Second, setSecond] = useState(false);
  const [Third, setThird] = useState(false);
  const [value, setValue] = useState(props.lastResult);
  const [user, loading, error] = useAuthState(auth);
  const PersonalCollectionRef = collection(db, "personal_info");
  const HabitsCollectionRef = collection(db, "habits");
  function Close(id: string) {
    document.getElementById(id)?.classList.add("hidden");
  }

  function Nothing(e: any) {
    e.stopPropagation()
  }

  async function Save(id: string) {
    const habits = doc(db, "habits", id);
    const V = (First ? 1 : value);
    if (!Third && !Second && V >= props.targetValue) { 
      const data = await getDocs(PersonalCollectionRef);
      let filteredDocsST: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
      let filteredDocs: any = filteredDocsST.filter((x: any) => x.mail.toLowerCase() == user?.email);
      const Me = doc(db, "personal_info", filteredDocs[0].id);
      let Fights = filteredDocs[0].Fights; 
      for (let i = 0; i < Fights.length; i++) {
        Fights[i].Me++;
      }
      const WithoutGap = filteredDocs[0].WithoutGap + 1;
      const xp = 5 * WithoutGap;
      await updateDoc(Me, {WithoutGap: WithoutGap, xp: filteredDocs[0].xp + xp, Fights: Fights});
      addNotification({
        title: 'Отлично!',
        subtitle: 'Вы выполнили "' + props.title + '"! Получено ' + xp + ' xp',
        message: 'Вы выполнили "' + props.title + '"! Получено ' + xp + ' xp',
        theme: 'darkblue',
        native: true
      });
      try {
        for (let i = 0; i < filteredDocsST.length; i++) {
          for (let j = 0; j < filteredDocsST[i].Fights.length; i++) {
            let Fights = filteredDocsST[i].Fights; 
            if (Fights[j].email.toLowerCase() == user?.email) {
              Fights[j].Op++;
            }
            const Oppon = doc(db, "personal_info", filteredDocsST[i].id);
            await updateDoc(Oppon, {Fights: Fights});
          }
        }
      } catch {}
    }

    const data2 = await getDocs(HabitsCollectionRef);
    let filteredDocs2: any = data2.docs.map((doc) => ({...doc.data(), id: doc.id}));
    filteredDocs2 = filteredDocs2.filter((x: any) => x.ForUser.toLowerCase() == user?.email && x.id == id);
    let H = filteredDocs2[0].history;
    H.push((await DateStore.GetTime()).toString());
    if (Third) await deleteDoc(habits);
    else {
      if (V >= props.targetValue) {
        await updateDoc(habits, {
          lastResult: V, 
          lastChange: (await DateStore.GetTime()).toString(), 
          visibility: !Second,
          allDone: filteredDocs2[0].allDone+1,
          history: H,
        });
      } else {
        await updateDoc(habits, {lastResult: V, lastChange: (await DateStore.GetTime()).toString(), visibility: !Second});
      }
    }
    props.getHabitsList();
    Close("Modal" + props.id);
  }

  return (
    <div onClick={() => Close("Modal" + props.id)} id={"Modal" + props.id} className={classNames(styles.Screen, "hidden")}>
      <div onClick={(e) => Nothing(e)} className={styles.Modal}>
        <h4 className={styles.Title}>{props.title}</h4>
        {
          props.lastResult >= props.targetValue ? 
          <div className={styles.Tick}>
            <h5>Вы уже выполнили норму!</h5>
          </div>
          : 
          (!props.type ?  
          <div className={styles.Tick}>
            <div onClick={() => setFirst(!First)} className={styles.Rect}>{First ? <img src={done} alt="" className={styles.DoneTick} /> : ""}</div>
            <h5>Задача была выполнена?</h5>
          </div> : 
          <div className={styles.TypeSecond}>
              <h4>Выполнено</h4>
              <div className={styles.InTogether}>
              <input onChange={(e) => setValue(!isNaN(Number(e.target.value)) ? parseInt(e.target.value) : 0)} type="number" className={styles.InInput} />
              <hr className={styles.InHr} />
              </div>
              <h4>/{props.targetValue}</h4>
          </div>)
        }
        
        <div className={styles.Tick}>
          <div onClick={() => setSecond(!Second)} className={styles.Rect}>{Second ? <img src={done} alt="" className={styles.DoneTick} /> : ""}</div>
          <h5>Удалить задачу?</h5>
        </div>
        <div className={styles.Tick}>
          <div onClick={() => setThird(!Third)} className={styles.Rect}>{Third ? <img src={done} alt="" className={styles.DoneTick} /> : ""}</div>
          <h5>Удалить задачу и всю ее историю?</h5>
        </div>
        <button onClick={() => Save(props.id)} className={styles.SaveButton}>Сохранить</button>
      </div>
    </div>
  );
}

export default ModalHabit;
