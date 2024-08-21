import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { getTime, Skipped, DoneActive, Next } from "../functions";
import ModalHabit from "../ModalHabit/ModalHabit";
import styles from "../MainPage.module.scss";
import addNotification from 'react-push-notification';
import {auth, db} from "../../../config/firebase"
import { done, SmHealth } from "../../../assets";
import classNames from "classnames";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import DateStore from "../../../store/Date/Date";

interface CardProps {
    id: string;
    title: string;
    category: string;
    targetValue: number;
    lastChange: string;
    lastResult: number;
    period: string;
    history: any;
    addDate: string;
    type: boolean;
    background: string;
    backgroundSm: string;
    getHabitsList: () => Promise<void>;
}

function Skipp(title: string) {
    try {  
      addNotification({
        title: 'Вы пропустили "' + title + '"!',
        subtitle: 'Невыполненная норма влечет за собой последствия! -5 xp',
        message: 'Невыполненная норма влечет за собой последствия! -5 xp',
        theme: 'darkblue',
        native: true
      });
    }catch {}
} 

function Skipp2(title: string) {
  try {  
    addNotification({
      title: 'Вы пропустили "' + title + '"! Но вы купили пропуск',
      subtitle: 'Никаких негативных последсвтий на этот раз не будет',
      message: 'Никаких негативных последсвтий на этот раз не будет',
      theme: 'darkblue',
      native: true
    });
  }catch {}
} 


function Card(props: CardProps) {
    function OpenCard() {
      document.getElementById("Modal" + props.id)?.classList.remove("hidden");
    }
    const [user, loading, error] = useAuthState(auth);
    const PersonalCollectionRef = collection(db, "personal_info");
    const [doneRes, setDoneRes] = useState(false);
    const [left, setLeft] = useState("");
    const Example = document.getElementsByClassName(styles.LineHow)[0];
    let lastResult = props.lastResult; 
    let Width = 0;
    if (Example != null) {
      const WidthExample = Example.getBoundingClientRect().width;
      Width = WidthExample * Math.min(1, lastResult / props.targetValue);
    }


    async function Update() {
      let From = parseInt(props.lastChange);
      for (let i = 0; i < props.history.length; i++) {
        From = Math.max(From, parseInt(props.history[i]));
      }
      setLeft(await getTime(props.addDate, props.period));
      setDoneRes(await DoneActive(props.addDate, props.period, From.toString(), props.lastResult >= props.targetValue));
      const data = await getDocs(PersonalCollectionRef);
      let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
      filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
      const Me = doc(db, "personal_info", filteredDocs[0].id);
      const Skip = await Skipped(props.addDate, props.period, From.toString(), props.lastResult >= props.targetValue);
      if (Skip && props.title != null) {
        lastResult = 0;
        const habits = doc(db, "habits", props.id);
        updateDoc(habits, {lastResult: 0, lastChange: (await DateStore.GetTime()).toString()});
        if (filteredDocs[0].CanSkip > 0) {
          Skipp2(props.title);
          await updateDoc(Me, {CanSkip: filteredDocs[0].CanSkip - 1});
        } else {  
          Skipp(props.title);
          await updateDoc(Me, {xp: Math.max(0, filteredDocs[0].xp - 5), WithoutGap: 0});
        }
      }
      try {
        const NextOrNot = await Next(props.addDate, props.period, From.toString(), props.lastResult >= props.targetValue);
        if (NextOrNot) {
          lastResult = 0;
          const habits = doc(db, "habits", props.id);
          updateDoc(habits, {lastResult: 0});
        }
      } catch {}
    }

    useEffect(() => {
      Update();
    }, [user, loading]);
    return (
      <>
        <ModalHabit getHabitsList={props.getHabitsList} id={props.id} title={props.title} type={props.type} targetValue={props.targetValue} lastResult={lastResult}></ModalHabit>
        <div onClick={OpenCard} id={props.id} className={styles.Card}>
          <div className={styles.CardUpper}>
            <h4 className={styles.CardText}>{props.title}</h4>
            {!props.type ? 
            <div className={styles.CardTick}>
              {doneRes ? <img src={done} alt="" className={styles.DoneTick} /> : ""}
            </div> : ""}
          </div>
          <div className={styles.CardBottom}>
            <div className={styles.CardCat}>
              <img src="" alt="" className={styles.ImgCatalogue} />
              <h4 className={styles.CardNameS}>{props.category}</h4>
            </div>
            <div className={styles.CardLeft}>
              {doneRes ? <h5 className={classNames(styles.CardNameSm, styles.End)}>Готово!</h5> : 
                <>
                  {props.type ? <div className={styles.CardLeftUp}>
                    <h5 className={styles.CardNameS}>{lastResult}/{props.targetValue}</h5>
                    <div className={styles.LineHow}>
                      <div style={{width: Width}} className={styles.GreenLine}></div>
                    </div>
                  </div> : ""}
                  <h4 className={styles.CardNameS}>{left}</h4>
                </>
              }
            </div>
          </div>
          <picture className={styles.CardBackground}>
            <source
                media="(max-width: 530px)"
                srcSet={`${props.backgroundSm} 530w`}
                sizes="530px"
            />
            <source srcSet={`${props.background} 1251w`} sizes="1251px" />
            <img src={props.background} className={styles.CardIMG}  alt="" />
          </picture>
        </div>
      </>
    );
}

export {
    Card,
}