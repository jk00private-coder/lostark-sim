/**
 * @/data/skills/guardian-knight-skills.ts
 *
 * 가디언나이트 스킬 DB
 *
 * [설계 원칙]
 *   - GK_SKILL_IDS 를 이 파일에서 직접 정의합니다.
 *   - effects → EffectEntry (type, value, operation, target?)
 *   - memo    → 계산 무관 메모
 *   - target.skillCategory 로 발현/화신 구분
 *
 * ⚠️ 화상/폭발 등 addDamageSources 의 임시값은 추후 실제값으로 교체 필요
 * ⚠️ QI_SPECIALIZATION_COEFF 는 guardian-knight-effects.ts 에서 관리
 */

import { SkillData } from '@/types/skill';
import { ID_AA, ID_BB } from '@/constants/id-config';

// ============================================================
// 스킬 ID 상수
// ============================================================

// 공통 Base ID (3081 0000) 
const BASE = (ID_AA.SKILL * 1000000) + (ID_BB.GUARDIANKNIGHT * 10000);

// 스킬별 ID
// CC : 11~99 각 스킬 분류
// DD : 00(스킬 본체), 10(1티어 트포), 20(2티어 트포), 30(3티어 트포)
export const ID = {
  CLEAVE: {
    BODY: BASE + 1100,
    T1_1: BASE + 1111, T1_2: BASE + 1112, T1_3: BASE + 1113,
    T2_1: BASE + 1121, T2_2: BASE + 1122, T2_3: BASE + 1123,
    T3_1: BASE + 1131, T3_2: BASE + 1132,
},
  WILD_UPPERCUT: {
    BODY: BASE + 1200,
    T1_1: BASE + 1211, T1_2: BASE + 1212, T1_3: BASE + 1213,
    T2_1: BASE + 1221, T2_2: BASE + 1222, T2_3: BASE + 1223,
    T3_1: BASE + 1231, T3_2: BASE + 1232
  },
  THRUST: {
    BODY: BASE + 1300,
    T1_1: BASE + 1311, T1_2: BASE + 1312, T1_3: BASE + 1313,
    T2_1: BASE + 1321, T2_2: BASE + 1322, T2_3: BASE + 1323,
    T3_1: BASE + 1331, T3_2: BASE + 1332
  },
  GUILLOTINE_SPIN: {
    BODY: BASE + 1400,
    T1_1: BASE + 1411, T1_2: BASE + 1412, T1_3: BASE + 1413,
    T2_1: BASE + 1421, T2_2: BASE + 1422, T2_3: BASE + 1423,
    T3_1: BASE + 1431, T3_2: BASE + 1432
  },
  PIERCING_SHOCK: {
    BODY: BASE + 1500,
    T1_1: BASE + 1511, T1_2: BASE + 1512, T1_3: BASE + 1513,
    T2_1: BASE + 1521, T2_2: BASE + 1522, T2_3: BASE + 1523,
    T3_1: BASE + 1531, T3_2: BASE + 1532
  },
  METEOR_CRASH: {
    BODY: BASE + 1600,
    T1_1: BASE + 1611, T1_2: BASE + 1612, T1_3: BASE + 1613,
    T2_1: BASE + 1621, T2_2: BASE + 1622, T2_3: BASE + 1623,
    T3_1: BASE + 1631, T3_2: BASE + 1632
  },
  QUAKE_SMASH: {
    BODY: BASE + 1700,
    T1_1: BASE + 1711, T1_2: BASE + 1712, T1_3: BASE + 1713,
    T2_1: BASE + 1721, T2_2: BASE + 1722, T2_3: BASE + 1723,
    T3_1: BASE + 1731, T3_2: BASE + 1732
  },
  FRENZY_SWEEP: {
    BODY: BASE + 1800,
    T1_1: BASE + 1811, T1_2: BASE + 1812, T1_3: BASE + 1813,
    T2_1: BASE + 1821, T2_2: BASE + 1822, T2_3: BASE + 1823,
    T3_1: BASE + 1831, T3_2: BASE + 1832
  },
  VENGEFUL_BLOW: {
    BODY: BASE + 1900,
    T1_1: BASE + 1911, T1_2: BASE + 1912, T1_3: BASE + 1913,
    T2_1: BASE + 1921, T2_2: BASE + 1922,
    T3_1: BASE + 1931, T3_2: BASE + 1932
  },
  AVENGING_SPEAR: {
    BODY: BASE + 2000,
    T1_1: BASE + 2011, T1_2: BASE + 2012, T1_3: BASE + 2013,
    T2_1: BASE + 2021, T2_2: BASE + 2022,
    T3_1: BASE + 2031, T3_2: BASE + 2032
  },
  SPINNING_FLAME: {
    BODY: BASE + 2100,
    T1_1: BASE + 2111, T1_2: BASE + 2112, T1_3: BASE + 2113,
    T2_1: BASE + 2121, T2_2: BASE + 2122,
    T3_1: BASE + 2131, T3_2: BASE + 2132
  },
  ABADDON_FLAME: {
    BODY: BASE + 2200,
    T1_1: BASE + 2211, T1_2: BASE + 2212, T1_3: BASE + 2213,
    T2_1: BASE + 2221, T2_2: BASE + 2222,
    T3_1: BASE + 2231, T3_2: BASE + 2232
  },
  SOARING_STRIKE: {
    BODY: BASE + 2300,
    T1_1: BASE + 2311, T1_2: BASE + 2312, T1_3: BASE + 2313,
    T2_1: BASE + 2321, T2_2: BASE + 2322,
    T3_1: BASE + 2331, T3_2: BASE + 2332
  },
  WING_LASH: {
    BODY: BASE + 2400,
    T1_1: BASE + 2411, T1_2: BASE + 2412, T1_3: BASE + 2413,
    T2_1: BASE + 2421, T2_2: BASE + 2422,
    T3_1: BASE + 2431, T3_2: BASE + 2432
  },
  BLAZE_SWEEP: {
    BODY: BASE + 2500,
    T1_1: BASE + 2511, T1_2: BASE + 2512, T1_3: BASE + 2513,
    T2_1: BASE + 2521, T2_2: BASE + 2522,
    T3_1: BASE + 2531, T3_2: BASE + 2532
  },
  BLAZE_FLASH: {
    BODY: BASE + 2600,
    T1_1: BASE + 2611, T1_2: BASE + 2612, T1_3: BASE + 2613,
    T2_1: BASE + 2621, T2_2: BASE + 2622,
    T3_1: BASE + 2631, T3_2: BASE + 2632
  },
  RENDING_FINISHER: {
    BODY: BASE + 2700,
    T1_1: BASE + 2711, T1_2: BASE + 2712, T1_3: BASE + 2713,
    T2_1: BASE + 2721, T2_2: BASE + 2722,
    T3_1: BASE + 2731, T3_2: BASE + 2732
  },
  EXPLOSION_FINISHER: {
    BODY: BASE + 2800,
    T1_1: BASE + 2811, T1_2: BASE + 2812, T1_3: BASE + 2813,
    T2_1: BASE + 2821, T2_2: BASE + 2822,
    T3_1: BASE + 2831, T3_2: BASE + 2832
  },
  SOUL_DIVIDE: { BODY: BASE + 2900 },
  DEEP_IMPACT: { BODY: BASE + 3000 },
  GUARDIAN_BACKLASH: { BODY: BASE + 3100 },
  BREATH_OF_EMBERES: { BODY: BASE + 3200 },
  GUARDIANS_CRASH: { BODY: BASE + 3300 },
  AWAKEN: { BODY: BASE + 3400 },
  INFERNO_BURST: { BODY: BASE + 3500 },
  GUARDIAN_FEAR: { BODY: BASE + 3600 }
} as const;

// ID와 NAME 맵핑
export const NAMES = {
  [ID.CLEAVE.BODY]: '클리브',
  [ID.CLEAVE.T1_1]: '피해 증폭', [ID.CLEAVE.T1_2]: '돌진', [ID.CLEAVE.T1_3]: '재빠른 손놀림',
  [ID.CLEAVE.T2_1]: '증강', [ID.CLEAVE.T2_2]: '약육강식', [ID.CLEAVE.T2_3]: '약점 포착',
  [ID.CLEAVE.T3_1]: '화염 폭풍', [ID.CLEAVE.T3_2]: '휩쓸기',

  [ID.WILD_UPPERCUT.BODY]: '와일드 어퍼',
  [ID.WILD_UPPERCUT.T1_1]: '신속한 준비', [ID.WILD_UPPERCUT.T1_2]: '우직함', [ID.WILD_UPPERCUT.T1_3]: '재빠른 손놀림',
  [ID.WILD_UPPERCUT.T2_1]: '돌진', [ID.WILD_UPPERCUT.T2_2]: '섬광', [ID.WILD_UPPERCUT.T2_3]: '강타',
  [ID.WILD_UPPERCUT.T3_1]: '강화된 일격', [ID.WILD_UPPERCUT.T3_2]: '사전 준비',
  
  [ID.THRUST.BODY]: '쓰러스트',
  [ID.THRUST.T1_1]: '피해 증폭', [ID.THRUST.T1_2]: '부위 파괴 강화', [ID.THRUST.T1_3]: '단단한 비늘',
  [ID.THRUST.T2_1]: '연속돌진', [ID.THRUST.T2_2]: '질풍', [ID.THRUST.T2_3]: '먹이 사냥',
  [ID.THRUST.T3_1]: '파멸의 오브', [ID.THRUST.T3_2]: '약점 포착',
  
  [ID.GUILLOTINE_SPIN.BODY]: '길로틴 스핀',
  [ID.GUILLOTINE_SPIN.T1_1]: '약육강식', [ID.GUILLOTINE_SPIN.T1_2]: '강화된 일격', [ID.GUILLOTINE_SPIN.T1_3]: '뇌진탕',
  [ID.GUILLOTINE_SPIN.T2_1]: '천부적인 힘', [ID.GUILLOTINE_SPIN.T2_2]: '강인함', [ID.GUILLOTINE_SPIN.T2_3]: '변화무쌍',
  [ID.GUILLOTINE_SPIN.T3_1]: '무자비', [ID.GUILLOTINE_SPIN.T3_2]: '파멸의 기운',

  [ID.PIERCING_SHOCK.BODY]: '임페일 쇼크',
  [ID.PIERCING_SHOCK.T1_1]: '기운 갈취', [ID.PIERCING_SHOCK.T1_2]: '화력 조절', [ID.PIERCING_SHOCK.T1_3]: '부위 파괴 강화',
  [ID.PIERCING_SHOCK.T2_1]: '응축된 힘', [ID.PIERCING_SHOCK.T2_2]: '즉결심판', [ID.PIERCING_SHOCK.T2_3]: '약점 포착',
  [ID.PIERCING_SHOCK.T3_1]: '파멸의 오브', [ID.PIERCING_SHOCK.T3_2]: '죽음의 일격',
  
  [ID.METEOR_CRASH.BODY]: '미티어 크래시',
  [ID.METEOR_CRASH.T1_1]: '단단한 비늘', [ID.METEOR_CRASH.T1_2]: '화력 조절', [ID.METEOR_CRASH.T1_3]: '기운 갈취',
  [ID.METEOR_CRASH.T2_1]: '대지 붕괴', [ID.METEOR_CRASH.T2_2]: '화염 지옥', [ID.METEOR_CRASH.T2_3]: '파멸의 낙뢰',
  [ID.METEOR_CRASH.T3_1]: '대재앙', [ID.METEOR_CRASH.T3_2]: '통찰력',
  
  [ID.QUAKE_SMASH.BODY]: '퀘이크 스매시',
  [ID.QUAKE_SMASH.T1_1]: '단단한 비늘', [ID.QUAKE_SMASH.T1_2]: '부위 파괴 강화', [ID.QUAKE_SMASH.T1_3]: '재빠른 손놀림',
  [ID.QUAKE_SMASH.T2_1]: '강철의 울림', [ID.QUAKE_SMASH.T2_2]: '말살', [ID.QUAKE_SMASH.T2_3]: '약점 포착',
  [ID.QUAKE_SMASH.T3_1]: '파멸의 오브', [ID.QUAKE_SMASH.T3_2]: '가디언의 비늘',
  
  [ID.FRENZY_SWEEP.BODY]: '프렌지 스윕',
  [ID.FRENZY_SWEEP.T1_1]: '단단한 비늘', [ID.FRENZY_SWEEP.T1_2]: '뇌진탕', [ID.FRENZY_SWEEP.T1_3]: '재빠른 손놀림',
  [ID.FRENZY_SWEEP.T2_1]: '가디언의 송곳니', [ID.FRENZY_SWEEP.T2_2]: '맹습', [ID.FRENZY_SWEEP.T2_3]: '파멸의 오브',
  [ID.FRENZY_SWEEP.T3_1]: '어둠의 발톱', [ID.FRENZY_SWEEP.T3_2]: '화염 폭발',
  
  [ID.VENGEFUL_BLOW.BODY]: '리벤지 블로우',
  [ID.VENGEFUL_BLOW.T1_1]: '기운 강화', [ID.VENGEFUL_BLOW.T1_2]: '전방위 타격', [ID.VENGEFUL_BLOW.T1_3]: '철벽',
  [ID.VENGEFUL_BLOW.T2_1]: '강화 비늘', [ID.VENGEFUL_BLOW.T2_2]: '반격의 시간',
  [ID.VENGEFUL_BLOW.T3_1]: '간섭 거부', [ID.VENGEFUL_BLOW.T3_2]: '응징',
  
  [ID.AVENGING_SPEAR.BODY]: '리벤지 스피어',
  [ID.AVENGING_SPEAR.T1_1]: '단단한 비늘', [ID.AVENGING_SPEAR.T1_2]: '기운 강화', [ID.AVENGING_SPEAR.T1_3]: '간결한 손놀림',
  [ID.AVENGING_SPEAR.T2_1]: '강화된 일격', [ID.AVENGING_SPEAR.T2_2]: '넓은 타격',
  [ID.AVENGING_SPEAR.T3_1]: '기동력 강화', [ID.AVENGING_SPEAR.T3_2]: '종언의 일격',
  
  [ID.SPINNING_FLAME.BODY]: '스피닝 플레임',
  [ID.SPINNING_FLAME.T1_1]: '피해 증폭', [ID.SPINNING_FLAME.T1_2]: '화력 조절', [ID.SPINNING_FLAME.T1_3]: '기운 강화',
  [ID.SPINNING_FLAME.T2_1]: '추적하는 갑주', [ID.SPINNING_FLAME.T2_2]: '화염 폭풍',
  [ID.SPINNING_FLAME.T3_1]: '지속력 강화', [ID.SPINNING_FLAME.T3_2]: '약점 포착',

  [ID.ABADDON_FLAME.BODY]: '아바돈 플레임',
  [ID.ABADDON_FLAME.T1_1]: '피해 증폭', [ID.ABADDON_FLAME.T1_2]: '과소비', [ID.ABADDON_FLAME.T1_3]: '기운 강화',
  [ID.ABADDON_FLAME.T2_1]: '사전 준비', [ID.ABADDON_FLAME.T2_2]: '원거리 사격',
  [ID.ABADDON_FLAME.T3_1]: '무자비한 폭격', [ID.ABADDON_FLAME.T3_2]: '업화',

  [ID.SOARING_STRIKE.BODY]: '윙 스팅어',
  [ID.SOARING_STRIKE.T1_1]: '재빠른 손놀림', [ID.SOARING_STRIKE.T1_2]: '화력 조절', [ID.SOARING_STRIKE.T1_3]: '기운 강화',
  [ID.SOARING_STRIKE.T2_1]: '엠버레스의 날개', [ID.SOARING_STRIKE.T2_2]: '날개 응축',
  [ID.SOARING_STRIKE.T3_1]: '넓은 타격', [ID.SOARING_STRIKE.T3_2]: '불굴의 강타',

  [ID.WING_LASH.BODY]: '윙 래시',
  [ID.WING_LASH.T1_1]: '재빠른 손놀림', [ID.WING_LASH.T1_2]: '과소비', [ID.WING_LASH.T1_3]: '기운 강화',
  [ID.WING_LASH.T2_1]: '강화된 일격', [ID.WING_LASH.T2_2]: '천공의 날개',
  [ID.WING_LASH.T3_1]: '공간절삭', [ID.WING_LASH.T3_2]: '파멸의 날개',

  [ID.BLAZE_SWEEP.BODY]: '블레이즈 스윕',
  [ID.BLAZE_SWEEP.T1_1]: '재빠른 손놀림', [ID.BLAZE_SWEEP.T1_2]: '전투의 달인', [ID.BLAZE_SWEEP.T1_3]: '전방위 타격',
  [ID.BLAZE_SWEEP.T2_1]: '꿰뚫는 진격', [ID.BLAZE_SWEEP.T2_2]: '약점 포착',
  [ID.BLAZE_SWEEP.T3_1]: '몰아치는 발톱', [ID.BLAZE_SWEEP.T3_2]: '정제된 분노',

  [ID.BLAZE_FLASH.BODY]: '블레이즈 플래시',
  [ID.BLAZE_FLASH.T1_1]: '재빠른 손놀림', [ID.BLAZE_FLASH.T1_2]: '전투의 달인', [ID.BLAZE_FLASH.T1_3]: '부위 파괴 강화',
  [ID.BLAZE_FLASH.T2_1]: '강화된 일격', [ID.BLAZE_FLASH.T2_2]: '깨어난 본능',
  [ID.BLAZE_FLASH.T3_1]: '엠버레스의 춤사위', [ID.BLAZE_FLASH.T3_2]: '맹렬한 추격',

  [ID.RENDING_FINISHER.BODY]: '렌딩 피니셔',
  [ID.RENDING_FINISHER.T1_1]: '재빠른 손놀림', [ID.RENDING_FINISHER.T1_2]: '단단한 비늘', [ID.RENDING_FINISHER.T1_3]: '정면 승부',
  [ID.RENDING_FINISHER.T2_1]: '응축된 힘', [ID.RENDING_FINISHER.T2_2]: '약점 포착',
  [ID.RENDING_FINISHER.T3_1]: '깨어난 본능', [ID.RENDING_FINISHER.T3_2]: '공간절삭',

  [ID.EXPLOSION_FINISHER.BODY]: '익스플로전 피니셔',
  [ID.EXPLOSION_FINISHER.T1_1]: '재빠른 손놀림', [ID.EXPLOSION_FINISHER.T1_2]: '단단한 비늘', [ID.EXPLOSION_FINISHER.T1_3]: '뇌진탕',
  [ID.EXPLOSION_FINISHER.T2_1]: '응축된 힘', [ID.EXPLOSION_FINISHER.T2_2]: '약점 포착',
  [ID.EXPLOSION_FINISHER.T3_1]: '깨어난 본능', [ID.EXPLOSION_FINISHER.T3_2]: '엠버레스의 헌신',
  
  [ID.SOUL_DIVIDE.BODY]: '소울 디바이드',
  [ID.DEEP_IMPACT.BODY]: '딥 임팩트',
  [ID.GUARDIAN_BACKLASH.BODY]: '가디언 백래시',
  [ID.BREATH_OF_EMBERES.BODY]: '브레스 오브 엠버레스',
  [ID.GUARDIANS_CRASH.BODY]: '가디언즈 크래시',
  [ID.AWAKEN.BODY]: '어웨이큰',
  [ID.INFERNO_BURST.BODY]: '인페르노 버스트',
  [ID.GUARDIAN_FEAR.BODY]: '가디언 피어'
} as const;

// todo: 나중에 모든 직업의 ID를 불러올때 이런식으로 작성해서 모아놓는 index파일을 만들자.
export const GK_ID = ID;
export const GK_NAMES = NAMES;

// ============================================================
// 스킬 DB
// ============================================================

/**
 * todo: ID.PIERCING_SHOCK.T2_2 기본피해량 1.4 검토
 * ID.METEOR_CRASH.T2 기본공격의 N% 검토, 스킬 속성 추가 고려, ID.METEOR_CRASH.T2_2 화상 상수계수 추가
 * ID.QUAKE_SMASH.BODY: 기본이 홀딩 스킬인 얘들 최대 홀딩피 피해증가 적용 기능 추가
 * 기본피해량을 1-기본피해량으로 해서 그냥 DB에 피해증가수치를 적을지 피해타입을 분류해서 적용할지 검토
 * 
 * 2타만 피해증가 적용 방법 검토: ID.AVENGING_SPEAR.T3_2, ID.PIERCING_SHOCK.T3_2, ID.BLAZE_SWEEP.T3_1,
 * ID.BLAZE_FLASH.T3_1, ID.BLAZE_FLASH.T3_2
 * 
 * 마법/물리 데미지 적용 여부 검토
 */
export const SKILLS_GUARDIAN_KNIGHT_DB: SkillData[] = [
// ── [일반 스킬, category: 'BASIC'] ──────────────────────────────────
  { // ────── 클리브 ────────────────────────────────────
    id: ID.CLEAVE.BODY,
    name: NAMES[ID.CLEAVE.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.BODY}.webp`,
    category: [ 'BASIC' ],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 0,
    stagger: '',
    superArmorId: 'NONE',
    cooldown: 6,

    levels:[{
          name: '1타', isCombined: true, hits: 1,
          constants: [306, 542, 692, 812, 908, 984, 1050, 1110, 1155, 1201, 1202, 1202, 1202, 1202],
          coefficients: [1.66, 2.95, 3.76, 4.41, 4.93, 5.35, 5.71, 6.03, 6.28, 6.53, 6.53, 6.53, 6.53, 6.53],
        }],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.CLEAVE.T1_1, name: NAMES[ID.CLEAVE.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '적 받는 피해 증가', value: 0.06}]
      },
      {
        id: ID.CLEAVE.T1_2, name: NAMES[ID.CLEAVE.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T1_2}.webp`,
        slot: 1, index: 2,
        memo: [{ type: '돌진 거리 증가', value: 4 }]
      },
      {
        id: ID.CLEAVE.T1_3, name: NAMES[ID.CLEAVE.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T1_3}.webp`,
        slot: 1, index: 3,
        memo: [{ type: '시전 속도 증가', value: 0.1 }]
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.CLEAVE.T2_1, name: NAMES[ID.CLEAVE.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T2_1}.webp`,
        slot: 2, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.4], target: { skillIds: [ID.CLEAVE.BODY] }
        }],
        memo: [{ type: '기운 추가 회복', value: 1 }]
      },
      {
        id: ID.CLEAVE.T2_2, name: NAMES[ID.CLEAVE.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T2_2}.webp`,
        slot: 2, index: 2,
        memo: [{ type: '하급 및 일반 몬스터에게 주는 피해', value: 1.2 }]
      },
      {
        id: ID.CLEAVE.T2_3, name: NAMES[ID.CLEAVE.T2_3],
        iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T2_3}.webp`,
        slot: 2, index: 3,
        effects: [{
          type: 'DMG_INC', value: [0.6], target: { skillIds: [ID.CLEAVE.BODY] }
        }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.CLEAVE.T3_1, name: NAMES[ID.CLEAVE.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T3_1}.webp`,
        slot: 3, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.6], target: { skillIds: [ID.CLEAVE.BODY] }
        }],
        addDamageSources: [{
          name: '화상', isCombined: false, hits: 6,
          constants: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
          coefficients: [4.0, 7.08, 9.05, 10.62, 11.87, 12.85, 13.7, 14.48, 15.08, 15.68, 15.68, 15.69, 15.69, 15.69],
        }]
      },
      {
        id: ID.CLEAVE.T3_2, name: NAMES[ID.CLEAVE.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T3_2}.webp`,
        slot: 3, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.7], target: { skillIds: [ID.CLEAVE.BODY] }
        }],
        memo: [{ type: '공격 범위 증가', value: 0.3 }]
      }
    ]
  },
  { // ────── 와일드 어퍼 ────────────────────────────────────
    id: ID.WILD_UPPERCUT.BODY,
    name: NAMES[ID.WILD_UPPERCUT.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.BODY}.webp`,
    category: [ 'BASIC' ],
    typeId: 'COMBO',
    attackId: 'NON_DIRECTIONAL',
    destruction: 1,
    stagger: '하',
    superArmorId: 'NONE',
    cooldown: 8,
    
    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [111, 196, 251, 294, 329, 357, 380, 402, 419, 436, 436, 436, 436, 436],
        coefficients: [0.6, 1.06, 1.36, 1.59, 1.78, 1.93, 2.06, 2.18, 2.27, 2.36, 2.36, 2.36, 2.36, 2.36],
      },
      {
        name: '2타', isCombined: true, hits: 1,
        constants: [258, 457, 584, 685, 765, 829, 883, 934, 972, 1010, 1010, 1011, 1011, 1011],
        coefficients: [1.4, 2.48, 3.17, 3.72, 4.15, 4.5, 4.79, 5.07, 5.27, 5.48, 5.48, 5.48, 5.48, 5.48],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.WILD_UPPERCUT.T1_1, name: NAMES[ID.WILD_UPPERCUT.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '카운터 성공 시 쿨감', value: 3 }]
      },
      {
        id: ID.WILD_UPPERCUT.T1_2, name: NAMES[ID.WILD_UPPERCUT.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T1_2}.webp`,
        slot: 1, index: 2,
        overrides: { superArmorId: 'STIFF_IMMUNE' }
      },
      {
        id: ID.WILD_UPPERCUT.T1_3, name: NAMES[ID.WILD_UPPERCUT.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T1_3}.webp`,
        slot: 1, index: 3,
        memo: [{ type: '시전 속도 증가', value: 0.1 }]
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.WILD_UPPERCUT.T2_1, name: NAMES[ID.WILD_UPPERCUT.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T2_1}.webp`,
        slot: 2, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.4], target: { skillIds: [ID.WILD_UPPERCUT.BODY] }
        }],
        memo: [{ type: '돌진 거리', value: 4 }]
      },
      {
        id: ID.WILD_UPPERCUT.T2_2, name: NAMES[ID.WILD_UPPERCUT.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.33], target: { skillIds: [ID.WILD_UPPERCUT.BODY] }
        }],
        overrides: { typeId: 'NORMAL' }
      },
      {
        id: ID.WILD_UPPERCUT.T2_3, name: NAMES[ID.WILD_UPPERCUT.T2_3],
        iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T2_3}.webp`,
        slot: 2, index: 3,
        effects: [{
          type: 'DMG_INC', value: [0.9], target: { skillIds: [ID.WILD_UPPERCUT.BODY] }
        }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.WILD_UPPERCUT.T3_1, name: NAMES[ID.WILD_UPPERCUT.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T3_1}.webp`,
        slot: 3, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.8], target: { skillIds: [ID.WILD_UPPERCUT.BODY] }
        }],
      },
      {
        id: ID.WILD_UPPERCUT.T3_2, name: NAMES[ID.WILD_UPPERCUT.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T3_2}.webp`,
        slot: 3, index: 2,
        memo: [{ type: '스택형으로 변경', value: 2 }]
      }
    ]
  },
  { // ────── 쓰러스트 ────────────────────────────────────
    id: ID.THRUST.BODY,
    name: NAMES[ID.THRUST.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.THRUST.BODY}.webp`,
    category: [ 'BASIC' ],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 0,
    stagger: '하',
    superArmorId: 'STIFF_IMMUNE',
    cooldown: 8,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [387, 687, 878, 1031, 1152, 1248, 1330, 1407, 1465, 1523, 1523, 1524, 1524, 1525],
        coefficients: [2.1, 3.73, 4.77, 5.6, 6.26, 6.78, 7.23, 7.64, 7.96, 8.27, 8.27, 8.28, 8.28, 8.28],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.THRUST.T1_1, name: NAMES[ID.THRUST.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.THRUST.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '적 받는 피해 증가', value: 0.06 }]
      },
      {
        id: ID.THRUST.T1_2, name: NAMES[ID.THRUST.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.THRUST.T1_2}.webp`,
        slot: 1, index: 2,
        overrides: { destruction: 1 }
      },
      {
        id: ID.THRUST.T1_3, name: NAMES[ID.THRUST.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.THRUST.T1_3}.webp`,
        slot: 1, index: 3,
        memo: [{ type: '피격 시 받는 피해 감소', value: 0.2 }]
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.THRUST.T2_1, name: NAMES[ID.THRUST.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.THRUST.T2_1}.webp`,
        slot: 2, index: 1,
        overrides: { typeId: 'CHAIN' },
        memo: [{ type: '기운 추가 회복', value: -1 }]
      },
      {
        id: ID.THRUST.T2_2, name: NAMES[ID.THRUST.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.THRUST.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.4],
          target: { skillIds: [ID.THRUST.BODY] }
        }]
      },
      {
        id: ID.THRUST.T2_3, name: NAMES[ID.THRUST.T2_3],
        iconPath: `/images/skills/guardian-knight/${ID.THRUST.T2_3}.webp`,
        slot: 2, index: 3,
        effects: [{
          type: 'DMG_INC', value: [0.7],
          target: { skillIds: [ID.THRUST.BODY] }
        }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.THRUST.T3_1, name: NAMES[ID.THRUST.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.THRUST.T3_1}.webp`,
        slot: 3, index: 1,
        effects: [{
          type: 'DMG_INC', value: [1.1],
          target: { skillIds: [ID.THRUST.BODY] }
        }]
      },
      {
        id: ID.THRUST.T3_2, name: NAMES[ID.THRUST.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.THRUST.T3_2}.webp`,
        slot: 3, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.9],
          target: { skillIds: [ID.THRUST.BODY] }
        }]
      }
    ]
  },
  { // ────── 길로틴 스핀 ────────────────────────────────────
    id: ID.GUILLOTINE_SPIN.BODY,
    name: NAMES[ID.GUILLOTINE_SPIN.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.BODY}.webp`,
    category: [ 'BASIC' ],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 1,
    stagger: '중상',
    superArmorId: 'STIFF_IMMUNE',
    cooldown: 24,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1, // 회전 공격
        constants: [777, 1378, 1761, 2069, 2313, 2504, 2670, 2820, 2936, 3053, 3054, 3055, 3056, 3056],
        coefficients: [4.22, 7.48, 9.56, 11.23, 12.56, 13.59, 14.5, 15.31, 15.94, 16.57, 16.57, 16.58, 16.58, 16.58],
      },
      {
        name: '2타', isCombined: true, hits: 1, // 내려치기
        constants: [437, 774, 989, 1162, 1298, 1405, 1499, 1585, 1649, 1714, 1715, 1715, 1716, 1716],
        coefficients: [2.37, 4.2, 5.37, 6.31, 7.05, 7.63, 8.14, 8.6, 8.95, 9.3, 9.31, 9.31, 9.31, 9.31],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.GUILLOTINE_SPIN.T1_1, name: NAMES[ID.GUILLOTINE_SPIN.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '하급 및 일반 몬스터에게 주는 피해', value: 0.65 }]
      },
      {
        id: ID.GUILLOTINE_SPIN.T1_2, name: NAMES[ID.GUILLOTINE_SPIN.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T1_2}.webp`,
        slot: 1, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.35],
          target: { skillIds: [ID.GUILLOTINE_SPIN.BODY] }
        }]
      },
      {
        id: ID.GUILLOTINE_SPIN.T1_3, name: NAMES[ID.GUILLOTINE_SPIN.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T1_3}.webp`,
        slot: 1, index: 3,
        overrides: { stagger: '상' }
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.GUILLOTINE_SPIN.T2_1, name: NAMES[ID.GUILLOTINE_SPIN.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T2_1}.webp`,
        slot: 2, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.8],
          target: { skillIds: [ID.GUILLOTINE_SPIN.BODY] }
        }]
      },
      {
        id: ID.GUILLOTINE_SPIN.T2_2, name: NAMES[ID.GUILLOTINE_SPIN.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.65],
          target: { skillIds: [ID.GUILLOTINE_SPIN.BODY] }
        }],
        overrides: { superArmorId: 'PUSH_IMMUNE' }
      },
      {
        id: ID.GUILLOTINE_SPIN.T2_3, name: NAMES[ID.GUILLOTINE_SPIN.T2_3],
        iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T2_3}.webp`,
        slot: 2, index: 3,
        effects: [{
          type: 'DMG_INC', value: [0.55],
          target: { skillIds: [ID.GUILLOTINE_SPIN.BODY] }
        }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.GUILLOTINE_SPIN.T3_1, name: NAMES[ID.GUILLOTINE_SPIN.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T3_1}.webp`,
        slot: 3, index: 1,
        memo: [{ type: '공격 범위 증가', value: 0.3 }, { type: '적중 시 쿨감(최대)', value: 12 }]
      },
      {
        id: ID.GUILLOTINE_SPIN.T3_2, name: NAMES[ID.GUILLOTINE_SPIN.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T3_2}.webp`,
        slot: 3, index: 2,
        effects: [{
          type: 'DMG_INC', value: [1.2],
          target: { skillIds: [ID.GUILLOTINE_SPIN.BODY] }
        }],
        memo: [{ type: '기운 추가 회복', value: -1 }]
      }
    ]
  },
  { // ────── 임페일 쇼크 ────────────────────────────────────
    id: ID.PIERCING_SHOCK.BODY,
    name: NAMES[ID.PIERCING_SHOCK.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.BODY}.webp`,
    category: [ 'BASIC' ],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 0,
    stagger: '상',
    superArmorId: 'STIFF_IMMUNE',
    cooldown: 24,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [176, 312, 399, 468, 523, 566, 604, 638, 664, 689, 690, 690, 690, 690],
        coefficients: [0.95, 1.69, 2.16, 2.54, 2.84, 3.07, 3.28, 3.46, 3.61, 3.74, 3.74, 3.74, 3.74, 3.74],
      },
      {
        name: '2타', isCombined: true, hits: 1,
        constants: [825, 1461, 1868, 2193, 2450, 2653, 2829, 2992, 3114, 3237, 3238, 3239, 3240, 3240],
        coefficients: [4.48, 7.93, 10.14, 11.9, 13.3, 14.4, 15.36, 16.24, 16.9, 17.57, 17.58, 17.58, 17.58, 17.58],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.PIERCING_SHOCK.T1_1, name: NAMES[ID.PIERCING_SHOCK.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '기운 추가 회복', value: 3 }]
      },
      {
        id: ID.PIERCING_SHOCK.T1_2, name: NAMES[ID.PIERCING_SHOCK.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T1_2}.webp`,
        slot: 1, index: 2,
        memo: [{ type: '오브 게이지 회복량 증가', value: 0.3 }]
      },
      {
        id: ID.PIERCING_SHOCK.T1_3, name: NAMES[ID.PIERCING_SHOCK.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T1_3}.webp`,
        slot: 1, index: 3,
        overrides: { destruction: 1 }
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.PIERCING_SHOCK.T2_1, name: NAMES[ID.PIERCING_SHOCK.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T2_1}.webp`,
        slot: 2, index: 1,
        overrides: { typeId: 'CHARGE' },
        effects: [{
          type: 'DMG_INC', value: [0.7],
          target: { skillIds: [ID.PIERCING_SHOCK.BODY] }
        }]
      },
      {
        id: ID.PIERCING_SHOCK.T2_2, name: NAMES[ID.PIERCING_SHOCK.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [
          {
            type: 'DMG_INC', value: [1.4],
            target: { skillIds: [ID.PIERCING_SHOCK.BODY] }
          },
          {
            type: 'CDR_C', value: [6],
            target: { skillIds: [ID.PIERCING_SHOCK.BODY] }
          }
        ]
      },
      {
        id: ID.PIERCING_SHOCK.T2_3, name: NAMES[ID.PIERCING_SHOCK.T2_3],
        iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T2_3}.webp`,
        slot: 2, index: 3,
        effects: [{
          type: 'DMG_INC', value: [0.9],
          target: { skillIds: [ID.PIERCING_SHOCK.BODY] }
        }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.PIERCING_SHOCK.T3_1, name: NAMES[ID.PIERCING_SHOCK.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T3_1}.webp`,
        slot: 3, index: 1,
        effects: [{
          type: 'DMG_INC', value: [1.2],
          target: { skillIds: [ID.PIERCING_SHOCK.BODY] }
        }],
        memo: [{ type: '게이지 회복량 감소', value: 0.5 }]
      },
      {
        id: ID.PIERCING_SHOCK.T3_2, name: NAMES[ID.PIERCING_SHOCK.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T3_2}.webp`,
        slot: 3, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.9],
          target: { skillIds: [ID.PIERCING_SHOCK.BODY] }
        }]
      }
    ]
  },
  { // ────── 미티어 크래시 ────────────────────────────────────
    id: ID.METEOR_CRASH.BODY,
    name: NAMES[ID.METEOR_CRASH.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.BODY}.webp`,
    category: [ 'BASIC' ],
    typeId: 'POINT',
    attackId: 'NON_DIRECTIONAL',
    destruction: 0,
    stagger: '중',
    superArmorId: 'STIFF_IMMUNE',
    cooldown: 15,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [736, 1303, 1666, 1955, 2185, 2366, 2523, 2667, 2777, 2886, 2887, 2888, 2889, 2889],
        coefficients: [4.0, 7.08, 9.05, 10.62, 11.87, 12.85, 13.7, 14.48, 15.08, 15.68, 15.68, 15.69, 15.69, 15.69],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.METEOR_CRASH.T1_1, name: NAMES[ID.METEOR_CRASH.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '피격 시 받는 피해 감소', value: 0.2 }]
      },
      {
        id: ID.METEOR_CRASH.T1_2, name: NAMES[ID.METEOR_CRASH.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T1_2}.webp`,
        slot: 1, index: 2,
        memo: [{ type: '오브 게이지 회복량 증가', value: 0.3 }]
      },
      {
        id: ID.METEOR_CRASH.T1_3, name: NAMES[ID.METEOR_CRASH.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T1_3}.webp`,
        slot: 1, index: 3,
        memo: [{ type: '기운 추가 회복', value: 2 }]
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.METEOR_CRASH.T2_1, name: NAMES[ID.METEOR_CRASH.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T2_1}.webp`,
        slot: 2, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.3],
          target: { skillIds: [ID.METEOR_CRASH.BODY] }
        }]
      },
      {
        id: ID.METEOR_CRASH.T2_2, name: NAMES[ID.METEOR_CRASH.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.4],
          target: { skillIds: [ID.METEOR_CRASH.BODY] }
        }],
        addDamageSources: [{
          name: '화상', isCombined: false, hits: 6,
          constants: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
          coefficients: [4.0, 7.08, 9.05, 10.62, 11.87, 12.85, 13.7, 14.48, 15.08, 15.68, 15.68, 15.69, 15.69, 15.69],
        }]
      },
      {
        id: ID.METEOR_CRASH.T2_3, name: NAMES[ID.METEOR_CRASH.T2_3],
        iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T2_3}.webp`,
        slot: 2, index: 3,
        effects: [{
          type: 'DMG_INC', value: [0.45],
          target: { skillIds: [ID.METEOR_CRASH.BODY] }
        }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.METEOR_CRASH.T3_1, name: NAMES[ID.METEOR_CRASH.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T3_1}.webp`,
        slot: 3, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.65],
          target: { skillIds: [ID.METEOR_CRASH.BODY] }
        }],
        memo: [{ type: '공격 범위 증가', value: 0.5 }]
      },
      {
        id: ID.METEOR_CRASH.T3_2, name: NAMES[ID.METEOR_CRASH.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T3_2}.webp`,
        slot: 3, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.55],
          target: { skillIds: [ID.METEOR_CRASH.BODY] }
        }],
        memo: [{ type: '사용 거리 증가', value: 5 }]
      }
    ]
  },
  { // ────── 퀘이크 스매시 ────────────────────────────────────
    id: ID.QUAKE_SMASH.BODY,
    name: NAMES[ID.QUAKE_SMASH.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.BODY}.webp`,
    category: [ 'BASIC' ],
    typeId: 'HOLDING',
    attackId: 'NON_DIRECTIONAL',
    destruction: 2,
    stagger: '최상',
    superArmorId: 'STIFF_IMMUNE',
    cooldown: 40,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [1810, 3207, 4099, 4812, 5376, 5822, 6208, 6564, 6832, 7099, 7102, 7104, 7106, 7107],
        coefficients: [9.84, 17.43, 22.28, 26.15, 29.22, 31.64, 33.74, 35.67, 37.13, 38.58, 38.6, 38.61, 38.62, 38.63],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.QUAKE_SMASH.T1_1, name: NAMES[ID.QUAKE_SMASH.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '피격 시 받는 피해 감소', value: 0.2 }]
      },
      {
        id: ID.QUAKE_SMASH.T1_2, name: NAMES[ID.QUAKE_SMASH.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T1_2}.webp`,
        slot: 1, index: 2,
        overrides: { destruction: 3 } // 부위 파괴 +1
      },
      {
        id: ID.QUAKE_SMASH.T1_3, name: NAMES[ID.QUAKE_SMASH.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T1_3}.webp`,
        slot: 1, index: 3,
        memo: [{ type: '시전 속도 증가', value: 0.1 }]
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.QUAKE_SMASH.T2_1, name: NAMES[ID.QUAKE_SMASH.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T2_1}.webp`,
        slot: 2, index: 1,
        overrides: { typeId: 'NORMAL' },
        effects: [{
          type: 'DMG_INC', value: [0.8],
          target: { skillIds: [ID.QUAKE_SMASH.BODY] }
        }],
        memo: [{ type: '기운 추가 회복', value: 2 }]
      },
      {
        id: ID.QUAKE_SMASH.T2_2, name: NAMES[ID.QUAKE_SMASH.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T2_2}.webp`,
        slot: 2, index: 2,
        overrides: { typeId: 'CHARGE' },
        effects: [{
          type: 'DMG_INC', value: [1.85],
          target: { skillIds: [ID.QUAKE_SMASH.BODY] }
        }]
      },
      {
        id: ID.QUAKE_SMASH.T2_3, name: NAMES[ID.QUAKE_SMASH.T2_3],
        iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T2_3}.webp`,
        slot: 2, index: 3,
        effects: [{
          type: 'DMG_INC', value: [0.9],
          target: { skillIds: [ID.QUAKE_SMASH.BODY] }
        }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.QUAKE_SMASH.T3_1, name: NAMES[ID.QUAKE_SMASH.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T3_1}.webp`,
        slot: 3, index: 1,
        effects: [{
          type: 'DMG_INC', value: [1.2],
          target: { skillIds: [ID.QUAKE_SMASH.BODY] }
        }],
        memo: [{ type: '게이지 회복량 감소', value: 0.5 }]
      },
      {
        id: ID.QUAKE_SMASH.T3_2, name: NAMES[ID.QUAKE_SMASH.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T3_2}.webp`,
        slot: 3, index: 2,
        overrides: { superArmorId: 'PUSH_IMMUNE' },
        effects: [{
          type: 'DMG_INC', value: [0.95],
          target: { skillIds: [ID.QUAKE_SMASH.BODY] }
        }]
      }
    ]
  },
  { // ────── 프렌지 스윕 ────────────────────────────────────
    id: ID.FRENZY_SWEEP.BODY,
    name: NAMES[ID.FRENZY_SWEEP.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.BODY}.webp`,
    category: [ 'BASIC' ],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 0,
    stagger: '중상',
    superArmorId: 'STIFF_IMMUNE',
    cooldown: 36,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [1324, 2348, 3003, 3524, 3938, 4263, 4547, 4810, 5006, 5202, 5205, 5206, 5207, 5208],
        coefficients: [7.2, 12.76, 16.32, 19.15, 21.4, 23.17, 24.71, 26.14, 27.21, 28.27, 28.29, 28.29, 28.3, 28.31],
      },
      {
        name: '2타', isCombined: true, hits: 1,
        constants: [881, 1561, 1996, 2343, 2618, 2834, 3023, 3196, 3327, 3457, 3458, 3459, 3460, 3461],
        coefficients: [4.79, 8.48, 10.85, 12.73, 14.23, 15.4, 16.43, 17.37, 18.08, 18.79, 18.79, 18.8, 18.8, 18.81],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.FRENZY_SWEEP.T1_1, name: NAMES[ID.FRENZY_SWEEP.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '피격 시 받는 피해 감소', value: 0.2 }]
      },
      {
        id: ID.FRENZY_SWEEP.T1_2, name: NAMES[ID.FRENZY_SWEEP.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T1_2}.webp`,
        slot: 1, index: 2,
        overrides: { stagger: '상' }
      },
      {
        id: ID.FRENZY_SWEEP.T1_3, name: NAMES[ID.FRENZY_SWEEP.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T1_3}.webp`,
        slot: 1, index: 3,
        memo: [{ type: '시전 속도 증가', value: 0.15 }]
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.FRENZY_SWEEP.T2_1, name: NAMES[ID.FRENZY_SWEEP.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T2_1}.webp`,
        slot: 2, index: 1,
        effects: [{
          type: 'DMG_INC', value: [1.755],
          target: { skillIds: [ID.FRENZY_SWEEP.BODY] }
        }]
      },
      {
        id: ID.FRENZY_SWEEP.T2_2, name: NAMES[ID.FRENZY_SWEEP.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [{
          type: 'DMG_INC', value: [1.44],
          target: { skillIds: [ID.FRENZY_SWEEP.BODY] }
        }]
      },
      {
        id: ID.FRENZY_SWEEP.T2_3, name: NAMES[ID.FRENZY_SWEEP.T2_3],
        iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T2_3}.webp`,
        slot: 2, index: 3,
        effects: [{
          type: 'DMG_INC', value: [0.8],
          target: { skillIds: [ID.FRENZY_SWEEP.BODY] }
        }],
        memo: [{ type: '게이지 회복량 감소', value: 0.5 }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.FRENZY_SWEEP.T3_1, name: NAMES[ID.FRENZY_SWEEP.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T3_1}.webp`,
        slot: 3, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.84],
          target: { skillIds: [ID.FRENZY_SWEEP.BODY] }
        }]
      },
      {
        id: ID.FRENZY_SWEEP.T3_2, name: NAMES[ID.FRENZY_SWEEP.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T3_2}.webp`,
        slot: 3, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.8],
          target: { skillIds: [ID.FRENZY_SWEEP.BODY] }
        }],
        addDamageSources: [{
          name: '화상', isCombined: false, hits: 6,
          constants: [73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73],
          coefficients: [4.0, 7.08, 9.05, 10.62, 11.87, 12.85, 13.7, 14.48, 15.08, 15.68, 15.68, 15.69, 15.69, 15.69],
        }]
      }
    ]
  },

  // ── [발현/화신 스킬, category: 'ENLIGHTEN'/'GOD_FORM'] ──────────────────────────────────  
  { // ────── 리벤지 블로우 ────────────────────────────────────
    id: ID.VENGEFUL_BLOW.BODY,
    name: NAMES[ID.VENGEFUL_BLOW.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.BODY}.webp`,
    category: [ 'ENLIGHTEN' ], // 발현 스킬
    typeId: 'HOLDING',
    attackId: 'HEAD_ATK',
    resource: { typeId: 'QI_EMBERES', isStatic: true, value: 4 },
    destruction: 0,
    stagger: '중',
    superArmorId: 'PUSH_IMMUNE',
    cooldown: 15,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [905, 1603, 2048, 2404, 2686, 2908, 3101, 3279, 3413, 3546, 3547, 3549, 3549, 3550],
        coefficients: [4.92, 8.71, 11.13, 13.06, 14.6, 15.8, 16.85, 17.82, 18.55, 19.27, 19.28, 19.29, 19.29, 19.3],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.VENGEFUL_BLOW.T1_1, name: NAMES[ID.VENGEFUL_BLOW.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.T1_1}.webp`,
        slot: 1, index: 1,
        effects: [{
          type: 'GK_QI_DMG', value: [0.05],
          target: { skillIds: [ID.VENGEFUL_BLOW.BODY] }
        }]
      },
      {
        id: ID.VENGEFUL_BLOW.T1_2, name: NAMES[ID.VENGEFUL_BLOW.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.T1_2}.webp`,
        slot: 1, index: 2,
        overrides: { attackId: 'NON_DIRECTIONAL' },
        effects: [{
          type: 'DMG_INC', value: [0.15],
          target: { skillIds: [ID.VENGEFUL_BLOW.BODY] }
        }]
      },
      {
        id: ID.VENGEFUL_BLOW.T1_3, name: NAMES[ID.VENGEFUL_BLOW.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.T1_3}.webp`,
        slot: 1, index: 3,
        memo: [{ type: '준비 동작 속도 증가 및 유지 시간 증가', value: 1 }]
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.VENGEFUL_BLOW.T2_1, name: NAMES[ID.VENGEFUL_BLOW.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.T2_1}.webp`,
        slot: 2, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.45],
          target: { skillIds: [ID.VENGEFUL_BLOW.BODY] }
        }],
        memo: [{ type: '보호막 수치 증가', value: 0.2 }]
      },
      {
        id: ID.VENGEFUL_BLOW.T2_2, name: NAMES[ID.VENGEFUL_BLOW.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [{
          type: 'CDR_C', value: [6],
          target: { skillIds: [ID.VENGEFUL_BLOW.BODY] }
        }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.VENGEFUL_BLOW.T3_1, name: NAMES[ID.VENGEFUL_BLOW.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.T3_1}.webp`,
        slot: 3, index: 1,
        link: { slot: 2, index: 1 },
        overrides: { superArmorId: 'DEBUFF_IMMUNE' }
      },
      {
        id: ID.VENGEFUL_BLOW.T3_2, name: NAMES[ID.VENGEFUL_BLOW.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.T3_2}.webp`,
        slot: 3, index: 2,
        link: { slot: 2, index: 2 },
        effects: [{
          type: 'DMG_INC', value: [0.8],
          target: { skillIds: [ID.VENGEFUL_BLOW.BODY] }
        }]
      }
    ]
  },
  { // ────── 리벤지 스피어 ────────────────────────────────────
    id: ID.AVENGING_SPEAR.BODY,
    name: NAMES[ID.AVENGING_SPEAR.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.BODY}.webp`,
    category: [ 'GOD_FORM' ],
    typeId: 'HOLDING',
    attackId: 'NON_DIRECTIONAL',
    resource: { typeId: 'QI_EMBERES', isStatic: true, value: 4 },
    destruction: 0,
    stagger: '중',
    superArmorId: 'NONE',
    cooldown: 21,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [395, 700, 893, 1051, 1173, 1275, 1363, 1440, 1503, 1562, 1563, 1564, 1564, 1564],
        coefficients: [2.15, 3.8, 4.85, 5.71, 6.37, 6.93, 7.41, 7.83, 8.17, 8.49, 8.49, 8.5, 8.5, 8.5],
      },
      {
        name: '2타', isCombined: true, hits: 1,
        constants: [169, 301, 384, 451, 504, 547, 583, 617, 643, 668, 668, 669, 669, 669],
        coefficients: [0.92, 1.64, 2.09, 2.45, 2.74, 2.97, 3.17, 3.35, 3.5, 3.63, 3.63, 3.64, 3.64, 3.64],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.AVENGING_SPEAR.T1_1, name: NAMES[ID.AVENGING_SPEAR.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '피격 시 데미지 감소', value: 0.2 }]
      },
      {
        id: ID.AVENGING_SPEAR.T1_2, name: NAMES[ID.AVENGING_SPEAR.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.T1_2}.webp`,
        slot: 1, index: 2,
        effects: [{
          type: 'GK_QI_DMG', value: [0.1],
          target: { skillIds: [ID.AVENGING_SPEAR.BODY] }
        }]
      },
      {
        id: ID.AVENGING_SPEAR.T1_3, name: NAMES[ID.AVENGING_SPEAR.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.T1_3}.webp`,
        slot: 1, index: 3
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.AVENGING_SPEAR.T2_1, name: NAMES[ID.AVENGING_SPEAR.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.T2_1}.webp`,
        slot: 2, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.55],
          target: { skillIds: [ID.AVENGING_SPEAR.BODY] }
        }]
      },
      {
        id: ID.AVENGING_SPEAR.T2_2, name: NAMES[ID.AVENGING_SPEAR.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.45],
          target: { skillIds: [ID.AVENGING_SPEAR.BODY] }
        }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.AVENGING_SPEAR.T3_1, name: NAMES[ID.AVENGING_SPEAR.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.T3_1}.webp`,
        slot: 3, index: 1,
        link: { slot: 2, index: 1 },
        effects: [{
          type: 'DMG_INC', value: [0.7],
          target: { skillIds: [ID.AVENGING_SPEAR.BODY] }
        }],
        memo: [{ type: '공격 중 이동 속도 증가', value: 0.4 }]
      },
      {
        id: ID.AVENGING_SPEAR.T3_2, name: NAMES[ID.AVENGING_SPEAR.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.T3_2}.webp`,
        slot: 3, index: 2,
        link: { slot: 2, index: 2 },
        effects: [{
          type: 'DMG_INC', value: [2.8],
          target: { skillIds: [ID.AVENGING_SPEAR.BODY] }
        }],
      }
    ]
  },
  { // ────── 스피닝 플레임 ────────────────────────────────────
    id: ID.SPINNING_FLAME.BODY,
    name: NAMES[ID.SPINNING_FLAME.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.BODY}.webp`,
    category: [ 'ENLIGHTEN' ], // 발현 스킬
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    resource: { typeId: 'QI_EMBERES', isStatic: true, value: 4 },
    destruction: 0,
    stagger: '하',
    superArmorId: 'NONE',
    cooldown: 10,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [158, 281, 358, 421, 470, 509, 542, 573, 597, 620, 620, 620, 620, 621],
        coefficients: [0.86, 1.53, 1.95, 2.29, 2.56, 2.77, 2.95, 3.12, 3.25, 3.37, 3.37, 3.37, 3.37, 3.38],
      },
      {
        name: '2타', isCombined: true, hits: 1,
        constants: [158, 280, 358, 421, 471, 508, 543, 576, 598, 621, 621, 621, 621, 622],
        coefficients: [0.86, 1.52, 1.95, 2.29, 2.56, 2.76, 2.95, 3.13, 3.25, 3.38, 3.38, 3.38, 3.38, 3.38],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.SPINNING_FLAME.T1_1, name: NAMES[ID.SPINNING_FLAME.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '적 받는 피해 증가', value: 0.06 }]
      },
      {
        id: ID.SPINNING_FLAME.T1_2, name: NAMES[ID.SPINNING_FLAME.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.T1_2}.webp`,
        slot: 1, index: 2,
        memo: [{ type: '오브 게이지 회복량 증가', value: 0.3 }]
      },
      {
        id: ID.SPINNING_FLAME.T1_3, name: NAMES[ID.SPINNING_FLAME.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.T1_3}.webp`,
        slot: 1, index: 3,
        effects: [{
          type: 'GK_QI_DMG', value: [0.05],
          target: { skillIds: [ID.SPINNING_FLAME.BODY] }
        }]
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.SPINNING_FLAME.T2_1, name: NAMES[ID.SPINNING_FLAME.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.T2_1}.webp`,
        slot: 2, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.35],
          target: { skillIds: [ID.SPINNING_FLAME.BODY] }
        }]
      },
      {
        id: ID.SPINNING_FLAME.T2_2, name: NAMES[ID.SPINNING_FLAME.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.5],
          target: { skillIds: [ID.SPINNING_FLAME.BODY] }
        }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.SPINNING_FLAME.T3_1, name: NAMES[ID.SPINNING_FLAME.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.T3_1}.webp`,
        slot: 3, index: 1,
        link: { slot: 2, index: 1 },
        effects: [{
          type: 'DMG_INC', value: [0.8],
          target: { skillIds: [ID.SPINNING_FLAME.BODY] }
        }]
      },
      {
        id: ID.SPINNING_FLAME.T3_2, name: NAMES[ID.SPINNING_FLAME.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.T3_2}.webp`,
        slot: 3, index: 2,
        link: { slot: 2, index: 2 },
        effects: [{
          type: 'DMG_INC', value: [0.9],
          target: { skillIds: [ID.SPINNING_FLAME.BODY] }
        }]
      }
    ]
  },
  { // ────── 아바돈 플레임 ────────────────────────────────────
    id: ID.ABADDON_FLAME.BODY,
    name: NAMES[ID.ABADDON_FLAME.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.BODY}.webp`,
    category: [ 'GOD_FORM' ], // 화신 스킬
    typeId: 'POINT',
    attackId: 'NON_DIRECTIONAL',
    resource: { typeId: 'QI_EMBERES', isStatic: true, value: 4 },
    destruction: 0,
    stagger: '중',
    superArmorId: 'NONE',
    cooldown: 18,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [503, 892, 1142, 1342, 1500, 1620, 1728, 1828, 1901, 1971, 1972, 1972, 1973, 1973],
        coefficients: [2.73, 4.85, 6.21, 7.3, 8.16, 8.81, 9.4, 9.94, 10.34, 10.72, 10.73, 10.73, 10.74, 10.74],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.ABADDON_FLAME.T1_1, name: NAMES[ID.ABADDON_FLAME.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '적 받는 피해 증가', value: 0.06 }]
      },
      {
        id: ID.ABADDON_FLAME.T1_2, name: NAMES[ID.ABADDON_FLAME.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.T1_2}.webp`,
        slot: 1, index: 2,
        effects: [{
          type: 'GK_QI_COST', value: [2],
          target: { skillIds: [ID.ABADDON_FLAME.BODY] }
        }]
      },
      {
        id: ID.ABADDON_FLAME.T1_3, name: NAMES[ID.ABADDON_FLAME.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.T1_3}.webp`,
        slot: 1, index: 3,
        effects: [{
          type: 'GK_QI_DMG', value: [0.1],
          target: { skillIds: [ID.ABADDON_FLAME.BODY] }
        }]
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.ABADDON_FLAME.T2_1, name: NAMES[ID.ABADDON_FLAME.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.T2_1}.webp`,
        slot: 2, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.4],
          target: { skillIds: [ID.ABADDON_FLAME.BODY] }
        }]
      },
      {
        id: ID.ABADDON_FLAME.T2_2, name: NAMES[ID.ABADDON_FLAME.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.6],
          target: { skillIds: [ID.ABADDON_FLAME.BODY] }
        }],
        memo: [{ type: '시전 거리 증가', value: 4 }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.ABADDON_FLAME.T3_1, name: NAMES[ID.ABADDON_FLAME.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.T3_1}.webp`,
        slot: 3, index: 1,
        link: { slot: 2, index: 1 },
        effects: [{
          type: 'DMG_INC', value: [0.92],
          target: { skillIds: [ID.ABADDON_FLAME.BODY] }
        }]
      },
      {
        id: ID.ABADDON_FLAME.T3_2, name: NAMES[ID.ABADDON_FLAME.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.T3_2}.webp`,
        slot: 3, index: 2,
        link: { slot: 2, index: 2 },
        effects: [{
          type: 'DMG_INC', value: [1.8],
          target: { skillIds: [ID.ABADDON_FLAME.BODY] }
        }]
      }
    ]
  },
  { // ────── 윙 스팅어 ────────────────────────────────────
    id: ID.SOARING_STRIKE.BODY,
    name: NAMES[ID.SOARING_STRIKE.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.BODY}.webp`,
    category: [ 'ENLIGHTEN' ], // 발현 스킬
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    resource: { typeId: 'QI_EMBERES', isStatic: true, value: 4 },
    destruction: 1,
    stagger: '하',
    superArmorId: 'STIFF_IMMUNE',
    cooldown: 9,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [384, 680, 869, 1021, 1141, 1236, 1318, 1394, 1450, 1507, 1508, 1508, 1509, 1509],
        coefficients: [2.09, 3.69, 4.72, 5.55, 6.2, 6.72, 7.16, 7.57, 7.88, 8.19, 8.2, 8.2, 8.2, 8.2],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.SOARING_STRIKE.T1_1, name: NAMES[ID.SOARING_STRIKE.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '시전 속도 증가', value: 0.1 }]
      },
      {
        id: ID.SOARING_STRIKE.T1_2, name: NAMES[ID.SOARING_STRIKE.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.T1_2}.webp`,
        slot: 1, index: 2,
        memo: [{ type: '오브 게이지 회복량 증가', value: 0.3 }]
      },
      {
        id: ID.SOARING_STRIKE.T1_3, name: NAMES[ID.SOARING_STRIKE.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.T1_3}.webp`,
        slot: 1, index: 3,
        effects: [{
          type: 'GK_QI_DMG', value: [0.05],
          target: { skillIds: [ID.SOARING_STRIKE.BODY] }
        }]
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.SOARING_STRIKE.T2_1, name: NAMES[ID.SOARING_STRIKE.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.T2_1}.webp`,
        slot: 2, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.65],
          target: { skillIds: [ID.SOARING_STRIKE.BODY] }
        }]
      },
      {
        id: ID.SOARING_STRIKE.T2_2, name: NAMES[ID.SOARING_STRIKE.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.T2_2}.webp`,
        slot: 2, index: 2,
        overrides: { typeId: 'CHARGE' },
        effects: [{
          type: 'DMG_INC', value: [0.8],
          target: { skillIds: [ID.SOARING_STRIKE.BODY] }
        }],
        memo: [{ type: '미차지 시 피해 감소', value: 0.5 }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.SOARING_STRIKE.T3_1, name: NAMES[ID.SOARING_STRIKE.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.T3_1}.webp`,
        slot: 3, index: 1,
        link: { slot: 2, index: 1 },
        effects: [{
          type: 'DMG_INC', value: [0.7],
          target: { skillIds: [ID.SOARING_STRIKE.BODY] }
        }],
        memo: [{ type: '공격 거리 증가', value: 0.4 }]
      },
      {
        id: ID.SOARING_STRIKE.T3_2, name: NAMES[ID.SOARING_STRIKE.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.T3_2}.webp`,
        slot: 3, index: 2,
        link: { slot: 2, index: 2 },
        overrides: { superArmorId: 'PUSH_IMMUNE' },
        effects: [{
          type: 'DMG_INC', value: [0.7],
          target: { skillIds: [ID.SOARING_STRIKE.BODY] }
        }]
      }
    ]
  },
  { // ────── 윙 래시 ────────────────────────────────────
    id: ID.WING_LASH.BODY,
    name: NAMES[ID.WING_LASH.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.BODY}.webp`,
    category: [ 'GOD_FORM' ], // 화신 스킬
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    resource: { typeId: 'QI_EMBERES', isStatic: true, value: 4 },
    destruction: 1,
    stagger: '하',
    superArmorId: 'NONE',
    cooldown: 18,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [527, 933, 1192, 1399, 1564, 1694, 1806, 1910, 1988, 2066, 2067, 2067, 2068, 2068],
        coefficients: [2.86, 5.07, 6.48, 7.6, 8.5, 9.21, 9.82, 10.38, 10.81, 11.23, 11.24, 11.24, 11.25, 11.25],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.WING_LASH.T1_1, name: NAMES[ID.WING_LASH.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '시전 속도 증가', value: 0.1 }]
      },
      {
        id: ID.WING_LASH.T1_2, name: NAMES[ID.WING_LASH.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.T1_2}.webp`,
        slot: 1, index: 2,
        effects: [{
          type: 'GK_QI_COST', value: [2],
          target: { skillIds: [ID.WING_LASH.BODY] }
        }]
      },
      {
        id: ID.WING_LASH.T1_3, name: NAMES[ID.WING_LASH.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.T1_3}.webp`,
        slot: 1, index: 3,
        effects: [{
          type: 'GK_QI_DMG', value: [0.1],
          target: { skillIds: [ID.WING_LASH.BODY] }
        }]
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.WING_LASH.T2_1, name: NAMES[ID.WING_LASH.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.T2_1}.webp`,
        slot: 2, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.6],
          target: { skillIds: [ID.WING_LASH.BODY] }
        }]
      },
      {
        id: ID.WING_LASH.T2_2, name: NAMES[ID.WING_LASH.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.4],
          target: { skillIds: [ID.WING_LASH.BODY] }
        }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.WING_LASH.T3_1, name: NAMES[ID.WING_LASH.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.T3_1}.webp`,
        slot: 3, index: 1,
        link: { slot: 2, index: 1 },
        effects: [{
          type: 'DMG_INC', value: [0.9],
          target: { skillIds: [ID.WING_LASH.BODY] }
        }]
      },
      {
        id: ID.WING_LASH.T3_2, name: NAMES[ID.WING_LASH.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.T3_2}.webp`,
        slot: 3, index: 2,
        link: { slot: 2, index: 2 },
        overrides: { typeId: 'COMBO' },
        effects: [{
          type: 'DMG_INC', value: [1.0],
          target: { skillIds: [ID.WING_LASH.BODY] }
        }]
      }
    ]
  },
  { // ────── 블레이즈 스윕 ────────────────────────────────────
    id: ID.BLAZE_SWEEP.BODY,
    name: NAMES[ID.BLAZE_SWEEP.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.BODY}.webp`,
    category: [ 'ENLIGHTEN' ],
    typeId: 'NORMAL',
    attackId: 'HEAD_ATK',
    resource: { typeId: 'QI_EMBERES', isStatic: true, value: 5 },
    destruction: 0,
    stagger: '중상',
    superArmorId: 'STIFF_IMMUNE',
    cooldown: 24,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [131, 232, 297, 348, 389, 422, 449, 475, 494, 513, 513, 513, 513, 513],
        coefficients: [0.71, 1.26, 1.61, 1.89, 2.11, 2.29, 2.44, 2.58, 2.68, 2.79, 2.79, 2.79, 2.79, 2.79],
      },
      {
        name: '2타', isCombined: true, hits: 1,
        constants: [527, 933, 1192, 1399, 1564, 1694, 1806, 1910, 1988, 2066, 2067, 2067, 2068, 2068],
        coefficients: [2.86, 5.07, 6.48, 7.6, 8.5, 9.21, 9.82, 10.38, 10.81, 11.23, 11.24, 11.24, 11.25, 11.25],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.BLAZE_SWEEP.T1_1, name: NAMES[ID.BLAZE_SWEEP.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '돌진 시전 속도 증가', value: 0.2 }]
      },
      {
        id: ID.BLAZE_SWEEP.T1_2, name: NAMES[ID.BLAZE_SWEEP.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.T1_2}.webp`,
        slot: 1, index: 2,
        memo: [{ type: '적중한 적 1명 당 쿨타임 감소(1명 당 0.5초)', value: 6 }]
      },
      {
        id: ID.BLAZE_SWEEP.T1_3, name: NAMES[ID.BLAZE_SWEEP.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.T1_3}.webp`,
        slot: 1, index: 3,
        overrides: { attackId: 'NON_DIRECTIONAL' },
        effects: [{
          type: 'DMG_INC', value: [0.15],
          target: { skillIds: [ID.BLAZE_SWEEP.BODY] }
        }]
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.BLAZE_SWEEP.T2_1, name: NAMES[ID.BLAZE_SWEEP.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.T2_1}.webp`,
        slot: 2, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.96],
          target: { skillIds: [ID.BLAZE_SWEEP.BODY] }
        }]
      },
      {
        id: ID.BLAZE_SWEEP.T2_2, name: NAMES[ID.BLAZE_SWEEP.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.7],
          target: { skillIds: [ID.BLAZE_SWEEP.BODY] }
        }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.BLAZE_SWEEP.T3_1, name: NAMES[ID.BLAZE_SWEEP.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.T3_1}.webp`,
        slot: 3, index: 1,
        link: { slot: 2, index: 1 },
        effects: [{
          type: 'DMG_INC', value: [1.8],
          target: { skillIds: [ID.BLAZE_SWEEP.BODY] }
        }]
      },
      {
        id: ID.BLAZE_SWEEP.T3_2, name: NAMES[ID.BLAZE_SWEEP.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.T3_2}.webp`,
        slot: 3, index: 2,
        link: { slot: 2, index: 2 },
        effects: [
          {
            type: 'DMG_INC', value: [0.6],
            target: { skillIds: [ID.BLAZE_SWEEP.BODY] }
          },
          {
            type: 'CDR_C', value: [6],
            target: { skillIds: [ID.BLAZE_SWEEP.BODY] }
          }
        ]
      }
    ]
  },
  { // ────── 블레이즈 플래시 ──────────────────────────────────
    id: ID.BLAZE_FLASH.BODY,
    name: NAMES[ID.BLAZE_FLASH.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.BODY}.webp`,
    category: [ 'GOD_FORM' ],
    typeId: 'COMBO',
    attackId: 'NON_DIRECTIONAL',
    resource: { typeId: 'QI_EMBERES', isStatic: true, value: 5 }, 
    destruction: 0,
    stagger: '중상',
    superArmorId: 'NONE',
    cooldown: 24,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [316, 560, 716, 841, 940, 1017, 1086, 1148, 1195, 1241, 1242, 1242, 1242, 1243],
        coefficients: [1.71, 3.04, 3.89, 4.57, 5.11, 5.53, 5.9, 6.24, 6.49, 6.74, 6.75, 6.75, 6.75, 6.76],
      },
      {
        name: '2타', isCombined: true, hits: 1,
        constants: [474, 841, 1074, 1261, 1409, 1526, 1628, 1721, 1791, 1861, 1862, 1863, 1863, 1863],
        coefficients: [2.58, 4.57, 5.84, 6.85, 7.66, 8.29, 8.85, 9.35, 9.73, 10.11, 10.12, 10.12, 10.12, 10.12],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.BLAZE_FLASH.T1_1, name: NAMES[ID.BLAZE_FLASH.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '최초 돌진 시전 속도 증가', value: 0.2 }]
      },
      {
        id: ID.BLAZE_FLASH.T1_2, name: NAMES[ID.BLAZE_FLASH.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.T1_2}.webp`,
        slot: 1, index: 2,
        memo: [{ type: '적중한 적 1명 당 쿨타임 감소(1명 당 0.5초)', value: 6 }]
      },
      {
        id: ID.BLAZE_FLASH.T1_3, name: NAMES[ID.BLAZE_FLASH.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.T1_3}.webp`,
        slot: 1, index: 3,
        overrides: { destruction: 1 },
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.BLAZE_FLASH.T2_1, name: NAMES[ID.BLAZE_FLASH.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.T2_1}.webp`,
        slot: 2, index: 1,
        effects: [{
          type: 'DMG_INC', value: [0.6],
          target: { skillIds: [ID.BLAZE_FLASH.BODY] }
        }]
      },
      {
        id: ID.BLAZE_FLASH.T2_2, name: NAMES[ID.BLAZE_FLASH.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [
          {
            type: 'DMG_INC', value: [0.4],
            target: { skillIds: [ID.BLAZE_FLASH.BODY] }
          },
          {
            type: 'GK_QI_DMG', value: [0.1],
            target: { skillIds: [ID.BLAZE_FLASH.BODY] }
          }
        ],
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.BLAZE_FLASH.T3_1, name: NAMES[ID.BLAZE_FLASH.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.T3_1}.webp`,
        slot: 3, index: 1,
        link: { slot: 2, index: 1 },
        effects: [{
          type: 'DMG_INC', value: [1.5],
          target: { skillIds: [ID.BLAZE_FLASH.BODY] }
        }]
      },
      {
        id: ID.BLAZE_FLASH.T3_2, name: NAMES[ID.BLAZE_FLASH.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.T3_2}.webp`,
        slot: 3, index: 2,
        link: { slot: 2, index: 2 },
        effects: [{
          type: 'DMG_INC', value: [0.8],
          target: { skillIds: [ID.BLAZE_FLASH.BODY] }
        }]
      }
    ]
  },
  { // ────── 렌딩 피니셔 ──────────────────────────────────
    id: ID.RENDING_FINISHER.BODY,
    name: NAMES[ID.RENDING_FINISHER.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.BODY}.webp`,
    category: [ 'ENLIGHTEN' ],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    resource: { typeId: 'QI_EMBERES', isStatic: true, value: 6 },
    destruction: 0,
    stagger: '중상',
    superArmorId: 'STIFF_IMMUNE',
    cooldown: 30,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [880, 1559, 1992, 2338, 2613, 2830, 3018, 3192, 3322, 3452, 3454, 3455, 3456, 3456],
        coefficients: [4.78, 8.47, 10.82, 12.71, 14.2, 15.38, 16.4, 17.35, 18.06, 18.76, 18.77, 18.78, 18.78, 18.78],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.RENDING_FINISHER.T1_1, name: NAMES[ID.RENDING_FINISHER.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '시전 속도 증가', value: 0.15 }]
      },
      {
        id: ID.RENDING_FINISHER.T1_2, name: NAMES[ID.RENDING_FINISHER.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.T1_2}.webp`,
        slot: 1, index: 2,
        memo: [{ type: '받는 피해 감소', value: 0.2 }]
      },
      {
        id: ID.RENDING_FINISHER.T1_3, name: NAMES[ID.RENDING_FINISHER.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.T1_3}.webp`,
        slot: 1, index: 3,
        overrides: { attackId: 'HEAD_ATK' },
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.RENDING_FINISHER.T2_1, name: NAMES[ID.RENDING_FINISHER.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.T2_1}.webp`,
        slot: 2, index: 1,
        overrides: { typeId: 'CHARGE', superArmorId: 'PUSH_IMMUNE' },
        effects: [{
          type: 'DMG_INC', value: [0.5],
          target: { skillIds: [ID.RENDING_FINISHER.BODY] }
        }]
      },
      {
        id: ID.RENDING_FINISHER.T2_2, name: NAMES[ID.RENDING_FINISHER.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.7],
          target: { skillIds: [ID.RENDING_FINISHER.BODY] }
        }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.RENDING_FINISHER.T3_1, name: NAMES[ID.RENDING_FINISHER.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.T3_1}.webp`,
        slot: 3, index: 1,
        link: { slot: 2, index: 1 },
        effects: [
          {
            type: 'DMG_INC', value: [0.5],
            target: { skillIds: [ID.RENDING_FINISHER.BODY] }
          },
          {
            type: 'GK_QI_DMG', value: [0.1],
            target: { skillIds: [ID.RENDING_FINISHER.BODY] }
          }
        ]
      },
      {
        id: ID.RENDING_FINISHER.T3_2, name: NAMES[ID.RENDING_FINISHER.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.T3_2}.webp`,
        slot: 3, index: 2,
        link: { slot: 2, index: 1 },
        effects: [{
          type: 'DMG_INC', value: [1.0],
          target: { skillIds: [ID.RENDING_FINISHER.BODY] }
        }]
      }
    ]
  },
  { // ────── 익스플로전 피니셔 ──────────────────────────────────
    id: ID.EXPLOSION_FINISHER.BODY,
    name: NAMES[ID.EXPLOSION_FINISHER.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.BODY}.webp`,
    category: [ 'GOD_FORM' ],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    resource: { typeId: 'QI_EMBERES', isStatic: true, value: 6 },
    destruction: 0,
    stagger: '상',
    superArmorId: 'NONE',
    cooldown: 52,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [1100, 1950, 2492, 2926, 3268, 3540, 3775, 3992, 4154, 4317, 4319, 4320, 4321, 4322],
        coefficients: [5.98, 10.59, 13.53, 15.88, 17.75, 19.22, 20.5, 21.68, 22.57, 23.45, 23.46, 23.47, 23.48, 23.48],
      }
    ],

    tripods: [
      // ── 1티어 ─────────────────────────────────────────────
      {
        id: ID.EXPLOSION_FINISHER.T1_1, name: NAMES[ID.EXPLOSION_FINISHER.T1_1],
        iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.T1_1}.webp`,
        slot: 1, index: 1,
        memo: [{ type: '시전 속도 증가', value: 0.1 }]
      },
      {
        id: ID.EXPLOSION_FINISHER.T1_2, name: NAMES[ID.EXPLOSION_FINISHER.T1_2],
        iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.T1_2}.webp`,
        slot: 1, index: 2,
        memo: [{ type: '받는 피해 감소', value: 0.2 }]
      },
      {
        id: ID.EXPLOSION_FINISHER.T1_3, name: NAMES[ID.EXPLOSION_FINISHER.T1_3],
        iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.T1_3}.webp`,
        slot: 1, index: 3,
        overrides: { stagger: '최상' },
      },
      // ── 2티어 ─────────────────────────────────────────────
      {
        id: ID.EXPLOSION_FINISHER.T2_1, name: NAMES[ID.EXPLOSION_FINISHER.T2_1],
        iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.T2_1}.webp`,
        slot: 2, index: 1,
        overrides: { typeId: 'CHARGE', superArmorId: 'PUSH_IMMUNE' },
        effects: [{
          type: 'DMG_INC', value: [0.7],
          target: { skillIds: [ID.EXPLOSION_FINISHER.BODY] }
        }]
      },
      {
        id: ID.EXPLOSION_FINISHER.T2_2, name: NAMES[ID.EXPLOSION_FINISHER.T2_2],
        iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.T2_2}.webp`,
        slot: 2, index: 2,
        effects: [{
          type: 'DMG_INC', value: [0.7],
          target: { skillIds: [ID.EXPLOSION_FINISHER.BODY] }
        }]
      },
      // ── 3티어 ─────────────────────────────────────────────
      {
        id: ID.EXPLOSION_FINISHER.T3_1, name: NAMES[ID.EXPLOSION_FINISHER.T3_1],
        iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.T3_1}.webp`,
        slot: 3, index: 1,
        link: { slot: 2, index: 1 },
        effects: [
          {
            type: 'DMG_INC', value: [0.75],
            target: { skillIds: [ID.EXPLOSION_FINISHER.BODY] }
          }
        ],
        addDamageSources: [
          {
            name: '화염지대', isCombined: false, hits: 1,
            constants: [217, 217, 217, 217, 217, 217, 217, 217, 217, 217, 217, 217, 217, 217],
            coefficients: [4.0, 7.08, 9.05, 10.62, 11.87, 12.85, 13.7, 14.48, 15.08, 15.68, 15.68, 15.69, 15.69, 15.69],
          }
        ]
      },
      {
        id: ID.EXPLOSION_FINISHER.T3_2, name: NAMES[ID.EXPLOSION_FINISHER.T3_2],
        iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.T3_2}.webp`,
        slot: 3, index: 2,
        link: { slot: 2, index: 1 },
        effects: [
          {
            type: 'DMG_INC', value: [0.5],
            target: { skillIds: [ID.EXPLOSION_FINISHER.BODY] }
          },
          {
            type: 'GK_QI_COST', value: [4],
            target: { skillIds: [ID.EXPLOSION_FINISHER.BODY] }
          }
        ]
      }
    ]
  },  

  // ── [초각성 스킬, category: 'HYPER_SKILL'] ────────────────────────────────── 
  { // ────── 소울 디바이드 ──────────────────────────────────
    id: ID.SOUL_DIVIDE.BODY,
    name: NAMES[ID.SOUL_DIVIDE.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.SOUL_DIVIDE.BODY}.webp`,
    category: ['BASIC', 'HYPER_SKILL'],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 1,
    stagger: '상',
    superArmorId: 'STIFF_IMMUNE',
    cooldown: 70,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [13807],
        coefficients: [75.04],
      },
      {
        name: '2타', isCombined: true, hits: 1,
        constants: [55232],
        coefficients: [300.17],
      }
    ]
  },
  { // ────── 딥 임팩트 ──────────────────────────────────
    id: ID.DEEP_IMPACT.BODY,
    name: NAMES[ID.DEEP_IMPACT.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.DEEP_IMPACT.BODY}.webp`,
    category: [ 'GOD_FORM', 'HYPER_SKILL' ],
    typeId: 'POINT',
    attackId: 'NON_DIRECTIONAL',
    resource: { typeId: 'QI_EMBERES', isStatic: true, value: 6 },
    destruction: 1,
    stagger: '최상',
    superArmorId: 'PUSH_IMMUNE',
    cooldown: 90,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [1341],
        coefficients: [7.29],
      },
      {
        name: '2타', isCombined: true, hits: 1,
        constants: [25445],
        coefficients: [138.35],
      }
    ]
  },

  // ── [각성기/초각성기, category: 'ULTIMATE'/'HYPER_ULTIMATE'] ────────────────────────────────── 
  { // ────── 가디언 백래시 ──────────────────────────────────
    id: ID.GUARDIAN_BACKLASH.BODY,
    name: NAMES[ID.GUARDIAN_BACKLASH.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.GUARDIAN_BACKLASH.BODY}.webp`,
    category: [ 'ULTIMATE' ],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 0,
    stagger: '최상',
    superArmorId: 'DEBUFF_IMMUNE',
    cooldown: 300,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [31370],
        coefficients: [170.49],
      },
      {
        name: '2타', isCombined: true, hits: 1,
        constants: [31354],
        coefficients: [170.4],
      }
    ]
  },
  { // ────── 브레스 오브 엠버레스 ────────────────────────────────── 
    id: ID.BREATH_OF_EMBERES.BODY,
    name: NAMES[ID.BREATH_OF_EMBERES.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.BREATH_OF_EMBERES.BODY}.webp`,
    category: [ 'HYPER_ULTIMATE' ],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 0,
    stagger: '최상',
    superArmorId: 'DEBUFF_IMMUNE',
    cooldown: 300,

    levels: [
      {
        name: '1타', isCombined: true, hits: 6,
        constants: [424617],
        coefficients: [2307.7],
      }
    ]
  },
  { // ────── 가디언즈 크래시 ──────────────────────────────────
    id: ID.GUARDIANS_CRASH.BODY,
    name: NAMES[ID.GUARDIANS_CRASH.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.GUARDIANS_CRASH.BODY}.webp`,
    category: ['ULTIMATE'],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 2,
    stagger: '최상',
    superArmorId: 'DEBUFF_IMMUNE',
    cooldown: 300,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [87303],
        coefficients: [474.47],
      }
    ]
  },
  { // ────── 어웨이큰 ──────────────────────────────────
    id: ID.AWAKEN.BODY,
    name: NAMES[ID.AWAKEN.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.AWAKEN.BODY}.webp`,
    category: ['HYPER_ULTIMATE'],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 2,
    stagger: '최상',
    superArmorId: 'DEBUFF_IMMUNE',
    cooldown: 300,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [2725180],
        coefficients: [14810.76],
      }
    ]
  },

  // ── [아덴 스킬, category: ''] ────────────────────────────────── 
  { // ────── 인페르노 버스트 ──────────────────────────────────
    id: ID.INFERNO_BURST.BODY,
    name: NAMES[ID.INFERNO_BURST.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.INFERNO_BURST.BODY}.webp`,
    category: ['GOD_FORM'],
    typeId: 'NORMAL',
    attackId: 'NON_DIRECTIONAL',
    destruction: 0,
    stagger: '상',
    superArmorId: 'PUSH_IMMUNE',
    cooldown: 90,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [13260],
        coefficients: [72.1],
      }
    ]
  },
  { // ────── 가디언 피어 ──────────────────────────────────
    id: ID.GUARDIAN_FEAR.BODY,
    name: NAMES[ID.GUARDIAN_FEAR.BODY],
    iconPath: `/images/skills/guardian-knight/${ID.GUARDIAN_FEAR.BODY}.webp`,
    category: ['BASIC'],
    typeId: 'NORMAL',
    attackId: 'HEAD_ATK',
    destruction: 0,
    stagger: '',
    superArmorId: 'PUSH_IMMUNE',
    cooldown: 1,

    levels: [
      {
        name: '1타', isCombined: true, hits: 1,
        constants: [5939],
        coefficients: [32.27],
      }
    ]
  },
];