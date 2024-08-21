import { logo, swim, meditation, work, running, book, pushup, basketball, ShortLogo, CardRun, CardHabits1, CardHabits3, CardMeditation, PersonBlack, PersonWhite, telegram, mail, CardHabits2 } from "../../assets";
import styles from "./StartPage.module.scss";

const ListBlocks = [
    {
        image: swim,
        // positionStrings: ["right", "bottom"],
        // positionMetrics: [200, 50],
        class: styles.First,
        id: 'Swim'
    },
    {
        image: meditation,
        // positionStrings: ["right", "top"],
        // positionMetrics: [100, 300],
        class: styles.Second,
        id: 'Meditation'
    },
    {
        image: work,
        // positionStrings: ["left", "top"],
        // positionMetrics: [100, 300],
        class: styles.Third,
        id: 'Work'
    },
    {
        image: running,
        // positionStrings: ["left", "bottom"],
        // positionMetrics: [700, 100],
        class: styles.Fourth,
        id: 'Running'
    },
    {
        image: book,
        // positionStrings: ["right", "top"],
        // positionMetrics: [400, 100],
        class: styles.Fifth,
        id: 'Book'
    },
    {
        image: pushup,
        // positionStrings: ["left", "bottom"],
        // positionMetrics: [200, 50],
        class: styles.Sixth,
        id: 'Pushup'
    },
    {
        image: basketball,
        // positionStrings: ["left", "top"],
        // positionMetrics: [400, 100],
        class: styles.Seventh,
        id: 'Basketball'
    }
]

const HabitsCards = [
    {
        image: CardRun,
        Name: "Регулярные пробежки",
        type: 2,
        left: "35/100",
        UnderTime: "Осталось времни: 1 час",
        background: CardHabits1,
    },
    {
        image: CardMeditation,
        Name: "Утренняя медитация",
        type: 2,
        left: "35/100",
        UnderTime: "Осталось времни: 2 часа",
        background: CardHabits2,
    },
    {
        image: CardRun,
        Name: "Регулярные пробежки",
        type: 1,
        left: "35/100",
        UnderTime: "Осталось времни: 3 час",
        background: CardHabits3,
    },
]

export {
    ListBlocks,
    HabitsCards,
}