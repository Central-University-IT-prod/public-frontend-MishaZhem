import classNames from "classnames";
import styles from "./ModalJson.module.scss";
import {auth, db} from "../../../config/firebase"
import { getDocs, collection, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { done } from "../../../assets";
import { Store } from 'react-notifications-component';
import { contains, getIndex, ToNormalPeriod } from "./functions";
import { useAuthState } from "react-firebase-hooks/auth";
import addNotification from 'react-push-notification';

interface ModalProps {
  setOpenModalJson: React.Dispatch<React.SetStateAction<boolean>>;
  getHabitsList: () => Promise<void>;
}

const CategoriesHave = [
  "Физическая активность",
  "Спокойствие",
  "Саморазвитие",
  "Языки",
  "Финансовая грамотность",
]

function ModalJson(props: ModalProps) {
  const [user, loading, error] = useAuthState(auth);
  const [file, setFile] = useState(null);
  const [CategoryList, setCategoryList] = useState([]);
  const HabitsCollectionRef = collection(db, "habits");
  const CategoryCollectionRef = collection(db, "categories");
  const PersonalCollectionRef = collection(db, "personal_info");

  function Close() {
    props.setOpenModalJson(false);
  }

  function Nothing(e: any) {
    e.stopPropagation()
  }

  async function CreateCategory(title: string) {
    const data = await getDocs(CategoryCollectionRef);
    let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
    filteredDocs = filteredDocs.filter((x: any) => x.ForUser.toLowerCase() == user?.email);
    const C = doc(db, "categories", filteredDocs[0].id);
    let CT = filteredDocs[0].categories;
    CT.push({
      value: title,
      icon: "/frontend-MishaZhem/src/assets/categories/Alarm.svg",
    });
    await updateDoc(C, {categories: CT});
    props.getHabitsList();
  }

  async function GetCategoryList() {
    const data2 = await getDocs(CategoryCollectionRef);
    let filteredDocs2: any = data2.docs.map((doc) => ({...doc.data(), id: doc.id}));
    filteredDocs2 = filteredDocs2.filter((x: any) => x.ForUser.toLowerCase() == user?.email);
    let G: any = [];
    for (let i = 0; i < filteredDocs2[0].categories.length; i++) {
      G.push(filteredDocs2[0].categories[i].value);
    }
    setCategoryList(G);
  }

  useEffect(() => {
    GetCategoryList();
  }, [user, loading]);

  function handleFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      try {
        const json = JSON.parse(e.target.result);
        setFile(json);
        let Habits: any = {};
        let IndexDays: any = {};
        let Keys = [];
        // let AllKeys = new set();
        for (let i = 0; i < json.habits.length; i++){
          Keys.push(json.habits[i].id);
          const Category = json.habits[i].category;
          const addDate = new Date(json.habits[i].addDate).getTime().toString();
          if (contains(CategoryList, Category) || contains(CategoriesHave, Category)) {}
          else {
            CreateCategory(Category);
          }
          IndexDays[json.habits[i].id] = {};
          if (json.habits.targetValue == null) { // кол-во
            Habits[json.habits[i].id] = {
              title: json.habits[i].title,
              targetValue: 1,
              period: ToNormalPeriod[json.habits[i].period],
              category: Category,
              addDate: addDate,
              lastResult: 0,
              lastChange: (parseInt(json.habits[i].addDate)+1).toString(),
              type: false,
              ForUser: user?.email,
              visibility: true,
              allDone: 0,
              history: [],
            }
          } else { // не кол-во
            Habits[json.habits[i].id] = {
              title: json.habits[i].title,
              targetValue: json.habits[i].targetValue,
              period: ToNormalPeriod[json.habits[i].period],
              category: Category,
              addDate: json.habits[i].addDate,
              lastResult: 0,
              lastChange: (parseInt(json.habits[i].addDate)+1).toString(),
              type: true,
              ForUser: user?.email,
              visibility: true,
              allDone: 0,
              history: [],
            }
          }
        }
        let cnt = 0;
        for (let i = 0; i < json.actions.length; i++) {
          const Id = json.actions[i].id;
          const date = new Date(json.actions[i].date).getTime().toString();
          const Index = getIndex(Habits[Id].addDate, Habits[Id].period, date);
          if ( IndexDays[Id][Index] >= Habits[Id].targetValue) continue; // уже поставили в эту дату точку
          if (json.habits.value == null) { // не кол-во
            IndexDays[Id][Index] = 1;
            Habits[Id].allDone++; Habits[Id].history.push(date);
            cnt++;
          } else { // кол-во
            IndexDays[Id][Index] += json.actions[i].value;
            if (IndexDays[Id][Index] >= Habits[Id].targetValue) {
              Habits[Id].allDone++; Habits[Id].history.push(date);
              cnt++;
            }
          }
        }
        for (let i = 0; i < Keys.length; i++) {
          const Id = Keys[i];
          addDoc(HabitsCollectionRef, Habits[Id]);
        }
        const data = await getDocs(PersonalCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
        const Me = doc(db, "personal_info", filteredDocs[0].id);
        const WithoutGap = filteredDocs[0].WithoutGap + 1;
        const xp = cnt * 5 * WithoutGap;
        await updateDoc(Me, {WithoutGap: WithoutGap, xp: filteredDocs[0].xp + xp}); 
        props.getHabitsList();
        props.setOpenModalJson(false);
        
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };
    reader.readAsText(file);
  }

  async function Save() {
    // const habits = doc(db, "habits", id);
    // const V = (First ? 1 : value);
    // if (Second) await deleteDoc(habits);
    // else await updateDoc(habits, {lastResult: V, lastChange: Date.now().toString()});
    // props.getHabitsList();
    Close();
  }

  return (
    <div onClick={() => Close()} className={classNames(styles.Screen)}>
      <div onClick={(e) => Nothing(e)} className={styles.Modal}>
        <h4 className={styles.Title}>Загрузите json файл<br/>(Только для жюри)</h4>
        <input type="file" accept=".json" onChange={handleFileChange} id="fileread" name="" />
        <button onClick={() => Save()} className={styles.SaveButton}>Сохранить</button>
      </div>
    </div>
  );
}

export default ModalJson;
