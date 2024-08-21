interface PropsBlock {
    image: string;
    // positionStrings: string[]; // [(left || right), (top || bottom)]
    // positionMetrics: number[];
    class: string;
    id: string;
};

interface PropsCard {
    image: string;
    background: string;
    Name: string;
    type: number;
    left: string;
    UnderTime: string;
};

interface PropsTime {
    text: string;
    value: number;
}

interface FriendsProps {
    num: number;
};

export type {
    PropsBlock,
    PropsCard,
    PropsTime,
    FriendsProps,
}