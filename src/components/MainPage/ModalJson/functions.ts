function getIndex(addDate: string, period: string, curTime: string) {
    const oneDay = 1000 * 86400;
    const oneWeek = oneDay * 7;
    let Start = new Date(parseInt(addDate));
    let Now = new Date(parseInt(curTime));
    if (period == "Ежемесячно") {
      let cnt = 0;
      while (Start.getFullYear() != Now.getFullYear() || Start.getMonth() != Now.getMonth()) {
        Start.setMonth(Start.getMonth() + 1);
        cnt++;
      }
      return cnt;
    } else if (period == "Еженедельно") {
      const CountWeek = Math.floor((Now.getTime() - Start.getTime()) / oneWeek) + 1;
      return CountWeek;
    } else {
      const CountDay = Math.floor((Now.getTime() - Start.getTime()) / oneDay) + 1;
      return CountDay;
    }
}

const ToNormalPeriod: any = {
  "daily": "Ежедневно",
  "weekly": "Еженедельно",
  "monthly": "Ежемесячно",
}

function contains(arr: any, elem: any) {
  return arr.indexOf(elem) != -1;
}

export {
    getIndex,
    contains,
    ToNormalPeriod,
};