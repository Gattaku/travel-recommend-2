// ============================================================
// Domain Types — 家族旅行プランナー
// ============================================================

/** 家族プロフィール */
export interface FamilyProfile {
  adultCount: number;        // 大人人数 1〜10
  childrenAges: number[];    // 子供の年齢リスト（空配列 = 子供なし）
}

/** 旅行条件 */
export interface TripCondition {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  budget: number;            // 総予算（円）
  style: 'nature' | 'culture' | 'resort' | 'onsen' | 'city';
  area: 'domestic' | 'overseas';
}

/** 旅行先候補（Claude が生成する 1 件分） */
export interface Destination {
  name: string;
  overview: string;
  highlights: string[];
  estimatedBudget: string;   // 例: "8〜12万円（4人）"
  tips: string;
}

/** 旅行提案セット（DB: trip_proposals） */
export interface TripProposal {
  id: string;                // UUID
  userId: string;
  condition: TripCondition;
  destinations: Destination[];
  createdAt: string;         // ISO 8601
}

/** 保存済み提案（DB: saved_proposals） */
export interface SavedProposal {
  id: string;
  userId: string;
  proposalId: string | null;
  destination: Destination;  // 保存時点のスナップショット
  memo: string;
  isDecided: boolean;
  createdAt: string;
  updatedAt: string;
}

/** しおりの日程 1 日分 */
export interface ScheduleDay {
  date: string;              // YYYY-MM-DD
  spots: ScheduleSpot[];
}

export interface ScheduleSpot {
  name: string;
  memo: string;
}

/** 宿泊先情報 */
export interface Accommodation {
  name?: string;
  address?: string;
  checkIn?: string;          // YYYY-MM-DD
  checkOut?: string;
}

/** 持ち物リストアイテム */
export interface PackingItem {
  item: string;
  checked: boolean;
}

/** 旅のしおり（DB: itineraries） */
export interface TripItinerary {
  id: string;
  userId: string;
  savedProposalId: string | null;
  title: string;
  travelDates: { start: string | null; end: string | null };
  schedule: ScheduleDay[];
  accommodation: Accommodation;
  packingList: PackingItem[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// API Request / Response Types
// ============================================================

export interface ProposeRequest {
  familyProfile: FamilyProfile;
  condition: TripCondition;
}

export interface ProposeResponse {
  proposalId: string;
  destinations: Destination[];
}

export interface SaveRequest {
  proposalId: string;
  destination: Destination;
}

export interface SaveResponse {
  id: string;
}

export interface PatchSavedRequest {
  memo?: string;
  isDecided?: boolean;
}

export interface CreateItineraryRequest {
  savedProposalId: string;
}

export interface PatchItineraryRequest {
  title?: string;
  travelDates?: { start: string | null; end: string | null };
  schedule?: ScheduleDay[];
  accommodation?: Accommodation;
  packingList?: PackingItem[];
}

export interface ApiError {
  error: string;
  fields?: string[];
}
