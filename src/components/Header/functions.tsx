function getCoins(level: number) {
    const To: any = {
        1: 0,
        2: 100,
        3: 100,
        4: 200,
        5: 100,
        6: 150,
        7: 200,
        8: 200,
        9: 300,
        10: 500,
    }
    return To[level];
}

function getMaxHabits(level: number) {
    const To: any = {
        1: 0,
        2: 1,
        3: 0,
        4: 0,
        5: 1,
        6: 0,
        7: 1,
        8: 1,
        9: 1,
        10: 1,
    }
    return To[level];
}

function getNumberFights(level: number) {
    const To: any = {
        1: 0,
        2: 0,
        3: 1,
        4: 0,
        5: 0,
        6: 1,
        7: 0,
        8: 0,
        9: 0,
        10: 1,
    }
    return To[level];
}

export {
    getCoins,
    getMaxHabits,
    getNumberFights,
}