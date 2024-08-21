import { addDoc, collection } from "firebase/firestore"
import { BaseUser, Stroke1, Stroke2, Stroke3, Stroke4, Stroke5, User2, User3, User4, User5, User6 } from "../assets"
import { db } from "../config/firebase"

const ToXp: any = {
    1: 10,
    2: 40,
    3: 50,
    4: 100,
    5: 100,
    6: 100,
    7: 100,
    8: 100,
    9: 100,
    10: 100,
}

const XpToLevel: any = {
    0: 0,
    1: 0,
    2: 10,
    3: 50,
    4: 100,
    5: 200,
    6: 300,
    7: 400,
    8: 500,
    9: 600,
    10: 700,
}

const To: any = {
    0: BaseUser,
    1: User2,
    2: User3,
    3: User4,
    4: User5,
    5: User6,
}
const To2: any = {
    0: "",
    1: Stroke1,
    2: Stroke2,
    3: Stroke3,
    4: Stroke4,
    5: Stroke5,
}

async function ReadyOptions(value: string, email: string) {
  const HabitsCollectionRef = collection(db, "habits");
  if (value == "Качать пресс") {
    await addDoc(HabitsCollectionRef, {
        title: "Качать пресс",
        targetValue: 30,
        period: "Ежедневно",
        category: "Физическая активность",
        addDate: Date.now().toString(),
        lastResult: 0,
        lastChange: (Date.now() + 1).toString(),
        type: true,
        ForUser: email,
        visibility: true,
        allDone: 0,
        history: [],
    })
  } else if (value == "Чтение книг") {
    await addDoc(HabitsCollectionRef, {
        title: "Чтение книг",
        targetValue: 1,
        period: "Еженедельно",
        category: "Саморазвитие",
        addDate: Date.now().toString(),
        lastResult: 0,
        lastChange: (Date.now() + 1).toString(),
        type: false,
        ForUser: email,
        visibility: true,
        allDone: 0,
        history: [],
    })
  } else if (value == "Регулярные пробежки") {
    await addDoc(HabitsCollectionRef, {
        title: "Регулярные пробежки",
        targetValue: 1,
        period: "Еженедельно",
        category: "Физическая активность",
        addDate: Date.now().toString(),
        lastResult: 0,
        lastChange: (Date.now() + 1).toString(),
        type: false,
        ForUser: email,
        visibility: true,
        allDone: 0,
        history: [],
    })
  } else if (value == "Пить воду 2000мл") {
    await addDoc(HabitsCollectionRef, {
        title: "Пить воду 2000мл",
        targetValue: 2000,
        period: "Еженедельно",
        category: "Физическая активность",
        addDate: Date.now().toString(),
        lastResult: 0,
        lastChange: (Date.now() + 1).toString(),
        type: true,
        ForUser: email,
        visibility: true,
        allDone: 0,
        history: [],
    })
  } else if (value == "Закончить PROD проект") {
    await addDoc(HabitsCollectionRef, {
        title: "Закончить PROD проект",
        targetValue: 1,
        period: "Ежемесячно",
        category: "Саморазвитие",
        addDate: Date.now().toString(),
        lastResult: 0,
        lastChange: (Date.now() + 1).toString(),
        type: false,
        ForUser: email,
        visibility: true,
        allDone: 0,
        history: [],
    })
  } 
}

export {
    ToXp,
    XpToLevel,
    To,
    To2,
    ReadyOptions,
}