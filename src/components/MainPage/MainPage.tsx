import { All, CardBackground2, CardHabits1, CardHabits2, CardHabits3, CardMain1, CardMain1Sm, CardMain2, CardMain2Sm, CardMain3, CardMain3Sm, Change, Dollar, done, health, jsonIco, Languages, motivate, SmHealth, smile, Take } from "../../assets";
import Header from "../Header/Header"
import styles from "./MainPage.module.scss";
import {auth, db} from "../../config/firebase"
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { json, useNavigate } from "react-router-dom";
import CreateHabit from "./CreateHabit/CreateHabit";
import addNotification from 'react-push-notification';
import {
  Eventcalendar,
  getJson,
  MbscCalendarEvent,
  MbscEventcalendarView,
  MbscEventClickEvent,
  setOptions,
  Toast, localeRu,
} from '@mobiscroll/react';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from "classnames";
import { Card } from "./ModalHabit/ExtraComponents";
import { DoneActive, GetEventCalendar, getRandomColor, ToNext } from "./functions";
import ModalJson from "./ModalJson/ModalJson";
import CreateCategory from "./CreateCategory/CreateCategory";
import ModalCategory from "./ModalCategory/ModalCategory";
import ModalReadyOptions from "./ModalReadyOptions/ModalReadyOptions";
import DateStore from "../../store/Date/Date";

interface PropsCatalogue {
  image: string;
  title: string;
};

function Catalogue(props: PropsCatalogue) {
  return (
      <img src={props.image} className={styles.CatalogueCardImg} alt="" />

  );
}

setOptions({
  locale: localeRu,
  theme: 'windows',
  themeVariant: 'dark'
});

function MainPage() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(true);
  const [ChooseCat, setChooseCat] = useState(-1);
  const [HabitsList, setHabitsList] = useState([{id: '1'}]);
  const [CategoryList, setCategoryList] = useState([{id: '1'}]);
  const [AllTasks, setAllTasks] = useState(1);
  const [DoneTasks, setDoneTasks] = useState(1);
  const [WidthLine, setWidthLine] = useState(1);
  const [ModalReadyOptionsT, setModalReadyOptions] = useState(false);
  const [OpenModalChange, setOpenModalChange] = useState(false);
  const [OpenModalCategory, setOpenModalCategory] = useState(false);
  const [OpenModalCreate, setOpenModalCreate] = useState(false);
  const [OpenModalJson, setOpenModalJson] = useState(false);
  const HabitsCollectionRef = collection(db, "habits");
  const CategoryCollectionRef = collection(db, "categories");
  const PersonalCollectionRef = collection(db, "personal_info");
  const BackCards = [CardMain1, CardMain2, CardMain3];
  const BackCardsSm = [CardMain1Sm, CardMain2Sm, CardMain3Sm];
  const [myEvents, setEvents] = useState([{}]);

  if (user == null) {
    navigate("/login");
  }

  const getHabitsList = async () => {
    setisLoading(true);
    try {
      const data = await getDocs(HabitsCollectionRef);
      let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
      filteredDocs = filteredDocs.filter((x: any) => x.ForUser.toLowerCase() == user?.email);
      setHabitsList(filteredDocs);
      setisLoading(false);
      let EventList = [];
      let cntAll = 0; let cntDone = 0;
      for (let i = 0; i < filteredDocs.length; i++) {
        if (filteredDocs[i].visibility) {cntAll++;}
        else {continue;}
        let Ans = await GetEventCalendar(filteredDocs[i].addDate, filteredDocs[i].period);
        const doneRes = await DoneActive(filteredDocs[i].addDate, filteredDocs[i].period, filteredDocs[i].lastChange, filteredDocs[i].lastResult >= filteredDocs[i].targetValue);
        if (doneRes) { cntDone++; continue; }
        EventList.push(
          {
            "start": Ans[0],
            "end": Ans[1],
            "title": filteredDocs[i].title,
            "color": getRandomColor(),
          }
        )
      }
      let LineWidth = 452;
      if (window.innerWidth <= 1080) LineWidth = 352;
      setWidthLine(LineWidth * (cntDone / cntAll));
      setAllTasks(cntAll);
      setDoneTasks(cntDone);
      setEvents(EventList);

      const data2 = await getDocs(CategoryCollectionRef);
      let filteredDocs2: any = data2.docs.map((doc) => ({...doc.data(), id: doc.id}));
      filteredDocs2 = filteredDocs2.filter((x: any) => x.ForUser.toLowerCase() == user?.email);
      setCategoryList(filteredDocs2[0].categories);

    } catch (err) {
      setisLoading(false);
    }
  }

  async function Filter(sort: string) {
    if (sort == "") {getHabitsList(); return;}
    setisLoading(true);
    try {
      const data = await getDocs(HabitsCollectionRef);
      let filteredDocs = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
      filteredDocs = filteredDocs.filter((x: any) => x.category == sort && x.ForUser.toLowerCase() == user?.email);
      setHabitsList(filteredDocs);
      setisLoading(false);
    } catch (err) {
    }
  }

  function FromJson() {
    setOpenModalJson(true);
  }

  function ChangeCategory() {
    setOpenModalChange(true);
  }

  async function CreateHabitFunc() {
    const data = await getDocs(PersonalCollectionRef);
    let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
    filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
    if (filteredDocs[0].Fights.length > 0) {
      addNotification({
        title: 'Вы находитесь в состоянии боя с другим человеком',
        subtitle: 'Во время боя запрещено добавлять новые привычки)))',
        message: 'Во время боя запрещено добавлять новые привычки)))',
        theme: 'darkblue',
        native: true 
      });
      return;
    }
    const data2 = await getDocs(HabitsCollectionRef);
    let filteredDocs2 = data2.docs.map((doc) => ({...doc.data(), id: doc.id}));
    filteredDocs2 = filteredDocs2.filter((x: any) => x.ForUser.toLowerCase() == user?.email);
    if (filteredDocs2.length >= filteredDocs[0].MaxHabits) {
      addNotification({
        title: 'Вы уже достигли максимума привычек для вашего уровня!',
        subtitle: 'Попробуйте поднять уровень или удалить уже имеющиеся',
        message: 'Попробуйте поднять уровень или удалить уже имеющиеся',
        theme: 'darkblue',
        native: true 
      });
      return;
    }
    setOpenModalCreate(true);
  }

  useEffect(() => {
    getHabitsList();
  }, [user, loading]);


	return (
    <div className={styles.Screen}>
      {ModalReadyOptionsT ? <ModalReadyOptions setModalReadyOptions={setModalReadyOptions} getHabitsList={getHabitsList} /> : ""}
      {OpenModalChange ? <ModalCategory setOpenModalChange={setOpenModalChange} getHabitsList={getHabitsList} /> : ""}
      {OpenModalCategory ? <CreateCategory setOpenModalCategory={setOpenModalCategory} getHabitsList={getHabitsList} /> : ""}
      {OpenModalCreate ? <CreateHabit newCat={CategoryList} setModalReadyOptions={setModalReadyOptions} setOpenModalCategory={setOpenModalCategory} setOpenModalCreate={setOpenModalCreate} getHabitsList={getHabitsList} /> : ""}
      {OpenModalJson ? <ModalJson setOpenModalJson={setOpenModalJson} getHabitsList={getHabitsList} /> : ""}
      <Header firstName="Профиль" firstTo="/profile" secondName="Магазин" secondTo="/shop"></Header>
      <div className={styles.Page}>
        <div className={styles.LeftPage}>
          <div className={styles.LeftPageList}>
            <div onClick={() => (Filter(""), setChooseCat(ToNext(0)))}><Catalogue image={All} title={""} /></div>
            <div onClick={() => (Filter("Физическая активность"), setChooseCat(ToNext(1)))}><Catalogue image={health} title={"Физическая активность"} /></div>
            <div onClick={() => (Filter("Спокойствие"), setChooseCat(ToNext(2)))}><Catalogue image={smile} title={"Спокойствие"} /></div>
            <div onClick={() => (Filter("Саморазвитие"), setChooseCat(ToNext(3)))}><Catalogue image={motivate} title={"Саморазвитие"} /></div>
            <div onClick={() => (Filter("Языки"), setChooseCat(ToNext(4)))}><Catalogue image={Languages} title={"Языки"} /></div>
            <div onClick={() => (Filter("Финансовая грамотность"), setChooseCat(ToNext(5)))}><Catalogue image={Dollar} title={"Финансовая грамотность"} /></div>
            {CategoryList.map((i: any, index: number) => 
              <div key={index} onClick={() => (Filter(i.value), setChooseCat(ToNext(index+6)))}><Catalogue image={i.icon} title={i.value} /></div>
            )}
            <div style={ChooseCat != -1 ? {top: ChooseCat} : {}} className={styles.Take}>
              <img src={Take} className={styles.TakeImg} alt="" />
            </div>
            <div className={classNames("none", styles.LineHow)}></div>
          </div>
          <div className={styles.LeftPage_BottomButtons}>
            
            <div onClick={FromJson} className={styles.ButtonAdd}>
              <img src={jsonIco} alt="" className={styles.Json} />
            </div>
            <div onClick={ChangeCategory} className={styles.ButtonAdd}>
              <img src={Change} alt="" className={styles.Change} />
            </div>
            <div className={styles.ButtonAdd}>
              <h4 onClick={CreateHabitFunc} className={styles.ButtonAddPlus}>+</h4>
            </div>
          </div>
        </div>
        <div className={styles.RightPlace}>
          <div className={styles.Cards}>
            {isLoading ? 
            <div className="loading">
              <div className="icons">
                <i className="ri-arrow-left-s-line"></i>
                <i className="ri-arrow-right-s-line"></i>
              </div>
            </div> : 
            (HabitsList.map((i: any, index: number) => 
              (i.visibility ? <Card history={i.history} key={index} getHabitsList={getHabitsList} backgroundSm={BackCardsSm[index % 3]} background={BackCards[index % 3]} addDate={i.addDate} category={i.category} id={i.id} period={i.period} targetValue={i.targetValue} type={i.type} title={i.title} lastChange={i.lastChange} lastResult={i.lastResult}></Card> : "" )
            ))}
          </div>
          <div className={styles.Information}>
            <div className={styles.InformationTogether}>
              <div className={styles.InformationUp}>
                <h4>План на сегодня</h4>
              </div>
              <div className={styles.Information_Block}>
                <h3 className={styles.Num}>{DoneTasks}/{AllTasks}</h3>
                <div className={styles.LineY}>
                  <div style={{width: (WidthLine == null ? 0 : WidthLine)}} className={styles.GreenY}></div>
                </div>
              </div>
            </div>
            <div className={styles.InformationTogether}>
              <div className={styles.InformationUp}>
                <h4>Календарь</h4>
              </div>
              <div className={styles.Information_Block2}>
              <Eventcalendar data={myEvents} className={styles.Calendar} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
	);
  }

export default MainPage;
