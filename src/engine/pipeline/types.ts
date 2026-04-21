/**
 * @/engine/pipeline/types.ts
 *
 * 데미지 계산 파이프라인 전용 타입 정의
 *
 * [구조]
 *   BufferMap       : 합산 전 원본값 보관 (type → subGroup → values[])
 *   SkillBuffer     : 스킬 하나의 버퍼 (Static 복사 + Dynamic 추가)
 *   SkillStatsBuffer: 전체 스킬별 완성된 수치 묶음
 *   ResolvedSkillMeta: 0단계에서 확정된 스킬 특성
 *   SpecialEntry    : Special 효과 식별에 필요한 정보
 */
 
import {
  SkillCategory,
  SkillTypeId,
  AttackTypeId,
  ResourceTypeId,
  DamageModifiers,
  EffectTarget,
} from '@/types/sim-types';
 
 
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
  skillId    : number;
  bufferMap  : BufferMap;
  /** Special 처리가 완료된 후 확정된 DamageModifiers */
  finalMods? : DamageModifiers;
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
  qiCost?     : number;
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
 * 기존 useCalculatorStore의 EffectLog와 동일 구조
 * 파이프라인 타입 파일로 이동하여 단일 출처 확보
 */
export interface PipelineEffectLog {
  label    : string;
  type     : string;
  value    : number;
  subGroup?: string;
  target?  : EffectTarget;
  /** true이면 1~2단계 스킵, 3단계 Special에서 처리 */
  special? : boolean;
}
 
 
// ============================================================
// 3단계: Special 처리
// ============================================================
 
/**
 * Special 처리 함수 시그니처 (공통/직업 모두 동일)
 *
 * @param skillBuffer  - 2단계까지 완성된 스킬 버퍼
 * @param specialLogs  - special=true인 로그 목록 (이 스킬에 적용 가능한 것만)
 * @param combatStats  - 전투 특성 (특화 수치 등 참조용)
 * @returns 완성된 로그 목록 (버퍼에 push할 값들)
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
// 파이프라인 최종 출력
// ============================================================
 
/**
 * 파이프라인 전체 실행 결과
 * damage-calculator가 이 타입을 소비
 */
export interface PipelineResult {
  /** 스킬 메타 (공격 타입, 카테고리 등) */
  meta   : ResolvedSkillMeta;
  /** 확정된 데미지 보정치 */
  mods   : DamageModifiers;
}