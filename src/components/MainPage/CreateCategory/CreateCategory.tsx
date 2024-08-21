import styles from "./CreateCategory.module.scss";
import {auth, db} from "../../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AI, Alarm, Cloud, Dollar, health, Languages, motivate, Plane, Work } from "../../../assets";
import Select, { components } from "react-select";

interface props {
    setOpenModalCategory: React.Dispatch<React.SetStateAction<boolean>>,
    getHabitsList: () => Promise<void>;
};

const options = [
    { value: "Alarm", label: "Предупреждение", icon: Alarm },
    { value: "AI", label: "ИИ", icon: AI },
    { value: "Cloud", label: "Облако", icon: Cloud },
    { value: "Plane", label: "Самолет", icon: Plane },
    { value: "Work", label: "Работа", icon: Work },
    { value: "Health", label: "Здоровье", icon: health },
    { value: "Dollar", label: "Деньги", icon: Dollar },
    { value: "Languages", label: "Языки", icon: Languages },
    { value: "Motivate", label: "Мотивация", icon: motivate },
  ];
  
  const { Option } = components;
  const IconOption = (props: any) => (
    <Option {...props}>
        <div className={styles.Chooses}>
            <img
                src={props.data.icon}
                style={{ width: 36 }}
                alt={props.data.label}
            />
            <h4 className={styles.ChoosesH}>{props.data.label}</h4>
        </div>
    </Option>
  );


function CreateCategory(props: props) {
  const [title, setTitle] = useState("");
  const [UserChoice, setUserChoice] = useState({value: "Alarm", icon: Alarm, label: "Предупреждение"});
  const [user] = useAuthState(auth);
  const CategoryCollectionRef = collection(db, "categories");

  async function Create() {
    const data = await getDocs(CategoryCollectionRef);
    let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
    filteredDocs = filteredDocs.filter((x: any) => x.ForUser.toLowerCase() == user?.email);
    const C = doc(db, "categories", filteredDocs[0].id);
    let CT = filteredDocs[0].categories;
    CT.push({
      value: title,
      icon: UserChoice.icon,
    });
    await updateDoc(C, {categories: CT});
    props.setOpenModalCategory(false);
    props.getHabitsList();
  }
  
  function Close() {
    props.setOpenModalCategory(false);
  }

  return (
    <div onClick={Close} className={styles.Screen}>
      <div onClick={(e) => e.stopPropagation()} className={styles.CreateHabit}>
      <div className={styles.CreateHabitInputs}>
            <div className={styles.CreateHabitTogether}>
              <input placeholder="Название" className={styles.CreateHabitInput} type="text" onChange={(e) => setTitle(e.target.value)} />
              <hr className={styles.CreateHabitHr} />
            </div>
            <div className={styles.CreateHabitTogether}>
              <h4>Картинка</h4>
              <Select
                    id="CategorySelect"
                    onChange={(choice: any) => setUserChoice(choice)}
                    defaultValue={options[0]}
                    options={options}
                    components={{ Option: IconOption }}
                />
            </div>
          </div>
          <button className={styles.In} onClick={() => Create()}>Создать</button>
      </div>
    </div>
  );
}

export default CreateCategory;
