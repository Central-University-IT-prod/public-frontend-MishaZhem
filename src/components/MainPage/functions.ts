import DateStore from "../../store/Date/Date";

async function getTime(addDate: string, period: string) {
    const oneDay = 1000 * 86400;
    const oneWeek = oneDay * 7;
    let Start = new Date(parseInt(addDate));
    if (period == "Ежемесячно") {
      let Now = new Date((await DateStore.GetTime()));
      while (Start.getFullYear() != Now.getFullYear() || Start.getMonth() != Now.getMonth()) {
        Start.setMonth(Start.getMonth() + 1)
      }
      Start.setMonth(Start.getMonth() + 1)
      const result = Start.getTime() - Now.getTime();
      return "Осталось времни: " + Math.ceil(result / 1000 / 60 / 60 / 24) + " (дни)";
    } else if (period == "Еженедельно") {
      let Now = (await DateStore.GetTime())
      const CountWeek = Math.floor((Now - Start.getTime()) / oneWeek) + 1;
      const result = Start.getTime() + CountWeek * oneWeek - Now;
      return "Осталось времни: " + Math.ceil(result / 1000 / 60 / 60 / 24) + " (дни)";
    } else {
      let Now = (await DateStore.GetTime());
      const J = Now;
      const CountDay = Math.floor((Now - Start.getTime()) / oneDay) + 1;
      const result = Start.getTime() + CountDay * oneDay - Now;
      return "Осталось времни: " + Math.ceil(result / 1000 / 60 / 60) + " (часы)";
    }
}

async function Skipped(addDate: string, period: string, lastChange: string, lastResult: boolean) {
    const oneDay = 1000 * 86400;
    const oneWeek = oneDay * 7;
    let lastT = new Date(parseInt(lastChange));
    let Start = new Date(parseInt(addDate));
    if (period == "Ежемесячно") {
      let Now = new Date((await DateStore.GetTime()));
      while (Start.getFullYear() != Now.getFullYear() || Start.getMonth() != Now.getMonth()) {
        Start.setMonth(Start.getMonth() + 1)
      }
      const Cur = Start;
      if (lastT.getFullYear() == Cur.getFullYear() && lastT.getMonth() == Cur.getMonth()) return false;
      lastT.setMonth(lastT.getMonth() + 1);
      if (lastT.getFullYear() == Cur.getFullYear() && lastT.getMonth() == Cur.getMonth() && lastResult) return false;
      else return true;
    } else if (period == "Еженедельно") {
      let Now = (await DateStore.GetTime())
      const CountWeek = Math.floor((Now - Start.getTime()) / oneWeek) + 1;
      const Cur = Start.getTime() + CountWeek * oneWeek;
      if (Cur - lastT.getTime() < oneWeek) return false;
      if (Cur - lastT.getTime() >= oneWeek && Cur - lastT.getTime() <= 2 * oneWeek && lastResult) return false
      return true;
    } else {
      let Now = (await DateStore.GetTime());
      const CountDay = ((Now - Start.getTime()) / oneDay);
      const Cur = Start.getTime() + CountDay * oneDay;
      if (Cur - lastT.getTime() < oneDay) return false;
      if (Cur - lastT.getTime() >= oneDay && Cur - lastT.getTime() <= 2 * oneDay && lastResult) return false
      return true;
    }
}

async function Next(addDate: string, period: string, lastChange: string, lastResult: boolean) {
  const oneDay = 1000 * 86400;
  const oneWeek = oneDay * 7;
  let lastT = new Date(parseInt(lastChange));
  let Start = new Date(parseInt(addDate));
  if (period == "Ежемесячно") {
    let Now = new Date((await DateStore.GetTime()));
    while (Start.getFullYear() != Now.getFullYear() || Start.getMonth() != Now.getMonth()) {
      Start.setMonth(Start.getMonth() + 1)
    }
    const Cur = Start;
    if (lastT.getFullYear() == Cur.getFullYear() && lastT.getMonth() == Cur.getMonth()) return false;
    else return true;
  } else if (period == "Еженедельно") {
    let Now = (await DateStore.GetTime())
    const CountWeek = Math.floor((Now - Start.getTime()) / oneWeek) + 1;
    const Cur = Start.getTime() + CountWeek * oneWeek;
    if (Cur - lastT.getTime() < oneWeek) return false;
    return true;
  } else {
    let Now = (await DateStore.GetTime())
    const CountDay = Math.floor((Now - Start.getTime()) / oneDay) + 1;
    const Cur = Start.getTime() + CountDay * oneDay;
    if (Cur - lastT.getTime() < oneDay) return false;
    return true;
  }
}

async function DoneActive(addDate: string, period: string, lastChange: string, lastResult: boolean) {
    const oneDay = 1000 * 86400;
    const oneWeek = oneDay * 7;
    let lastT = new Date(parseInt(lastChange));
    let Start = new Date(parseInt(addDate));
    if (period == "Ежемесячно") {
      let Now = new Date((await DateStore.GetTime()));
      while (Start.getFullYear() != Now.getFullYear() || Start.getMonth() != Now.getMonth()) {
        Start.setMonth(Start.getMonth() + 1)
      }
      const Cur = Start;
      if (lastT.getFullYear() == Cur.getFullYear() && lastT.getMonth() == Cur.getMonth() && lastResult) return true;
      return false;
    } else if (period == "Еженедельно") {
      let Now = (await DateStore.GetTime())
      const CountWeek = Math.floor((Now - Start.getTime()) / oneWeek) + 1;
      const Cur = Start.getTime() + CountWeek * oneWeek;
      if (Cur - lastT.getTime() < oneWeek && lastResult) return true;
      return false;
    } else {
      let Now = (await DateStore.GetTime())
      const CountDay = Math.floor((Now - Start.getTime()) / oneDay) + 1;
      const Cur = Start.getTime() + CountDay * oneDay;
      if (Cur - lastT.getTime() < oneDay && lastResult) return true;
      return false;
    }
}

async function GetEventCalendar(addDate: string, period: string) {
  const oneDay = 1000 * 86400;
  const oneWeek = oneDay * 7;
  let Start = new Date(parseInt(addDate));
  if (period == "Ежемесячно") {
    let Now = new Date((await DateStore.GetTime()));
    while (Start.getFullYear() != Now.getFullYear() || Start.getMonth() != Now.getMonth()) {
      Start.setMonth(Start.getMonth() + 1)
    }
    let End = new Date(Start.getTime());
    End.setMonth(End.getMonth() + 1);
    return [Start, End];
  } else if (period == "Еженедельно") {
    let Now = (await DateStore.GetTime())
    const CountWeek = Math.floor((Now - Start.getTime()) / oneWeek) + 1;
    const Cur = new Date(Start.getTime() + CountWeek * oneWeek);
    let End = Cur;
    End = new Date(Cur.getTime() + oneWeek);
    return [Cur, End];
  } else {
    let Now = (await DateStore.GetTime());
    const CountDay = Math.floor((Now - Start.getTime()) / oneDay) + 1;
    const Cur = new Date(Start.getTime() + CountDay * oneDay);
    let End = Cur;
    End = new Date(Cur.getTime() + oneDay);
    return [Cur, End];
  }
}

const toCatalogue: any = {
  1: 24,
  2: 110,
  3: 196,
  4: 289, 
  5: 370,
  6: 465,
}

const toCatalogueMobile: any = {
  1: 37,
  2: 91,
  3: 146,
  4: 196,
  5: 244,
  6: 297, 
}

function ToNext(num: number) {
  if (window.innerWidth <= 650) {
    return 45 + num * 67
  }
  return 24 + num * 86
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export {
    getTime,
    Skipped,
    DoneActive,
    Next,
    ToNext,
    GetEventCalendar,
    getRandomColor,
}