import classNames from "classnames";
import styles from "./ModalAddFight.module.scss";
import Select from 'react-select'
import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface ModalProps {
    id: string;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function ModalAddFight(props: ModalProps) {
    const [user, loading, error] = useAuthState(auth);
    const [FriendsList, setFriendsList] = useState([]);
    const [Friend, setFriend] = useState("");
    const [period, setPeriod] = useState("день");
    const [value, setValue] = useState(0);
    const PersonalCollectionRef = collection(db, "personal_info");
    function Close(id: string) {
        props.setModal(false);
    }
    
    function Nothing(e: any) {
        e.stopPropagation()
    }

    async function getFriends() {
        const data = await getDocs(PersonalCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        const Me = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
        let NeededList: any = [];
        for (let i = 0; i < Me[0].friends.length; i++) {
            const FriendEmail = Me[0].friends[i];
            const F = filteredDocs.filter((x: any) => x.mail.toLowerCase() == FriendEmail);
            NeededList.push({value: F[0].mail, label: F[0].Name});
        }
        setFriend(NeededList[0].value);
        setFriendsList(NeededList);
    }
      
    async function Save(id: string) {
        if (Friend == "" || Math.abs(value) == 0) return;
        const data = await getDocs(PersonalCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        const Me = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
        const FindFriend = filteredDocs.filter((x: any) => x.mail.toLowerCase() == Friend);
        const personal = doc(db, "personal_info", FindFriend[0].id);
        let bids = FindFriend[0].bids; bids.push(
            {
                Who: Me[0].Name,
                email: Me[0].mail,
                period: period,
                price: Math.abs(value)
            }
        );
        await updateDoc(personal, {bids: bids});
        props.setModal(false);
    }

    useEffect(() => {
        getFriends();
    }, [user, loading]);

	return (
    <div onClick={() => Close(props.id)} id={props.id} className={classNames(styles.Screen, "")}>
      <div onClick={(e) => Nothing(e)} className={styles.Modal}>
        <h4 className={styles.Title}>Бой с друзьями</h4>
        <p className={styles.Decs}>Острожно! Можно выиграть награду, но также и проиграть свои чокопай-coins!!!</p>
        
        {/* <div className={styles.Tick}>
            <div className={styles.Rect}>1</div>
            <h5>Задача была выполнена?</h5>
        </div> */}
        <h4 className={styles.TextT}>С кем будете сражаться?</h4>
        <select className={styles.Select} name="category" id="category-select" onChange={e => setFriend(e.target.value)}>
            {FriendsList.map((i: any, index: number) => 
              <option value={i.value}>{i.label}</option>
            )}
        </select>
        <h4 className={styles.TextT}>Период битвы?</h4>
        <select className={styles.Select} name="period" id="period-select" 
              onChange={e => setPeriod(e.target.value)}>
                <option value="день">Ежедневно</option>
                <option value="неделя">Еженедельно</option>
                <option value="месяц">Ежемесячно</option>
        </select>
        <div className={styles.Together}>
              <input placeholder="Ставка" className={styles.Input} type="number" onChange={(e: any) => setValue(e.target.value)} />
              <hr className={styles.Hr} />
        </div>
        <button onClick={() => Save(props.id)} className={styles.SaveButton}>Отправить заявку</button>
      </div>
    </div>
	);
  }

export default ModalAddFight;
