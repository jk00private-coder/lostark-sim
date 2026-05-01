/**
 * @/engine/pipeline/types.ts
 *
 * 데미지 계산 파이프라인 전용 타입 정의
 *
 * [구조]
 *   BufferMap        : 합산 전 원본값 보관 (type → subGroup → values[])
 *   SkillBuffer      : 스킬 하나의 버퍼 (Static 복사 + Dynamic 추가)
 *   SkillStatsBuffer : 전체 스킬별 완성된 수치 묶음
 *   ResolvedSkillMeta: 0단계에서 확정된 스킬 특성
 *   EffectRow        : UI 상세로그 한 줄 단위 (신규)
 *   SkillDetailLog   : 스킬 클릭 시 표시할 상세 로그 묶음 (신규)
 *   PipelineDebugData: 각 단계별 중간값 (디버깅 + UI 공용)
 *
 * [변경 이력]
 *   - EffectRow, SkillDetailLog 타입 추가
 *   - PipelineDebugData에 atkDetailLogs, staticLogs, dynamicLogs,
 *     specialLogs, skillDetailLogs 필드 추가
 *   - inputLogs는 유지 (파이프라인 전체 원본 참조용)
 */

import {
  SkillCategory,
  SkillTypeId,
  AttackTypeId,
  ResourceTypeId,
  DamageModifiers,
  EffectTarget,
} from '@/types/sim-types';
import { SkillOverride } from '@/types/skill-types';


// ============================================================
// 버퍼 타입
// ============================================================

/**
 * 합산 전 원본값 보관 구조
 *
 * 예) { DMG_INC: { card: [0.08, 0.12], __solo_0: [0.18] }, EVO_DMG: { __solo_0: [0.075] } }
 *
 * subGroup 없음 → '__solo_{idx}' 키로 독립 보관
 * subGroup 있음 → 해당 키로 합산 보관
 */
export type BufferMap = Record<string, Record<string, number[]>>;

/**
 * 스킬 하나의 버퍼
 * Static 복사 후 Dynamic 추가분이 합쳐진 상태
 */
export interface SkillBuffer {
  skillId   : number;
  bufferMap : BufferMap;
  /** Special 처리가 완료된 후 확정된 DamageModifiers */
  finalMods?: DamageModifiers;
}

/**
 * 전체 스킬별 완성된 버퍼 묶음
 * key: skillId
 */
export type SkillStatsBuffer = Record<number, SkillBuffer>;


// ============================================================
// 0단계: 스킬 특성 확정
// ============================================================

/**
 * 0단계 출력: overrides 적용 후 확정된 스킬 특성
 */
export interface ResolvedSkillMeta {
  skillId     : number;
  skillName   : string;
  categories  : SkillCategory[];
  typeId      : SkillTypeId;
  attackId    : AttackTypeId;
  resourceType: ResourceTypeId | undefined;
  /** 기운 소모 개수 (GK_QI_COST 기본값 + 트라이포드 보정) */
  cost?       : number;
  /** 피해원 목록 (상수/계수 레벨별 확정) */
  sources     : ResolvedSource[];
}

/**
 * 피해원 하나 (레벨 확정 후)
 */
export interface ResolvedSource {
  name       : string;
  isCombined : boolean;
  hits       : number;
  constant   : number;
  coefficient: number;
  attackId   : AttackTypeId;
}


// ============================================================
// 효과 로그 (파이프라인 내부용)
// ============================================================

/**
 * 파이프라인 내부에서 사용하는 효과 로그 단위
 *
 * [desc 필드]
 *   Special Hook에서 계산 근거를 명시할 때 사용
 *   예) "특화1800 × 0.0000858" → UI에서 수치 옆 괄호로 표기
 *   일반 effectLog는 desc 생략 가능
 */
export interface PipelineEffectLog {
  label     : string;
  type      : string;
  value     : number;
  subGroup? : string;
  target?   : EffectTarget;
  overrides?: SkillOverride;
  /** true이면 1~2단계 스킵, 3단계 Special에서 처리 */
  special?  : boolean;
  /** 계산 근거 설명 (Special Hook 결과물에 명시, UI 표기용) */
  desc?     : string;
}


// ============================================================
// 3단계: Special 처리
// ============================================================

/**
 * Special 처리 함수 시그니처 (공통/직업 모두 동일)
 */
export type SpecialHandler = (
  skillBuffer : SkillBuffer,
  specialLogs : PipelineEffectLog[],
  combatStats : SpecialCombatStats,
) => PipelineEffectLog[];

/**
 * Special 단계에서 참조 가능한 전투 특성
 */
export interface SpecialCombatStats {
  /** API에서 받아온 특화 수치 */
  specialization: number;
  /** 2단계까지 확정된 치명타 확률 합산 (0~1) */
  critChance    : number;
}


// ============================================================
// UI 상세 로그 타입 (신규)
// ============================================================

/**
 * UI 스킬 상세로그 한 줄 단위
 *
 * [용도]
 *   스킬 클릭 시 모달/패널에 표시되는 효과 목록의 개별 행
 *   버퍼에 실제로 적용된 값만 포함 (target 매칭 후 결과)
 *
 * [출처 역탐색 방식]
 *   bufferMap의 value → inputLogs에서 동일 value를 가진 log 탐색
 *   Special 처리 결과물처럼 inputLogs에 없는 경우 desc로 대체
 */
export interface EffectRow {
  label    : string;   // 출처 (예: "원한", "아크그리드:피니셔 (17pt)")
  type     : string;   // 효과 타입 (예: "DMG_INC", "CRIT_CHANCE")
  value    : number;   // 실제 적용된 수치
  subGroup : string;   // 그룹 키 ('-' 이면 독립 곱연산)
  desc     : string;   // Special 계산 근거 또는 '-'
}

/**
 * 스킬 하나의 UI 상세 로그 묶음
 *
 * [사용처]
 *   - 스킬 클릭 → skillDetailLogs[skillId].bufferRows 렌더링
 *   - 공격력 표시는 상위에서 atkStats + atkDetailLogs를 공통으로 사용
 *
 * [bufferRows 생성 시점]
 *   run-pipeline.ts의 finalizeAllBuffers 완료 후
 *   step3_specialBuffers(최종 버퍼)를 순회하여 생성
 */
export interface SkillDetailLog {
  skillId   : number;
  skillName : string;
  /** 이 스킬에 실제 적용된 효과 행 목록 (type별 정렬) */
  bufferRows: EffectRow[];
}


// ============================================================
// 디버그 데이터 (각 단계 중간값 수집)
// ============================================================

/**
 * 공격력 4종 계산 결과
 * calcAllAtk() 반환값과 동일 구조
 */
export interface AtkDebugStats {
  mainStat : number;  // 최종 주스탯
  weaponAtk: number;  // 최종 무기 공격력
  baseAtk  : number;  // 기본 공격력
  finalAtk : number;  // 최종 공격력
}

/**
 * 0단계 디버그 데이터 — 스킬 특성 확정 결과
 */
export interface SkillMetaDebug {
  skillId       : number;
  skillName     : string;
  level         : number;
  categories    : SkillCategory[];
  typeId        : SkillTypeId;
  attackId      : AttackTypeId;
  cooldown      : number;
  resourceType  : string | undefined;
  cost          : number | undefined;
  appliedTripods: string[];
  sources       : {
    name       : string;
    isCombined : boolean;
    hits       : number;
    constant   : number;
    coefficient: number;
  }[];
}

/**
 * 파이프라인 전체 디버그 데이터
 * runPipeline()에서 수집하여 반환
 *
 * [로그 분류 설계]
 *   inputLogs     : 파이프라인 투입 전 전체 원본 (분류 전)
 *   atkDetailLogs : 공격력 계산에만 쓰이는 로그 (모든 스킬 공통)
 *                   UI에서 공격력 수치에 호버 시 표시
 *   staticLogs    : target 없음 + special 아님 → 모든 스킬 공통 적용
 *   dynamicLogs   : target 있음 + special 아님 → 스킬별 조건 적용
 *   specialLogs   : special=true → 3단계 Special에서 처리
 *
 * [skillDetailLogs]
 *   스킬별 실제 적용된 효과 행 목록
 *   key: skillId
 *   UI 스킬 상세 모달에서 직접 소비
 *
 * [단계별 수집 시점]
 *   step0 : resolveSkillMeta 완료 직후
 *   step1 : buildStaticBuffer 완료 직후
 *   step2 : buildDynamicBuffers 완료 직후
 *   step3 : processAllSpecials 완료 직후
 */
export interface PipelineDebugData {
  /** 파이프라인에 투입된 전체 effectLog 원본 */
  inputLogs           : PipelineEffectLog[];

  // ── 분류된 로그 (run-pipeline에서 한 번만 분류) ─────────
  /** 공격력 계산 전용 로그 (WEAPON_ATK_*, MAIN_STAT_*, ATK_*, BASE_ATK_P) */
  atkDetailLogs       : PipelineEffectLog[];
  /** 모든 스킬 공통 적용 로그 (target 없음, special 아님) */
  staticLogs          : PipelineEffectLog[];
  /** 스킬별 조건부 로그 (target 있음, special 아님) */
  dynamicLogs         : PipelineEffectLog[];
  /** Special 처리 대상 로그 (special=true) */
  specialLogs         : PipelineEffectLog[];

  // ── 단계별 중간값 ────────────────────────────────────────
  /** 0단계: 스킬별 확정 특성 */
  step0_resolvedSkills: SkillMetaDebug[];
  /** 1단계: Static 버퍼 (공통 효과만) */
  step1_staticBuffer  : BufferMap;
  /** 2단계: 스킬별 Dynamic 버퍼 (key: skillId) */
  step2_dynamicBuffers: Record<number, BufferMap>;
  /** 3단계: Special 처리 후 스킬별 버퍼 (key: skillId) */
  step3_specialBuffers: Record<number, BufferMap>;

  // ── 확정값 ──────────────────────────────────────────────
  /** 공격력 4종 최종값 */
  atkStats            : AtkDebugStats;
  /** 스킬별 최종 DamageModifiers (key: skillId) */
  finalMods           : Record<number, DamageModifiers>;

  // ── UI 소비용 ────────────────────────────────────────────
  /**
   * 스킬별 UI 상세 로그
   * key: skillId
   * 스킬 클릭 시 이 데이터를 렌더링
   */
  skillDetailLogs     : Record<number, SkillDetailLog>;

  /** 스킬 이름 역참조 맵 (skillId → skillName) */
  skillNameMap        : Record<number, string>;
}


// ============================================================
// 파이프라인 최종 출력
// ============================================================

/**
 * 파이프라인 전체 실행 결과
 */
export interface PipelineResult {
  meta: ResolvedSkillMeta;
  mods: DamageModifiers;
}