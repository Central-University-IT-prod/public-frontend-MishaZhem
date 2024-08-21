import styles from "./ModalCategory.module.scss";
import {auth, db} from "../../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AI, Alarm, Cloud, Dollar, health, Languages, motivate, Plane, Work } from "../../../assets";
import Select, { components } from "react-select";
import classNames from "classnames";

interface props {
  setOpenModalChange: React.Dispatch<React.SetStateAction<boolean>>,
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


function ModalCategory(props: props) {
  const [user, loading, error] = useAuthState(auth);
  const [What, setWhat] = useState({value: "Alarm", icon: Alarm, label: "Предупреждение"});
  const [ListHave, setListHave] = useState([{
    value: "Выбрать",
    label: "Выбрать",
    icon: ""
  }]);
  const [title, setTitle] = useState("");
  const [UserChoice, setUserChoice] = useState({
    value: "Выбрать",
    label: "Выбрать",
    icon: ""
  });
  const CategoryCollectionRef = collection(db, "categories");

  async function Create() {
    if (UserChoice.value == "Выбрать") return;
    const data = await getDocs(CategoryCollectionRef);
    let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
    filteredDocs = filteredDocs.filter((x: any) => x.ForUser.toLowerCase() == user?.email);
    let CT = filteredDocs[0].categories; let NewC = []; let find = false;
    for (let i = 0; i < CT.length; i++) {
      if (!find && CT[i].value == UserChoice.value && CT[i].icon == UserChoice.icon) {
        find = true;
        NewC.push({
          value: title,
          icon: What.icon,
        })
      } else {  
        NewC.push({
          value: CT[i].value,
          icon: CT[i].icon,
        })
      }
    }
    const C = doc(db, "categories", filteredDocs[0].id);
    await updateDoc(C, {categories: NewC});
    props.setOpenModalChange(false);
    props.getHabitsList();
  }

  const getCategoryList = async () => {
    try {
      const data = await getDocs(CategoryCollectionRef);
      let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
      filteredDocs = filteredDocs.filter((x: any) => x.ForUser.toLowerCase() == user?.email);
      let CT = filteredDocs[0].categories;
      let NewC = [];
      NewC.push({
        value: "Выбрать",
        label: "Выбрать",
        icon: ""
      });
      for (let i = 0; i < CT.length; i++) {
        NewC.push({
          value: CT[i].value,
          label: CT[i].value,
          icon: CT[i].icon,
        })
      }
      setListHave(NewC);
    } catch {}
  }
  
  function Close() {
    props.setOpenModalChange(false);
  }

  useEffect(() => {
    getCategoryList();
  }, [user, loading]);

  return (
    <div onClick={Close} className={styles.Screen}>
      <div onClick={(e) => e.stopPropagation()} className={styles.CreateHabit}>
      <div className={styles.CreateHabitInputs}>
          <div className={styles.CreateHabitTogether}>
          <h4>Какую категорию хотите заменить?<br/>(Можно изменять только вами созданные категории)</h4>
            <Select
                id="CategorySelect"
                onChange={(choice: any) => setUserChoice(choice)}
                defaultValue={{value: ListHave[0].value, label: ListHave[0].label}}
                options={ListHave}
                components={{ Option: IconOption }}
            />
            </div>
            <div className={styles.CreateHabitTogether}>
              <input placeholder="Новое Название" className={styles.CreateHabitInput} type="text" onChange={(e) => setTitle(e.target.value)} />
              <hr className={styles.CreateHabitHr} />
            </div>
            <div className={styles.CreateHabitTogether}>
              <h4>Картинка</h4>
              <Select
                    id="CategorySelect"
                    onChange={(choice: any) => setWhat(choice)}
                    defaultValue={options[0]}
                    options={options}
                    components={{ Option: IconOption }}
                />
            </div>
          </div>
          <button className={classNames(styles.In, (UserChoice.value == "Выбрать" ? styles.InActive : ""))} onClick={() => Create()}>Изменить</button>
      </div>
    </div>
  );
}

export default ModalCategory;
