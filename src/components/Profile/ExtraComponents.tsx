import classNames from "classnames";
import { signOut } from "firebase/auth";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import addNotification from 'react-push-notification';
import { Link, useNavigate } from "react-router-dom";
import { BaseUser, coins, edit, exit, FightIco, logo, SearchIco, SmButtons } from "../../assets";
import { auth, db } from "../../config/firebase";
import Header from "../Header/Header";
import ModalAddFight from "./ModalAddFight/ModalAddFight";
import styles from "./Profile.module.scss";
import { getTime, Next } from "./functions";
import { To, To2, ToXp, XpToLevel } from "../../constants";
import { DoneActive } from "../MainPage/functions";
import DateStore from "../../store/Date/Date"
import ModalStats from "./ModalStats/ModalStats";

interface CircleProps {
    percent: number;
    Level: number;
  }

const CircularProgressBar = (props: CircleProps) => {
    let radius = 100;
    let strokeWidth = 10;
    let Y = 55;
    if (window.innerWidth <= 420) {
        radius = 80;
        strokeWidth = 8;
    }
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (props.percent / 100) * circumference;
  
    return (
      <svg className={styles.SVG} height={radius * 2} width={radius * 2}>
        <svg>
          <defs>
              <linearGradient id="myGradient">
                <stop  stopColor="white"/>
                <stop offset="1" stopColor="#8271CD" />
              </linearGradient>
          </defs>
          <circle
            className={styles.progressCircle}
            stroke="url(#myGradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <text x="50%" y={Y + "%"} className={styles.progressText}>
          {`${props.Level}`}
        </text>
      </svg>
    );
};

function User() {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [isLoading, setisLoading] = useState(true);
    const [Ava, setAva] = useState(0);
    const [AvaStroke, setAvaStroke] = useState(0);
    if (user == null) {
        navigate("/login");
    }

    async function GetInfo() {
        try {
            setisLoading(true);
            const PersonalCollectionRef = collection(db, "personal_info");
            const data = await getDocs(PersonalCollectionRef);
            let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
            const Me = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
            setAva(Me[0].icons[Me[0].CurIcon]);
            setAvaStroke(Me[0].strokes[Me[0].CurStroke]);
            setEmail(Me[0].mail);
            setName(Me[0].Name);
            setisLoading(false);
        } catch {}
    }

    async function ChangeName() {
        setisLoading(true);
        const DateToday = (document.getElementById("Date") as HTMLInputElement).value;
        const GetTime = (new Date(Date.parse(DateToday))).getTime();
        await DateStore.ChangeTime(GetTime);
        const PersonalCollectionRef = collection(db, "personal_info");
        const data = await getDocs(PersonalCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        const Me = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
        const Info = doc(db, "personal_info", Me[0].id);
        await updateDoc(Info, {Name: Name});
        setisLoading(false);
    }

    const LogOut = async () => {
        await signOut(auth)
        .then((userCredential) => {})
        .catch((error) => {});
        navigate("/login");
    }

    useEffect(() => {
        GetInfo();
    }, [user, loading]);

    return (
        <div className={styles.User}>
            <img onClick={LogOut} src={exit} className={styles.exit} alt="" />
            {/* <img src={BaseUser} alt="" className={styles.UserImg} /> */}
            <div className={styles.TogMain}>
                <img src={To[Ava]} alt="" className={styles.ImgUser} />
                {To2[AvaStroke] != "" ? 
                <img src={To2[AvaStroke]} className={styles.StrokeImg} alt="" /> :
                <div className={styles.StrokeImg} ></div>}
            </div>
            {isLoading ? 
            <div className="loading">
              <div className="icons">
                <i className="ri-arrow-left-s-line"></i>
                <i className="ri-arrow-right-s-line"></i>
              </div>
            </div> : <>
            <div className={styles.UserTogether}>
                <h4 className={styles.TitleUser}>Логин:</h4>
                <div className={styles.Together}>
                    <input value={Name} onChange={(e: any) => setName(e.target.value)} className={classNames(styles.Input, styles.InputUser)} type="text" />
                    <hr className={classNames(styles.Hr, styles.HrUser)} />
                </div>
                <img className={styles.UserEdit} src={edit} alt="" />
            </div>
            <div className={styles.UserTogether}>
                <h4 className={styles.TitleUser}>Почта:</h4>
                <div className={styles.Together}>
                    <input value={Email} disabled className={classNames(styles.Input, styles.InputUser)} type="text" />
                    <hr className={classNames(styles.Hr, styles.HrUser)} />
                </div>
            </div>
            <div className={styles.UserTogether}>
                <h4 className={styles.TitleUser}>Сегодняя дата: (3 часа ночи)</h4>
                <input type="date" id="Date" />
            </div>
            <button onClick={ChangeName} className={styles.UserSaveButton}>Сохранить</button></>}
        </div>
    );
}

function Summary() {
    const [DayNumber, setDayNumber] = useState(0);
    const [Level, setLevel] = useState(0);
    const [Xp, setXp] = useState(0);
    const [Width, setWidth] = useState(0);
    const [OpenModal, setOpenModal] = useState(false);
    const [user, loading, error] = useAuthState(auth);
    const PersonalCollectionRef = collection(db, "personal_info");
    const HabitsCollectionRef = collection(db, "habits");

    const GetWidthLine = async () => {
        const data = await getDocs(HabitsCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        filteredDocs = filteredDocs.filter((x: any) => x.ForUser.toLowerCase() == user?.email);
        let cntAll = 0; let cntDone = 0;
        for (let i = 0; i < filteredDocs.length; i++) {
            if (filteredDocs[i].visibility) cntAll++;
            const doneRes = await DoneActive(filteredDocs[i].addDate, filteredDocs[i].period, filteredDocs[i].lastChange, filteredDocs[i].lastResult >= filteredDocs[i].targetValue);
            if (doneRes) { cntDone++; continue; }
        }
        let LineWidth = 204;
        if (window.innerWidth <= 550) LineWidth = 150;
        if (window.innerWidth <= 410) LineWidth = 100;
        setWidth(LineWidth * (cntDone / cntAll));
    }

    const GetInfo = async () => {
        try {
          // setisLoading(true);
          const data = await getDocs(PersonalCollectionRef);
          let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
          filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
          const oneDay = 1000 * 86400;
          setDayNumber(Math.trunc(((await DateStore.GetTime()) - parseInt(filteredDocs[0].addDate)) / oneDay) + 1);
          setLevel(filteredDocs[0].Level);
          setXp(filteredDocs[0].xp);
        } catch (err) {
        }
    }
    useEffect(() => {
        GetInfo();
        GetWidthLine();
        // setInterval(() => GetInfo(), 4000);
    }, [user, loading]);

    return (
        <>
            {OpenModal ? <ModalStats setOpenModal={setOpenModal} /> : ""}
            <div className={styles.SummaryTogether}>
                <h4>Сводка</h4>
                <div className={styles.Summary}>
                    <h4>День входа: <span className={styles.SummaryNumber}>{DayNumber}</span></h4>
                    <div className={styles.SummaryBottom}>
                        <div className={styles.Level}>
                            <CircularProgressBar Level={Level} percent={ToXp[Level] == null ? 0 : 100 * ((Xp - XpToLevel[Level]) / ToXp[Level])}></CircularProgressBar>
                        </div>
                        <div className={styles.HabitsCountStats}>
                            <h4>План на сегодня:</h4>
                            <div className={styles.LineY}>
                                <div style={{width: Width}} className={styles.GreenY}></div>
                            </div>
                            <button onClick={() => setOpenModal(true)} className={styles.InTest}>Посмотреть статистику</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Fight() {
    const PersonalCollectionRef = collection(db, "personal_info");
    const [user, loading, error] = useAuthState(auth);
    const [FightList, setFightList] = useState([{}]);
    const [Gap, setGap] = useState(0);

    async function getFights() {
        try {
            const data = await getDocs(PersonalCollectionRef);
            let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
            filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
            let ListFight = filteredDocs[0].Fights;
            setGap(filteredDocs[0].NumberFights - ListFight.length);
            if (ListFight.length < filteredDocs[0].NumberFights && ListFight.length < filteredDocs[0].NumberFights) {
                ListFight.push({
                    email: "1",
                    period: "1",
                    price: "1",
                    addDate: "1",
                    have: false,
                    visibility: true,
                })
            }
            while (ListFight.length < filteredDocs[0].NumberFights && ListFight.length < filteredDocs[0].NumberFights) {
                ListFight.push({
                    email: "1",
                    period: "1",
                    price: "1",
                    addDate: "1",
                    have: false,
                    visibility: false,
                })
            }
            
            setFightList(ListFight);
            
        } catch {}
    }

    useEffect(() => {
        getFights();
        // setInterval(() => getFights(), 5000);
    }, [user, loading]);

    return (
        <div className={styles.Fight}>
            <div className={styles.FightText}>
                <img src={FightIco} alt="" className={styles.FightImg} />
                <h3 className={styles.FightH}>Бой с друзьями</h3>
                <img src={FightIco} alt="" className={styles.FightImg} />
            </div>
            <h4 className={styles.FightDecs}>Кидай заявку боя другу и бейся не на жизнь, а на чокопай-коины!</h4>
            <div className={styles.FightBlocks}>
                {
                (FightList.map((i: any, index: number) => 
                    <BlockFight key={index} id={"Modal" + index.toString()} email={i.email} period={i.period} price={i.price} addDate={i.addDate} have={i.have} visibility={i.visibility} Me={i.Me} Op={i.Op} Name={i.Name}></BlockFight>
                ))
                }
            </div>
            <h4 className={styles.FightExtra}>Ещё доступно: {Gap}</h4>
        </div>
    );
}

interface BlockFightProps {
    Name: string;
    email: string;
    period: string;
    price: string;
    addDate: string;
    have: boolean;
    visibility: boolean;
    id: string;
    Me: number;
    Op: number;
}

function BlockFight(props: BlockFightProps) {
    const [Name, setName] = useState(props.Name);
    const [user, loading, error] = useAuthState(auth);
    const PersonalCollectionRef = collection(db, "personal_info");   
    const [Modal, setModal] = useState(false); 
    const MaxWidth = 80;
    const [left, setLeft] = useState("");

    async function Check() {
        const NextOrNot = await Next(props.addDate, props.period, (await DateStore.GetTime()).toString());
        if (props.have && props.visibility && NextOrNot) {
            const data = await getDocs(PersonalCollectionRef);
            let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
            const Me = filteredDocs.filter((x: any) => x.mail == user?.email);
            const info = doc(db, "personal_info", Me[0].id);
            let Fin = [];
            for (let i = 0; i < Me[0].Fights.length; i++) {
                if (Me[0].Fights[i].addDate == props.addDate) continue;
                Fin.push(Me[0].Fights[i])
            }
            await updateDoc(info, {Fights: Fin});
            if (props.Me > props.Op) {
                const MeG = doc(db, "personal_info", Me[0].id);
                const H = Me[0].coins + parseInt(props.price);
                await updateDoc(MeG, {coins: H, Fights: Fin});
                addNotification({
                    title: 'Вы выиграли!',
                    subtitle: 'Вам зачислена награда',
                    message: 'Вам зачислена награда',
                    theme: 'darkblue',
                    native: true 
                });
            } else {
                const MeG = doc(db, "personal_info", Me[0].id);
                const H = Me[0].coins - parseInt(props.price);
                await updateDoc(MeG, {coins: Math.max(0, H), Fights: Fin});
                addNotification({
                    title: 'Вы проиграли!',
                    subtitle: 'Награда списана с вашего кошелька!',
                    message: 'Награда списана с вашего кошелька!',
                    theme: 'darkblue',
                    native: true 
                });
            }
            return;
        }
    }


    async function getRequests() {
        try {
            setLeft(await getTime(props.addDate, props.period));
            const data = await getDocs(PersonalCollectionRef);
            let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
            const opN = filteredDocs.filter((x: any) => x.mail == props.email);
            setName(opN[0].Name);
            Check();
        } catch {}
    } 

    useEffect(() => {
        getRequests();
        Check();
        // setInterval(() => getRequests(), 3000);
    }, [user, loading, props.email]);

    return (
        <>
            {Modal ? <ModalAddFight setModal={setModal} id={props.id} /> : ""}
            <div onClick={() => (props.have ? console.log("") : setModal(true))} className={classNames(styles.BlockFight, (props.visibility ? "" : styles.VisibilityNone))}>
                {props.have ? 
                <div className={styles.Card}>
                    <div className={styles.CardUp}>
                        <h4 className={styles.CardH}>Ты</h4>
                        <img src={FightIco} className={styles.CardImg} alt="" />
                        <h4 className={styles.CardH}>{Name}</h4>
                    </div>
                    <div style={{width: MaxWidth * Math.min(1, props.Me / 10)}} className={styles.CardLeft}>{props.Me}</div>
                    <div style={{width: MaxWidth * Math.min(1, props.Op / 10)}} className={styles.CardRight}>{props.Op}</div>
                    <div className={styles.CardTog}>
                        <div className={styles.CardTog2}>
                            <h4>Приз:</h4>
                            <div className={styles.CardCoins}>
                                <h4 className={styles.Card}>+{props.price}</h4>
                                <img src={coins} className={styles.CardImg2} alt="" />
                            </div>
                        </div>
                        <h4 className={styles.CardLeft22}>{left}</h4>
                    </div>
                </div> : 
                <>
                    <div className={styles.FightGButton}>
                        <h4 className={styles.FightGH4}>+</h4>
                        <img src={SmButtons} className={styles.FightGEllipse}></img>
                    </div>
                </>}
            </div>
        </>
    );
}

interface ReqProps {
    Who: string;
    email: string;
    Period: string;
    Win: number;
}

function RequestsFightBlock(props: ReqProps) {
    const [user, loading, error] = useAuthState(auth);
    const PersonalCollectionRef = collection(db, "personal_info");    

    async function Save() {
        const data = await getDocs(PersonalCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        const Me = filteredDocs.filter((x: any) => x.mail == user?.email);
        const FindFriend = filteredDocs.filter((x: any) => x.mail == props.email);
        if (Me[0].NumberFights - Me[0].Fights.length <= 0 || FindFriend[0].NumberFights - FindFriend[0].Fights.length <= 0) {
            addNotification({
                title: 'Лимит по боям',
                subtitle: 'У вас или у оппонента достигнут лимит',
                message: 'У вас или у оппонента достигнут лимит',
                theme: 'darkblue',
                native: true 
            });
            return;
        }
        const personal1 = doc(db, "personal_info", Me[0].id);
        let bids: any = []; let Fights: any = Me[0].Fights;
        const Obj = {
            Who: props.Who,
            email: props.email,
            period: props.Period,
            price: props.Win,
        }
        for (let i = 0; i < Me[0].bids.length; i++) {
            if (Obj.email == Me[0].bids[i].email && Obj.period == Me[0].bids[i].period && Obj.price == Me[0].bids[i].price) {
                continue;
            }
            bids.push(Me[0].bids[i]);
        }
        Fights.push({
            Name: FindFriend[0].Name,
            email: props.email,
            period: props.Period,
            price: props.Win,
            addDate: (await DateStore.GetTime()).toString(),
            have: true,
            visibility: true,
            Me: 0,
            Op: 0,
        });
        await updateDoc(personal1, {Fights: Fights, bids: bids});
        const personal2 = doc(db, "personal_info", FindFriend[0].id);
        Fights = FindFriend[0].Fights;
        Fights.push({
            Name: Me[0].Name,
            email: Me[0].mail,
            period: props.Period,
            price: props.Win,
            addDate: (await DateStore.GetTime()).toString(),
            have: true,
            visibility: true,
            Me: 0,
            Op: 0,
        });
        await updateDoc(personal2, {Fights: Fights});
    }

    return (
        <div className={styles.RequestsFightBlock}>
            <h5 className={styles.RequestsFightBlockText}>Заявка</h5>
            <div className={styles.RequestsFightBlockTog}>
                <img src={FightIco} className={styles.RequestsFightBlockImg} alt="" />
                <h4>{props.Who}</h4>
            </div>
            <h5 className={styles.RequestsFightBlockPeriod}>Период: {props.Period}</h5>
            <div className={styles.RequestsFightBlockTog}>
                <h4>Приз</h4>
                <div className={styles.RequestsFightBlockCoins}>
                    <h4>+{props.Win}</h4>
                    <img src={coins} alt="" className={styles.RequestsFightBlockCoinsImg} />
                </div>
            </div>
            <button onClick={Save} className={styles.RequestsFightBlockTake}>
                <h3 className={styles.RequestsFightBlockTakeH}>Принять</h3>
            </button>
        </div>
    );
}

function RequestsFight() {
    const [user, loading, error] = useAuthState(auth);
    const [List, setList] = useState([]);
    const PersonalCollectionRef = collection(db, "personal_info");    

    async function getRequests() {
        try {
            const data = await getDocs(PersonalCollectionRef);
            let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
            const Me = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
            setList(Me[0].bids);
        } catch {}
    } 

    useEffect(() => {
        getRequests();
        // setInterval(() => getRequests(), 3000);
    }, [user, loading]);

    return (
        <div className={styles.RequestsFight}>
            <h4 className={styles.RequestsFightText}>Мои заявки</h4>
            <div className={styles.RequestsFightList}>
                {List.map((i: any, index: number) => 
                    <RequestsFightBlock key={index} email={i.email} Who={i.Who} Period={i.period} Win={i.price} />
                )}
            </div>
        </div>
    );
}

function Friends() {
    const [user, loading, error] = useAuthState(auth);
    const [FindFriend, setFindFriend] = useState("");
    const [FriendsList, setFriendsList] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [Number, setNumber] = useState(0);
    const [Rate, setRate] = useState(0);
    const [Who, setWho] = useState("");
    const PersonalCollectionRef = collection(db, "personal_info");

    async function getFriends() {
        try {
            setisLoading(true);
            const data = await getDocs(PersonalCollectionRef);
            let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
            const Me = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
            let NeededList: any = [];
            for (let i = 0; i < Me[0].friends.length; i++) {
                const FriendEmail = Me[0].friends[i];
                const F = filteredDocs.filter((x: any) => x.mail == FriendEmail);
                NeededList.push({rate: F[0].xp, Name: F[0].Name, mail: F[0].mail});
            }
            NeededList.push({rate: Me[0].xp, Name: Me[0].Name, mail: Me[0].mail});
            setRate(Me[0].xp);
            setWho(Me[0].Name);
            NeededList.sort(function (a: any, b: any) {
                return a.rate - b.rate;
            });
            setFriendsList(NeededList);
            for (let i = 0; i < NeededList.length; i++) {
                if (NeededList[i].mail.toLowerCase() == user?.email) {
                    setNumber(i+1);
                    break;
                }
            }
            setisLoading(false);
        } catch {}
    }

    async function Search() {
        const data = await getDocs(PersonalCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        const Me = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
        const tryFind = filteredDocs.filter((x: any) => x.mail.toLowerCase() == FindFriend);
        if (tryFind.length == 0) {
            addNotification({
                title: 'Пользователь не найден',
                subtitle: 'Попробуйте другой email',
                message: 'Попробуйте другой email',
                theme: 'darkblue',
                native: true
            });
            return;
        }
        for (let i = 0; i < Me[0].friends.length; i++) {
            const FriendEmail = Me[0].friends[i];
            if (FriendEmail.toLowerCase() == FindFriend.toLowerCase()) {
                addNotification({
                    title: 'Пользователь уже был ранее добавлен',
                    subtitle: 'Попробуйте другой email',
                    message: 'Попробуйте другой email',
                    theme: 'darkblue',
                    native: true 
                });
                return;
            }
        }
        const personal_info = doc(db, "personal_info", Me[0].id);
        let G = Me[0].friends;
        G.push(FindFriend);
        await updateDoc(personal_info, {friends: G});
        getFriends();
    }

    useEffect(() => {
        getFriends();
    }, [user, loading]);

    return (
        <div className={styles.Friends}>
            {isLoading ? 
            <div className="loading">
              <div className="icons">
                <i className="ri-arrow-left-s-line"></i>
                <i className="ri-arrow-right-s-line"></i>
              </div>
            </div> : <>
            <div className={styles.FriendsTitle}>
                <h4>Рейтинг среди друзей</h4>
                <div className={styles.FriendsGroupButtons}>
                    <div className={classNames(styles.FriendsButton, styles.FriendsSearch)}>
                        <div className={styles.Together}>
                            <input placeholder="Email" onChange={(e) => setFindFriend(e.target.value)} type="text" className={styles.Input} />
                            <hr className={styles.Hr} />
                        </div>
                        <div className={styles.FriendsSIMG}>
                            <img src={SearchIco} alt="" />
                        </div>
                        <img src={SmButtons} className={styles.FriendsEllipse}></img>
                    </div>
                    <div onClick={Search} className={styles.FriendsButton}>
                        <h4 className={styles.FriendsH4}>+</h4>
                        <img src={SmButtons} className={styles.FriendsEllipse}></img>
                    </div>
                </div>
            </div>
            <FriendsMe number={Number} Who={Who} rate={Rate} />
            {FriendsList.map((i: any, index: number) => 
              <FriendsPerson key={index} position={index+1} Who={i.Name} rate={i.rate} />
            )}</>}
        </div>
    );
}


interface MeProps {
    number: number;
    Who: string;
    rate: number;
};

function FriendsMe(props: MeProps) {
    return (
        <div className={styles.FriendsMe}>
            <h4 className={styles.FriendsMeTitle}>Твоё место:</h4>
            <div className={styles.FriendsMeTogether}>
                <div className={styles.FriendsMeInfo}>
                    <h4 className={styles.FriendsNJ}>{props.number}</h4>
                    <img src={BaseUser} className={styles.FriendsMeImg} alt="" />
                    <h4 className={styles.FriendsMeTitle}>{props.Who}</h4>
                </div>
                <h4 className={styles.FriendsMeRate}>{props.rate}</h4>
            </div>
        </div>
    );
}

interface FriendsPersonProps {
    position: number;
    Who: string;
    rate: string;
};

function FriendsPerson(props: FriendsPersonProps) {
    return (
        <div className={classNames(styles.FriendsMe, styles.FriendsCard)}>
            <div className={styles.FriendsMeTogether}>
                <div className={styles.FriendsMeInfo}>
                    <h4 className={classNames(styles.Font40, styles.FriendsNJ)}>{props.position}</h4>
                    <img src={BaseUser} className={styles.FriendsMeImg} alt="" />
                    <h4 className={styles.FriendsMeTitle}>{props.Who}</h4>
                </div>
                <h4 className={styles.FriendsMeRate}>{props.rate}</h4>
            </div>
        </div>
    );
}


export {
    User,
    Summary,
    Fight,
    RequestsFight,
    Friends,
}