import styles from "./Levels.module.scss";
import Header from "../Header/Header"
import {auth, db} from "../../config/firebase"
import { path, sky, PlanetIco, BackPlanet, SunIco } from "../../assets";
import classNames from "classnames";
import { Planets } from "./constants";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

interface PlanetProps {
    position: string;
    textPosition: string;
    text: string[];
    textNum: number;
};

function Click(e: any, t: number) {
    e.stopPropagation();
    document.getElementById("Planet" + t)?.classList.remove("hidden");
}

function Leave(t: number) {
    document.getElementById("Planet" + t)?.classList.add("hidden");
}

function Planet(props: PlanetProps){
    return (
        <>
            <div id={"Planet" + props.textNum} className={classNames(styles.Info, props.textPosition, "hidden")}>
                {props.text.map((T: string, index: number) => 
                    <h4 key={index}>{T}</h4>
                )}
            </div>
            <div onMouseEnter={(e) => Click(e, props.textNum)} onMouseLeave={() => Leave(props.textNum)} onClick={(e) => Click(e, props.textNum)} className={classNames(styles.Planet, props.position)}>
                <img src={PlanetIco} className={styles.PlanetIco} alt="" />
                <img src={BackPlanet} className={styles.PlanetBack} alt="" />
                <h2 className={styles.PlanetText}>{props.textNum}</h2>
            </div>
        </>
    );
}

function Sun(){
    return (
        <>
            <div id={"Planet" + 10} className={classNames(styles.Info, styles.SunT, "hidden")}>
                {["+1 привычка", "+ 1 боя", "+500 coins"].map((T: string, index: number) => 
                    <h4 key={index}>{T}</h4>
                )}
            </div>
            <div onMouseEnter={(e) => Click(e, 10)} onMouseLeave={() => Leave(10)} onClick={(e) => Click(e, 10)}  className={classNames(styles.Planet, styles.Sun)}>
                <img src={SunIco} className={styles.PlanetSun} alt="" />
                <h2 className={classNames(styles.PlanetText, styles.SunText)}>10</h2>
            </div>
        </>
    );
}

function Levels() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    if (user == null) {
        navigate("/login");
    }

    function Leave() {
        for (let i = 0; i < 10; i++) {
            document.getElementById("Planet" + i)?.classList.add("hidden");
        }
    }

    return (
        <div onClick={Leave} className={styles.AllScreen}>
            <div className={styles.FixedHeader}><Header firstName="Главная" firstTo="/main" secondName="Магазин" secondTo="/shop"/></div>
            <div className={styles.Screen}>
                <img src={path} className={styles.Path} alt="" />
                {(Planets.map((i: any, index: number) => 
                    <Planet key={index} textPosition={i.textPosition} text={i.text} position={i.position} textNum={index+1} />
                ))}
                <Sun></Sun>
            </div>
        </div>
    );
  }

export default Levels;
