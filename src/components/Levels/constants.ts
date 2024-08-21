import styles from "./Levels.module.scss";

const Planets = [
    {
        position: styles.First,
        textPosition: styles.FirstT,
        text: ["1 бой", "3 привычки", "100 coins"]
    },
    {
        position: styles.Second,
        textPosition: styles.SecondT,
        text: ["+ 1 привычка", "+ 100 coins"]
    },
    {
        position: styles.Third,
        textPosition: styles.ThirdT,
        text: ["+ 1 бой", "+ 100 coins"]
    },
    {
        position: styles.Fourth,
        textPosition: styles.FourthT,
        text: [ "+ 200 coins"]
    },
    {
        position: styles.Fifth,
        textPosition: styles.FifthT,
        text: ["+ 1 привычка", "+ 100 coins"]
    },
    {
        position: styles.Sixth,
        textPosition: styles.SixthT,
        text: ["+ 1 бой", "+ 150 coins"]
    },
    {
        position: styles.Seventh,
        textPosition: styles.SeventhT,
        text: ["+ 1 привычка", "+ 200 coins"]
    },
    {
        position: styles.Eighth,
        textPosition: styles.EighthT,
        text: ["+ 1 привычка", "+ 200 coins"]
    },
    {
        position: styles.Ninth,
        textPosition: styles.NinthT,
        text: ["+ 1 привычки", "300 coins"]
    },
];

export {
    Planets,
}