import { makeAutoObservable } from "mobx";

class DateStore {
	TodayTime: number = parseInt(localStorage.TodayTime);
    TakeTime: number = parseInt(localStorage.TakeTime);

    constructor() {
		makeAutoObservable(this);
	}

    ChangeTime = async (T: number) => {
        this.TodayTime = T;
        localStorage.TodayTime = this.TodayTime.toString();
        this.TakeTime = Date.now();
        localStorage.TakeTime = this.TakeTime.toString();
    }

    GetTime = async () => {
        const result = this.TodayTime + (Date.now() - this.TakeTime);
        if (isNaN(result)) return Date.now();
        return this.TodayTime + (Date.now() - this.TakeTime);
    }
}

export default new DateStore();