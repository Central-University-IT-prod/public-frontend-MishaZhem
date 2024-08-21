import styles from "./StartPage.module.scss";
import { Link, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { logo, ShortLogo, CardBackground1, PersonBlack, PersonWhite, telegram, mail, BackLogo, BackHabits, BackStats, UnderRate, TrianLogo, UnderCompetition } from "../../assets";
import { useEffect } from "react";
import classNames from "classnames";
import { FriendsProps, PropsBlock, PropsCard, PropsTime } from "./Interfaces";
import { HabitsCards, ListBlocks } from "./constants";
import { getRandomInt, WakeUpRandomly } from "./functions";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";

function BlockBackground(props: PropsBlock) {
    const Style: any = new Object();
    return (
        <div className={classNames(props.class, styles.StartLogo_Together)}>
            <img id={props.id + "Img"} src={props.image} alt="" className={styles.StartLogo_RectangleImg} />
            <div id={props.id + "Help"} className={styles.StartLogo_Activate}></div> 
            {/* onMouseOver={() => Change(props.id)} onMouseOut={() => RemoveAll()} */}
            <div id={props.id} className={styles.StartLogo_Rectangle}></div>
        </div>
    );
}

function Card(props: PropsCard) {
    return (
        <div className={classNames(styles.HabitCard, styles.MarginRightCard)}>
            <img src={props.background} className={styles.HabitCard_Background} alt="" />
            <div className={styles.HabitCard_Together}>
                <img src={props.image} className={styles.HabitCard_Img} alt="" />
                <div className={styles.HabitCard_ForText}>
                    <h3 className={styles.HabitCard_Name}>{props.Name}</h3>
                    {props.type == 2 ?
                    <>
                        <h4 className={styles.HabitCard_Count}>{props.left}</h4>
                        <div className={styles.LineHow}>
                            <div id="GreenLine" className={styles.GreenLine}></div>
                        </div>
                        <h4 className={styles.HabitCard_LeftTime}>{props.UnderTime}</h4>
                    </> : 
                    <>
                        <div className={styles.HabitCard_FirstType}>
                            <div className={styles.HabitCard_Tick}></div>
                            <h3 className={styles.HabitCard_LeftFirst}>Осталось времни: 1 час</h3>
                        </div>
                    </>
                    }
                    
                </div>
            </div>
        </div>
    );
}

function ColumnTime(props: PropsTime) {
    return (
        <div className={styles.Days_WithText}>
            <div className={styles.Days_Column}>
                <div style={{height: props.value}} className={styles.Days_Value}></div>
            </div>
            <h5>{props.text}</h5>
        </div>
    );
}

function FriendsBlock(props: FriendsProps) {
    return (
        <div className={styles.Friends_Block}>
            <div className={styles.Friends_BlockTogether}>
                <h3 className={styles.Friends_BlockPos}>{props.num}</h3>
                <img src={PersonWhite} alt="" />
                <h3 className={styles.Friends_BlockName}>User 1</h3>
            </div>
            <h4 className={styles.Friends_BlockPoint}>1830</h4>
        </div>
    );
}

function Circle() {
    let Width = 200;
    let Radius = 175;
    if (window.innerWidth <= 980) {
        Width = 125;
        Radius = 100;
    }
    if (window.innerWidth <= 550) {
        Width = 55;
        Radius = 45;
    }
    return (
        <div className={styles.Circle}>
            <div className="circle-big">
                <div className="text">
                    <p className="Big">3</p>
                    <p className="small">70/100</p>
                </div>
                <svg>
                    <defs>
                        <linearGradient id="myGradient">
                            <stop offset="0%" stopColor="#FFF" />
                            <stop offset="60%" stopColor="#8271CD" />
                            <stop offset="100%" stopColor="#8271CD" />
                        </linearGradient>
                    </defs>
                    <circle stroke="url(#myGradient)" className="progress" cx={Width} cy={Width} r={Radius}>
                    </circle>
                </svg>
            </div>
            <h4 className={styles.Circle_Text}>Уровень</h4>
        </div>
    );
}

function Habits() {
    return (
        <div className={styles.Habits}>
            <h4 className={styles.Habits_Text}>Создай <span className={styles.Habits_Any}>любые</span> привычки</h4>
            <div className={styles.Habits_Cards}>
                <Marquee direction="right" speed={60}>
                    {HabitsCards.map((i: PropsCard, Index: number) => 
                        <Card key={Index} background={i.background} image={i.image} Name={i.Name} type={i.type} left={i.left} UnderTime={i.UnderTime}></Card>
                    )}
                </Marquee>
            </div>
        </div>
    );
}

function StartPage() {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    useEffect(() => {
        WakeUpRandomly();
        setInterval(WakeUpRandomly, 2500);
    }, []);

    const LogOut = async () => {
        await signOut(auth)
        .then((userCredential) => {})
        .catch((error) => {});
        navigate("/login");
    }

    // const user = useAuth
    let MaxInt = 204;
    if (window.innerWidth <= 980) {
        MaxInt = 130;
    }
	return (
        <div className={styles.Screen}>
            <img src={BackLogo} className={styles.BackLogo} alt="" />
            <img src={BackHabits} className={styles.BackHabits} alt="" />
            <header className={styles.Header}>
                <img className={styles.Header_Img} src={ShortLogo} alt="" />
                <div></div>
                <nav className={styles.Header_Nav}>
                    <Link className={styles.White} to="/levels">Уровни</Link>
                    <Link className={styles.White} to="/shop">Магазин</Link>
                    <Link className={styles.White} to="/profile">Профиль</Link>
                </nav>
                <button onClick={() => (user == null ? navigate("/login") : LogOut())} className={styles.Header_Button}>{user == null ? "Войти" : "Выйти"}</button>
            </header>
            <div className={styles.StartLogo}>
                <img className={styles.StartLogo_Img}  src={logo} alt="" />
                <h3 className={styles.StartLogo_Text}>Your Personal Habit Tracker</h3>
                <div className={styles.StartLogo_Buttons}>
                    <Link to="/main" className={styles.StartLogo_First}>Старт</Link>
                    <button className={styles.StartLogo_Second}><p className={styles.StartLogo_Contacts}>Контакты</p></button>
                </div>
                {ListBlocks.map((i: PropsBlock) => 
                    <BlockBackground key={i.id} image={i.image} id={i.id} class={i.class}></BlockBackground>
                )}
            </div>
            <Habits></Habits>
            <div className={styles.Stats}>
                <img src={TrianLogo} className={styles.Trian} alt="" />
                <img src={BackStats} className={styles.BackStats} alt="" />
                <img src={UnderCompetition} className={styles.UnderCompetition} alt="" />
                <h3 className={styles.Stats_Text}>Следи за своим <span className={styles.Rate}>рейтингом</span> <img src={UnderRate} className={styles.UnderRate} /></h3>
                <div className={styles.BottomStats}>
                    <div className={styles.LeftStats}>
                        <Circle></Circle>
                        <div className={styles.BottomStats_Graph}>
                            <h4 className={styles.BottomStats_InfoDay}>День входа: <span className={styles.BottomStats_InfoDay2}>34</span></h4>
                            <div className={styles.BottomStats_Today}>
                                <h4 className={styles.BottomStats_InfoDay}>План на сегодня:</h4>
                                <div className={styles.LineHowToday}>
                                    <div className={styles.GreenLineToday}></div>
                                </div>
                            </div>
                            <div className={styles.Days}>
                                <h4 className={styles.Days_Text}>График успеваемости:</h4>
                                <div className={styles.DaysColumns}>
                                    <ColumnTime text={"пн"} value={Math.max(getRandomInt(MaxInt), 30)}></ColumnTime>
                                    <ColumnTime text={"вт"} value={Math.max(getRandomInt(MaxInt), 30)}></ColumnTime>
                                    <ColumnTime text={"ср"} value={Math.max(getRandomInt(MaxInt), 30)}></ColumnTime>
                                    <ColumnTime text={"чт"} value={Math.max(getRandomInt(MaxInt), 30)}></ColumnTime>
                                    <ColumnTime text={"пт"} value={Math.max(getRandomInt(MaxInt), 30)}></ColumnTime>
                                    <ColumnTime text={"сб"} value={Math.max(getRandomInt(MaxInt), 30)}></ColumnTime>
                                    <ColumnTime text={"вс"} value={Math.max(getRandomInt(MaxInt), 30)}></ColumnTime>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.Friends}>
                        <h4 className={styles.Friends_Text}>Соревнуйся с друзьями</h4>
                        <div className={styles.Friends_Me}>
                            <h4 className={styles.Friends_Me_Text}>Твоё место:</h4>
                            <div className={classNames(styles.Friends_Block, styles.TransParent)}>
                                <div className={styles.Friends_BlockTogether}>
                                    <h3 className={classNames(styles.Friends_BlockPos, styles.MePos)}>{12}</h3>
                                    <img src={PersonWhite} alt="" />
                                    <h3 className={styles.Friends_BlockName}>User 1</h3>
                                </div>
                                <h4 className={styles.Friends_BlockPoint}>1830</h4>
                            </div>
                        </div>
                        <div className={styles.Friends_Others}>
                            <FriendsBlock num={1}></FriendsBlock>
                            <FriendsBlock num={2}></FriendsBlock>
                            <FriendsBlock num={3}></FriendsBlock>
                            <FriendsBlock num={4}></FriendsBlock>
                        </div>
                    </div>
                </div>
		    </div>
            <footer className={styles.Footer}>
                <div className={styles.FooterInfo}>
                    <img src={logo} className={styles.FooterImg} alt="" />
                    <h5 className={styles.FooterText}>
                        Напишите нам в Telegram или отправьте e-mail, а мы ответим!
                    </h5>
                    <div className={styles.FooterGroupButtons}>
                        <button className={styles.Footer_Button}>
                            <img src={telegram} alt="" className={styles.IMGF} />
                            <p>Telegram</p>
                        </button>
                        <button className={styles.Footer_Button}>
                            <img src={mail} alt="" className={styles.IMGF} />
                            <p>Почта</p>
                        </button>
                    </div>
                </div>
                <nav className={styles.FooterNav}>
                    <h2 className={styles.FooterNav_Main}>Навигация</h2>
                    <Link to="/levels" className={styles.FooterNav_Sub}>Уровни</Link>
                    <Link to="/shop" className={styles.FooterNav_Sub}>Магазин</Link>
                    <Link to="/profile" className={styles.FooterNav_Sub}>Профиль</Link>
                </nav>
            </footer>
        </div>
	);
  }

export default StartPage;
