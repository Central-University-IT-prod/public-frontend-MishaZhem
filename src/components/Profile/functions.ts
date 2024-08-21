import DateStore from "../../store/Date/Date";

async function getTime(addDate: string, period: string) {
    const oneDay = 1000 * 86400;
    const oneWeek = oneDay * 7;
    let Start = new Date(parseInt(addDate));
    if (period == "месяц") {
      let Now = new Date((await DateStore.GetTime()));
      while (Start.getFullYear() != Now.getFullYear() || Start.getMonth() != Now.getMonth()) {
        Start.setMonth(Start.getMonth() + 1)
      }
      Start.setMonth(Start.getMonth() + 1)
      const result = Start.getTime() - Now.getTime();
      return "Осталось времни: " + Math.ceil(result / 1000 / 60 / 60 / 24) + " (дни)";
    } else if (period == "неделя") {
      let Now = (await DateStore.GetTime())
      const CountWeek = Math.floor(Math.abs(Now - Start.getTime()) / oneWeek) + 1;
      const result = Start.getTime() + CountWeek * oneWeek - Now;
      return "Осталось времни: " + Math.ceil(result / 1000 / 60 / 60 / 24) + " (дни)";
    } else {
      let Now = (await DateStore.GetTime())
      const CountDay = Math.floor(Math.abs(Now - Start.getTime()) / oneDay) + 1;
      const result = Start.getTime() + CountDay * oneDay - Now;
      return "Осталось времни: " + Math.ceil(result / 1000 / 60 / 60) + " (часы)";
    }
}


async function Next(addDate: string, period: string, lastChange: string) {
    const oneDay = 1000 * 86400;
    const oneWeek = oneDay * 7;
    let lastT = new Date(parseInt(lastChange));
    let Start = new Date(parseInt(addDate));
    if (period == "месяц") {
      let Now = new Date((await DateStore.GetTime()));
      if (Start.getFullYear() != Now.getFullYear() || Start.getMonth() != Now.getMonth()) {
        return true;
      }
      return false;
    } else if (period == "неделя") {
      let Now = (await DateStore.GetTime())
      const CountWeek = Math.floor((Now - Start.getTime()) / oneWeek) + 1;
      const Cur = Start.getTime() + CountWeek * oneWeek;
      if (CountWeek <= 1) return false;
      return true;
    } else {
      let Now = (await DateStore.GetTime())
      const CountDay = Math.floor((Now - Start.getTime()) / oneDay) + 1;
      if (CountDay <= 1) return false;
      return true;
    }
  }

export {
    Next,
    getTime,
}