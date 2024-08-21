import styles from "./CreateHabit.module.scss";
import {auth, db} from "../../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocs, collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import DateStore from "../../../store/Date/Date";

interface props {
    newCat: any,
    getHabitsList: () => Promise<void>,
    setOpenModalCreate: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenModalCategory: React.Dispatch<React.SetStateAction<boolean>>,
    setModalReadyOptions: React.Dispatch<React.SetStateAction<boolean>>
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function CreateHabit(props: props) {
  const [title, setTitle] = useState("");
  const [addDate, setAddDate] = useState("");
  const [category, setCategory] = useState("Физическая активность");
  const [period, setPeriod] = useState("Ежедневно");
  const [checked, setChecked] = useState(false);
  const [targetValue, setTargetValue] = useState(1);
  const [user] = useAuthState(auth);
  const HabitsCollectionRef = collection(db, "habits");

  function handleChange() {
		setChecked(!checked);
	}

  async function Create(props: props) {
    const type = checked;
    await addDoc(HabitsCollectionRef, {
      title: title,
      targetValue: (!type ? 1 : targetValue),
      period: period,
      category: category,
      addDate: (await DateStore.GetTime()).toString(),
      lastResult: 0,
      lastChange: ((await DateStore.GetTime()) + 1).toString(),
      type: type,
      ForUser: user?.email,
      visibility: true,
      allDone: 0,
      history: [],
    })
    await props.getHabitsList();
    props.setOpenModalCreate(false);
  }
  
  function Close() {
    props.setOpenModalCreate(false);
  }

  function CreateCategory() {
    props.setOpenModalCategory(true);
    props.setOpenModalCreate(false);
  }

  function ModalOptions() {
    props.setModalReadyOptions(true);
    props.setOpenModalCreate(false);
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
              <h4>Категория</h4>
              <select className={styles.Select} name="category" id="category-select"
              onChange={e => setCategory(e.target.value)}>
                <option value="Физическая активность">Физическая активность</option>
                <option value="Спокойствие">Спокойствие</option>
                <option value="Саморазвитие">Саморазвитие</option>
                <option value="Языки">Языки</option>
                <option value="Финансовая грамотность">Финансовая грамотность</option>
                {props.newCat.map((i: any, index: number) => 
                  <option value={i.value}>{i.value}</option>
                )}
              </select>
            </div>
            <div className={styles.CreateHabitTogether}>
              <h4>Частота выполения</h4>
              <select className={styles.Select} name="period" id="period-select" 
              onChange={e => setPeriod(e.target.value)}>
                <option value="Ежедневно">Ежедневно</option>
                <option value="Еженедельно">Еженедельно</option>
                <option value="Ежемесячно">Ежемесячно</option>
              </select>
            </div>
            <div className={styles.CreateHabit_Checkbox}>
                <input checked={checked} onChange={handleChange} type="checkbox" id="scales" name="scales" />
                <label className={styles.Label} htmlFor="scales">Количественная цель?</label>
            </div>
            {checked ? 
            <div className={styles.CreateHabitTogether}>
              <input placeholder="До скольки?" className={styles.CreateHabitInput} type="number" onChange={(e) => setTargetValue(!isNaN(Number(e.target.value)) ? parseInt(e.target.value) : 0)} />
              <hr className={styles.CreateHabitHr} />
            </div> : ""}
            
          </div>
          <h4 onClick={CreateCategory} className={styles.Not}>Нет нужной категории? <span className={styles.NotH}>Тогда добавь её!</span></h4>
          <h4 onClick={ModalOptions} className={styles.Not}>Сложно придумать? <span className={styles.NotH}>Посмотрите на готовые варианты!</span></h4>
          <button className={styles.In} onClick={() => Create(props)}>Создать</button>
      </div>
    </div>
  );
}

export default CreateHabit;
