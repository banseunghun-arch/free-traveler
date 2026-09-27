export interface SafetyInfo {
  country: string;
  region: string;
  level: "safe" | "caution" | "warning";
  categories: {
    name: string;
    status: string;
    details: string;
  }[];
  lastUpdated: string;
}

export const safetyInfo: SafetyInfo[] = [
  {
    country: "일본",
    region: "전역",
    level: "safe",
    categories: [
      {
        name: "치안",
        status: "안전",
        details: "일반적으로 안전한 지역으로 알려져 있습니다",
      },
      {
        name: "자연재해",
        status: "주의",
        details: "지진 위험이 있으니 사전 준비가 필요합니다",
      },
      {
        name: "보건",
        status: "안전",
        details: "의료시설이 잘 갖춰져 있습니다",
      },
    ],
    lastUpdated: "2024-09-01",
  },
  {
    country: "태국",
    region: "방콕",
    level: "caution",
    categories: [
      {
        name: "치안",
        status: "주의",
        details: "일부 지역에서 소매치기 발생 가능",
      },
      {
        name: "자연재해",
        status: "안전",
        details: "우기(5-10월)에 홍수 가능",
      },
      {
        name: "보건",
        status: "안전",
        details: "수인성 질환 주의 필요",
      },
    ],
    lastUpdated: "2024-09-01",
  },
  {
    country: "프랑스",
    region: "파리",
    level: "caution",
    categories: [
      {
        name: "치안",
        status: "주의",
        details: "관광지 주변에서 소매치기 주의",
      },
      {
        name: "자연재해",
        status: "안전",
        details: "자연재해 위험 낮음",
      },
      {
        name: "보건",
        status: "안전",
        details: "의료시설 우수",
      },
    ],
    lastUpdated: "2024-09-01",
  },
  {
    country: "영국",
    region: "런던",
    level: "safe",
    categories: [
      {
        name: "치안",
        status: "안전",
        details: "일반적으로 안전한 도시",
      },
      {
        name: "자연재해",
        status: "안전",
        details: "자연재해 위험 낮음",
      },
      {
        name: "보건",
        status: "안전",
        details: "의료시설 세계 최고 수준",
      },
    ],
    lastUpdated: "2024-09-01",
  },
  {
    country: "스페인",
    region: "바르셀로나",
    level: "caution",
    categories: [
      {
        name: "치안",
        status: "주의",
        details: "관광지에서 자산 보호 필요",
      },
      {
        name: "자연재해",
        status: "안전",
        details: "지중해 기후로 안전",
      },
      {
        name: "보건",
        status: "안전",
        details: "의료시설 우수",
      },
    ],
    lastUpdated: "2024-09-01",
  },
  {
    country: "이탈리아",
    region: "로마",
    level: "caution",
    categories: [
      {
        name: "치안",
        status: "주의",
        details: "소매치기 및 스리 주의",
      },
      {
        name: "자연재해",
        status: "안전",
        details: "자연재해 위험 낮음",
      },
      {
        name: "보건",
        status: "안전",
        details: "의료시설 양호",
      },
    ],
    lastUpdated: "2024-09-01",
  },
  {
    country: "독일",
    region: "베를린",
    level: "safe",
    categories: [
      {
        name: "치안",
        status: "안전",
        details: "비교적 안전한 도시",
      },
      {
        name: "자연재해",
        status: "안전",
        details: "자연재해 위험 낮음",
      },
      {
        name: "보건",
        status: "안전",
        details: "의료시설 우수",
      },
    ],
    lastUpdated: "2024-09-01",
  },
  {
    country: "네덜란드",
    region: "암스테르담",
    level: "safe",
    categories: [
      {
        name: "치안",
        status: "안전",
        details: "비교적 안전한 도시",
      },
      {
        name: "자연재해",
        status: "안전",
        details: "자연재해 위험 낮음",
      },
      {
        name: "보건",
        status: "안전",
        details: "의료시설 세계 최고 수준",
      },
    ],
    lastUpdated: "2024-09-01",
  },
];
