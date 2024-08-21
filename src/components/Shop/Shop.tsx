import styles from "./Shop.module.scss";
import classNames from "classnames";
import Header from "../Header/Header";
import { BaseUser, coins, line, Stroke1, Stroke2, Stroke3, Stroke4, Stroke5, User2, User3, User4, User5, User6, WhiteCoins } from "../../assets";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import addNotification from 'react-push-notification';
import { To, To2 } from "../../constants";
import { SkipFightOne, SkipFightTwo, SkipFour, SkipOne } from "./Skips";

interface BlockProps {
    image: any;
}

function Block(props: BlockProps) {
    return (
        <div className={styles.Block}>
            <img src={props.image} alt="" className={styles.BlockImg} />
        </div>
    );
}
 
interface Block2Props {
    image: string;
    cost: number;
    index: number;
    getInfoShop(): Promise<void>;
}

function BlockShop(props: Block2Props) {
    const [user, loading, error] = useAuthState(auth);
    const PersonalCollectionRef = collection(db, "personal_info");

    async function Buy() {
        const data = await getDocs(PersonalCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
        if (filteredDocs[0].coins < props.cost) {
            addNotification({
                title: 'У вас не хватает денег!',
                subtitle: 'Заработайте или посмотрите что-нибудь другое!',
                message: 'Заработайте или посмотрите что-нибудь другое!',
                theme: 'darkblue',
                native: true
            });
        } else {
            const pers = doc(db, "personal_info", filteredDocs[0].id);
            const MoneyNow = filteredDocs[0].coins - props.cost;
            let icons = filteredDocs[0].icons; icons.push(props.index);
            await updateDoc(pers, {coins: MoneyNow, icons: icons});
            await props.getInfoShop();
            addNotification({
                title: 'Покупка совершена!',
                subtitle: 'Поздравляем!',
                message: 'Поздравляем!',
                theme: 'darkblue',
                native: true
            });
        }
    }
    
    return (
        <div className={styles.RightBlock}>
            <img src={props.image} alt="" className={styles.RightImg} />
            <div onClick={Buy} className={styles.RightCost}>
                <h4>{props.cost}</h4>
                <img src={WhiteCoins} className={styles.RightCostImg} alt="" />
            </div>
        </div>
    );
}


function StrokeShop(props: Block2Props) {
    const [user, loading, error] = useAuthState(auth);
    const PersonalCollectionRef = collection(db, "personal_info");

    async function Buy() {
        const data = await getDocs(PersonalCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
        if (filteredDocs[0].coins < props.cost) {
            addNotification({
                title: 'У вас не хватает денег!',
                subtitle: 'Заработайте или посмотрите что-нибудь другое!',
                message: 'Заработайте или посмотрите что-нибудь другое!',
                theme: 'darkblue',
                native: true
            });
        } else {
            const pers = doc(db, "personal_info", filteredDocs[0].id);
            const MoneyNow = filteredDocs[0].coins - props.cost;
            let strokes = filteredDocs[0].strokes; strokes.push(props.index);
            await updateDoc(pers, {coins: MoneyNow, strokes: strokes});
            await props.getInfoShop();
            addNotification({
                title: 'Покупка совершена!',
                subtitle: 'Поздравляем!',
                message: 'Поздравляем!',
                theme: 'darkblue',
                native: true
            });
        }
    }
    
    return (
        <div className={styles.RightBlock}>
            <div className={styles.TogImg}>
                <img src={props.image} alt="" className={styles.Stroke} />
                <img src={BaseUser} alt="" className={styles.ImgUser} />
            </div>
            <div onClick={Buy} className={styles.RightCost}>
                <h4>{props.cost}</h4>
                <img src={WhiteCoins} className={styles.RightCostImg} alt="" />
            </div>
        </div>
    );
}

function Shop() {
    const [user, loading, error] = useAuthState(auth);
    const [ListIcons, setListIcons] : any = useState([]);
    const [Strokes, setStrokes] : any = useState([]);
    const [coins, setCoins] = useState(0);
    const [Ava, setAva] = useState(0);
    const [AvaStroke, setAvaStroke] = useState(0);
    const [CanSkip, setCanSkip] = useState(0);
    const [NumberFights, setNumberFights] = useState(1);
    const HabitsCollectionRef = collection(db, "habits");
    const CategoryCollectionRef = collection(db, "categories");
    const PersonalCollectionRef = collection(db, "personal_info");

    async function getInfoShop() {
        try {
            const data = await getDocs(PersonalCollectionRef);
            let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
            filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
            setAva(filteredDocs[0].icons[filteredDocs[0].CurIcon]);
            setAvaStroke(filteredDocs[0].strokes[filteredDocs[0].CurStroke]);
            setListIcons(filteredDocs[0].icons);
            setStrokes(filteredDocs[0].strokes);
            setCoins(filteredDocs[0].coins);
            setCanSkip(filteredDocs[0].CanSkip);
            setNumberFights(filteredDocs[0].NumberFights);
        } catch {}
    }

    async function ChooseIco(index: number) {
        const data = await getDocs(PersonalCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
        const pers = doc(db, "personal_info", filteredDocs[0].id);
        await updateDoc(pers, {CurIcon: index});
        getInfoShop();
    }

    async function ChooseIco2(index: number) {
        const data = await getDocs(PersonalCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
        const pers = doc(db, "personal_info", filteredDocs[0].id);
        await updateDoc(pers, {CurStroke: index});
        setAvaStroke(index);
        getInfoShop();
    }

    useEffect(() => {
        getInfoShop();
    }, [user, loading]);

	return (
        <>
            <Header firstName="Главная" firstTo="/main" secondName="Профиль" secondTo="/profile" />
            <div className={styles.Screen}>
                <div className={styles.ScreenMain}>
                    <div className={styles.Main}>
                        <div className={styles.TogMain}>
                            <img src={To[Ava]} alt="" className={styles.MainImg} />
                            {To2[AvaStroke] != "" ? 
                            <img src={To2[AvaStroke]} className={styles.StrokeImg} alt="" /> :
                            <div className={styles.StrokeImg} ></div>}
                        </div>
                        <div className={styles.MainGroup}>
                            <h4>Мои иконки:</h4>
                            <div className={styles.MainList}>
                                {ListIcons.map((i: number, index: number) => 
                                    <div key={index} className={(i == Ava ? styles.BlockActive : "")} onClick={() => ChooseIco(index)}><Block image={To[i]}></Block></div>
                                )}
                            </div>
                        </div>
                        <div className={styles.MainGroup}>
                            <h4>Мои обводки:</h4>
                            <div className={styles.MainList}>
                                {Strokes.map((i: number, index: number) => 
                                    <div key={index} className={(i == AvaStroke ? styles.BlockActive : "")} onClick={() => ChooseIco2(index)}>{To2[i] == "" ? <div className={styles.Block}></div> : <Block image={To2[i]}></Block>}</div>
                                )}
                            </div>
                        </div>
                        <div className={styles.MainInfo}>
                            <h4>Количество пропусков:</h4>
                            <h4>{CanSkip}</h4>
                        </div>
                        <div className={styles.MainInfo}>
                            <h4>Количество боёв:</h4>
                            <h4>{NumberFights}</h4>
                        </div>
                    </div>
                    <div className={styles.Right}>
                        <div className={styles.RightList}>
                            <h4 className={styles.TextName}>Иконки:</h4>
                            {ListIcons.includes(1) ? "" : <BlockShop getInfoShop={getInfoShop} index={1} image={User2} cost={400} />}
                            {ListIcons.includes(2) ? "" :  <BlockShop getInfoShop={getInfoShop} index={2} image={User3} cost={10} />}
                            {ListIcons.includes(3) ? "" : <BlockShop getInfoShop={getInfoShop} index={3} image={User4} cost={100} />}
                            {ListIcons.includes(4) ? "" : <BlockShop getInfoShop={getInfoShop} index={4} image={User5} cost={600} />}
                            {ListIcons.includes(5) ? "" :  <BlockShop getInfoShop={getInfoShop} index={5} image={User6} cost={200} />}
                        </div>
                        <div className={styles.RightList}>
                            <h4 className={styles.TextName}>Обводки:</h4>
                            {Strokes.includes(1) ? "" : <StrokeShop getInfoShop={getInfoShop} index={1} image={Stroke1} cost={100} />}
                            {Strokes.includes(2) ? "" : <StrokeShop getInfoShop={getInfoShop} index={2} image={Stroke2} cost={100} />}
                            {Strokes.includes(3) ? "" : <StrokeShop getInfoShop={getInfoShop} index={3} image={Stroke3} cost={200} />}
                            {Strokes.includes(4) ? "" : <StrokeShop getInfoShop={getInfoShop} index={4} image={Stroke4} cost={500} />}
                            {Strokes.includes(5) ? "" : <StrokeShop getInfoShop={getInfoShop} index={5} image={Stroke5} cost={400} />}
                        </div>
                        <div className={styles.RightList}>
                            <SkipOne getInfoShop={getInfoShop}/>
                            <SkipFour getInfoShop={getInfoShop}/>
                            <SkipFightOne getInfoShop={getInfoShop}/>
                            <SkipFightTwo getInfoShop={getInfoShop}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
	);
  }

export default Shop;
