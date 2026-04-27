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
 *   PipelineDebugData: 각 단계별 중간값 (디버깅용)
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
 *
 * [desc 필드]
 *   Special Hook에서 계산 근거를 명시할 때 사용
 *   예) "특화1800 × 0.0000858" → UI에서 수치 옆 괄호로 표기
 *   일반 effectLog는 desc 생략 가능
 */
export interface PipelineEffectLog {
  label    : string;
  type     : string;
  value    : number;
  subGroup?: string;
  target?  : EffectTarget;
  /** true이면 1~2단계 스킵, 3단계 Special에서 처리 */
  special? : boolean;
  /** 계산 근거 설명 (Special Hook 결과물에 명시, UI 표기용) */
  desc?    : string;
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
 * run-pipeline에서 resolveSkillMeta 완료 후 수집
 */
export interface SkillMetaDebug {
  skillId       : number;
  skillName     : string;
  level         : number;           // 표시용 스킬 레벨
  categories    : SkillCategory[];
  typeId        : SkillTypeId;
  attackId      : AttackTypeId;
  cooldown      : number;           // 원본 쿨타임 (트라이포드 적용 전)
  resourceType  : string | undefined;
  qiCost        : number | undefined;
  appliedTripods: string[];         // 적용된 트라이포드 이름 목록
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
 * [단계별 수집 시점]
 *   step0 : resolveSkillMeta 완료 직후
 *   step1 : buildStaticBuffer 완료 직후
 *   step2 : buildDynamicBuffers 완료 직후 (스킬별 버퍼)
 *   step3 : processAllSpecials 완료 직후 (스킬별 버퍼)
 *   atkStats  : calcAllAtk 완료 직후
 *   finalMods : finalizeAllBuffers 완료 직후
 */
export interface PipelineDebugData {
  /**
   * 파이프라인에 투입된 전체 effectLog 원본
   * (장비/각인/아크패시브/아크그리드/트라이포드 포함)
   * UI 렌더링과 콘솔 디버그 모두 이 배열을 직접 사용
   */
  inputLogs           : PipelineEffectLog[];

  /** 0단계: 스킬별 확정 특성 */
  step0_resolvedSkills: SkillMetaDebug[];

  /** 1단계: Static 버퍼 (공통 효과만) */
  step1_staticBuffer  : BufferMap;

  /**
   * 2단계: 스킬별 Dynamic 버퍼
   * key: skillId, value: 해당 스킬의 BufferMap 스냅샷
   */
  step2_dynamicBuffers: Record<number, BufferMap>;

  /**
   * 3단계: Special 처리 후 스킬별 버퍼
   * key: skillId
   */
  step3_specialBuffers: Record<number, BufferMap>;

  /** 확정: 공격력 4종 */
  atkStats            : AtkDebugStats;

  /**
   * 확정: 스킬별 최종 DamageModifiers
   * key: skillId
   */
  finalMods           : Record<number, DamageModifiers>;

  /**
   * 스킬 이름 역참조 맵 (skillId → skillName)
   * 디버그 출력 시 id 대신 이름으로 표시하기 위해 사용
   */
  skillNameMap        : Record<number, string>;
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