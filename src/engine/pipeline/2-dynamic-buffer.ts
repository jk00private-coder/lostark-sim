/**
 * @/engine/pipeline/2-dynamic-buffer.ts
 *
 * [2단계] Dynamic Buffer 구성
 *
 * [역할]
 *   스킬별로 SkillBuffer를 생성:
 *   1. StaticBuffer를 깊은 복사하여 초기값 세팅
 *   2. dynamicLogs 중 이 스킬에 적용 가능한 로그를 추가 push
 *
 * [target 매칭 규칙]
 *   모든 조건은 AND (전부 통과해야 적용)
 *   - skillIds   : 스킬 ID가 목록에 포함
 *   - categories : 스킬 카테고리 중 하나라도 포함
 *   - skillTypes : 스킬 타입이 목록에 포함
 *   - attackType : 공격 타입이 목록에 포함
 *   - resourceTypes: 소모 자원 타입이 목록에 포함
 */

import {
  PipelineEffectLog,
  BufferMap,
  SkillBuffer,
  SkillStatsBuffer,
  ResolvedSkillMeta,
} from './types';
import {
  SkillCategory,
  SkillTypeId,
  AttackTypeId,
  ResourceTypeId,
  EffectTarget,
} from '@/types/sim-types';
import { pushToBuffer, cloneBufferMap } from './1-static-buffer';


// ============================================================
// 헬퍼: target 매칭 판별
// ============================================================

/**
 * effectLog의 target 조건이 현재 스킬에 적용 가능한지 판별
 * target 없음 → 1단계에서 이미 처리됨 (여기 오지 않음)
 */
export const isTargetMatch = (
  target      : EffectTarget,
  skillId     : number,
  categories  : SkillCategory[],
  typeId      : SkillTypeId,
  attackId    : AttackTypeId,
  resourceType: ResourceTypeId | undefined,
): boolean => {

  // skillIds 조건
  if (target.skillIds && !target.skillIds.includes(skillId)) return false;

  // categories 조건: 하나라도 포함이면 통과
  if (target.categories) {
    const hasCategory = target.categories.some(c => categories.includes(c));
    if (!hasCategory) return false;
  }

  // skillTypes 조건
  if (target.skillTypes && !target.skillTypes.includes(typeId)) return false;

  // attackType 조건
  if (target.attackType && !target.attackType.includes(attackId)) return false;

  // resourceTypes 조건
  if (target.resourceTypes && resourceType) {
    if (!target.resourceTypes.includes(resourceType)) return false;
  }

  console.log('결과: 모든 조건 통과 (True)');
  return true;
};


// ============================================================
// 메인: buildDynamicBuffers
// ============================================================

/**
 * 전체 스킬 목록에 대한 SkillStatsBuffer 생성
 *
 * @param resolvedSkills - 0단계에서 확정된 스킬 메타 목록
 * @param staticBuffer   - 1단계에서 완성된 Static 버퍼
 * @param dynamicLogs    - 1단계에서 분류된 Dynamic 로그 목록
 */
export const buildDynamicBuffers = (
  resolvedSkills: ResolvedSkillMeta[],
  staticBuffer  : BufferMap,
  dynamicLogs   : PipelineEffectLog[],
): SkillStatsBuffer => {
  const skillStatsBuffer: SkillStatsBuffer = {};

  resolvedSkills.forEach(meta => {
    // Static 버퍼 깊은 복사 → 스킬별 초기 버퍼
    const bufferMap: BufferMap = cloneBufferMap(staticBuffer);

    // Dynamic 로그 중 이 스킬에 적용 가능한 것만 추가
    let soloIdx = 10000; // Static의 soloIdx와 충돌 방지를 위해 큰 값에서 시작

    dynamicLogs.forEach(log => {
      if (!log.target) return; // target 없는 건 여기 오지 않음 (방어 코드)

      const match = isTargetMatch(
        log.target,
        meta.skillId,
        meta.categories,
        meta.typeId,
        meta.attackId,
        meta.resourceType,
      );

      if (match) {
        pushToBuffer(bufferMap, log.type, log.subGroup, log.value, soloIdx++);
      }
    });

    skillStatsBuffer[meta.skillId] = {
      skillId  : meta.skillId,
      bufferMap,
    };
  });

  return skillStatsBuffer;
};
