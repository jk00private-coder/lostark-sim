/**
 * @/engine/pipeline/3-special/index.ts
 *
 * [3단계] Special 처리 통합 라우터
 *
 * [처리 순서]
 *   3-A: 공통 Special (수치 의존형 — critChance 등 읽기)
 *   3-B: 직업 Special (직업 엔진 — GK_QI_DMG 확정 등)
 *
 * [완성된 로그 push 후 BufferMap 반영]
 *   Special 핸들러가 반환한 완성 로그를
 *   스킬 버퍼에 최종 push하여 DamageModifiers 확정 준비
 *
 * [직업 추가 방법]
 *   1. classes/ 아래 새 직업 파일 작성
 *   2. CLASS_SPECIAL_HANDLERS에 직업명 → 함수 등록
 */

import {
  PipelineEffectLog,
  SkillBuffer,
  SkillStatsBuffer,
  ResolvedSkillMeta,
  SpecialCombatStats,
} from '../types';
import { pushToBuffer } from '../1-static-buffer';
import { processCommonSpecials } from './common-specials';
import { processGuardianKnightSpecials } from './classes/guardian-knight';
import { isTargetMatch } from '../2-dynamic-buffer';


// ============================================================
// 직업 Special 핸들러 라우터
// ============================================================

type ClassSpecialFn = (
  skillBuffer: SkillBuffer,
  meta       : ResolvedSkillMeta,
  combatStats: SpecialCombatStats,
) => PipelineEffectLog[];

/** 직업명 → Special 처리 함수 매핑 */
const CLASS_SPECIAL_HANDLERS: Record<string, ClassSpecialFn> = {
  '가디언나이트': processGuardianKnightSpecials,
  // 새 직업 추가 시 여기에 등록
};


// ============================================================
// 헬퍼: 완성된 로그를 스킬 버퍼에 push
// ============================================================

/**
 * Special 핸들러가 반환한 완성 로그를 BufferMap에 추가
 * soloIdx는 Special 전용 범위(20000~)를 사용하여 충돌 방지
 */
const pushCompletedLogs = (
  skillBuffer  : SkillBuffer,
  completedLogs: PipelineEffectLog[],
): void => {
  completedLogs.forEach((log, idx) => {
    pushToBuffer(
      skillBuffer.bufferMap,
      log.type,
      log.subGroup,
      log.value,
      20000 + idx,
    );
  });
};


// ============================================================
// 헬퍼: SpecialCombatStats 구성
// ============================================================

/**
 * 스킬 버퍼의 현재 치명타 확률 합산값 계산
 * (뭉툭한 가시 등 critChance 의존 Special용)
 */
const resolveCritChance = (skillBuffer: SkillBuffer): number => {
  const critBuffer = skillBuffer.bufferMap['CRIT_CHANCE'];
  if (!critBuffer) return 0;
  return Object.values(critBuffer)
    .flat()
    .reduce((s, v) => s + v, 0);
};


// ============================================================
// 메인: processAllSpecials
// ============================================================

/**
 * 모든 스킬의 Special 처리 실행
 *
 * @param skillStatsBuffer - 2단계까지 완성된 전체 스킬 버퍼
 * @param resolvedSkills   - 0단계 스킬 메타 목록
 * @param specialLogs      - 1단계에서 분류된 Special 로그
 * @param className        - 직업명 (직업 Special 라우팅용)
 * @param specialization   - 특화 수치 (직업 Special용)
 */
export const processAllSpecials = (
  skillStatsBuffer: SkillStatsBuffer,
  resolvedSkills  : ResolvedSkillMeta[],
  specialLogs     : PipelineEffectLog[],
  className       : string,
  specialization  : number,
): void => {
  const classHandler = CLASS_SPECIAL_HANDLERS[className];

  resolvedSkills.forEach(meta => {
    const skillBuffer = skillStatsBuffer[meta.skillId];
    if (!skillBuffer) return;

    // SpecialCombatStats 구성
    const combatStats: SpecialCombatStats = {
      specialization,
      critChance: resolveCritChance(skillBuffer),
    };

    // 이 스킬에 적용 가능한 Special 로그 필터링
    const applicableSpecials = specialLogs.filter(log => {
      if (!log.target) return true; // target 없으면 전체 적용
      return isTargetMatch(
        log.target,
        meta.skillId,
        meta.categories,
        meta.typeId,
        meta.attackId,
        meta.resourceType,
      );
    });

    // [3-A] 공통 Special 처리
    const commonResults = processCommonSpecials(
      skillBuffer,
      applicableSpecials,
      combatStats,
    );
    pushCompletedLogs(skillBuffer, commonResults);

    // [3-B] 직업 Special 처리
    if (classHandler) {
      const classResults = classHandler(skillBuffer, meta, combatStats);
      pushCompletedLogs(skillBuffer, classResults);
    }
  });
};
