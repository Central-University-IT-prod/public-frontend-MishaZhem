import styles from "./Shop.module.scss";
import { BaseUser, coins, line, Stroke1, Stroke2, Stroke3, Stroke4, Stroke5, User2, User3, User4, User5, User6, WhiteCoins } from "../../assets";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import addNotification from 'react-push-notification';

interface SkipProps {
    getInfoShop(): Promise<void>;
}

function SkipOne(props: SkipProps) {
    const [user, loading, error] = useAuthState(auth);

    async function Buy() {
        const PersonalCollectionRef = collection(db, "personal_info");
        const data = await getDocs(PersonalCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
        if (filteredDocs[0].coins < 30) {
            addNotification({
                title: 'У вас не хватает денег!',
                subtitle: 'Заработайте или посмотрите что-нибудь другое!',
                message: 'Заработайте или посмотрите что-нибудь другое!',
                theme: 'darkblue',
                native: true
            });
        } else {
            const pers = doc(db, "personal_info", filteredDocs[0].id);
            const MoneyNow = filteredDocs[0].coins - 30;
            let CanSkip = filteredDocs[0].CanSkip; CanSkip++;
            await updateDoc(pers, {coins: MoneyNow, CanSkip: CanSkip});
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
        <div className={styles.Skip}>
            <div className={styles.SkipTop}>
                <h3 className={styles.SkipTopText}>Пропуск</h3>
            </div>  
            <div className={styles.SkipMain}>
                <h3 className={styles.SkipMainH}>Пропуск <span className={styles.SkipMainBold}>одной</span> привычки</h3>
                <h4>Если ты пропустишь привычку, то она зачтётся автоматически!</h4>
                <div onClick={Buy} className={styles.SkipMainButton}>
                    <h5>30</h5>
                    <img src={coins} alt="" className={styles.SkipMainButtonImg} />
                </div>
                <img src={line} className={styles.SkipMainLine}></img>
                <div className={styles.Empty1}></div>
                <div className={styles.Empty2}></div>
            </div>
        </div>
    );
}

function SkipFour(props: SkipProps) {
    const [user, loading, error] = useAuthState(auth);

    async function Buy() {
        const PersonalCollectionRef = collection(db, "personal_info");
        const data = await getDocs(PersonalCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
        if (filteredDocs[0].coins < 80) {
            addNotification({
                title: 'У вас не хватает денег!',
                subtitle: 'Заработайте или посмотрите что-нибудь другое!',
                message: 'Заработайте или посмотрите что-нибудь другое!',
                theme: 'darkblue',
                native: true
            });
        } else {
            const pers = doc(db, "personal_info", filteredDocs[0].id);
            const MoneyNow = filteredDocs[0].coins - 80;
            let CanSkip = filteredDocs[0].CanSkip; CanSkip += 4;
            await updateDoc(pers, {coins: MoneyNow, CanSkip: CanSkip});
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
        <div className={styles.Skip}>
            <div className={styles.SkipTop}>
                <h3 className={styles.SkipTopText}>Пропуск</h3>
            </div>  
            <div className={styles.SkipMain}>
                <h3 className={styles.SkipMainH}>Пропуск <span className={styles.SkipMainBold}>четырех</span> привычки</h3>
                <h4>Если ты пропустишь привычку, то она зачтётся автоматически!</h4>
                <div onClick={Buy} className={styles.SkipMainButton}>
                    <h5>80</h5>
                    <img src={coins} alt="" className={styles.SkipMainButtonImg} />
                </div>
                <img src={line} className={styles.SkipMainLine}></img>
                <div className={styles.Empty1}></div>
                <div className={styles.Empty2}></div>
            </div>
        </div>
    );
}

function SkipFightOne(props: SkipProps) {
    const [user, loading, error] = useAuthState(auth);

    async function Buy() {
        const PersonalCollectionRef = collection(db, "personal_info");
        const data = await getDocs(PersonalCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
        if (filteredDocs[0].coins < 150) {
            addNotification({
                title: 'У вас не хватает денег!',
                subtitle: 'Заработайте или посмотрите что-нибудь другое!',
                message: 'Заработайте или посмотрите что-нибудь другое!',
                theme: 'darkblue',
                native: true
            });
        } else if (filteredDocs[0].NumberFights >= 4) {
            addNotification({
                title: 'У вас уже достигнут максимум возможных боев',
                subtitle: 'Посмотрите что-нибудь другое!',
                message: 'Посмотрите что-нибудь другое!',
                theme: 'darkblue',
                native: true
            });
        } else {
            const pers = doc(db, "personal_info", filteredDocs[0].id);
            const MoneyNow = filteredDocs[0].coins - 150;
            let NumberFights = filteredDocs[0].NumberFights; NumberFights++;
            await updateDoc(pers, {coins: MoneyNow, NumberFights: NumberFights});
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
        <div className={styles.Skip}>
            <div className={styles.SkipTop}>
                <h3 className={styles.SkipTopText}>Бой</h3>
            </div>  
            <div className={styles.SkipMain}>
                <h3 className={styles.SkipMainH}>+ <span className={styles.SkipMainBold}>один</span> бой</h3>
                <h4>Если ты пропустишь привычку, то она зачтётся автоматически!</h4>
                <div onClick={Buy} className={styles.SkipMainButton}>
                    <h5>150</h5>
                    <img src={coins} alt="" className={styles.SkipMainButtonImg} />
                </div>
                <img src={line} className={styles.SkipMainLine}></img>
                <div className={styles.Empty1}></div>
                <div className={styles.Empty2}></div>
            </div>
        </div>
    );
}

function SkipFightTwo(props: SkipProps) {
    const [user, loading, error] = useAuthState(auth);

    async function Buy() {
        const PersonalCollectionRef = collection(db, "personal_info");
        const data = await getDocs(PersonalCollectionRef);
        let filteredDocs: any = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        filteredDocs = filteredDocs.filter((x: any) => x.mail.toLowerCase() == user?.email);
        if (filteredDocs[0].coins < 250) {
            addNotification({
                title: 'У вас не хватает денег!',
                subtitle: 'Заработайте или посмотрите что-нибудь другое!',
                message: 'Заработайте или посмотрите что-нибудь другое!',
                theme: 'darkblue',
                native: true
            });
        } else if (filteredDocs[0].NumberFights >= 4) {
            addNotification({
                title: 'У вас уже достигнут максимум возможных боев',
                subtitle: 'Посмотрите что-нибудь другое!',
                message: 'Посмотрите что-нибудь другое!',
                theme: 'darkblue',
                native: true
            });
        } else {
            const pers = doc(db, "personal_info", filteredDocs[0].id);
            const MoneyNow = filteredDocs[0].coins - 250;
            let NumberFights = filteredDocs[0].NumberFights; NumberFights = Math.min(4, NumberFights + 2);
            await updateDoc(pers, {coins: MoneyNow, NumberFights: NumberFights});
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
        <div className={styles.Skip}>
            <div className={styles.SkipTop}>
                <h3 className={styles.SkipTopText}>Бой</h3>
            </div>  
            <div className={styles.SkipMain}>
                <h3 className={styles.SkipMainH}>+ <span className={styles.SkipMainBold}>два</span> бой</h3>
                <h4>Если ты пропустишь привычку, то она зачтётся автоматически!</h4>
                <div onClick={Buy} className={styles.SkipMainButton}>
                    <h5>250</h5>
                    <img src={coins} alt="" className={styles.SkipMainButtonImg} />
                </div>
                <img src={line} className={styles.SkipMainLine}></img>
                <div className={styles.Empty1}></div>
                <div className={styles.Empty2}></div>
            </div>
        </div>
    );
}

export {
    SkipOne,
    SkipFour,
    SkipFightOne,
    SkipFightTwo,
}