import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { BackLogo, coins, logo, ShortLogo } from "../../assets";
import { auth, db } from "../../config/firebase";
import { ToXp, XpToLevel } from "../../constants";
import styles from "./Header.module.scss";
import addNotification from 'react-push-notification';
import { getCoins, getMaxHabits, getNumberFights } from "./functions";

interface CircleProps {
  percent: number;
  Level: number;
}

const CircularProgressBar = (props: CircleProps) => {
  let radius = 35;
  let strokeWidth = 4;
  let Y = 65;
  if (window.innerWidth <= 650) {
    radius = 21;
    strokeWidth = 2;
    Y = 60;
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

interface HeaderProps {
  firstTo: string;
  firstName: string;
  secondTo: string;
  secondName: string;
};

function Header(props: HeaderProps) {
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setisLoading] = useState(false);
  const [Money, setMoney] = useState(0);
  const [Level, setLevel] = useState(0);
  const [Xp, setXp] = useState(0);
  const PersonalCollectionRef = collection(db, "personal_info");

  const GiveReward = async (id: string, level: number, coins: number, MaxHabits: number, NumberFights: number) => {
    const Me = doc(db, "personal_info", id);
    await updateDoc(Me, {coins: coins + getCoins(level), MaxHabits: MaxHabits + getMaxHabits(level), NumberFights: Math.min(4, NumberFights + getNumberFights(NumberFights))});
  }

  const GetInfo = async () => {
    try {
      // setisLoading(true);
      const data = await getDocs(PersonalCollectionRef);
      let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
      filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
      let Level = filteredDocs[0].Level; let Xp = filteredDocs[0].xp;
      if (Xp >= XpToLevel[Level] + ToXp[Level]) {
        Level++;
        const Me = doc(db, "personal_info", filteredDocs[0].id);
        if (Level > filteredDocs[0].WasMaxLevel) {
          addNotification({
            title: 'Уровень повышен и награды пришли',
            subtitle: 'Посмотрите на свои новые награды!',
            message: 'Посмотрите на свои новые награды!',
            theme: 'darkblue',
            native: true 
          });
          GiveReward(filteredDocs[0].id, Level, filteredDocs[0].coins, filteredDocs[0].MaxHabits, filteredDocs[0].NumberFights);
        } else {
          addNotification({
            title: 'Уровень повышен, но награды вы получали ранее',
            subtitle: 'Уровень повышен',
            message: 'Уровень повышен',
            theme: 'darkblue',
            native: true 
          });
        }
        await updateDoc(Me, {Level: Level, WasMaxLevel: Math.max(Level, filteredDocs[0].WasMaxLevel)});
      }
      if (Xp < XpToLevel[Level]) {
        Level--;
        const Me = doc(db, "personal_info", filteredDocs[0].id);
        await updateDoc(Me, {Level: Level});
        addNotification({
          title: 'Уровень понижен!',
          subtitle: 'Награды за обратное повышение уровня вы не получаете!',
          message: 'Награды за обратное повышение уровня вы не получаете!',
          theme: 'darkblue',
          native: true 
        });
      }
      setMoney(filteredDocs[0].coins);
      setLevel(Level);
      setXp(Xp);
      // setisLoading(false);
    } catch (err) {
      // setisLoading(false);
    }
  }
  useEffect(() => {
    GetInfo();
    setInterval(() => GetInfo(), 10000);
}, [user, loading]);

	return (
    <header className={styles.Header}>
      <div className={styles.HeaderTog}>
        <Link to="/">
          <picture>
            <source
                media="(max-width: 375px)"
                srcSet={`${ShortLogo} 375w`}
                sizes="375px"
            />
            <source srcSet={`${logo} 1251w`} sizes="1251px" />
            <img src={logo} className={styles.HeaderLogo} alt="" />
          </picture>
        </Link>
        <nav className={styles.HeaderNav}>
          <Link to={props.firstTo}>{props.firstName}</Link>
          <Link to={props.secondTo}>{props.secondName}</Link>
        </nav>
      </div>
      <div className={styles.HeaderLevel}>
        {!isLoading ? <Link to="/shop" className={styles.Coins}>
          <h4>{Money}</h4>
          <img className={styles.CoinsImg} src={coins} alt="" />
        </Link>: ""}
        {!isLoading ? <Link to="/levels" className={styles.HeaderTogether}>
          <h4 className={styles.HeaderUpText}>{Xp - XpToLevel[Level]}/{ToXp[Level]}</h4>
          <div className={styles.LineHow}>
            <div style={{width: (ToXp[Level] == null ? 0 : 126 * ((Xp - XpToLevel[Level]) / ToXp[Level]))}} className={styles.GreenLine}></div>
          </div>
        </Link> : ""}
        <Link to="/levels"><CircularProgressBar percent={ToXp[Level] == null ? 0 : 100 * ((Xp - XpToLevel[Level]) / ToXp[Level])} Level={Level}></CircularProgressBar></Link> 
      </div>
    </header>
	);
  }

export default Header;
