import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import styles from "./Login.module.scss";
import {auth, db} from "../../config/firebase"
import { LoginBack, logo, TrianLogo, UnderCompetition } from "../../assets";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import DateStore from "../../store/Date/Date"

function Login() {
    const [LoginU, setLoginU] = useState(true);
	const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [Wrong, setWrong] = useState(false);
    const navigate = useNavigate();
    const PersonalCollectionRef = collection(db, "personal_info");
    const CategoryCollectionRef = collection(db, "categories");

    const SignIn = async () => {
        await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            await addDoc(PersonalCollectionRef, {
                addDate: (await DateStore.GetTime()).toString(),
                coins: 10,
                friends: [],
                mail: email,
                xp: 0,
                doneHabits: 0,
                NumberFights: 1,
                Level: 1,
                Fights: [],
                bids: [],
                Name: "User",
                WithoutGap: 0,
                icons: [0],
                strokes: [0],
                WasMaxLevel: 1,
                MaxHabits: 3,
                CanSkip: 0,
                CurIcon: 0,
                CurStroke: 0,
            })
            await addDoc(CategoryCollectionRef, {
                categories: [],
                ForUser: email,
            })
            navigate("/main");
        })
        .catch((error) => {
            setWrong(true);
        });
    }

    

    const onLogin = async () => {
       
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            navigate("/main");
        })
        .catch((error) => {
            setWrong(true);
        });
       
    }

    return (
        <div className={styles.Screen}>
            <img src={LoginBack} alt="" className={styles.UnderCompetition} />
            <div className={styles.Make}>
                <img src={logo} alt="" className={styles.Logo} />
                <div className={styles.Place}>
                    <h4 className={styles.PlaceTitle}>{LoginU ? "Войти" : "Зарегистрироваться"}</h4>
                    <div className={styles.PlaceInputs}>
                        <div className={styles.PlaceTogether}>
                            <p>Почта</p>
                            <input onChange={(e) => setEmail(e.target.value)} type="text" className={styles.PlaceInput} />
                            <div className={styles.PlaceHr}></div>
                        </div>
                        <div className={styles.PlaceTogether}>
                            <p>Пароль</p>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" className={styles.PlaceInput} />
                            <div className={styles.PlaceHr}></div>
                        </div>
                        {LoginU ? <h4 className={styles.PlaceMessage}>Нет аккаунта? <span onClick={() => (setLoginU(false), setWrong(false))} className={styles.PlaceBold}>Зарегистрируйся</span></h4> : 
                        <h4 className={styles.PlaceMessage}>Есть аккаунт? <span onClick={() => (setLoginU(true), setWrong(false))} className={styles.PlaceBold}>Войти</span></h4>}
                    </div>
                    <button onClick={LoginU ? onLogin : SignIn} className={styles.PlaceIn}>{LoginU ? "Войти" : "Зарегистрироваться"}</button>
                    {Wrong ? <h5 className={styles.Wrong}>Некорректные данные!</h5> : ""}
                </div>
            </div>
        </div>
    );
  }

export default Login;
