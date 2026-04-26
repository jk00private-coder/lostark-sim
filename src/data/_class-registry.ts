/**
 * @/data/class-registry.ts
 *
 * 직업별 DB 단일 진입점 (Class Registry)
 *
 * [역할]
 *   - 직업명(string) → 해당 직업의 모든 DB를 묶어 제공
 *
 * [새 직업 추가 방법]
 *   1. 각 DB 파일 작성 (skills, arkGrid, enlighten 등)
 *   2. 이 파일 하단 CLASS_REGISTRY에 직업명 키로 한 줄 추가
 *   3. src/engine/pipeline/3-special/index.ts의
 *      CLASS_SPECIAL_HANDLERS에도 한 줄 추가
 *   ※ 위 두 곳 외에는 수정할 파일 없음, 생기면 여기에 명시
 *
 * [Special 핸들러가 여기 없는 이유]
 *   Special 핸들러는 계산 로직(engine)이므로
 *   engine/pipeline/3-special/index.ts에서 별도 관리
 *   → 직업 추가 시 수정 파일: class-registry.ts + 3-special/index.ts (2곳)
 */

import { SkillData } from '@/types/skill-types';
import { ArkPassiveSectionData } from '@/types/ark-passive';
import { ArkGridCoreData } from '@/types/ark-grid';

// ── 가디언나이트 DB imports ───────────────────────────────
import { SKILLS_GUARDIAN_KNIGHT_DB } from '@/data/skills/guardian-knight-skills';
import { ELIGHTEN_GUARDIAN_KNIGHT_DATA } from '@/data/arc-passive/elighten/guardian-knight';
import { LEAP_GUARDIAN_KNIGHT_DATA } from '@/data/arc-passive/leap/guardian-knight';
import { ARKGRID_GUARDIAN_KNIGHT_DATA } from '@/data/arc-grid/guardian-knight';

// ── 공통 DB imports ──────────────────────────────────────
import { ARKGRID_COMMON_DATA } from '@/data/arc-grid/common';
import { EVOLUTION_DATA } from '@/data/arc-passive/evolution';
import { LEAP_COMMON_DATA } from './arc-passive/leap/common';

// ============================================================
// 레지스트리 타입 정의
// ============================================================

/**
 * 직업 하나의 DB 묶음
 *
 * [각 필드 설명]
 *   skills        : 스킬 + 트라이포드 DB (계산 + normalizer 공용)
 *   enlightenData : 아크패시브 깨달음 DB (직업별 상이)
 *   arkGridData   : 아크그리드 질서 코어 DB (직업별 상이)
 *
 * [공통 DB는 여기 포함하지 않는 이유]
 *   EVOLUTION_DATA, ARKGRID_COMMON_DATA, LEAP_COMMON_DATA 등
 *   공통 데이터는 직업과 무관하게 항상 동일하게 사용되므로
 *   각 헬퍼 함수(getLeapData, findArkPassiveNode 등)에서 직접 참조
 */
export interface ClassRegistry {
  skills       : SkillData[];
  enlightenData: ArkPassiveSectionData[];
  leapNodes    : ArkPassiveSectionData[];
  arkGridData  : ArkGridCoreData[];
}


// ============================================================
// 직업 레지스트리 등록
// ============================================================

/**
 * 직업명(인게임 CharacterClassName) → ClassRegistry 매핑
 *
 * ⚠️ 직업명은 API 응답의 CharacterClassName과 정확히 일치해야 함
 */
export const CLASS_REGISTRY: Record<string, ClassRegistry> = {
  '가디언나이트': {
    skills       : SKILLS_GUARDIAN_KNIGHT_DB,
    enlightenData: ELIGHTEN_GUARDIAN_KNIGHT_DATA,
    leapNodes    : LEAP_GUARDIAN_KNIGHT_DATA,
    arkGridData  : ARKGRID_GUARDIAN_KNIGHT_DATA,
  },
  // ── 새 직업 추가 시 아래에 한 블록씩 추가 ──────────────
  // '버서커': {
  //   skills       : SKILLS_BERSERKER_DB,
  //   enlightenData: ELIGHTEN_BERSERKER_DATA,
  //   leapNodes    : LEAP_BERSERKER_DATA,
  //   arkGridData  : ARKGRID_BERSERKER_DATA,
  // },
};
export type ClassName = keyof typeof CLASS_REGISTRY;

// ============================================================
// DB 조회 헬퍼 함수
// ============================================================

/**
 * 직업명으로 ClassRegistry를 조회
 * 미등록 직업이면 undefined 반환 (호출부에서 방어 처리 필요)
 */
export const getClassRegistry = (jobName: ClassName): ClassRegistry | undefined =>
  CLASS_REGISTRY[jobName];

/**
 * 스킬 이름으로 SkillData 조회
 */
export const findSkillByName = (
  jobName  : ClassName,
  skillName: string,
): SkillData | undefined => {
  const registry = CLASS_REGISTRY[jobName];
  if (!registry) return undefined;
  return registry.skills.find(s => s.label || s.name === skillName);
};

/**
 * 아크패시브 노드를 카테고리 + 이름으로 조회
 *
 * [카테고리별 조회 대상]
 *   진화   → 공통 EVOLUTION_DATA (직업 무관)
 *   깨달음 → 직업별 enlightenData
 *   도약   → getLeapData (공통 1티어 + 직업 2티어 병합)
 */
export const findArkPassiveNode = (
  category: string,
  nodeName: string,
  jobName: ClassName,
): ArkPassiveSectionData | undefined => {
  const registry = CLASS_REGISTRY[jobName];

  const nodeSources: Record<string, ArkPassiveSectionData[] | undefined> = {
    '진화': EVOLUTION_DATA,
    '깨달음': registry?.enlightenData,
    '도약': getLeapData(registry)
  };

  return nodeSources[category]?.find(n => n.name === nodeName);
};

export const getLeapData = (registry?: ClassRegistry): ArkPassiveSectionData[] => {
  return [
    ...(LEAP_COMMON_DATA || []),
    ...(registry?.leapNodes ?? []),
  ];
};

/** 현재 직업에 맞는 아크패시브 노드 전체를 ID 맵으로 반환 */
export const getArkPassiveNodeMap = (jobName: ClassName): Map<number, ArkPassiveSectionData> => {
  const registry = CLASS_REGISTRY[jobName];
  const nodeMap = new Map<number, ArkPassiveSectionData>();

  // 진화 (배열 직접 순회)
  EVOLUTION_DATA.forEach(n => nodeMap.set(n.id, n));
  
  // 깨달음 (배열 직접 순회)
  registry?.enlightenData?.forEach(n => nodeMap.set(n.id, n));
  
  // 도약 (getLeapData 결과가 배열)
  getLeapData(registry).forEach(n => nodeMap.set(n.id, n));

  return nodeMap;
};

/**
 * 아크그리드 코어를 이름(label)으로 조회
 *
 * [조회 우선순위]
 *   1. 직업 전용 질서 코어 (arkGridData)
 *   2. 공통 혼돈 코어 (ARKGRID_COMMON_DATA)
 */
export const findArkGridCore = (
  jobName : ClassName,
  coreName: string,
): ArkGridCoreData | undefined => {
  const registry = CLASS_REGISTRY[jobName];
  return (
    registry?.arkGridData.find(d => (d.label || d.name) === coreName) ??
    ARKGRID_COMMON_DATA.find(d => (d.label || d.name) === coreName)
  );
};

/** 특정 직업의 아크그리드 데이터를 Map으로 변환하여 반환 */
export const getArkGridMap = (jobName: ClassName): Map<number | string, ArkGridCoreData> => {
  const registry = CLASS_REGISTRY[jobName];
  const coreMap = new Map<number | string, ArkGridCoreData>();

  ARKGRID_COMMON_DATA.forEach(d => coreMap.set(d.id, d));
  registry?.arkGridData?.forEach(d => coreMap.set(d.id, d));

  return coreMap;
};

/**
 * 직업의 스킬 DB를 Map<skillName, SkillData> 형태로 반환
 *
 * [run-pipeline, useSimulatorStore용]
 *   이름 → SkillData O(1) 조회가 필요한 곳에 사용
 *   매번 find()로 순회하는 것보다 성능상 유리
 */
export const getSkillMap = (
  jobName: ClassName,
): Map<string, SkillData> => {
  const registry = CLASS_REGISTRY[jobName];
  if (!registry) return new Map();
  return new Map(registry.skills.map(s => [s.name, s]));
};

/**
 * 직업의 스킬 DB를 Map<skillId, SkillData> 형태로 반환
 *
 * [useSimulatorStore의 보석 처리용]
 *   보석 효과를 스킬 ID에 연결할 때 사용
 */
export const getSkillIdMap = (
  jobName: ClassName,
): Map<number, SkillData> => {
  const registry = CLASS_REGISTRY[jobName];
  if (!registry) return new Map();
  return new Map(registry.skills.map(s => [s.id, s]));
};
