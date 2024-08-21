import { ListBlocks } from "./constants";
import styles from "./StartPage.module.scss";

function RemoveAll() {
    for (let i = 0; i < document.getElementsByClassName(styles.StartLogo_Rectangle_Active).length; i++) {
        document.getElementsByClassName(styles.StartLogo_Rectangle_Active)[0].classList.remove(styles.StartLogo_Rectangle_Active);
        document.getElementsByClassName(styles.StartLogo_Rectangle_ActiveImg)[0].classList.remove(styles.StartLogo_Rectangle_ActiveImg);
        document.getElementsByClassName(styles.StartLogo_Rectangle_ActiveImg)[0].classList.remove(styles.StartLogo_Rectangle_ActiveImg);
    }
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function WakeUpRandomly() {
    const Res = getRandomInt(7);
    RemoveAll();
    Change(ListBlocks[Res].id);
}

function Change(id: string) {
    RemoveAll();
    document.getElementById(id)?.classList.toggle(styles.StartLogo_Rectangle_Active);
    document.getElementById(id + "Img")?.classList.toggle(styles.StartLogo_Rectangle_ActiveImg);
    document.getElementById(id + "Help")?.classList.toggle(styles.StartLogo_Rectangle_ActiveImg);
}

export {
    WakeUpRandomly,
    RemoveAll,
    Change,
    getRandomInt,
}