import styles from "./ModalReadyOptions.module.scss";
import {auth, db} from "../../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocs, collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Select, { components } from "react-select";
import { health, motivate, Work } from "../../../assets";
import { ReadyOptions } from "../../../constants";

interface props {
    getHabitsList: () => Promise<void>,
    setModalReadyOptions: React.Dispatch<React.SetStateAction<boolean>>,
}


const options = [
  { value: "Качать пресс", label: "Качать пресс", icon: health },
  { value: "Чтение книг", label: "Чтение книг", icon: motivate },
  { value: "Регулярные пробежки", label: "Регулярные пробежки", icon: health },
  { value: "Пить воду 2000мл", label: "Пить воду 2000мл", icon: health },
  { value: "Закончить PROD проект", label: "Закончить PROD проект", icon: motivate },
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


function ModalReadyOptions(props: props) {
  const [user, loading, error] = useAuthState(auth);
  const [UserChoice, setUserChoice] = useState({value: "Качать пресс", icon: health, label: "Качать пресс"});

  async function Create(props: props) {
    if (user?.email == null) {
      await props.getHabitsList();
      props.setModalReadyOptions(false);
      return;
    }
    ReadyOptions(UserChoice.value, user?.email);
    await props.getHabitsList();
    props.setModalReadyOptions(false);
  }
  
  function Close() {
    props.setModalReadyOptions(false);
  }
  
  return (
    <div onClick={Close} className={styles.Screen}>
      <div onClick={(e) => e.stopPropagation()} className={styles.CreateHabit}>
          <div className={styles.CreateHabitInputs}>
              <div className={styles.CreateHabitTogether}>
                <h4>Категория</h4>
                <Select
                    id="CategorySelect"
                    onChange={(choice: any) => setUserChoice(choice)}
                    defaultValue={options[0]}
                    options={options}
                    components={{ Option: IconOption }}
                />
              </div>
            
            
          </div>
          <button className={styles.In} onClick={() => Create(props)}>Создать</button>
      </div>
    </div>
  );
}

export default ModalReadyOptions;
