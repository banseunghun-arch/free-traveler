export interface RepresentativeData {
  name: string;
  title: string;
  bio: string;
  stats: {
    trips: number;
    countries: number;
    years: number;
  };
  highlights: string[];
}

export const representative: RepresentativeData = {
  name: "Free Traveler",
  title: "자유로운 여행자",
  bio: "전 세계 50개 이상의 국가를 방문했으며, 30개국 이상의 도시에서 현지 문화를 경험한 여행 애호가입니다. 매년 새로운 목적지를 탐험하며 동행자들과 경험을 나누고 있습니다.",
  stats: {
    trips: 50,
    countries: 30,
    years: 15,
  },
  highlights: [
    "동남아 문화 탐방",
    "유럽 예술 여행",
    "아프리카 사파리 경험",
    "남미 자연 트래킹",
    "중동 유산 탐방",
  ],
};
