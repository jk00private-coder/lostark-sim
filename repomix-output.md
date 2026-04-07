# Directory Structure
```
src/data/arc-grid/common.ts
src/data/arc-grid/guardian-knight.ts
src/data/arc-passive/elighten/guardian-knight.ts
src/data/arc-passive/evolution.ts
src/data/arc-passive/index.ts
src/data/arc-passive/leap/common.ts
src/data/arc-passive/leap/guardian-knight.ts
src/data/avatars.ts
src/data/cards.ts
src/data/engravings.ts
src/data/equipment/accessory.ts
src/data/equipment/bracelet.ts
src/data/equipment/combat-equip.ts
src/data/gems.ts
src/data/skills/guardian-knight-skills.ts
src/types/character-types.ts
src/types/raw-types.ts
src/utils/data-normalizer.ts
```

# Files

## File: src/data/arc-grid/common.ts
```typescript
  1: // @/data/arc-grid/guardain-knight.ts
  2: 
  3: import { ArkGridCoreData, GET_GRID_ICON } from '@/types/ark-grid';
  4: import { ID_AA, ID_BB } from '@/constants/id-config';
  5: 
  6: // 공통 Base ID (80 10 0 0 00)
  7: const BASE = (ID_AA.ARK_GRID * 1000000) + (ID_BB.COMMON * 10000);
  8: 
  9: // BB: 직업(질서 코어), 공통(혼돈 코어)
 10: // C: 1(해, SN), 2(달, MN), 3(별, ST)
 11: // D: 없음
 12: // EE: 인게임 순서
 13: export const ID = {
 14:   // [🌞 해 코어]
 15:   SN_01: BASE + 1001, SN_02: BASE + 1002, SN_03: BASE + 1003,
 16:   SN_04: BASE + 1004, SN_05: BASE + 1005, SN_06: BASE + 1006,
 17: 
 18:   // [🌙 달 코어]
 19:   MN_01: BASE + 2001, MN_02: BASE + 2002, MN_03: BASE + 2003,
 20:   MN_04: BASE + 2004, MN_05: BASE + 2005, MN_06: BASE + 2006,
 21: 
 22:   // [⭐ 별 코어]
 23:   ST_01: BASE + 3001, ST_02: BASE + 3002, ST_03: BASE + 3003,
 24:   ST_04: BASE + 3004, ST_05: BASE + 3005, ST_06: BASE + 3006,
 25: };
 26: 
 27: export const NAMES = {
 28:   // [🌞 해 코어]
 29:   [ID.SN_01]: '현란한 공격', [ID.SN_02]: '안정적인 공격', [ID.SN_03]: '재빠른 공격',
 30:   [ID.SN_04]: '신념의 강화', [ID.SN_05]: '흐르는 마나', [ID.SN_06]: '불굴의 강화',
 31: 
 32:   // [🌙 달 코어]
 33:   [ID.MN_01]: '불타는 일격', [ID.MN_02]: '흡수의 일격', [ID.MN_03]: '부수는 일격',
 34:   [ID.MN_04]: '낙인의 흔적', [ID.MN_05]: '강철의 흔적', [ID.MN_06]: '치명적인 흔적',
 35: 
 36:   // [⭐ 별 코어]
 37:   [ID.ST_01]: '공격', [ID.ST_02]: '무기', [ID.ST_03]: '구원',
 38:   [ID.ST_04]: '생명', [ID.ST_05]: '속도', [ID.ST_06]: '방어',
 39: } as const;
 40: 
 41: 
 42: 
 43: export const ARKGRID_COMMON_DATA: ArkGridCoreData[] = [
 44:   // ── [🌞 혼돈의 해 코어] ──────────────────────────────────
 45:   { // <해1> 현란한 공격
 46:     id: ID.SN_01, name: NAMES[ID.SN_01], iconPath: GET_GRID_ICON('C_SN'),
 47:     thresholds: [
 48:       { point: 10, effects: [{ type: 'CRIT_DMG_INC', value: [0.0055] }] },
 49:       { point: 14, effects: [{ type: 'DMG_INC', value: [0.005] }] },
 50:       { point: 17, effects: [
 51:           { type: 'DMG_INC', multiValues: { relic:[0.01], ancient:[0.015] } },
 52:           { type: 'CRIT_DMG_INC', multiValues: { relic:[0.0055], ancient:[0.011] } }
 53:       ]},
 54:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
 55:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
 56:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.0016] }] }
 57:     ]
 58:   },
 59:   { // <해2> 안정적인 공격
 60:     id: ID.SN_02, name: NAMES[ID.SN_02], iconPath: GET_GRID_ICON('C_SN'),
 61:     thresholds: [
 62:       { point: 10 }, // 받는 피해가 0.5% 감소한다.
 63:       { point: 14, effects: [{ type: 'ADD_DMG', value: [0.007] }] },
 64:       { point: 17, effects: [{ type: 'ADD_DMG', multiValues: { relic: [0.014], ancient: [0.028] } }] },
 65:       { point: 18, effects: [{ type: 'ADD_DMG', value: [0.0023] }] },
 66:       { point: 19, effects: [{ type: 'ADD_DMG', value: [0.0023] }] },
 67:       { point: 20, effects: [{ type: 'ADD_DMG', value: [0.0023] }] }
 68:     ]
 69:   },
 70:   { // <해3> 재빠른 공격
 71:     id: ID.SN_03, name: NAMES[ID.SN_03], iconPath: GET_GRID_ICON('C_SN'),
 72:     thresholds: [
 73:       { point: 10, effects: [{ type: 'SPEED_ATK', value: [0.01] }] },
 74:       { point: 14, effects: [{ type: 'CRIT_DMG', value: [0.014] }] },
 75:       { point: 17, effects: [
 76:           { type: 'SPEED_ATK', multiValues: { relic: [0.02], ancient: [0.03] } },
 77:           { type: 'CRIT_DMG', multiValues: { relic: [0.028], ancient: [0.056] } }
 78:       ]},
 79:       { point: 18, effects: [{ type: 'CRIT_DMG', value: [0.0045] }] },
 80:       { point: 19, effects: [{ type: 'CRIT_DMG', value: [0.0045] }] },
 81:       { point: 20, effects: [{ type: 'CRIT_DMG', value: [0.0045] }] }
 82:     ]
 83:   },
 84:   { // <해4> 신념의 강화
 85:     id: ID.SN_04, name: NAMES[ID.SN_04], iconPath: GET_GRID_ICON('C_SN'),
 86:     thresholds: [
 87:       { point: 10 },
 88:       { point: 14 },
 89:       { point: 17 },
 90:       { point: 18 },
 91:       { point: 19 },
 92:       { point: 20 }
 93:     ]
 94:   },
 95:   { // <해5> 흐르는 마나
 96:     id: ID.SN_05, name: NAMES[ID.SN_05], iconPath: GET_GRID_ICON('C_SN'),
 97:     thresholds: [
 98:       { point: 10 },
 99:       { point: 14, effects: [{ type: 'CDR_P', value: [0.004] }] },
100:       { point: 17, effects: [{ type: 'CDR_P', multiValues: { relic: [0.008], ancient: [0.016] } }] },
101:       { point: 18, effects: [{ type: 'CDR_P', value: [0.0013] }] },
102:       { point: 19, effects: [{ type: 'CDR_P', value: [0.0013] }] },
103:       { point: 20, effects: [{ type: 'CDR_P', value: [0.0013] }] }
104:     ]
105:   },
106:   { // <해6> 불굴의 강화
107:     id: ID.SN_06, name: NAMES[ID.SN_06], iconPath: GET_GRID_ICON('C_SN'),
108:     thresholds: [
109:       { point: 10 },
110:       { point: 14 },
111:       { point: 17 },
112:       { point: 18 },
113:       { point: 19 },
114:       { point: 20 }
115:     ]
116:   },
117: 
118:   // ── [🌙 혼돈의 달 코어] ──────────────────────────────────
119:   { // <달1> 불타는 일격
120:     id: ID.MN_01, name: NAMES[ID.MN_01], iconPath: GET_GRID_ICON('C_MN'),
121:     thresholds: [
122:       { point: 10}, //todo: 화상 도트 대미지 유틸
123:       { point: 14, effects: [{ type: 'DMG_INC', value: [0.005] }] },
124:       { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.01], ancient: [0.02] } }] },
125:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
126:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
127:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.0016] }] }
128:     ]
129:   },
130:   { // <달2> 흡수의 일격
131:     id: ID.MN_02, name: NAMES[ID.MN_02], iconPath: GET_GRID_ICON('C_MN'),
132:     thresholds: [
133:       { point: 10 }, // 생명력 회복 유틸
134:       { point: 14, effects: [{ type: 'DMG_INC', value: [0.005] }] },
135:       { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.01], ancient: [0.02] } }] },
136:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
137:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
138:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.0016] }] }
139:     ]
140:   },
141:   { // <달3> 부수는 일격
142:     id: ID.MN_03, name: NAMES[ID.MN_03], iconPath: GET_GRID_ICON('C_MN'),
143:     thresholds: [
144:       { point: 10 }, // 부위 파괴 유틸
145:       { point: 14, effects: [{ type: 'CRIT_CHANCE', value: [0.0065] }] },
146:       { point: 17, effects: [{ type: 'CRIT_CHANCE', multiValues: { relic: [0.013], ancient: [0.026] } }] },
147:       { point: 18, effects: [{ type: 'CRIT_CHANCE', value: [0.0021] }] },
148:       { point: 19, effects: [{ type: 'CRIT_CHANCE', value: [0.0021] }] },
149:       { point: 20, effects: [{ type: 'CRIT_CHANCE', value: [0.0021] }] }
150:     ]
151:   },
152:   { // <달4> 낙인의 흔적
153:     id: ID.MN_04, name: NAMES[ID.MN_04], iconPath: GET_GRID_ICON('C_MN'),
154:     thresholds: [
155:       { point: 10 },
156:       { point: 14 },
157:       { point: 17 },
158:       { point: 18 },
159:       { point: 19 },
160:       { point: 20 }
161:     ]
162:   },
163:   { // <달5> 강철의 흔적, todo: 방어력 감소 10p 17p 합인지 곱인지 검토
164:     id: ID.MN_05, name: NAMES[ID.MN_05], iconPath: GET_GRID_ICON('C_MN'),
165:     thresholds: [
166:       { point: 10, effects:[{ type: 'DEF_PENETRATION', value: [0.002] }] },
167:       { point: 14 },
168:       { point: 17, effects: [{ type: 'DEF_PENETRATION', multiValues: { relic: [0.004], ancient: [0.008] } }] },
169:       { point: 18 },
170:       { point: 19 },
171:       { point: 20 }
172:     ]
173:   },
174:   { // <달6> 치명적인 흔적
175:     id: ID.MN_06, name: NAMES[ID.MN_06], iconPath: GET_GRID_ICON('C_MN'),
176:     thresholds: [
177:       { point: 10, effects: [{ type: 'CRIT_DMG', value: [0.003] }] },
178:       { point: 14, },
179:       { point: 17, effects: [{ type: 'CRIT_DMG', multiValues: { relic: [0.006], ancient: [0.012] } }] },
180:       { point: 18 },
181:       { point: 19 },
182:       { point: 20 }
183:     ]
184:   },
185: 
186:   // ── [⭐ 혼돈의 별 코어] ──────────────────────────────────
187:   { // <별1> 공격
188:     id: ID.ST_01, name: NAMES[ID.ST_01], iconPath: GET_GRID_ICON('C_ST'),
189:     thresholds: [
190:       { point: 10, effects: [{ type: 'ATK_C', value: [900] }] },
191:       { point: 14, effects: [{ type: 'ATK_P', value: [0.0055] }] },
192:       { point: 17, effects: [
193:           { type: 'ATK_P', multiValues: { relic: [0.011], ancient: [0.0165] } },
194:           { type: 'ATK_C', multiValues: { relic: [1800], ancient: [2700] } }
195:       ]},
196:       { point: 18, effects: [{ type: 'ATK_P', value: [0.0016] }] },
197:       { point: 19, effects: [{ type: 'ATK_P', value: [0.0016] }] },
198:       { point: 20, effects: [{ type: 'ATK_P', value: [0.0016] }] }
199:     ]
200:   },
201:   { // <별2> 무기
202:     id: ID.ST_02, name: NAMES[ID.ST_02], iconPath: GET_GRID_ICON('C_ST'),
203:     thresholds: [
204:       { point: 10, effects: [{ type: 'WEAPON_ATK_C', value: [1300] }] },
205:       { point: 14, effects: [{ type: 'WEAPON_ATK_P', value: [0.0075] }] },
206:       { point: 17, effects: [
207:           { type: 'WEAPON_ATK_P', multiValues: { relic: [0.015], ancient: [0.0225] } },
208:           { type: 'WEAPON_ATK_C', multiValues: { relic: [2600], ancient: [3900] } }
209:       ]},
210:       { point: 18, effects: [{ type: 'WEAPON_ATK_P', value: [0.0023] }] },
211:       { point: 19, effects: [{ type: 'WEAPON_ATK_P', value: [0.0023] }] },
212:       { point: 20, effects: [{ type: 'WEAPON_ATK_P', value: [0.0023] }] }
213:     ]
214:   },
215:   { // <별3> 구원
216:     id: ID.ST_03, name: NAMES[ID.ST_03], iconPath: GET_GRID_ICON('C_ST'),
217:     thresholds: [
218:       { point: 10 },
219:       { point: 14 },
220:       { point: 17 },
221:       { point: 18 },
222:       { point: 19 },
223:       { point: 20 }
224:     ]
225:   },
226:   { // <별4> 생명
227:     id: ID.ST_04, name: NAMES[ID.ST_04], iconPath: GET_GRID_ICON('C_ST'),
228:     thresholds: [
229:       { point: 10 },
230:       { point: 14 },
231:       { point: 17 },
232:       { point: 18 },
233:       { point: 19 },
234:       { point: 20 }
235:     ]
236:   },
237:   { // <별5> 속도
238:     id: ID.ST_05, name: NAMES[ID.ST_05], iconPath: GET_GRID_ICON('C_ST'),
239:     thresholds: [
240:       { point: 10, effects: [{ type: 'SPEED_ATK', value: [0.009] }] },
241:       { point: 14, effects: [{ type: 'SPEED_MOV', value: [0.009] }] },
242:       { point: 17, effects: [
243:           { type: 'SPEED_ATK', multiValues: { relic: [0.018], ancient: [0.027] } },
244:           { type: 'SPEED_MOV', multiValues: { relic: [0.018], ancient: [0.027] } }
245:       ]},
246:       { point: 18, effects: [{ type: 'SPEED_ATK', value: [0.003] }, { type: 'SPEED_MOV', value: [0.003] }] },
247:       { point: 19, effects: [{ type: 'SPEED_ATK', value: [0.003] }, { type: 'SPEED_MOV', value: [0.003] }] },
248:       { point: 20, effects: [{ type: 'SPEED_ATK', value: [0.003] }, { type: 'SPEED_MOV', value: [0.003] }] }
249:     ]
250:   },
251:   { // <별6> 방어
252:     id: ID.ST_06, name: NAMES[ID.ST_06], iconPath: GET_GRID_ICON('C_ST'),
253:     thresholds: [
254:       { point: 10 },
255:       { point: 14 },
256:       { point: 17 },
257:       { point: 18 },
258:       { point: 19 },
259:       { point: 20 }
260:     ]
261:   }
262: ];
```

## File: src/data/avatars.ts
```typescript
 1: // @/data/cards.ts
 2: 
 3: import { BaseSimData } from '@/types/sim-types';
 4: import { ID_AA, ID_BB } from '@/constants/id-config';
 5: 
 6: // 공통 Base ID (50 10 0 0 00)
 7: const BASE = (ID_AA.AVATAR * 1000000) + (ID_BB.COMMON * 10000);
 8: 
 9: export const ID = {
10:     AVATAR: BASE,
11: }
12: 
13: export const NAMES = {
14:     [ID.AVATAR]: '아바타',
15: }
16: 
17: /**
18:  * todo: 아바타는 등급이 영웅, 전설임, 현재 multiValues는 유물, 고대, 세르카로 장비기준인데
19:  * 이 장비 등급기준을 커스텀할수 있게끔 바꿔야하나 고민!, 아바타는 상하의 세트가 있는데 세트는 상하의 증가폭 합이 증가함.
20:  */
21: export const AVATAR_DATA: BaseSimData[] = [
22:   {
23:     id: ID.AVATAR,
24:     name: NAMES[ID.AVATAR],
25:     effects: [
26:       { type: "MAIN_STAT_P", multiValues: {relic:[0.01], ancient:[0.02]} }
27:     ]
28:   }
29: ]
```

## File: src/data/cards.ts
```typescript
 1: // @/data/cards.ts
 2: 
 3: import { BaseSimData } from '@/types/sim-types';
 4: import { ID_AA, ID_BB } from '@/constants/id-config';
 5: 
 6: // 공통 Base ID (50 10 0 0 00)
 7: const BASE = (ID_AA.CARD * 1000000) + (ID_BB.COMMON * 10000);
 8: 
 9: export const ID = {
10:     CARDS: BASE,
11: }
12: 
13: export const NAMES = {
14:     [ID.CARDS]: '카드',
15: }
16: 
17: // todo: 카드도 어떻게할지 고민, 그냥 18각은 8퍼, 24각 12퍼 30각 15퍼 이렇게만 표현해도 됨.
18: export const CARD_DATA: BaseSimData[] = [
19:   {
20:     id: ID.CARDS,
21:     name: NAMES[ID.CARDS],
22:     effects: [
23:       { type: "DMG_INC", value: [0.08, 0.12, 0.15] }
24:     ]
25:   }
26: ]
```

## File: src/data/equipment/bracelet.ts
```typescript
  1: // @/data/equipment/bracelet.ts
  2: 
  3: import { BaseSimData } from '@/types/sim-types';
  4: import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';
  5: 
  6: // 공통 Base ID (10 10 4 0 00)
  7: const BASE = (ID_AA.EQUIPMENT * 1000000) + (ID_BB.COMMON * 10000) + (ID_C.EQ_BRACELET * 1000);
  8: 
  9: // D: 1(4티어, F)
 10: // EE: 01~09(기본 효과, F1), 11~19(전투 특성, F2), 21~(특수 효과, F3)
 11: export const ID = {
 12:   // ── 등급: 유물 ──────────────────────────────────
 13:   F1_1: BASE + 101, F1_2: BASE + 102,
 14:     
 15:   F2_1: BASE + 111, F2_2: BASE + 112, F2_3: BASE + 113,
 16:   F2_4: BASE + 114, F2_5: BASE + 115, F2_6: BASE + 116,
 17: 
 18:   F3_1 : BASE + 121, F3_11: BASE + 131, F3_12: BASE + 132,
 19:   F3_13: BASE + 133, F3_14: BASE + 134, F3_15: BASE + 135,
 20:   F3_16: BASE + 136, F3_17: BASE + 137, F3_19: BASE + 139,
 21:   F3_20: BASE + 140, F3_21: BASE + 141, F3_22: BASE + 142,
 22:   F3_23: BASE + 143, F3_24: BASE + 144, F3_25: BASE + 145,
 23:   F3_26: BASE + 146, F3_27: BASE + 147, F3_31: BASE + 151,
 24:   F3_32: BASE + 152, F3_33: BASE + 153,
 25: };
 26: 
 27: export const NAMES = {
 28:   [ID.F1_1]: '주스탯', [ID.F1_2]: '체력',
 29: 
 30:   [ID.F2_1]: '치명', [ID.F2_2]: '특화', [ID.F2_3]: '제압',
 31:   [ID.F2_4]: '신속', [ID.F2_5]: '인내', [ID.F2_6]: '숙련',
 32: 
 33:   [ID.F3_1]: '공이속', [ID.F3_11]: '치적 + 치피시 피증', [ID.F3_12]: '치피 + 치피시 피증',
 34:   [ID.F3_13]: '피증 + 무력시 피증', [ID.F3_14]: '추피 + 악마대악마 피증', [ID.F3_15]: '피증 + 쿨증',
 35:   [ID.F3_16]: '방감 + 아공강', [ID.F3_17]: '치적 + 아공강', [ID.F3_19]: '치피 + 아공강',
 36:   [ID.F3_20]: '무공 + 공이속', [ID.F3_21]: '무공 + 생50무공', [ID.F3_22]: '무공 + 적중시 무공',
 37:   [ID.F3_23]: '피해 증가', [ID.F3_24]: '추가 피해', [ID.F3_25]: '백 피증',
 38:   [ID.F3_26]: '헤드 피증', [ID.F3_27]: '타대 피증', [ID.F3_31]: '치적',
 39:   [ID.F3_32]: '치피', [ID.F3_33]: '무공',
 40: } as const;
 41: 
 42: export const BRACELET_DATA: BaseSimData[] = [
 43:   // ── 주스탯 (Main Stat) ──────────────────────────────────
 44:   {
 45:     id: ID.F1_1,
 46:     name: NAMES[ID.F1_1],
 47:     effects: [
 48:       {
 49:         type: "MAIN_STAT_C",
 50:         multiGrades: {
 51:           relic: { low: [6400, 8320], mid: [8321, 10240], high: [10241, 12800] },
 52:           ancient: { low: [9600, 11520], mid: [11521, 13440], high: [13441, 16000] }
 53:         }
 54:       }
 55:     ]
 56:   },
 57:   // ── 체력 (HP) ──────────────────────────────────
 58:   {
 59:     id: ID.F1_2, // 유물(R1_2)과 고대(A1_2)를 이 ID로 통합
 60:     name: NAMES[ID.F1_2],
 61:     effects: [
 62:       {
 63:         type: "STAT_HP_C",
 64:         multiGrades: {
 65:           relic: { low: [3000, 3800], mid: [3801, 4400], high: [4401, 5000] },
 66:           ancient: { low: [4000, 4800], mid: [4801, 5400], high: [5401, 6000] }
 67:         }
 68:       }
 69:     ]
 70:   },
 71: 
 72:   // ── 치명 (Critical) ──────────────────────────────────
 73:   {
 74:     id: ID.F2_1,
 75:     name: NAMES[ID.F2_1],
 76:     effects: [
 77:       {
 78:         type: "STAT_CRIT",
 79:         multiGrades: {
 80:           relic: { low: [41, 64], mid: [65, 82], high: [83, 100] },
 81:           ancient: { low: [61, 84], mid: [85, 102], high: [103, 120] }
 82:         }
 83:       }
 84:     ]
 85:   },
 86:   // ── 특화 (Specialization) ──────────────────────────────────
 87:   {
 88:     id: ID.F2_2,
 89:     name: NAMES[ID.F2_2],
 90:     effects: [
 91:       {
 92:         type: "STAT_SPEC",
 93:         multiGrades: {
 94:           relic: { low: [41, 64], mid: [65, 82], high: [83, 100] },
 95:           ancient: { low: [61, 84], mid: [85, 102], high: [103, 120] }
 96:         }
 97:       }
 98:     ]
 99:   },
100:   // ── 제압 (Domination) ──────────────────────────────────
101:   {
102:     id: ID.F2_3,
103:     name: NAMES[ID.F2_3],
104:     effects: [
105:       {
106:         type: "STAT_DOM",
107:         multiGrades: {
108:           relic: { low: [41, 64], mid: [65, 82], high: [83, 100] },
109:           ancient: { low: [61, 84], mid: [85, 102], high: [103, 120] }
110:         }
111:       }
112:     ]
113:   },
114:   // ── 신속 (Swiftness) ──────────────────────────────────
115:   {
116:     id: ID.F2_4,
117:     name: NAMES[ID.F2_4],
118:     effects: [
119:       {
120:         type: "STAT_SWIFT",
121:         multiGrades: {
122:           relic: { low: [41, 64], mid: [65, 82], high: [83, 100] },
123:           ancient: { low: [61, 84], mid: [85, 102], high: [103, 120] }
124:         }
125:       }
126:     ]
127:   },
128:   // ── 인내 (Endurance) ──────────────────────────────────
129:   {
130:     id: ID.F2_5,
131:     name: NAMES[ID.F2_5],
132:     effects: [
133:       {
134:         type: "STAT_END",
135:         multiGrades: {
136:           relic: { low: [41, 64], mid: [65, 82], high: [83, 100] },
137:           ancient: { low: [61, 84], mid: [85, 102], high: [103, 120] }
138:         }
139:       }
140:     ]
141:   },
142:   // ── 숙련 (Expertise) ──────────────────────────────────
143:   {
144:     id: ID.F2_6,
145:     name: NAMES[ID.F2_6],
146:     effects: [
147:       {
148:         type: "STAT_EXP",
149:         multiGrades: {
150:           relic: { low: [41, 64], mid: [65, 82], high: [83, 100] },
151:           ancient: { low: [61, 84], mid: [85, 102], high: [103, 120] }
152:         }
153:       }
154:     ]
155:   },
156: 
157:   // ── 공이속 ──────────────────────────────────
158:   {
159:     id: ID.F3_1,
160:     name: NAMES[ID.F3_1],
161:     effects: [
162:       {
163:         type: "SPEED_ATK",
164:         multiGrades: {
165:           relic: { low: [0.03, 0.03], mid: [0.04, 0.04], high: [0.05, 0.05] },
166:           ancient: { low: [0.04, 0.04], mid: [0.05, 0.05], high: [0.06, 0.06] }
167:         }
168:       },
169:       {
170:         type: "SPEED_MOV",
171:         multiGrades: {
172:           relic: { low: [0.03, 0.03], mid: [0.04, 0.04], high: [0.05, 0.05] },
173:           ancient: { low: [0.04, 0.04], mid: [0.05, 0.05], high: [0.06, 0.06] }
174:         }
175:       }
176:     ]
177:   },
178:   // ── 치명타 적중률 + 치명타 시 피해 증가 ────────────────────────
179:   {
180:     id: ID.F3_11,
181:     name: NAMES[ID.F3_11],
182:     effects: [
183:       {
184:         type: 'CRIT_CHANCE',
185:         multiGrades: {
186:           relic: { low: [0.026, 0.026], mid: [0.034, 0.034], high: [0.042, 0.042] },
187:           ancient: { low: [0.034, 0.034], mid: [0.042, 0.042], high: [0.05, 0.05] }
188:         }
189:       },
190:       {
191:         type: 'CRIT_DMG_INC',
192:         value: [0.015]
193:       }
194:     ]
195:   },
196:   // ── 치명타 피해 + 치명타 시 피해 증가 ──────────────────────────
197:   {
198:     id: ID.F3_12,
199:     name: NAMES[ID.F3_12],
200:     effects: [
201:       {
202:         type: 'CRIT_DMG',
203:         multiGrades: {
204:           relic: { low: [0.052, 0.052], mid: [0.068, 0.068], high: [0.084, 0.084] },
205:           ancient: { low: [0.068, 0.068], mid: [0.084, 0.084], high: [0.1, 0.1] }
206:         }
207:       },
208:       {
209:         type: 'CRIT_DMG_INC',
210:         value: [0.015]
211:       }
212:     ]
213:   },
214:   // ── 피해 증가 + 무력화시 피해 증가 ────────────────────────────
215:   {
216:     id: ID.F3_13,
217:     name: NAMES[ID.F3_13],
218:     effects: [
219:       {
220:         type: 'DMG_INC',
221:         multiGrades: {
222:           relic: { low: [0.015, 0.015], mid: [0.02, 0.02], high: [0.025, 0.025] },
223:           ancient: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] }
224:         }
225:       }
226:     ]
227:   },
228:   // ── 추가 피해 + 악마대악마 피해 증가 ──────────────────────────────────
229:   {
230:     id: ID.F3_14,
231:     name: NAMES[ID.F3_14],
232:     effects: [
233:       {
234:         type: 'ADD_DMG',
235:         multiGrades: {
236:           relic: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] },
237:           ancient: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] }
238:         }
239:       }
240:     ]
241:   },
242:   // ── 피해 증가 + 쿨타임 증가 ──────────────────────────────────
243:   {
244:     id: ID.F3_15,
245:     name: NAMES[ID.F3_15],
246:     effects: [
247:       {
248:         type: 'DMG_INC',
249:         multiGrades: {
250:           relic: { low: [0.04, 0.04], mid: [0.045, 0.045], high: [0.05, 0.05] },
251:           ancient: { low: [0.045, 0.045], mid: [0.05, 0.05], high: [0.055, 0.055] }
252:         }
253:       },
254:       {
255:         type: 'CDR_C',
256:         value: [-0.2]
257:       }
258:     ]
259:   },
260:   // ── 방어력 감소 + 아군 공격력 강화 ──────────────────────────────────
261:   {
262:     id: ID.F3_16,
263:     name: NAMES[ID.F3_16],
264:     effects: [
265:       {
266:         type: 'DEF_PENETRATION',
267:         multiGrades: {
268:           relic: { low: [0.015, 0.015], mid: [0.018, 0.018], high: [0.021, 0.021] },
269:           ancient: { low: [0.018, 0.018], mid: [0.021, 0.021], high: [0.025, 0.025] }
270:         }
271:       }
272:     ]
273:   },
274:   // ── 치명타 저항 + 아군 공격력 강화 ──────────────────────────────────
275:   {
276:     id: ID.F3_17,
277:     name: NAMES[ID.F3_17],
278:     effects: [
279:       {
280:         type: 'DEF_PENETRATION',
281:         multiGrades: {
282:           relic: { low: [0.015, 0.015], mid: [0.018, 0.018], high: [0.021, 0.021] },
283:           ancient: { low: [0.018, 0.018], mid: [0.021, 0.021], high: [0.025, 0.025] }
284:         }
285:       }
286:     ]
287:   },
288:   // ── 치명타 피해 저항 + 아군 공격력 강화 ──────────────────────────────────
289:   {
290:     id: ID.F3_19,
291:     name: NAMES[ID.F3_19],
292:     effects: [
293:       {
294:         type: 'CRIT_DMG',
295:         multiGrades: {
296:           relic: { low: [0.03, 0.03], mid: [0.036, 0.036], high: [0.042, 0.042] },
297:           ancient: { low: [0.036, 0.036], mid: [0.042, 0.042], high: [0.048, 0.048] }
298:         }
299:       }
300:     ]
301:   },
302:   // ── 무기 공격력 증가 + 공이속 증가 ──────────────────────────────────
303:   {
304:     id: ID.F3_20,
305:     name: NAMES[ID.F3_20],
306:     effects: [
307:       {
308:         type: 'WEAPON_ATK_C',
309:         multiGrades: {
310:           relic: { low: [6000, 6000], mid: [6960, 6960], high: [7920, 7920] },
311:           ancient: { low: [6960, 6960], mid: [7920, 7920], high: [8880, 8880] }
312:         }
313:       },
314:       {
315:         type: 'SPEED_ATK',
316:         value: [0.06]
317:       },
318:       {
319:         type: 'SPEED_MOV',
320:         value: [0.06]
321:       }
322:     ]
323:   },
324:   // ── 무기 공격력 증가 + 생명력 50퍼 이상 무기 공격력 증가 ──────────────────────────────────
325:   {
326:     id: ID.F3_21,
327:     name: NAMES[ID.F3_21],
328:     effects: [
329:       {
330:         type: 'WEAPON_ATK_C',
331:         multiGrades: {
332:           relic: { low: [8100, 8100], mid: [9200, 9200], high: [10300, 10300] },
333:           ancient: { low: [9200, 9200], mid: [10300, 10300], high: [11400, 11400] }
334:         }
335:       }
336:     ]
337:   },
338:   // ── 무기 공격력 증가 + 적중시 무기 공격력 증가 ──────────────────────────────────
339:   {
340:     id: ID.F3_22,
341:     name: NAMES[ID.F3_22],
342:     effects: [
343:       {
344:         type: 'WEAPON_ATK_C',
345:         multiGrades: {
346:           relic: { low: [9600, 9600], mid: [10800, 10800], high: [12000, 12000] },
347:           ancient: { low: [10800, 10800], mid: [12000, 12000], high: [13200, 13200] }
348:         }
349:       }
350:     ]
351:   },
352:   // ── 피해 증가 ──────────────────────────────────
353:   {
354:     id: ID.F3_23,
355:     name: NAMES[ID.F3_23],
356:     effects: [
357:       {
358:         type: 'DMG_INC',
359:         multiGrades: {
360:           relic: { low: [0.015, 0.015], mid: [0.02, 0.02], high: [0.025, 0.025] },
361:           ancient: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] }
362:         }
363:       }
364:     ]
365:   },
366:   // ── 추가 피해 ──────────────────────────────────
367:   {
368:     id: ID.F3_24,
369:     name: NAMES[ID.F3_24],
370:     effects: [
371:       {
372:         type: 'ADD_DMG',
373:         multiGrades: {
374:           relic: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] },
375:           ancient: { low: [0.03, 0.03], mid: [0.035, 0.035], high: [0.04, 0.04] }
376:         }
377:       }
378:     ]
379:   },
380:   // ── 백어택 시 피해 증가 ──────────────────────────────────
381:   {
382:     id: ID.F3_25,
383:     name: NAMES[ID.F3_25],
384:     effects: [
385:       {
386:         type: 'DMG_INC', target: { attackType: ['BACK_ATK'] },
387:         multiGrades: {
388:           relic: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] },
389:           ancient: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] }
390:         }
391:       }
392:     ]
393:   },
394:   // ── 헤드어택 시 피해 증가 ──────────────────────────────────
395:   {
396:     id: ID.F3_26,
397:     name: NAMES[ID.F3_26],
398:     effects: [
399:       {
400:         type: 'DMG_INC', target: { attackType: ['HEAD_ATK'] },
401:         multiGrades: {
402:           relic: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] },
403:           ancient: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] }
404:         }
405:       }
406:     ]
407:   },
408:   // ── 비방향성 시  피해 증가 ──────────────────────────────────
409:   {
410:     id: ID.F3_27,
411:     name: NAMES[ID.F3_27],
412:     effects: [
413:       {
414:         type: 'DMG_INC', target: { attackType: ['NON_DIRECTIONAL'] },
415:         multiGrades: {
416:           relic: { low: [0.02, 0.02], mid: [0.025, 0.025], high: [0.03, 0.03] },
417:           ancient: { low: [0.025, 0.025], mid: [0.03, 0.03], high: [0.035, 0.035] }
418:         }
419:       }
420:     ]
421:   },
422:   // ── 치명타 적중률 ──────────────────────────────────
423:   {
424:     id: ID.F3_31,
425:     name: NAMES[ID.F3_31],
426:     effects: [
427:       {
428:         type: 'CRIT_CHANCE',
429:         multiGrades: {
430:           relic: { low: [0.026, 0.026], mid: [0.034, 0.034], high: [0.042, 0.042] },
431:           ancient: { low: [0.034, 0.034], mid: [0.042, 0.042], high: [0.05, 0.05] }
432:         }
433:       }
434:     ]
435:   },
436:   // ── 치명타 피해 ──────────────────────────────────
437:   {
438:     id: ID.F3_32,
439:     name: NAMES[ID.F3_32],
440:     effects: [
441:       {
442:         type: 'CRIT_DMG',
443:         multiGrades: {
444:           relic: { low: [0.052, 0.052], mid: [0.068, 0.068], high: [0.084, 0.084] },
445:           ancient: { low: [0.068, 0.068], mid: [0.084, 0.084], high: [0.1, 0.1] }
446:         }
447:       }
448:     ]
449:   },
450:   // ── 무기 공격력 ──────────────────────────────────
451:   {
452:     id: ID.F3_33,
453:     name: NAMES[ID.F3_33],
454:     effects: [
455:       {
456:         type: 'WEAPON_ATK_C',
457:         multiGrades: {
458:           relic: { low: [6300, 6300], mid: [7200, 7200], high: [8100, 8100] },
459:           ancient: { low: [7200, 7200], mid: [8100, 8100], high: [9000, 9000] }
460:         }
461:       }
462:     ]
463:   },
464: ];
```

## File: src/data/equipment/combat-equip.ts
```typescript
  1: /**
  2:  * - DB에 필요한 데이터
  3:  * 
  4:  * - ID로 구분해야할 것
  5:  * 부위, 장비등급(유물, 에기르고대, 세르카고대)
  6:  * 아이템 명으로 해당 아이템 종류 구분,
  7:  * 
  8:  * 품질이 0일 경우, +10%의 추가 피해 능력치를 갖고 있으며,
  9:  * 품질이 100일 경우, +30%의 추가 피해 능력치를 갖고 있습니다.
 10:  * 추가 피해 수치는 아래와 같은 공식에 의해 정해집니다.
 11:  * 추가 피해 수치 (%) = 10 + 0.002 * (품질)^2
 12:  * 
 13:  * 품질이 0일 경우, 0의 생명 활성력 능력치를 갖고 있으며,
 14:  * 품질이 100일 경우, 1400의 생명 활성력 능력치를 갖고 있습니다.
 15:  * 생명 활성력 수치는 아래와 같은 공식에 의해 정해집니다.
 16:  * 생명 활성력 수치 = 140 * 0.001 * (품질)^2
 17:  * 생명 활성력 140당 추가 최대 생명력 수치는 1% 증가합니다.
 18:  * 
 19:  * 
 20:  */
 21: 
 22: import { GET_ICON, CombatEquipData } from '@/types/combat-equip';
 23: import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';
 24: 
 25: 
 26: 
 27: // 공통 Base ID (10 10 1 0 00)
 28: const BASE = (ID_AA.EQUIPMENT * 1000000) + (ID_BB.COMMON * 10000) + (ID_C.EQ_COMBAT * 1000);
 29: 
 30: // D: 머리(1), 견갑(2), 상의(3), 하의(4), 장갑(5), 무기(6)
 31: // EE: 없음
 32: export const ID = {
 33:   HEAD: BASE + 100, SHOULDER: BASE + 200, CHEST: BASE + 300,
 34:   PANTS: BASE + 400, GLOVE: BASE + 500, WEAPON: BASE + 600,
 35: } as const;
 36: 
 37: export const NAMES = {
 38:   [ID.HEAD]: '투구', [ID.SHOULDER]: '견갑',[ID.CHEST]: '상의',
 39:   [ID.PANTS]: '하의', [ID.GLOVE]: '장갑', [ID.WEAPON]: '무기',
 40: } as const;
 41: 
 42: export const COMBAT_EQUIP_DATA: CombatEquipData[] = [
 43:   { // 투구
 44:     id: ID.HEAD,
 45:     name: NAMES[ID.HEAD],
 46:     iconPath: GET_ICON('HEAD'),
 47:     multiName: { ancient: '운명의 업화 투구', serca: '운명의 전율 투구' },
 48:     initItemLv: { ancient: 1590, serca: 1675 },
 49:     adv_refine: [
 50:       { // 6
 51:         refineLv: 6,
 52:         effects: [
 53:           { type: 'MAIN_STAT_C', multiValues: { ancient: [235, 471, 708, 948, 1189, 1431, 1675, 1921, 2168, 2417, 2668, 2920, 3174, 3429, 3687, 3946, 4206, 4469, 4733, 4999, 5266, 5536, 5807, 6080, 6355, 6631, 6910, 7190, 7472, 8965, 9270, 9576, 9884, 10195, 10508, 10822, 11140, 11459, 11780, 14011] } },
 54:           { type: 'STAT_HP_C', multiValues: { ancient: [20, 40, 60, 80, 100, 121, 141, 161, 182, 202, 223, 244, 265, 285, 306, 327, 348, 370, 391, 412, 433, 455, 476, 498, 520, 541, 563, 585, 607, 779, 802, 826, 850, 874, 897, 922, 945, 969, 994, 1251] } }
 55:         ],
 56:       },
 57:       { // 7
 58:         refineLv: 7,
 59:         effects: [
 60:           { type: 'MAIN_STAT_C', multiValues: { ancient: [242, 486, 731, 979, 1228, 1479, 1731, 1985, 2240, 2498, 2757, 3017, 3280, 3544, 3810, 4077, 4347, 4618, 4891, 5166, 5442, 5721, 6001, 6283, 6567, 6866, 7166, 7468, 7773, 9319, 9633, 9951, 10270, 10591, 10916, 11241, 11569, 11900, 12232, 14523] } },
 61:           { type: 'STAT_HP_C', multiValues: { ancient: [21, 41, 61, 82, 102, 123, 144, 165, 185, 206, 227, 248, 270, 291, 312, 333, 355, 376, 398, 420, 441, 463, 485, 507, 529, 552, 575, 599, 622, 797, 822, 845, 869, 894, 918, 943, 967, 992, 1016, 1277] } }
 62:         ],
 63:       },
 64:       { // 8
 65:         refineLv: 8,
 66:         effects: [
 67:           { type: 'MAIN_STAT_C', multiValues: { ancient: [251, 503, 757, 1012, 1270, 1529, 1789, 2052, 2316, 2582, 2849, 3119, 3390, 3663, 3938, 4214, 4493, 4773, 5055, 5339, 5638, 5938, 6240, 6545, 6852, 7160, 7471, 7784, 8099, 9688, 10013, 10341, 10672, 11004, 11340, 11677, 12016, 12359, 12703, 15055] } },
 68:           { type: 'STAT_HP_C', multiValues: { ancient: [21, 42, 63, 83, 104, 125, 146, 168, 189, 210, 231, 253, 274, 296, 318, 339, 361, 383, 405, 427, 450, 473, 497, 520, 543, 567, 590, 614, 638, 816, 841, 865, 890, 914, 939, 963, 989, 1013, 1039, 1304] } }
 69:         ],
 70:       },
 71:       { // 9
 72:         refineLv: 9,
 73:         effects: [
 74:           { type: 'MAIN_STAT_C', multiValues: { ancient: [259, 519, 782, 1046, 1312, 1579, 1849, 2120, 2393, 2668, 2944, 3223, 3503, 3785, 4069, 4368, 4668, 4970, 5275, 5582, 5890, 6201, 6514, 6829, 7147, 7466, 7788, 8112, 8438, 10070, 10407, 10746, 11089, 11433, 11780, 12129, 12480, 12834, 13191, 15608] } },
 75:           { type: 'STAT_HP_C', multiValues: { ancient: [21, 42, 64, 85, 106, 127, 149, 170, 192, 214, 235, 257, 279, 301, 323, 346, 369, 393, 416, 439, 463, 486, 510, 534, 558, 582, 606, 630, 654, 835, 859, 885, 909, 935, 960, 986, 1010, 1036, 1061, 1331] } }
 76:         ],
 77:       },
 78:       { // 10
 79:         refineLv: 10,
 80:         effects: [
 81:           { type: 'MAIN_STAT_C', multiValues: { ancient: [267, 537, 808, 1081, 1356, 1632, 1911, 2191, 2473, 2757, 3056, 3356, 3658, 3963, 4270, 4578, 4889, 5202, 5517, 5835, 6154, 6476, 6800, 7126, 7455, 7785, 8118, 8454, 8791, 10468, 10817, 11168, 11522, 11879, 12238, 12599, 12963, 13330, 13699, 16182] } },
 82:           { type: 'STAT_HP_C', multiValues: { ancient: [21, 43, 64, 86, 108, 129, 151, 173, 195, 217, 240, 263, 287, 310, 333, 357, 380, 404, 428, 452, 476, 500, 524, 548, 572, 596, 621, 645, 670, 854, 880, 904, 930, 955, 982, 1007, 1033, 1059, 1085, 1359] } }
 83:         ],
 84:       },
 85:       { // 11
 86:         refineLv: 11,
 87:         effects: [
 88:           { type: 'MAIN_STAT_C', multiValues: { ancient: [276, 555, 835, 1117, 1401, 1700, 2000, 2302, 2607, 2914, 3222, 3533, 3846, 4161, 4479, 4798, 5120, 5444, 5770, 6099, 6429, 6762, 7098, 7435, 7775, 8118, 8462, 8809, 9159, 10882, 11243, 11607, 11974, 12343, 12714, 13089, 13465, 13843, 14226, 16778] } },
 89:           { type: 'STAT_HP_C', multiValues: { ancient: [21, 43, 65, 87, 109, 132, 155, 179, 202, 225, 249, 272, 296, 320, 344, 368, 392, 416, 440, 464, 488, 513, 537, 562, 587, 612, 636, 661, 686, 874, 899, 925, 951, 977, 1003, 1029, 1055, 1082, 1108, 1386] } }
 90:         ],
 91:       },
 92:       { // 12
 93:         refineLv: 12,
 94:         effects: [
 95:           { type: 'MAIN_STAT_C', multiValues: { ancient: [299, 599, 901, 1206, 1513, 1821, 2132, 2445, 2760, 3078, 3397, 3719, 4043, 4370, 4699, 5031, 5365, 5701, 6040, 6381, 6724, 7069, 7416, 7766, 8118, 8472, 8829, 9188, 9550, 11313, 11688, 12064, 12442, 12825, 13209, 13596, 13986, 14378, 14774, 17397] } },
 96:           { type: 'STAT_HP_C', multiValues: { ancient: [23, 46, 70, 93, 116, 140, 164, 188, 213, 237, 262, 286, 311, 336, 362, 387, 413, 439, 465, 491, 517, 544, 570, 597, 624, 651, 678, 706, 733, 894, 920, 946, 973, 999, 1026, 1052, 1079, 1106, 1133, 1416] } }
 97:         ],
 98:       },
 99:       { // 13
100:         refineLv: 13,
101:         effects: [
102:           { type: 'MAIN_STAT_C', multiValues: { ancient: [308, 619, 932, 1247, 1565, 1884, 2206, 2530, 2856, 3185, 3515, 3848, 4184, 4521, 4861, 5204, 5548, 5895, 6245, 6597, 6951, 7308, 7667, 8029, 8393, 8760, 9129, 9500, 9875, 11696, 12083, 12473, 12865, 13261, 13659, 14060, 14463, 14869, 15278, 17974] } },
103:           { type: 'STAT_HP_C', multiValues: { ancient: [24, 47, 71, 95, 119, 143, 167, 191, 215, 239, 263, 288, 313, 337, 362, 387, 413, 439, 465, 491, 517, 544, 571, 597, 614, 639, 665, 691, 717, 910, 936, 963, 990, 1017, 1045, 1071, 1099, 1126, 1154, 1440] } }
104:         ],
105:       },
106:       { // 14
107:         refineLv: 14,
108:         effects: [
109:           { type: 'MAIN_STAT_C', multiValues: { ancient: [319, 641, 965, 1291, 1620, 1950, 2283, 2619, 2956, 3296, 3639, 3983, 4330, 4680, 5032, 5386, 5743, 6102, 6464, 6828, 7195, 7564, 7935, 8310, 8687, 9066, 9448, 9833, 10221, 12094, 12495, 12898, 13304, 13713, 14125, 14540, 14957, 15377, 15801, 18573] } },
110:           { type: 'STAT_HP_C', multiValues: { ancient: [24, 48, 72, 96, 120, 144, 169, 193, 218, 243, 268, 292, 317, 342, 368, 393, 418, 444, 469, 495, 520, 546, 572, 598, 624, 650, 676, 703, 729, 926, 952, 980, 1007, 1035, 1062, 1090, 1117, 1145, 1173, 1464] } }
111:         ],
112:       },
113:       { // 15
114:         refineLv: 15,
115:         effects: [
116:           { type: 'MAIN_STAT_C', multiValues: { ancient: [330, 663, 999, 1336, 1676, 2019, 2363, 2710, 3060, 3412, 3766, 4123, 4482, 4844, 5208, 5575, 5944, 6315, 6690, 7067, 7446, 7828, 8213, 8601, 8991, 9384, 9779, 10177, 10578, 12505, 12920, 13337, 13757, 14181, 14607, 15036, 15469, 15903, 16342, 19193] } },
117:           { type: 'STAT_HP_C', multiValues: { ancient: [24, 49, 73, 98, 123, 148, 172, 197, 222, 248, 273, 298, 324, 349, 375, 400, 426, 452, 478, 504, 530, 556, 583, 609, 636, 662, 689, 716, 743, 942, 970, 997, 1025, 1053, 1081, 1109, 1138, 1166, 1194, 1490] } }
118:         ],
119:       },
120:       { // 16
121:         refineLv: 16,
122:         effects: [
123:           { type: 'MAIN_STAT_C', multiValues: { ancient: [343, 687, 1034, 1384, 1736, 2090, 2447, 2806, 3168, 3532, 3899, 4268, 4639, 5014, 5391, 5770, 6152, 6537, 6925, 7315, 7708, 8103, 8501, 8902, 9306, 9713, 10122, 10534, 10949, 12931, 13360, 13793, 14227, 14666, 15107, 15551, 15998, 16449, 16902, 19836] } },
124:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 49, 74, 99, 125, 150, 175, 201, 226, 252, 277, 303, 329, 355, 381, 407, 433, 460, 486, 513, 539, 566, 593, 620, 647, 674, 701, 728, 756, 958, 986, 1015, 1043, 1071, 1100, 1128, 1158, 1186, 1215, 1516] } }
125:         ],
126:       },
127:       { // 17
128:         refineLv: 17,
129:         effects: [
130:           { type: 'MAIN_STAT_C', multiValues: { ancient: [354, 711, 1070, 1432, 1796, 2163, 2532, 2904, 3278, 3655, 4034, 4416, 4800, 5189, 5579, 5972, 6367, 6765, 7166, 7570, 7977, 8386, 8798, 9213, 9631, 10052, 10476, 10902, 11332, 13371, 13815, 14262, 14713, 15166, 15623, 16083, 16546, 17012, 17481, 20499] } },
131:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 50, 76, 101, 127, 152, 178, 204, 230, 256, 282, 308, 335, 361, 388, 414, 441, 468, 495, 522, 549, 576, 603, 631, 658, 686, 714, 741, 769, 975, 1003, 1033, 1061, 1090, 1120, 1148, 1178, 1207, 1237, 1542] } }
132:         ],
133:       },
134:       { // 18
135:         refineLv: 18,
136:         effects: [
137:           { type: 'MAIN_STAT_C', multiValues: { ancient: [367, 736, 1107, 1482, 1859, 2238, 2620, 3005, 3393, 3783, 4176, 4571, 4969, 5370, 5774, 6181, 6590, 7002, 7417, 7835, 8256, 8680, 9106, 9536, 9968, 10404, 10842, 11284, 11728, 13827, 14287, 14750, 15216, 15685, 16157, 16634, 17113, 17596, 18081, 21186] } },
138:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 51, 77, 103, 129, 155, 181, 208, 234, 261, 287, 314, 341, 368, 395, 422, 449, 476, 504, 531, 559, 587, 614, 642, 670, 698, 727, 755, 783, 993, 1021, 1051, 1080, 1110, 1139, 1169, 1199, 1228, 1259, 1569] } }
139:         ],
140:       },
141:       { // 19
142:         refineLv: 19,
143:         effects: [
144:           { type: 'MAIN_STAT_C', multiValues: { ancient: [379, 761, 1146, 1534, 1924, 2317, 2712, 3110, 3511, 3915, 4322, 4731, 5143, 5558, 5976, 6397, 6821, 7247, 7677, 8109, 8545, 8983, 9425, 9869, 10317, 10768, 11222, 11679, 12139, 14298, 14775, 15254, 15737, 16222, 16711, 17203, 17699, 18199, 18702, 21897] } },
145:           { type: 'STAT_HP_C', multiValues: { ancient: [26, 52, 79, 105, 132, 158, 185, 212, 239, 266, 293, 320, 347, 375, 402, 430, 458, 485, 513, 541, 569, 598, 626, 654, 683, 711, 740, 769, 798, 1010, 1040, 1070, 1099, 1130, 1159, 1190, 1221, 1250, 1281, 1596] } }
146:         ],
147:       },
148:       { // 20
149:         refineLv: 20,
150:         effects: [
151:           { type: 'MAIN_STAT_C', multiValues: { ancient: [393, 788, 1186, 1587, 1991, 2398, 2807, 3219, 3634, 4052, 4473, 4897, 5323, 5753, 6185, 6621, 7059, 7501, 7945, 8393, 8844, 9298, 9755, 10215, 10678, 11145, 11615, 12088, 12564, 14787, 15279, 15775, 16275, 16778, 17284, 17794, 18307, 18824, 19344, 22634] } },
152:           { type: 'STAT_HP_C', multiValues: { ancient: [26, 53, 80, 107, 134, 161, 188, 215, 243, 270, 298, 326, 353, 381, 409, 437, 466, 494, 522, 551, 579, 608, 637, 666, 695, 724, 753, 782, 812, 1027, 1058, 1089, 1118, 1149, 1179, 1211, 1242, 1272, 1304, 1624] } }
153:         ],
154:       },
155:       { // 21
156:         refineLv: 21,
157:         effects: [
158:           { type: 'MAIN_STAT_C', multiValues: { ancient: [407, 816, 1228, 1643, 2061, 2482, 2906, 3332, 3762, 4194, 4630, 5068, 5510, 5954, 6402, 6853, 7307, 7764, 8224, 8687, 9154, 9624, 10097, 10573, 11052, 11535, 12021, 12511, 13004, 15293, 15803, 16316, 16833, 17353, 17877, 18405, 18936, 19471, 20009, 23396] } },
159:           { type: 'STAT_HP_C', multiValues: { ancient: [27, 54, 81, 109, 136, 164, 192, 219, 247, 275, 303, 332, 360, 388, 417, 445, 474, 503, 532, 561, 590, 619, 648, 678, 707, 737, 767, 796, 826, 1045, 1077, 1108, 1138, 1170, 1200, 1232, 1264, 1295, 1327, 1652] } }
160:         ],
161:       },
162:       { // 22
163:         refineLv: 22,
164:         effects: [
165:           { type: 'MAIN_STAT_C', multiValues: { ancient: [421, 845, 1271, 1701, 2133, 2569, 3007, 3449, 3893, 4341, 4792, 5246, 5703, 6163, 6626, 7093, 7563, 8036, 8512, 8991, 9474, 9960, 10450, 10943, 11439, 11939, 12442, 12949, 13459, 15816, 16344, 16875, 17410, 17948, 18491, 19036, 19586, 20140, 20698, 24185] } },
166:           { type: 'STAT_HP_C', multiValues: { ancient: [28, 56, 83, 111, 139, 167, 196, 224, 252, 281, 309, 338, 367, 396, 425, 454, 483, 512, 542, 571, 601, 631, 660, 690, 720, 751, 781, 811, 842, 1064, 1096, 1128, 1159, 1191, 1222, 1254, 1286, 1318, 1351, 1681] } }
167:         ],
168:       },
169:       { // 23
170:         refineLv: 23,
171:         effects: [
172:           { type: 'MAIN_STAT_C', multiValues: { ancient: [436, 874, 1316, 1760, 2208, 2659, 3113, 3570, 4030, 4493, 4960, 5430, 5903, 6379, 6858, 7341, 7827, 8317, 8810, 9306, 9806, 10309, 10816, 11326, 11840, 12357, 12878, 13402, 13930, 16358, 16903, 17453, 18007, 18565, 19126, 19691, 20260, 20834, 21410, 25001] } },
173:           { type: 'STAT_HP_C', multiValues: { ancient: [28, 57, 85, 113, 142, 170, 199, 228, 257, 286, 315, 344, 373, 403, 432, 462, 492, 521, 551, 581, 612, 642, 672, 703, 733, 764, 795, 826, 857, 1083, 1115, 1147, 1179, 1212, 1244, 1276, 1309, 1342, 1374, 1710] } }
174:         ],
175:       },
176:       { // 24
177:         refineLv: 24,
178:         effects: [
179:           { type: 'MAIN_STAT_C', multiValues: { ancient: [451, 905, 1362, 1822, 2285, 2752, 3222, 3695, 4171, 4650, 5133, 5619, 6109, 6602, 7098, 7598, 8101, 8608, 9118, 9632, 10149, 10670, 11194, 11722, 12254, 12789, 13328, 13871, 14418, 16918, 17483, 18052, 18626, 19202, 19783, 20368, 20957, 21550, 22148, 25846] } },
180:           { type: 'STAT_HP_C', multiValues: { ancient: [28, 57, 86, 115, 144, 173, 202, 231, 261, 290, 320, 350, 379, 409, 439, 470, 500, 530, 561, 591, 622, 653, 684, 715, 746, 777, 808, 840, 872, 1102, 1134, 1167, 1200, 1232, 1265, 1298, 1331, 1365, 1397, 1739] } }
181:         ],
182:       },
183:       { // 25
184:         refineLv: 25,
185:         effects: [
186:           { type: 'MAIN_STAT_C', multiValues: { ancient: [467, 937, 1410, 1886, 2365, 2848, 3334, 3824, 4317, 4813, 5313, 5816, 6323, 6833, 7347, 7864, 8385, 8909, 9437, 9969, 10504, 11043, 11586, 12133, 12683, 13237, 13795, 14357, 14922, 17498, 18083, 18672, 19265, 19863, 20463, 21069, 21678, 22292, 22910, 26720] } },
187:           { type: 'STAT_HP_C', multiValues: { ancient: [29, 58, 87, 117, 146, 176, 206, 235, 265, 295, 326, 356, 386, 417, 447, 478, 509, 540, 571, 602, 633, 664, 696, 728, 759, 791, 823, 855, 887, 1121, 1154, 1187, 1221, 1253, 1287, 1321, 1354, 1388, 1423, 1770] } }
188:         ],
189:       }
190:     ],
191:     effects: [
192:       {
193:         type: 'MAIN_STAT_C',
194:         multiValues: {
195:           ancient: [38669, 42565, 46495, 50459, 51572, 52722, 53911, 55139, 56409, 57721, 59077, 60478, 61991, 63556, 65176, 66852, 68588, 70384, 72243, 74167, 76158, 78219, 80352, 82560, 84845],
196:           serca: [73903, 75855, 77875, 79965, 82129, 84369, 86688, 89087, 91570, 94140, 96801, 99554, 102404, 105353, 108406, 111565, 114358, 117218, 120150, 123155, 126236, 129393, 132629, 135946, 139346]
197:         }
198:       },
199:       {
200:         type: 'STAT_HP_C',
201:         multiValues: {
202:           ancient: [5505, 5897, 6290, 6685, 6782, 6881, 6981, 7083, 7187, 7293,7401, 7510, 7626, 7745, 7865, 7988, 8113, 8240, 8369, 8501, 8635, 8771, 8910, 9052, 9196],
203:           serca: [8652, 8787, 8926, 9066, 9209, 9355, 9504, 9655, 9809, 9965, 10125, 10287, 10452, 10620, 10791, 10966, 11117, 11270, 11426, 11584, 11743, 11906, 12070, 12236, 12405]
204:         }
205:       },
206:       {
207:         type: 'STAT_HP_P',
208:         grades: { low: [0, 35], mid: [36, 70], high: [71, 100] }
209:       }
210:     ]
211:   },
212:   { // 견갑
213:     id: ID.SHOULDER,
214:     name: NAMES[ID.SHOULDER],
215:     iconPath: GET_ICON('SHOULDER'),
216:     multiName: { ancient: '운명의 업화 견갑', serca: '운명의 전율 견갑' },
217:     initItemLv: { ancient: 1590, serca: 1675 },
218:     adv_refine: [
219:       { // 6
220:         refineLv: 6,
221:         effects: [
222:           { type: 'MAIN_STAT_C', multiValues: { ancient: [250, 501, 754, 1009, 1265, 1523, 1783, 2045, 2308, 2573, 2839, 3108, 3378, 3650, 3924, 4199, 4477, 4756, 5037, 5320, 5605, 5892, 6181, 6471, 6764, 7058, 7354, 7653, 7953, 9542, 9866, 10192, 10520, 10850, 11184, 11519, 11856, 12196, 12539, 14913] } },
223:           { type: 'STAT_HP_C', multiValues: { ancient: [17, 34, 52, 69, 87, 104, 122, 140, 157, 175, 193, 211, 229, 247, 265, 283, 302, 320, 338, 357, 375, 394, 413, 431, 450, 469, 488, 507, 526, 675, 695, 715, 736, 756, 778, 798, 819, 840, 860, 1083] } }
224:         ],
225:       },
226:       { // 7
227:         refineLv: 7,
228:         effects: [
229:           { type: 'MAIN_STAT_C', multiValues: { ancient: [258, 518, 780, 1043, 1308, 1574, 1843, 2113, 2385, 2659, 2934, 3212, 3491, 3772, 4055, 4340, 4627, 4916, 5206, 5499, 5793, 6089, 6388, 6688, 6990, 7308, 7627, 7949, 8273, 9919, 10254, 10591, 10931, 11274, 11618, 11965, 12314, 12666, 13020, 15458] } },
230:           { type: 'STAT_HP_C', multiValues: { ancient: [17, 35, 53, 70, 88, 106, 124, 142, 160, 178, 196, 215, 233, 251, 270, 288, 307, 326, 344, 363, 382, 401, 420, 439, 458, 478, 498, 518, 538, 691, 711, 732, 753, 773, 795, 816, 838, 859, 879, 1105] } }
231:         ],
232:       },
233:       { // 8
234:         refineLv: 8,
235:         effects: [
236:           { type: 'MAIN_STAT_C', multiValues: { ancient: [266, 535, 805, 1077, 1351, 1626, 1904, 2183, 2464, 2747, 3032, 3319, 3608, 3898, 4191, 4485, 4781, 5080, 5380, 5682, 6000, 6319, 6641, 6965, 7292, 7620, 7951, 8284, 8620, 10310, 10657, 11006, 11358, 11712, 12069, 12428, 12789, 13153, 13519, 16023] } },
237:           { type: 'STAT_HP_C', multiValues: { ancient: [18, 36, 54, 72, 90, 108, 127, 145, 163, 182, 200, 219, 238, 256, 275, 294, 313, 332, 351, 370, 390, 410, 430, 450, 471, 491, 511, 532, 552, 707, 728, 750, 771, 791, 813, 835, 857, 878, 900, 1130] } }
238:         ],
239:       },
240:       { // 9
241:         refineLv: 9,
242:         effects: [
243:           { type: 'MAIN_STAT_C', multiValues: { ancient: [275, 553, 832, 1113, 1396, 1681, 1968, 2257, 2547, 2840, 3134, 3430, 3729, 4029, 4331, 4649, 4968, 5290, 5614, 5941, 6269, 6600, 6933, 7269, 7607, 7947, 8289, 8634, 8981, 10718, 11077, 11438, 11802, 12168, 12538, 12909, 13283, 13661, 14039, 16611] } },
244:           { type: 'STAT_HP_C', multiValues: { ancient: [18, 37, 55, 73, 92, 110, 129, 148, 166, 185, 204, 223, 242, 261, 280, 300, 320, 340, 360, 381, 401, 421, 442, 462, 483, 504, 525, 546, 566, 723, 745, 767, 788, 810, 832, 853, 876, 897, 920, 1153] } }
245:         ],
246:       },
247:       { // 10
248:         refineLv: 10,
249:         effects: [
250:           { type: 'MAIN_STAT_C', multiValues: { ancient: [285, 572, 861, 1151, 1444, 1738, 2034, 2333, 2633, 2935, 3253, 3572, 3894, 4218, 4545, 4873, 5204, 5537, 5873, 6211, 6551, 6893, 7238, 7585, 7935, 8287, 8641, 8998, 9357, 11142, 11513, 11887, 12265, 12643, 13025, 13410, 13798, 14187, 14580, 17223] } },
251:           { type: 'STAT_HP_C', multiValues: { ancient: [18, 37, 56, 74, 93, 112, 131, 150, 169, 188, 208, 228, 248, 268, 289, 309, 329, 350, 370, 391, 412, 433, 454, 474, 495, 517, 538, 559, 580, 740, 761, 784, 805, 828, 850, 873, 895, 917, 940, 1177] } }
252:         ],
253:       },
254:       { // 11
255:         refineLv: 11,
256:         effects: [
257:           { type: 'MAIN_STAT_C', multiValues: { ancient: [294, 590, 889, 1189, 1491, 1809, 2128, 2450, 2774, 3101, 3429, 3760, 4093, 4429, 4767, 5107, 5449, 5794, 6141, 6491, 6843, 7197, 7554, 7913, 8275, 8639, 9006, 9376, 9747, 11581, 11966, 12354, 12743, 13136, 13532, 13929, 14330, 14733, 15140, 17856] } },
258:           { type: 'STAT_HP_C', multiValues: { ancient: [19, 38, 57, 76, 95, 115, 135, 155, 175, 196, 216, 236, 257, 277, 298, 319, 340, 361, 381, 402, 424, 445, 466, 487, 509, 530, 552, 573, 595, 757, 780, 802, 824, 847, 869, 892, 915, 938, 961, 1201] } }
259:         ],
260:       },
261:       { // 12
262:         refineLv: 12,
263:         effects: [
264:           { type: 'MAIN_STAT_C', multiValues: { ancient: [318, 637, 959, 1283, 1610, 1938, 2269, 2602, 2938, 3276, 3616, 3958, 4303, 4650, 5000, 5352, 5706, 6063, 6422, 6784, 7148, 7515, 7885, 8256, 8631, 9008, 9388, 9770, 10155, 12041, 12438, 12839, 13242, 13649, 14058, 14470, 14885, 15303, 15723, 18515] } },
265:           { type: 'STAT_HP_C', multiValues: { ancient: [20, 40, 60, 80, 101, 121, 141, 162, 182, 203, 224, 245, 266, 286, 307, 329, 350, 371, 392, 414, 435, 457, 478, 500, 522, 544, 566, 588, 610, 774, 797, 820, 843, 866, 889, 912, 935, 958, 981, 1226] } }
266:         ],
267:       },
268:       { // 13
269:         refineLv: 13,
270:         effects: [
271:           { type: 'MAIN_STAT_C', multiValues: { ancient: [328, 659, 992, 1328, 1666, 2006, 2348, 2693, 3040, 3390, 3742, 4096, 4453, 4812, 5174, 5538, 5905, 6275, 6646, 7021, 7398, 7778, 8160, 8545, 8933, 9323, 9716, 10111, 10510, 12448, 12860, 13275, 13693, 14113, 14537, 14964, 15393, 15825, 16260, 19130] } },
272:           { type: 'STAT_HP_C', multiValues: { ancient: [20, 40, 61, 81, 102, 123, 144, 165, 185, 206, 228, 249, 270, 291, 313, 334, 356, 377, 399, 421, 443, 465, 487, 509, 531, 553, 576, 598, 621, 788, 811, 834, 857, 880, 904, 927, 952, 975, 999, 1248] } }
273:         ],
274:       },
275:       { // 14
276:         refineLv: 14,
277:         effects: [
278:           { type: 'MAIN_STAT_C', multiValues: { ancient: [340, 682, 1027, 1374, 1724, 2076, 2430, 2787, 3146, 3508, 3872, 4239, 4609, 4980, 5355, 5732, 6112, 6494, 6879, 7267, 7657, 8050, 8445, 8844, 9245, 9649, 10056, 10465, 10877, 12871, 13298, 13727, 14159, 14594, 15033, 15474, 15918, 16366, 16817, 19768] } },
279:           { type: 'STAT_HP_C', multiValues: { ancient: [21, 42, 63, 83, 104, 126, 147, 168, 189, 211, 232, 254, 275, 297, 319, 341, 363, 385, 407, 429, 451, 474, 496, 519, 541, 564, 587, 609, 632, 802, 825, 850, 873, 897, 921, 945, 969, 993, 1017, 1270] } }
280:         ],
281:       },
282:       { // 15
283:         refineLv: 15,
284:         effects: [
285:           { type: 'MAIN_STAT_C', multiValues: { ancient: [352, 706, 1063, 1422, 1784, 2148, 2515, 2885, 3256, 3631, 4008, 4388, 4770, 5155, 5543, 5933, 6326, 6721, 7120, 7521, 7925, 8332, 8741, 9153, 9569, 9987, 10408, 10832, 11258, 13309, 13750, 14194, 14642, 15093, 15546, 16002, 16462, 16926, 17393, 20427] } },
286:           { type: 'STAT_HP_C', multiValues: { ancient: [22, 43, 64, 85, 107, 128, 150, 171, 193, 215, 237, 259, 281, 303, 325, 347, 370, 392, 415, 437, 460, 483, 505, 528, 551, 574, 598, 621, 644, 817, 841, 865, 889, 913, 938, 962, 987, 1011, 1035, 1292] } }
287:         ],
288:       },
289:       { // 16
290:         refineLv: 16,
291:         effects: [
292:           { type: 'MAIN_STAT_C', multiValues: { ancient: [364, 731, 1101, 1472, 1847, 2224, 2604, 2986, 3371, 3759, 4149, 4542, 4937, 5336, 5737, 6141, 6548, 6957, 7369, 7785, 8203, 8624, 9048, 9474, 9904, 10337, 10772, 11211, 11653, 13762, 14218, 14678, 15142, 15609, 16078, 16550, 17026, 17506, 17988, 21111] } },
293:           { type: 'STAT_HP_C', multiValues: { ancient: [21, 43, 64, 86, 108, 130, 152, 174, 196, 218, 240, 263, 285, 308, 330, 353, 376, 398, 421, 444, 467, 491, 514, 537, 561, 584, 608, 631, 655, 831, 855, 880, 904, 928, 953, 978, 1003, 1028, 1053, 1314] } }
294:         ],
295:       },
296:       { // 17
297:         refineLv: 17,
298:         effects: [
299:           { type: 'MAIN_STAT_C', multiValues: { ancient: [377, 757, 1139, 1524, 1912, 2302, 2695, 3090, 3489, 3890, 4294, 4701, 5110, 5522, 5938, 6356, 6777, 7201, 7627, 8057, 8490, 8925, 9364, 9806, 10251, 10698, 11149, 11603, 12061, 14231, 14703, 15179, 15659, 16141, 16628, 17116, 17609, 18106, 18606, 21818] } },
300:           { type: 'STAT_HP_C', multiValues: { ancient: [22, 44, 66, 88, 110, 132, 155, 177, 200, 222, 245, 268, 290, 313, 336, 359, 383, 406, 429, 453, 476, 500, 523, 547, 571, 595, 619, 643, 667, 845, 870, 895, 920, 945, 970, 996, 1021, 1047, 1072, 1337] } }
301:         ],
302:       },
303:       { // 18
304:         refineLv: 18,
305:         effects: [
306:           { type: 'MAIN_STAT_C', multiValues: { ancient: [390, 783, 1178, 1577, 1978, 2382, 2786, 3198, 3610, 4026, 4444, 4865, 5289, 5715, 6145, 6578, 7013, 7452, 7894, 8339, 8786, 9237, 9691, 10149, 10609, 11072, 11539, 12009, 12482, 14716, 15204, 15697, 16194, 16694, 17197, 17702, 18212, 18727, 19243, 22548] } },
307:           { type: 'STAT_HP_C', multiValues: { ancient: [22, 45, 67, 90, 112, 135, 158, 180, 203, 226, 249, 273, 296, 319, 343, 366, 390, 413, 437, 461, 485, 509, 533, 557, 581, 606, 630, 655, 679, 860, 886, 911, 937, 962, 988, 1013, 1039, 1065, 1091, 1360] } }
308:         ],
309:       },
310:       { // 19
311:         refineLv: 19,
312:         effects: [
313:           { type: 'MAIN_STAT_C', multiValues: { ancient: [404, 811, 1220, 1632, 2048, 2466, 2887, 3311, 3737, 4167, 4600, 5035, 5474, 5916, 6361, 6808, 7259, 7713, 8171, 8631, 9094, 9561, 10031, 10504, 10981, 11460, 11943, 12430, 12920, 15219, 15724, 16234, 16749, 17265, 17786, 18310, 18837, 19369, 19904, 23306] } },
314:           { type: 'STAT_HP_C', multiValues: { ancient: [23, 46, 68, 91, 114, 137, 161, 184, 207, 231, 254, 278, 301, 325, 349, 373, 397, 421, 445, 469, 494, 518, 543, 567, 592, 617, 642, 667, 692, 876, 901, 927, 953, 979, 1005, 1031, 1057, 1084, 1111, 1384] } }
315:         ],
316:       },
317:       { // 20
318:         refineLv: 20,
319:         effects: [
320:           { type: 'MAIN_STAT_C', multiValues: { ancient: [418, 839, 1263, 1689, 2119, 2552, 2987, 3426, 3868, 4313, 4760, 5211, 5665, 6123, 6583, 7046, 7513, 7983, 8456, 8933, 9412, 9895, 10382, 10872, 11365, 11861, 12361, 12865, 13371, 15738, 16262, 16789, 17321, 17856, 18395, 18938, 19483, 20034, 20588, 24088] } },
321:           { type: 'STAT_HP_C', multiValues: { ancient: [23, 47, 70, 93, 117, 140, 164, 187, 211, 235, 259, 283, 307, 331, 355, 380, 404, 429, 453, 478, 503, 528, 553, 578, 603, 628, 653, 679, 704, 891, 917, 943, 970, 997, 1023, 1050, 1076, 1104, 1130, 1408] } }
322:         ],
323:       },
324:       { // 21
325:         refineLv: 21,
326:         effects: [
327:           { type: 'MAIN_STAT_C', multiValues: { ancient: [433, 868, 1307, 1749, 2194, 2641, 3092, 3546, 4004, 4464, 4927, 5394, 5864, 6337, 6814, 7293, 7776, 8263, 8753, 9246, 9742, 10242, 10746, 11252, 11763, 12277, 12794, 13315, 13840, 16276, 16819, 17364, 17915, 18469, 19026, 19588, 20153, 20722, 21295, 24900] } },
328:           { type: 'STAT_HP_C', multiValues: { ancient: [23, 47, 70, 94, 118, 142, 166, 190, 214, 238, 263, 287, 312, 336, 361, 386, 411, 436, 461, 486, 511, 536, 562, 587, 613, 638, 664, 690, 716, 906, 933, 959, 987, 1013, 1041, 1067, 1095, 1122, 1150, 1432] } }
329:         ],
330:       },
331:       { // 22
332:         refineLv: 22,
333:         effects: [
334:           { type: 'MAIN_STAT_C', multiValues: { ancient: [447, 898, 1352, 1810, 2270, 2733, 3200, 3670, 4143, 4620, 5099, 5582, 6069, 6559, 7052, 7548, 8048, 8552, 9058, 9569, 10083, 10600, 11121, 11646, 12174, 12706, 13241, 13781, 14324, 16832, 17394, 17959, 18528, 19101, 19679, 20260, 20846, 21434, 22028, 25739] } },
335:           { type: 'STAT_HP_C', multiValues: { ancient: [24, 48, 72, 96, 120, 145, 169, 194, 218, 243, 268, 293, 318, 343, 368, 393, 418, 444, 469, 495, 520, 546, 572, 598, 624, 650, 676, 703, 729, 923, 949, 977, 1004, 1032, 1059, 1087, 1114, 1142, 1170, 1457] } }
336:         ],
337:       },
338:       { // 23
339:         refineLv: 23,
340:         effects: [
341:           { type: 'MAIN_STAT_C', multiValues: { ancient: [463, 930, 1400, 1873, 2350, 2829, 3312, 3799, 4289, 4782, 5278, 5778, 6282, 6788, 7299, 7813, 8330, 8851, 9376, 9904, 10436, 10971, 11511, 12054, 12600, 13151, 13705, 14263, 14825, 17409, 17990, 18576, 19164, 19758, 20355, 20956, 21562, 22172, 22786, 26608] } },
342:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 49, 74, 98, 123, 148, 173, 198, 223, 248, 273, 298, 324, 349, 375, 400, 426, 452, 478, 504, 530, 556, 583, 609, 636, 662, 689, 716, 743, 939, 967, 994, 1022, 1050, 1078, 1106, 1134, 1163, 1191, 1483] } }
343:         ],
344:       },
345:       { // 24
346:         refineLv: 24,
347:         effects: [
348:           { type: 'MAIN_STAT_C', multiValues: { ancient: [479, 962, 1449, 1939, 2432, 2928, 3428, 3932, 4438, 4949, 5463, 5980, 6501, 7026, 7554, 8086, 8621, 9161, 9704, 10250, 10801, 11355, 11913, 12475, 13041, 13611, 14185, 14762, 15344, 18005, 18606, 19212, 19822, 20436, 21054, 21677, 22304, 22935, 23571, 27507] } },
349:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 50, 75, 100, 125, 150, 175, 201, 226, 252, 277, 303, 329, 355, 381, 407, 433, 460, 486, 513, 539, 566, 593, 620, 647, 674, 701, 728, 755, 955, 983, 1011, 1040, 1068, 1097, 1125, 1154, 1183, 1211, 1508] } }
350:         ],
351:       },
352:       { // 25
353:         refineLv: 25,
354:         effects: [
355:           { type: 'MAIN_STAT_C', multiValues: { ancient: [496, 996, 1500, 2006, 2517, 3031, 3548, 4069, 4594, 5122, 5654, 6189, 6729, 7272, 7818, 8369, 8923, 9481, 10043, 10609, 11179, 11753, 12330, 12912, 13498, 14087, 14681, 15279, 15881, 18622, 19245, 19872, 20503, 21139, 21778, 22423, 23071, 23725, 24383, 28438] } },
356:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 50, 76, 101, 127, 152, 178, 204, 230, 256, 282, 308, 335, 361, 388, 414, 441, 468, 495, 522, 549, 576, 603, 630, 658, 685, 713, 741, 769, 972, 1000, 1029, 1058, 1086, 1116, 1144, 1174, 1203, 1233, 1534] } }
357:         ],
358:       },
359:     ],
360:     effects: [
361:       {
362:         type: 'MAIN_STAT_C',
363:         multiValues: {
364:           ancient: [41155, 45302, 49483, 53703, 54887, 56111, 57376, 58684, 60035, 61431, 62875, 64366, 65976, 67642, 69366, 71150, 72997, 74909, 76887, 78935, 81054, 83248, 85518, 87868, 90300],
365:           serca: [78654, 80731, 82881, 85106, 87410, 89793, 92261, 94815, 97457, 100193, 103023, 105954, 108987, 112126, 115375, 118738, 121709, 124754, 127874, 131072, 134351, 137711, 141155, 144686, 148304]
366:         }
367:       },
368:       {
369:         type: 'STAT_HP_C',
370:         multiValues: {
371:           ancient: [4771, 5110, 5452, 5794, 5878, 5964, 6051, 6139, 6229, 6321, 6414, 6509, 6610, 6712, 6816, 6923, 7031, 7141, 7253, 7367, 7484, 7602, 7722, 7845, 7970],
372:           serca: [7498, 7615, 7735, 7858, 7982, 8108, 8237, 8368, 8501, 8637, 8775, 8916, 9059, 9205, 9353, 9504, 9635, 9768, 9903, 10039, 10178, 10318, 10461, 10605, 10751]
373:         }
374:       },
375:       {
376:         type: 'STAT_HP_P',
377:         grades: { low: [0, 35], mid: [36, 70], high: [71, 100] }
378:       }
379:     ]
380:   },
381: 
382:   //상의 하의 장갑은 디버깅을 위해 견갑수치와 동일한 값으로 임시 작성
383:   { // 상의
384:     id: ID.CHEST,
385:     name: NAMES[ID.CHEST],
386:     iconPath: GET_ICON('CHEST'),
387:     multiName: { ancient: '운명의 업화 상의', serca: '운명의 전율 상의' },
388:     initItemLv: { ancient: 1590, serca: 1675 },
389:     adv_refine: [
390:       { // 6
391:         refineLv: 6,
392:         effects: [
393:           { type: 'MAIN_STAT_C', multiValues: { ancient: [250, 501, 754, 1009, 1265, 1523, 1783, 2045, 2308, 2573, 2839, 3108, 3378, 3650, 3924, 4199, 4477, 4756, 5037, 5320, 5605, 5892, 6181, 6471, 6764, 7058, 7354, 7653, 7953, 9542, 9866, 10192, 10520, 10850, 11184, 11519, 11856, 12196, 12539, 14913] } },
394:           { type: 'STAT_HP_C', multiValues: { ancient: [17, 34, 52, 69, 87, 104, 122, 140, 157, 175, 193, 211, 229, 247, 265, 283, 302, 320, 338, 357, 375, 394, 413, 431, 450, 469, 488, 507, 526, 675, 695, 715, 736, 756, 778, 798, 819, 840, 860, 1083] } }
395:         ],
396:       },
397:       { // 7
398:         refineLv: 7,
399:         effects: [
400:           { type: 'MAIN_STAT_C', multiValues: { ancient: [258, 518, 780, 1043, 1308, 1574, 1843, 2113, 2385, 2659, 2934, 3212, 3491, 3772, 4055, 4340, 4627, 4916, 5206, 5499, 5793, 6089, 6388, 6688, 6990, 7308, 7627, 7949, 8273, 9919, 10254, 10591, 10931, 11274, 11618, 11965, 12314, 12666, 13020, 15458] } },
401:           { type: 'STAT_HP_C', multiValues: { ancient: [17, 35, 53, 70, 88, 106, 124, 142, 160, 178, 196, 215, 233, 251, 270, 288, 307, 326, 344, 363, 382, 401, 420, 439, 458, 478, 498, 518, 538, 691, 711, 732, 753, 773, 795, 816, 838, 859, 879, 1105] } }
402:         ],
403:       },
404:       { // 8
405:         refineLv: 8,
406:         effects: [
407:           { type: 'MAIN_STAT_C', multiValues: { ancient: [266, 535, 805, 1077, 1351, 1626, 1904, 2183, 2464, 2747, 3032, 3319, 3608, 3898, 4191, 4485, 4781, 5080, 5380, 5682, 6000, 6319, 6641, 6965, 7292, 7620, 7951, 8284, 8620, 10310, 10657, 11006, 11358, 11712, 12069, 12428, 12789, 13153, 13519, 16023] } },
408:           { type: 'STAT_HP_C', multiValues: { ancient: [18, 36, 54, 72, 90, 108, 127, 145, 163, 182, 200, 219, 238, 256, 275, 294, 313, 332, 351, 370, 390, 410, 430, 450, 471, 491, 511, 532, 552, 707, 728, 750, 771, 791, 813, 835, 857, 878, 900, 1130] } }
409:         ],
410:       },
411:       { // 9
412:         refineLv: 9,
413:         effects: [
414:           { type: 'MAIN_STAT_C', multiValues: { ancient: [275, 553, 832, 1113, 1396, 1681, 1968, 2257, 2547, 2840, 3134, 3430, 3729, 4029, 4331, 4649, 4968, 5290, 5614, 5941, 6269, 6600, 6933, 7269, 7607, 7947, 8289, 8634, 8981, 10718, 11077, 11438, 11802, 12168, 12538, 12909, 13283, 13661, 14039, 16611] } },
415:           { type: 'STAT_HP_C', multiValues: { ancient: [18, 37, 55, 73, 92, 110, 129, 148, 166, 185, 204, 223, 242, 261, 280, 300, 320, 340, 360, 381, 401, 421, 442, 462, 483, 504, 525, 546, 566, 723, 745, 767, 788, 810, 832, 853, 876, 897, 920, 1153] } }
416:         ],
417:       },
418:       { // 10
419:         refineLv: 10,
420:         effects: [
421:           { type: 'MAIN_STAT_C', multiValues: { ancient: [285, 572, 861, 1151, 1444, 1738, 2034, 2333, 2633, 2935, 3253, 3572, 3894, 4218, 4545, 4873, 5204, 5537, 5873, 6211, 6551, 6893, 7238, 7585, 7935, 8287, 8641, 8998, 9357, 11142, 11513, 11887, 12265, 12643, 13025, 13410, 13798, 14187, 14580, 17223] } },
422:           { type: 'STAT_HP_C', multiValues: { ancient: [18, 37, 56, 74, 93, 112, 131, 150, 169, 188, 208, 228, 248, 268, 289, 309, 329, 350, 370, 391, 412, 433, 454, 474, 495, 517, 538, 559, 580, 740, 761, 784, 805, 828, 850, 873, 895, 917, 940, 1177] } }
423:         ],
424:       },
425:       { // 11
426:         refineLv: 11,
427:         effects: [
428:           { type: 'MAIN_STAT_C', multiValues: { ancient: [294, 590, 889, 1189, 1491, 1809, 2128, 2450, 2774, 3101, 3429, 3760, 4093, 4429, 4767, 5107, 5449, 5794, 6141, 6491, 6843, 7197, 7554, 7913, 8275, 8639, 9006, 9376, 9747, 11581, 11966, 12354, 12743, 13136, 13532, 13929, 14330, 14733, 15140, 17856] } },
429:           { type: 'STAT_HP_C', multiValues: { ancient: [19, 38, 57, 76, 95, 115, 135, 155, 175, 196, 216, 236, 257, 277, 298, 319, 340, 361, 381, 402, 424, 445, 466, 487, 509, 530, 552, 573, 595, 757, 780, 802, 824, 847, 869, 892, 915, 938, 961, 1201] } }
430:         ],
431:       },
432:       { // 12
433:         refineLv: 12,
434:         effects: [
435:           { type: 'MAIN_STAT_C', multiValues: { ancient: [318, 637, 959, 1283, 1610, 1938, 2269, 2602, 2938, 3276, 3616, 3958, 4303, 4650, 5000, 5352, 5706, 6063, 6422, 6784, 7148, 7515, 7885, 8256, 8631, 9008, 9388, 9770, 10155, 12041, 12438, 12839, 13242, 13649, 14058, 14470, 14885, 15303, 15723, 18515] } },
436:           { type: 'STAT_HP_C', multiValues: { ancient: [20, 40, 60, 80, 101, 121, 141, 162, 182, 203, 224, 245, 266, 286, 307, 329, 350, 371, 392, 414, 435, 457, 478, 500, 522, 544, 566, 588, 610, 774, 797, 820, 843, 866, 889, 912, 935, 958, 981, 1226] } }
437:         ],
438:       },
439:       { // 13
440:         refineLv: 13,
441:         effects: [
442:           { type: 'MAIN_STAT_C', multiValues: { ancient: [328, 659, 992, 1328, 1666, 2006, 2348, 2693, 3040, 3390, 3742, 4096, 4453, 4812, 5174, 5538, 5905, 6275, 6646, 7021, 7398, 7778, 8160, 8545, 8933, 9323, 9716, 10111, 10510, 12448, 12860, 13275, 13693, 14113, 14537, 14964, 15393, 15825, 16260, 19130] } },
443:           { type: 'STAT_HP_C', multiValues: { ancient: [20, 40, 61, 81, 102, 123, 144, 165, 185, 206, 228, 249, 270, 291, 313, 334, 356, 377, 399, 421, 443, 465, 487, 509, 531, 553, 576, 598, 621, 788, 811, 834, 857, 880, 904, 927, 952, 975, 999, 1248] } }
444:         ],
445:       },
446:       { // 14
447:         refineLv: 14,
448:         effects: [
449:           { type: 'MAIN_STAT_C', multiValues: { ancient: [340, 682, 1027, 1374, 1724, 2076, 2430, 2787, 3146, 3508, 3872, 4239, 4609, 4980, 5355, 5732, 6112, 6494, 6879, 7267, 7657, 8050, 8445, 8844, 9245, 9649, 10056, 10465, 10877, 12871, 13298, 13727, 14159, 14594, 15033, 15474, 15918, 16366, 16817, 19768] } },
450:           { type: 'STAT_HP_C', multiValues: { ancient: [21, 42, 63, 83, 104, 126, 147, 168, 189, 211, 232, 254, 275, 297, 319, 341, 363, 385, 407, 429, 451, 474, 496, 519, 541, 564, 587, 609, 632, 802, 825, 850, 873, 897, 921, 945, 969, 993, 1017, 1270] } }
451:         ],
452:       },
453:       { // 15
454:         refineLv: 15,
455:         effects: [
456:           { type: 'MAIN_STAT_C', multiValues: { ancient: [352, 706, 1063, 1422, 1784, 2148, 2515, 2885, 3256, 3631, 4008, 4388, 4770, 5155, 5543, 5933, 6326, 6721, 7120, 7521, 7925, 8332, 8741, 9153, 9569, 9987, 10408, 10832, 11258, 13309, 13750, 14194, 14642, 15093, 15546, 16002, 16462, 16926, 17393, 20427] } },
457:           { type: 'STAT_HP_C', multiValues: { ancient: [22, 43, 64, 85, 107, 128, 150, 171, 193, 215, 237, 259, 281, 303, 325, 347, 370, 392, 415, 437, 460, 483, 505, 528, 551, 574, 598, 621, 644, 817, 841, 865, 889, 913, 938, 962, 987, 1011, 1035, 1292] } }
458:         ],
459:       },
460:       { // 16
461:         refineLv: 16,
462:         effects: [
463:           { type: 'MAIN_STAT_C', multiValues: { ancient: [364, 731, 1101, 1472, 1847, 2224, 2604, 2986, 3371, 3759, 4149, 4542, 4937, 5336, 5737, 6141, 6548, 6957, 7369, 7785, 8203, 8624, 9048, 9474, 9904, 10337, 10772, 11211, 11653, 13762, 14218, 14678, 15142, 15609, 16078, 16550, 17026, 17506, 17988, 21111] } },
464:           { type: 'STAT_HP_C', multiValues: { ancient: [21, 43, 64, 86, 108, 130, 152, 174, 196, 218, 240, 263, 285, 308, 330, 353, 376, 398, 421, 444, 467, 491, 514, 537, 561, 584, 608, 631, 655, 831, 855, 880, 904, 928, 953, 978, 1003, 1028, 1053, 1314] } }
465:         ],
466:       },
467:       { // 17
468:         refineLv: 17,
469:         effects: [
470:           { type: 'MAIN_STAT_C', multiValues: { ancient: [377, 757, 1139, 1524, 1912, 2302, 2695, 3090, 3489, 3890, 4294, 4701, 5110, 5522, 5938, 6356, 6777, 7201, 7627, 8057, 8490, 8925, 9364, 9806, 10251, 10698, 11149, 11603, 12061, 14231, 14703, 15179, 15659, 16141, 16628, 17116, 17609, 18106, 18606, 21818] } },
471:           { type: 'STAT_HP_C', multiValues: { ancient: [22, 44, 66, 88, 110, 132, 155, 177, 200, 222, 245, 268, 290, 313, 336, 359, 383, 406, 429, 453, 476, 500, 523, 547, 571, 595, 619, 643, 667, 845, 870, 895, 920, 945, 970, 996, 1021, 1047, 1072, 1337] } }
472:         ],
473:       },
474:       { // 18
475:         refineLv: 18,
476:         effects: [
477:           { type: 'MAIN_STAT_C', multiValues: { ancient: [390, 783, 1178, 1577, 1978, 2382, 2786, 3198, 3610, 4026, 4444, 4865, 5289, 5715, 6145, 6578, 7013, 7452, 7894, 8339, 8786, 9237, 9691, 10149, 10609, 11072, 11539, 12009, 12482, 14716, 15204, 15697, 16194, 16694, 17197, 17702, 18212, 18727, 19243, 22548] } },
478:           { type: 'STAT_HP_C', multiValues: { ancient: [22, 45, 67, 90, 112, 135, 158, 180, 203, 226, 249, 273, 296, 319, 343, 366, 390, 413, 437, 461, 485, 509, 533, 557, 581, 606, 630, 655, 679, 860, 886, 911, 937, 962, 988, 1013, 1039, 1065, 1091, 1360] } }
479:         ],
480:       },
481:       { // 19
482:         refineLv: 19,
483:         effects: [
484:           { type: 'MAIN_STAT_C', multiValues: { ancient: [404, 811, 1220, 1632, 2048, 2466, 2887, 3311, 3737, 4167, 4600, 5035, 5474, 5916, 6361, 6808, 7259, 7713, 8171, 8631, 9094, 9561, 10031, 10504, 10981, 11460, 11943, 12430, 12920, 15219, 15724, 16234, 16749, 17265, 17786, 18310, 18837, 19369, 19904, 23306] } },
485:           { type: 'STAT_HP_C', multiValues: { ancient: [23, 46, 68, 91, 114, 137, 161, 184, 207, 231, 254, 278, 301, 325, 349, 373, 397, 421, 445, 469, 494, 518, 543, 567, 592, 617, 642, 667, 692, 876, 901, 927, 953, 979, 1005, 1031, 1057, 1084, 1111, 1384] } }
486:         ],
487:       },
488:       { // 20
489:         refineLv: 20,
490:         effects: [
491:           { type: 'MAIN_STAT_C', multiValues: { ancient: [418, 839, 1263, 1689, 2119, 2552, 2987, 3426, 3868, 4313, 4760, 5211, 5665, 6123, 6583, 7046, 7513, 7983, 8456, 8933, 9412, 9895, 10382, 10872, 11365, 11861, 12361, 12865, 13371, 15738, 16262, 16789, 17321, 17856, 18395, 18938, 19483, 20034, 20588, 24088] } },
492:           { type: 'STAT_HP_C', multiValues: { ancient: [23, 47, 70, 93, 117, 140, 164, 187, 211, 235, 259, 283, 307, 331, 355, 380, 404, 429, 453, 478, 503, 528, 553, 578, 603, 628, 653, 679, 704, 891, 917, 943, 970, 997, 1023, 1050, 1076, 1104, 1130, 1408] } }
493:         ],
494:       },
495:       { // 21
496:         refineLv: 21,
497:         effects: [
498:           { type: 'MAIN_STAT_C', multiValues: { ancient: [433, 868, 1307, 1749, 2194, 2641, 3092, 3546, 4004, 4464, 4927, 5394, 5864, 6337, 6814, 7293, 7776, 8263, 8753, 9246, 9742, 10242, 10746, 11252, 11763, 12277, 12794, 13315, 13840, 16276, 16819, 17364, 17915, 18469, 19026, 19588, 20153, 20722, 21295, 24900] } },
499:           { type: 'STAT_HP_C', multiValues: { ancient: [23, 47, 70, 94, 118, 142, 166, 190, 214, 238, 263, 287, 312, 336, 361, 386, 411, 436, 461, 486, 511, 536, 562, 587, 613, 638, 664, 690, 716, 906, 933, 959, 987, 1013, 1041, 1067, 1095, 1122, 1150, 1432] } }
500:         ],
501:       },
502:       { // 22
503:         refineLv: 22,
504:         effects: [
505:           { type: 'MAIN_STAT_C', multiValues: { ancient: [447, 898, 1352, 1810, 2270, 2733, 3200, 3670, 4143, 4620, 5099, 5582, 6069, 6559, 7052, 7548, 8048, 8552, 9058, 9569, 10083, 10600, 11121, 11646, 12174, 12706, 13241, 13781, 14324, 16832, 17394, 17959, 18528, 19101, 19679, 20260, 20846, 21434, 22028, 25739] } },
506:           { type: 'STAT_HP_C', multiValues: { ancient: [24, 48, 72, 96, 120, 145, 169, 194, 218, 243, 268, 293, 318, 343, 368, 393, 418, 444, 469, 495, 520, 546, 572, 598, 624, 650, 676, 703, 729, 923, 949, 977, 1004, 1032, 1059, 1087, 1114, 1142, 1170, 1457] } }
507:         ],
508:       },
509:       { // 23
510:         refineLv: 23,
511:         effects: [
512:           { type: 'MAIN_STAT_C', multiValues: { ancient: [463, 930, 1400, 1873, 2350, 2829, 3312, 3799, 4289, 4782, 5278, 5778, 6282, 6788, 7299, 7813, 8330, 8851, 9376, 9904, 10436, 10971, 11511, 12054, 12600, 13151, 13705, 14263, 14825, 17409, 17990, 18576, 19164, 19758, 20355, 20956, 21562, 22172, 22786, 26608] } },
513:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 49, 74, 98, 123, 148, 173, 198, 223, 248, 273, 298, 324, 349, 375, 400, 426, 452, 478, 504, 530, 556, 583, 609, 636, 662, 689, 716, 743, 939, 967, 994, 1022, 1050, 1078, 1106, 1134, 1163, 1191, 1483] } }
514:         ],
515:       },
516:       { // 24
517:         refineLv: 24,
518:         effects: [
519:           { type: 'MAIN_STAT_C', multiValues: { ancient: [479, 962, 1449, 1939, 2432, 2928, 3428, 3932, 4438, 4949, 5463, 5980, 6501, 7026, 7554, 8086, 8621, 9161, 9704, 10250, 10801, 11355, 11913, 12475, 13041, 13611, 14185, 14762, 15344, 18005, 18606, 19212, 19822, 20436, 21054, 21677, 22304, 22935, 23571, 27507] } },
520:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 50, 75, 100, 125, 150, 175, 201, 226, 252, 277, 303, 329, 355, 381, 407, 433, 460, 486, 513, 539, 566, 593, 620, 647, 674, 701, 728, 755, 955, 983, 1011, 1040, 1068, 1097, 1125, 1154, 1183, 1211, 1508] } }
521:         ],
522:       },
523:       { // 25
524:         refineLv: 25,
525:         effects: [
526:           { type: 'MAIN_STAT_C', multiValues: { ancient: [496, 996, 1500, 2006, 2517, 3031, 3548, 4069, 4594, 5122, 5654, 6189, 6729, 7272, 7818, 8369, 8923, 9481, 10043, 10609, 11179, 11753, 12330, 12912, 13498, 14087, 14681, 15279, 15881, 18622, 19245, 19872, 20503, 21139, 21778, 22423, 23071, 23725, 24383, 28438] } },
527:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 50, 76, 101, 127, 152, 178, 204, 230, 256, 282, 308, 335, 361, 388, 414, 441, 468, 495, 522, 549, 576, 603, 630, 658, 685, 713, 741, 769, 972, 1000, 1029, 1058, 1086, 1116, 1144, 1174, 1203, 1233, 1534] } }
528:         ],
529:       },
530:     ],
531:     effects: [
532:       {
533:         type: 'MAIN_STAT_C',
534:         multiValues: {
535:           ancient: [41155, 45302, 49483, 53703, 54887, 56111, 57376, 58684, 60035, 61431, 62875, 64366, 65976, 67642, 69366, 71150, 72997, 74909, 76887, 78935, 81054, 83248, 85518, 87868, 90300],
536:           serca: [78654, 80731, 82881, 85106, 87410, 89793, 92261, 94815, 97457, 100193, 103023, 105954, 108987, 112126, 115375, 118738, 121709, 124754, 127874, 131072, 134351, 137711, 141155, 144686, 148304]
537:         }
538:       },
539:       {
540:         type: 'STAT_HP_C',
541:         multiValues: {
542:           ancient: [4771, 5110, 5452, 5794, 5878, 5964, 6051, 6139, 6229, 6321, 6414, 6509, 6610, 6712, 6816, 6923, 7031, 7141, 7253, 7367, 7484, 7602, 7722, 7845, 7970],
543:           serca: [7498, 7615, 7735, 7858, 7982, 8108, 8237, 8368, 8501, 8637, 8775, 8916, 9059, 9205, 9353, 9504, 9635, 9768, 9903, 10039, 10178, 10318, 10461, 10605, 10751]
544:         }
545:       },
546:       {
547:         type: 'STAT_HP_P',
548:         grades: { low: [0, 35], mid: [36, 70], high: [71, 100] }
549:       }
550:     ]
551:   },
552:   { // 하의
553:     id: ID.PANTS,
554:     name: NAMES[ID.PANTS],
555:     iconPath: GET_ICON('PANTS'),
556:     multiName: { ancient: '운명의 업화 하의', serca: '운명의 전율 하의' },
557:     initItemLv: { ancient: 1590, serca: 1675 },
558:     adv_refine: [
559:       { // 6
560:         refineLv: 6,
561:         effects: [
562:           { type: 'MAIN_STAT_C', multiValues: { ancient: [250, 501, 754, 1009, 1265, 1523, 1783, 2045, 2308, 2573, 2839, 3108, 3378, 3650, 3924, 4199, 4477, 4756, 5037, 5320, 5605, 5892, 6181, 6471, 6764, 7058, 7354, 7653, 7953, 9542, 9866, 10192, 10520, 10850, 11184, 11519, 11856, 12196, 12539, 14913] } },
563:           { type: 'STAT_HP_C', multiValues: { ancient: [17, 34, 52, 69, 87, 104, 122, 140, 157, 175, 193, 211, 229, 247, 265, 283, 302, 320, 338, 357, 375, 394, 413, 431, 450, 469, 488, 507, 526, 675, 695, 715, 736, 756, 778, 798, 819, 840, 860, 1083] } }
564:         ],
565:       },
566:       { // 7
567:         refineLv: 7,
568:         effects: [
569:           { type: 'MAIN_STAT_C', multiValues: { ancient: [258, 518, 780, 1043, 1308, 1574, 1843, 2113, 2385, 2659, 2934, 3212, 3491, 3772, 4055, 4340, 4627, 4916, 5206, 5499, 5793, 6089, 6388, 6688, 6990, 7308, 7627, 7949, 8273, 9919, 10254, 10591, 10931, 11274, 11618, 11965, 12314, 12666, 13020, 15458] } },
570:           { type: 'STAT_HP_C', multiValues: { ancient: [17, 35, 53, 70, 88, 106, 124, 142, 160, 178, 196, 215, 233, 251, 270, 288, 307, 326, 344, 363, 382, 401, 420, 439, 458, 478, 498, 518, 538, 691, 711, 732, 753, 773, 795, 816, 838, 859, 879, 1105] } }
571:         ],
572:       },
573:       { // 8
574:         refineLv: 8,
575:         effects: [
576:           { type: 'MAIN_STAT_C', multiValues: { ancient: [266, 535, 805, 1077, 1351, 1626, 1904, 2183, 2464, 2747, 3032, 3319, 3608, 3898, 4191, 4485, 4781, 5080, 5380, 5682, 6000, 6319, 6641, 6965, 7292, 7620, 7951, 8284, 8620, 10310, 10657, 11006, 11358, 11712, 12069, 12428, 12789, 13153, 13519, 16023] } },
577:           { type: 'STAT_HP_C', multiValues: { ancient: [18, 36, 54, 72, 90, 108, 127, 145, 163, 182, 200, 219, 238, 256, 275, 294, 313, 332, 351, 370, 390, 410, 430, 450, 471, 491, 511, 532, 552, 707, 728, 750, 771, 791, 813, 835, 857, 878, 900, 1130] } }
578:         ],
579:       },
580:       { // 9
581:         refineLv: 9,
582:         effects: [
583:           { type: 'MAIN_STAT_C', multiValues: { ancient: [275, 553, 832, 1113, 1396, 1681, 1968, 2257, 2547, 2840, 3134, 3430, 3729, 4029, 4331, 4649, 4968, 5290, 5614, 5941, 6269, 6600, 6933, 7269, 7607, 7947, 8289, 8634, 8981, 10718, 11077, 11438, 11802, 12168, 12538, 12909, 13283, 13661, 14039, 16611] } },
584:           { type: 'STAT_HP_C', multiValues: { ancient: [18, 37, 55, 73, 92, 110, 129, 148, 166, 185, 204, 223, 242, 261, 280, 300, 320, 340, 360, 381, 401, 421, 442, 462, 483, 504, 525, 546, 566, 723, 745, 767, 788, 810, 832, 853, 876, 897, 920, 1153] } }
585:         ],
586:       },
587:       { // 10
588:         refineLv: 10,
589:         effects: [
590:           { type: 'MAIN_STAT_C', multiValues: { ancient: [285, 572, 861, 1151, 1444, 1738, 2034, 2333, 2633, 2935, 3253, 3572, 3894, 4218, 4545, 4873, 5204, 5537, 5873, 6211, 6551, 6893, 7238, 7585, 7935, 8287, 8641, 8998, 9357, 11142, 11513, 11887, 12265, 12643, 13025, 13410, 13798, 14187, 14580, 17223] } },
591:           { type: 'STAT_HP_C', multiValues: { ancient: [18, 37, 56, 74, 93, 112, 131, 150, 169, 188, 208, 228, 248, 268, 289, 309, 329, 350, 370, 391, 412, 433, 454, 474, 495, 517, 538, 559, 580, 740, 761, 784, 805, 828, 850, 873, 895, 917, 940, 1177] } }
592:         ],
593:       },
594:       { // 11
595:         refineLv: 11,
596:         effects: [
597:           { type: 'MAIN_STAT_C', multiValues: { ancient: [294, 590, 889, 1189, 1491, 1809, 2128, 2450, 2774, 3101, 3429, 3760, 4093, 4429, 4767, 5107, 5449, 5794, 6141, 6491, 6843, 7197, 7554, 7913, 8275, 8639, 9006, 9376, 9747, 11581, 11966, 12354, 12743, 13136, 13532, 13929, 14330, 14733, 15140, 17856] } },
598:           { type: 'STAT_HP_C', multiValues: { ancient: [19, 38, 57, 76, 95, 115, 135, 155, 175, 196, 216, 236, 257, 277, 298, 319, 340, 361, 381, 402, 424, 445, 466, 487, 509, 530, 552, 573, 595, 757, 780, 802, 824, 847, 869, 892, 915, 938, 961, 1201] } }
599:         ],
600:       },
601:       { // 12
602:         refineLv: 12,
603:         effects: [
604:           { type: 'MAIN_STAT_C', multiValues: { ancient: [318, 637, 959, 1283, 1610, 1938, 2269, 2602, 2938, 3276, 3616, 3958, 4303, 4650, 5000, 5352, 5706, 6063, 6422, 6784, 7148, 7515, 7885, 8256, 8631, 9008, 9388, 9770, 10155, 12041, 12438, 12839, 13242, 13649, 14058, 14470, 14885, 15303, 15723, 18515] } },
605:           { type: 'STAT_HP_C', multiValues: { ancient: [20, 40, 60, 80, 101, 121, 141, 162, 182, 203, 224, 245, 266, 286, 307, 329, 350, 371, 392, 414, 435, 457, 478, 500, 522, 544, 566, 588, 610, 774, 797, 820, 843, 866, 889, 912, 935, 958, 981, 1226] } }
606:         ],
607:       },
608:       { // 13
609:         refineLv: 13,
610:         effects: [
611:           { type: 'MAIN_STAT_C', multiValues: { ancient: [328, 659, 992, 1328, 1666, 2006, 2348, 2693, 3040, 3390, 3742, 4096, 4453, 4812, 5174, 5538, 5905, 6275, 6646, 7021, 7398, 7778, 8160, 8545, 8933, 9323, 9716, 10111, 10510, 12448, 12860, 13275, 13693, 14113, 14537, 14964, 15393, 15825, 16260, 19130] } },
612:           { type: 'STAT_HP_C', multiValues: { ancient: [20, 40, 61, 81, 102, 123, 144, 165, 185, 206, 228, 249, 270, 291, 313, 334, 356, 377, 399, 421, 443, 465, 487, 509, 531, 553, 576, 598, 621, 788, 811, 834, 857, 880, 904, 927, 952, 975, 999, 1248] } }
613:         ],
614:       },
615:       { // 14
616:         refineLv: 14,
617:         effects: [
618:           { type: 'MAIN_STAT_C', multiValues: { ancient: [340, 682, 1027, 1374, 1724, 2076, 2430, 2787, 3146, 3508, 3872, 4239, 4609, 4980, 5355, 5732, 6112, 6494, 6879, 7267, 7657, 8050, 8445, 8844, 9245, 9649, 10056, 10465, 10877, 12871, 13298, 13727, 14159, 14594, 15033, 15474, 15918, 16366, 16817, 19768] } },
619:           { type: 'STAT_HP_C', multiValues: { ancient: [21, 42, 63, 83, 104, 126, 147, 168, 189, 211, 232, 254, 275, 297, 319, 341, 363, 385, 407, 429, 451, 474, 496, 519, 541, 564, 587, 609, 632, 802, 825, 850, 873, 897, 921, 945, 969, 993, 1017, 1270] } }
620:         ],
621:       },
622:       { // 15
623:         refineLv: 15,
624:         effects: [
625:           { type: 'MAIN_STAT_C', multiValues: { ancient: [352, 706, 1063, 1422, 1784, 2148, 2515, 2885, 3256, 3631, 4008, 4388, 4770, 5155, 5543, 5933, 6326, 6721, 7120, 7521, 7925, 8332, 8741, 9153, 9569, 9987, 10408, 10832, 11258, 13309, 13750, 14194, 14642, 15093, 15546, 16002, 16462, 16926, 17393, 20427] } },
626:           { type: 'STAT_HP_C', multiValues: { ancient: [22, 43, 64, 85, 107, 128, 150, 171, 193, 215, 237, 259, 281, 303, 325, 347, 370, 392, 415, 437, 460, 483, 505, 528, 551, 574, 598, 621, 644, 817, 841, 865, 889, 913, 938, 962, 987, 1011, 1035, 1292] } }
627:         ],
628:       },
629:       { // 16
630:         refineLv: 16,
631:         effects: [
632:           { type: 'MAIN_STAT_C', multiValues: { ancient: [364, 731, 1101, 1472, 1847, 2224, 2604, 2986, 3371, 3759, 4149, 4542, 4937, 5336, 5737, 6141, 6548, 6957, 7369, 7785, 8203, 8624, 9048, 9474, 9904, 10337, 10772, 11211, 11653, 13762, 14218, 14678, 15142, 15609, 16078, 16550, 17026, 17506, 17988, 21111] } },
633:           { type: 'STAT_HP_C', multiValues: { ancient: [21, 43, 64, 86, 108, 130, 152, 174, 196, 218, 240, 263, 285, 308, 330, 353, 376, 398, 421, 444, 467, 491, 514, 537, 561, 584, 608, 631, 655, 831, 855, 880, 904, 928, 953, 978, 1003, 1028, 1053, 1314] } }
634:         ],
635:       },
636:       { // 17
637:         refineLv: 17,
638:         effects: [
639:           { type: 'MAIN_STAT_C', multiValues: { ancient: [377, 757, 1139, 1524, 1912, 2302, 2695, 3090, 3489, 3890, 4294, 4701, 5110, 5522, 5938, 6356, 6777, 7201, 7627, 8057, 8490, 8925, 9364, 9806, 10251, 10698, 11149, 11603, 12061, 14231, 14703, 15179, 15659, 16141, 16628, 17116, 17609, 18106, 18606, 21818] } },
640:           { type: 'STAT_HP_C', multiValues: { ancient: [22, 44, 66, 88, 110, 132, 155, 177, 200, 222, 245, 268, 290, 313, 336, 359, 383, 406, 429, 453, 476, 500, 523, 547, 571, 595, 619, 643, 667, 845, 870, 895, 920, 945, 970, 996, 1021, 1047, 1072, 1337] } }
641:         ],
642:       },
643:       { // 18
644:         refineLv: 18,
645:         effects: [
646:           { type: 'MAIN_STAT_C', multiValues: { ancient: [390, 783, 1178, 1577, 1978, 2382, 2786, 3198, 3610, 4026, 4444, 4865, 5289, 5715, 6145, 6578, 7013, 7452, 7894, 8339, 8786, 9237, 9691, 10149, 10609, 11072, 11539, 12009, 12482, 14716, 15204, 15697, 16194, 16694, 17197, 17702, 18212, 18727, 19243, 22548] } },
647:           { type: 'STAT_HP_C', multiValues: { ancient: [22, 45, 67, 90, 112, 135, 158, 180, 203, 226, 249, 273, 296, 319, 343, 366, 390, 413, 437, 461, 485, 509, 533, 557, 581, 606, 630, 655, 679, 860, 886, 911, 937, 962, 988, 1013, 1039, 1065, 1091, 1360] } }
648:         ],
649:       },
650:       { // 19
651:         refineLv: 19,
652:         effects: [
653:           { type: 'MAIN_STAT_C', multiValues: { ancient: [404, 811, 1220, 1632, 2048, 2466, 2887, 3311, 3737, 4167, 4600, 5035, 5474, 5916, 6361, 6808, 7259, 7713, 8171, 8631, 9094, 9561, 10031, 10504, 10981, 11460, 11943, 12430, 12920, 15219, 15724, 16234, 16749, 17265, 17786, 18310, 18837, 19369, 19904, 23306] } },
654:           { type: 'STAT_HP_C', multiValues: { ancient: [23, 46, 68, 91, 114, 137, 161, 184, 207, 231, 254, 278, 301, 325, 349, 373, 397, 421, 445, 469, 494, 518, 543, 567, 592, 617, 642, 667, 692, 876, 901, 927, 953, 979, 1005, 1031, 1057, 1084, 1111, 1384] } }
655:         ],
656:       },
657:       { // 20
658:         refineLv: 20,
659:         effects: [
660:           { type: 'MAIN_STAT_C', multiValues: { ancient: [418, 839, 1263, 1689, 2119, 2552, 2987, 3426, 3868, 4313, 4760, 5211, 5665, 6123, 6583, 7046, 7513, 7983, 8456, 8933, 9412, 9895, 10382, 10872, 11365, 11861, 12361, 12865, 13371, 15738, 16262, 16789, 17321, 17856, 18395, 18938, 19483, 20034, 20588, 24088] } },
661:           { type: 'STAT_HP_C', multiValues: { ancient: [23, 47, 70, 93, 117, 140, 164, 187, 211, 235, 259, 283, 307, 331, 355, 380, 404, 429, 453, 478, 503, 528, 553, 578, 603, 628, 653, 679, 704, 891, 917, 943, 970, 997, 1023, 1050, 1076, 1104, 1130, 1408] } }
662:         ],
663:       },
664:       { // 21
665:         refineLv: 21,
666:         effects: [
667:           { type: 'MAIN_STAT_C', multiValues: { ancient: [433, 868, 1307, 1749, 2194, 2641, 3092, 3546, 4004, 4464, 4927, 5394, 5864, 6337, 6814, 7293, 7776, 8263, 8753, 9246, 9742, 10242, 10746, 11252, 11763, 12277, 12794, 13315, 13840, 16276, 16819, 17364, 17915, 18469, 19026, 19588, 20153, 20722, 21295, 24900] } },
668:           { type: 'STAT_HP_C', multiValues: { ancient: [23, 47, 70, 94, 118, 142, 166, 190, 214, 238, 263, 287, 312, 336, 361, 386, 411, 436, 461, 486, 511, 536, 562, 587, 613, 638, 664, 690, 716, 906, 933, 959, 987, 1013, 1041, 1067, 1095, 1122, 1150, 1432] } }
669:         ],
670:       },
671:       { // 22
672:         refineLv: 22,
673:         effects: [
674:           { type: 'MAIN_STAT_C', multiValues: { ancient: [447, 898, 1352, 1810, 2270, 2733, 3200, 3670, 4143, 4620, 5099, 5582, 6069, 6559, 7052, 7548, 8048, 8552, 9058, 9569, 10083, 10600, 11121, 11646, 12174, 12706, 13241, 13781, 14324, 16832, 17394, 17959, 18528, 19101, 19679, 20260, 20846, 21434, 22028, 25739] } },
675:           { type: 'STAT_HP_C', multiValues: { ancient: [24, 48, 72, 96, 120, 145, 169, 194, 218, 243, 268, 293, 318, 343, 368, 393, 418, 444, 469, 495, 520, 546, 572, 598, 624, 650, 676, 703, 729, 923, 949, 977, 1004, 1032, 1059, 1087, 1114, 1142, 1170, 1457] } }
676:         ],
677:       },
678:       { // 23
679:         refineLv: 23,
680:         effects: [
681:           { type: 'MAIN_STAT_C', multiValues: { ancient: [463, 930, 1400, 1873, 2350, 2829, 3312, 3799, 4289, 4782, 5278, 5778, 6282, 6788, 7299, 7813, 8330, 8851, 9376, 9904, 10436, 10971, 11511, 12054, 12600, 13151, 13705, 14263, 14825, 17409, 17990, 18576, 19164, 19758, 20355, 20956, 21562, 22172, 22786, 26608] } },
682:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 49, 74, 98, 123, 148, 173, 198, 223, 248, 273, 298, 324, 349, 375, 400, 426, 452, 478, 504, 530, 556, 583, 609, 636, 662, 689, 716, 743, 939, 967, 994, 1022, 1050, 1078, 1106, 1134, 1163, 1191, 1483] } }
683:         ],
684:       },
685:       { // 24
686:         refineLv: 24,
687:         effects: [
688:           { type: 'MAIN_STAT_C', multiValues: { ancient: [479, 962, 1449, 1939, 2432, 2928, 3428, 3932, 4438, 4949, 5463, 5980, 6501, 7026, 7554, 8086, 8621, 9161, 9704, 10250, 10801, 11355, 11913, 12475, 13041, 13611, 14185, 14762, 15344, 18005, 18606, 19212, 19822, 20436, 21054, 21677, 22304, 22935, 23571, 27507] } },
689:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 50, 75, 100, 125, 150, 175, 201, 226, 252, 277, 303, 329, 355, 381, 407, 433, 460, 486, 513, 539, 566, 593, 620, 647, 674, 701, 728, 755, 955, 983, 1011, 1040, 1068, 1097, 1125, 1154, 1183, 1211, 1508] } }
690:         ],
691:       },
692:       { // 25
693:         refineLv: 25,
694:         effects: [
695:           { type: 'MAIN_STAT_C', multiValues: { ancient: [496, 996, 1500, 2006, 2517, 3031, 3548, 4069, 4594, 5122, 5654, 6189, 6729, 7272, 7818, 8369, 8923, 9481, 10043, 10609, 11179, 11753, 12330, 12912, 13498, 14087, 14681, 15279, 15881, 18622, 19245, 19872, 20503, 21139, 21778, 22423, 23071, 23725, 24383, 28438] } },
696:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 50, 76, 101, 127, 152, 178, 204, 230, 256, 282, 308, 335, 361, 388, 414, 441, 468, 495, 522, 549, 576, 603, 630, 658, 685, 713, 741, 769, 972, 1000, 1029, 1058, 1086, 1116, 1144, 1174, 1203, 1233, 1534] } }
697:         ],
698:       },
699:     ],
700:     effects: [
701:       {
702:         type: 'MAIN_STAT_C',
703:         multiValues: {
704:           ancient: [41155, 45302, 49483, 53703, 54887, 56111, 57376, 58684, 60035, 61431, 62875, 64366, 65976, 67642, 69366, 71150, 72997, 74909, 76887, 78935, 81054, 83248, 85518, 87868, 90300],
705:           serca: [78654, 80731, 82881, 85106, 87410, 89793, 92261, 94815, 97457, 100193, 103023, 105954, 108987, 112126, 115375, 118738, 121709, 124754, 127874, 131072, 134351, 137711, 141155, 144686, 148304]
706:         }
707:       },
708:       {
709:         type: 'STAT_HP_C',
710:         multiValues: {
711:           ancient: [4771, 5110, 5452, 5794, 5878, 5964, 6051, 6139, 6229, 6321, 6414, 6509, 6610, 6712, 6816, 6923, 7031, 7141, 7253, 7367, 7484, 7602, 7722, 7845, 7970],
712:           serca: [7498, 7615, 7735, 7858, 7982, 8108, 8237, 8368, 8501, 8637, 8775, 8916, 9059, 9205, 9353, 9504, 9635, 9768, 9903, 10039, 10178, 10318, 10461, 10605, 10751]
713:         }
714:       },
715:       {
716:         type: 'STAT_HP_P',
717:         grades: { low: [0, 35], mid: [36, 70], high: [71, 100] }
718:       }
719:     ]
720:   },
721:   { // 장갑
722:     id: ID.GLOVE,
723:     name: NAMES[ID.GLOVE],
724:     iconPath: GET_ICON('GLOVE'),
725:     multiName: { ancient: '운명의 업화 장갑', serca: '운명의 전율 장갑' },
726:     initItemLv: { ancient: 1590, serca: 1675 },
727:     adv_refine: [
728:       { // 6
729:         refineLv: 6,
730:         effects: [
731:           { type: 'MAIN_STAT_C', multiValues: { ancient: [250, 501, 754, 1009, 1265, 1523, 1783, 2045, 2308, 2573, 2839, 3108, 3378, 3650, 3924, 4199, 4477, 4756, 5037, 5320, 5605, 5892, 6181, 6471, 6764, 7058, 7354, 7653, 7953, 9542, 9866, 10192, 10520, 10850, 11184, 11519, 11856, 12196, 12539, 14913] } },
732:           { type: 'STAT_HP_C', multiValues: { ancient: [17, 34, 52, 69, 87, 104, 122, 140, 157, 175, 193, 211, 229, 247, 265, 283, 302, 320, 338, 357, 375, 394, 413, 431, 450, 469, 488, 507, 526, 675, 695, 715, 736, 756, 778, 798, 819, 840, 860, 1083] } }
733:         ],
734:       },
735:       { // 7
736:         refineLv: 7,
737:         effects: [
738:           { type: 'MAIN_STAT_C', multiValues: { ancient: [258, 518, 780, 1043, 1308, 1574, 1843, 2113, 2385, 2659, 2934, 3212, 3491, 3772, 4055, 4340, 4627, 4916, 5206, 5499, 5793, 6089, 6388, 6688, 6990, 7308, 7627, 7949, 8273, 9919, 10254, 10591, 10931, 11274, 11618, 11965, 12314, 12666, 13020, 15458] } },
739:           { type: 'STAT_HP_C', multiValues: { ancient: [17, 35, 53, 70, 88, 106, 124, 142, 160, 178, 196, 215, 233, 251, 270, 288, 307, 326, 344, 363, 382, 401, 420, 439, 458, 478, 498, 518, 538, 691, 711, 732, 753, 773, 795, 816, 838, 859, 879, 1105] } }
740:         ],
741:       },
742:       { // 8
743:         refineLv: 8,
744:         effects: [
745:           { type: 'MAIN_STAT_C', multiValues: { ancient: [266, 535, 805, 1077, 1351, 1626, 1904, 2183, 2464, 2747, 3032, 3319, 3608, 3898, 4191, 4485, 4781, 5080, 5380, 5682, 6000, 6319, 6641, 6965, 7292, 7620, 7951, 8284, 8620, 10310, 10657, 11006, 11358, 11712, 12069, 12428, 12789, 13153, 13519, 16023] } },
746:           { type: 'STAT_HP_C', multiValues: { ancient: [18, 36, 54, 72, 90, 108, 127, 145, 163, 182, 200, 219, 238, 256, 275, 294, 313, 332, 351, 370, 390, 410, 430, 450, 471, 491, 511, 532, 552, 707, 728, 750, 771, 791, 813, 835, 857, 878, 900, 1130] } }
747:         ],
748:       },
749:       { // 9
750:         refineLv: 9,
751:         effects: [
752:           { type: 'MAIN_STAT_C', multiValues: { ancient: [275, 553, 832, 1113, 1396, 1681, 1968, 2257, 2547, 2840, 3134, 3430, 3729, 4029, 4331, 4649, 4968, 5290, 5614, 5941, 6269, 6600, 6933, 7269, 7607, 7947, 8289, 8634, 8981, 10718, 11077, 11438, 11802, 12168, 12538, 12909, 13283, 13661, 14039, 16611] } },
753:           { type: 'STAT_HP_C', multiValues: { ancient: [18, 37, 55, 73, 92, 110, 129, 148, 166, 185, 204, 223, 242, 261, 280, 300, 320, 340, 360, 381, 401, 421, 442, 462, 483, 504, 525, 546, 566, 723, 745, 767, 788, 810, 832, 853, 876, 897, 920, 1153] } }
754:         ],
755:       },
756:       { // 10
757:         refineLv: 10,
758:         effects: [
759:           { type: 'MAIN_STAT_C', multiValues: { ancient: [285, 572, 861, 1151, 1444, 1738, 2034, 2333, 2633, 2935, 3253, 3572, 3894, 4218, 4545, 4873, 5204, 5537, 5873, 6211, 6551, 6893, 7238, 7585, 7935, 8287, 8641, 8998, 9357, 11142, 11513, 11887, 12265, 12643, 13025, 13410, 13798, 14187, 14580, 17223] } },
760:           { type: 'STAT_HP_C', multiValues: { ancient: [18, 37, 56, 74, 93, 112, 131, 150, 169, 188, 208, 228, 248, 268, 289, 309, 329, 350, 370, 391, 412, 433, 454, 474, 495, 517, 538, 559, 580, 740, 761, 784, 805, 828, 850, 873, 895, 917, 940, 1177] } }
761:         ],
762:       },
763:       { // 11
764:         refineLv: 11,
765:         effects: [
766:           { type: 'MAIN_STAT_C', multiValues: { ancient: [294, 590, 889, 1189, 1491, 1809, 2128, 2450, 2774, 3101, 3429, 3760, 4093, 4429, 4767, 5107, 5449, 5794, 6141, 6491, 6843, 7197, 7554, 7913, 8275, 8639, 9006, 9376, 9747, 11581, 11966, 12354, 12743, 13136, 13532, 13929, 14330, 14733, 15140, 17856] } },
767:           { type: 'STAT_HP_C', multiValues: { ancient: [19, 38, 57, 76, 95, 115, 135, 155, 175, 196, 216, 236, 257, 277, 298, 319, 340, 361, 381, 402, 424, 445, 466, 487, 509, 530, 552, 573, 595, 757, 780, 802, 824, 847, 869, 892, 915, 938, 961, 1201] } }
768:         ],
769:       },
770:       { // 12
771:         refineLv: 12,
772:         effects: [
773:           { type: 'MAIN_STAT_C', multiValues: { ancient: [318, 637, 959, 1283, 1610, 1938, 2269, 2602, 2938, 3276, 3616, 3958, 4303, 4650, 5000, 5352, 5706, 6063, 6422, 6784, 7148, 7515, 7885, 8256, 8631, 9008, 9388, 9770, 10155, 12041, 12438, 12839, 13242, 13649, 14058, 14470, 14885, 15303, 15723, 18515] } },
774:           { type: 'STAT_HP_C', multiValues: { ancient: [20, 40, 60, 80, 101, 121, 141, 162, 182, 203, 224, 245, 266, 286, 307, 329, 350, 371, 392, 414, 435, 457, 478, 500, 522, 544, 566, 588, 610, 774, 797, 820, 843, 866, 889, 912, 935, 958, 981, 1226] } }
775:         ],
776:       },
777:       { // 13
778:         refineLv: 13,
779:         effects: [
780:           { type: 'MAIN_STAT_C', multiValues: { ancient: [328, 659, 992, 1328, 1666, 2006, 2348, 2693, 3040, 3390, 3742, 4096, 4453, 4812, 5174, 5538, 5905, 6275, 6646, 7021, 7398, 7778, 8160, 8545, 8933, 9323, 9716, 10111, 10510, 12448, 12860, 13275, 13693, 14113, 14537, 14964, 15393, 15825, 16260, 19130] } },
781:           { type: 'STAT_HP_C', multiValues: { ancient: [20, 40, 61, 81, 102, 123, 144, 165, 185, 206, 228, 249, 270, 291, 313, 334, 356, 377, 399, 421, 443, 465, 487, 509, 531, 553, 576, 598, 621, 788, 811, 834, 857, 880, 904, 927, 952, 975, 999, 1248] } }
782:         ],
783:       },
784:       { // 14
785:         refineLv: 14,
786:         effects: [
787:           { type: 'MAIN_STAT_C', multiValues: { ancient: [340, 682, 1027, 1374, 1724, 2076, 2430, 2787, 3146, 3508, 3872, 4239, 4609, 4980, 5355, 5732, 6112, 6494, 6879, 7267, 7657, 8050, 8445, 8844, 9245, 9649, 10056, 10465, 10877, 12871, 13298, 13727, 14159, 14594, 15033, 15474, 15918, 16366, 16817, 19768] } },
788:           { type: 'STAT_HP_C', multiValues: { ancient: [21, 42, 63, 83, 104, 126, 147, 168, 189, 211, 232, 254, 275, 297, 319, 341, 363, 385, 407, 429, 451, 474, 496, 519, 541, 564, 587, 609, 632, 802, 825, 850, 873, 897, 921, 945, 969, 993, 1017, 1270] } }
789:         ],
790:       },
791:       { // 15
792:         refineLv: 15,
793:         effects: [
794:           { type: 'MAIN_STAT_C', multiValues: { ancient: [352, 706, 1063, 1422, 1784, 2148, 2515, 2885, 3256, 3631, 4008, 4388, 4770, 5155, 5543, 5933, 6326, 6721, 7120, 7521, 7925, 8332, 8741, 9153, 9569, 9987, 10408, 10832, 11258, 13309, 13750, 14194, 14642, 15093, 15546, 16002, 16462, 16926, 17393, 20427] } },
795:           { type: 'STAT_HP_C', multiValues: { ancient: [22, 43, 64, 85, 107, 128, 150, 171, 193, 215, 237, 259, 281, 303, 325, 347, 370, 392, 415, 437, 460, 483, 505, 528, 551, 574, 598, 621, 644, 817, 841, 865, 889, 913, 938, 962, 987, 1011, 1035, 1292] } }
796:         ],
797:       },
798:       { // 16
799:         refineLv: 16,
800:         effects: [
801:           { type: 'MAIN_STAT_C', multiValues: { ancient: [364, 731, 1101, 1472, 1847, 2224, 2604, 2986, 3371, 3759, 4149, 4542, 4937, 5336, 5737, 6141, 6548, 6957, 7369, 7785, 8203, 8624, 9048, 9474, 9904, 10337, 10772, 11211, 11653, 13762, 14218, 14678, 15142, 15609, 16078, 16550, 17026, 17506, 17988, 21111] } },
802:           { type: 'STAT_HP_C', multiValues: { ancient: [21, 43, 64, 86, 108, 130, 152, 174, 196, 218, 240, 263, 285, 308, 330, 353, 376, 398, 421, 444, 467, 491, 514, 537, 561, 584, 608, 631, 655, 831, 855, 880, 904, 928, 953, 978, 1003, 1028, 1053, 1314] } }
803:         ],
804:       },
805:       { // 17
806:         refineLv: 17,
807:         effects: [
808:           { type: 'MAIN_STAT_C', multiValues: { ancient: [377, 757, 1139, 1524, 1912, 2302, 2695, 3090, 3489, 3890, 4294, 4701, 5110, 5522, 5938, 6356, 6777, 7201, 7627, 8057, 8490, 8925, 9364, 9806, 10251, 10698, 11149, 11603, 12061, 14231, 14703, 15179, 15659, 16141, 16628, 17116, 17609, 18106, 18606, 21818] } },
809:           { type: 'STAT_HP_C', multiValues: { ancient: [22, 44, 66, 88, 110, 132, 155, 177, 200, 222, 245, 268, 290, 313, 336, 359, 383, 406, 429, 453, 476, 500, 523, 547, 571, 595, 619, 643, 667, 845, 870, 895, 920, 945, 970, 996, 1021, 1047, 1072, 1337] } }
810:         ],
811:       },
812:       { // 18
813:         refineLv: 18,
814:         effects: [
815:           { type: 'MAIN_STAT_C', multiValues: { ancient: [390, 783, 1178, 1577, 1978, 2382, 2786, 3198, 3610, 4026, 4444, 4865, 5289, 5715, 6145, 6578, 7013, 7452, 7894, 8339, 8786, 9237, 9691, 10149, 10609, 11072, 11539, 12009, 12482, 14716, 15204, 15697, 16194, 16694, 17197, 17702, 18212, 18727, 19243, 22548] } },
816:           { type: 'STAT_HP_C', multiValues: { ancient: [22, 45, 67, 90, 112, 135, 158, 180, 203, 226, 249, 273, 296, 319, 343, 366, 390, 413, 437, 461, 485, 509, 533, 557, 581, 606, 630, 655, 679, 860, 886, 911, 937, 962, 988, 1013, 1039, 1065, 1091, 1360] } }
817:         ],
818:       },
819:       { // 19
820:         refineLv: 19,
821:         effects: [
822:           { type: 'MAIN_STAT_C', multiValues: { ancient: [404, 811, 1220, 1632, 2048, 2466, 2887, 3311, 3737, 4167, 4600, 5035, 5474, 5916, 6361, 6808, 7259, 7713, 8171, 8631, 9094, 9561, 10031, 10504, 10981, 11460, 11943, 12430, 12920, 15219, 15724, 16234, 16749, 17265, 17786, 18310, 18837, 19369, 19904, 23306] } },
823:           { type: 'STAT_HP_C', multiValues: { ancient: [23, 46, 68, 91, 114, 137, 161, 184, 207, 231, 254, 278, 301, 325, 349, 373, 397, 421, 445, 469, 494, 518, 543, 567, 592, 617, 642, 667, 692, 876, 901, 927, 953, 979, 1005, 1031, 1057, 1084, 1111, 1384] } }
824:         ],
825:       },
826:       { // 20
827:         refineLv: 20,
828:         effects: [
829:           { type: 'MAIN_STAT_C', multiValues: { ancient: [418, 839, 1263, 1689, 2119, 2552, 2987, 3426, 3868, 4313, 4760, 5211, 5665, 6123, 6583, 7046, 7513, 7983, 8456, 8933, 9412, 9895, 10382, 10872, 11365, 11861, 12361, 12865, 13371, 15738, 16262, 16789, 17321, 17856, 18395, 18938, 19483, 20034, 20588, 24088] } },
830:           { type: 'STAT_HP_C', multiValues: { ancient: [23, 47, 70, 93, 117, 140, 164, 187, 211, 235, 259, 283, 307, 331, 355, 380, 404, 429, 453, 478, 503, 528, 553, 578, 603, 628, 653, 679, 704, 891, 917, 943, 970, 997, 1023, 1050, 1076, 1104, 1130, 1408] } }
831:         ],
832:       },
833:       { // 21
834:         refineLv: 21,
835:         effects: [
836:           { type: 'MAIN_STAT_C', multiValues: { ancient: [433, 868, 1307, 1749, 2194, 2641, 3092, 3546, 4004, 4464, 4927, 5394, 5864, 6337, 6814, 7293, 7776, 8263, 8753, 9246, 9742, 10242, 10746, 11252, 11763, 12277, 12794, 13315, 13840, 16276, 16819, 17364, 17915, 18469, 19026, 19588, 20153, 20722, 21295, 24900] } },
837:           { type: 'STAT_HP_C', multiValues: { ancient: [23, 47, 70, 94, 118, 142, 166, 190, 214, 238, 263, 287, 312, 336, 361, 386, 411, 436, 461, 486, 511, 536, 562, 587, 613, 638, 664, 690, 716, 906, 933, 959, 987, 1013, 1041, 1067, 1095, 1122, 1150, 1432] } }
838:         ],
839:       },
840:       { // 22
841:         refineLv: 22,
842:         effects: [
843:           { type: 'MAIN_STAT_C', multiValues: { ancient: [447, 898, 1352, 1810, 2270, 2733, 3200, 3670, 4143, 4620, 5099, 5582, 6069, 6559, 7052, 7548, 8048, 8552, 9058, 9569, 10083, 10600, 11121, 11646, 12174, 12706, 13241, 13781, 14324, 16832, 17394, 17959, 18528, 19101, 19679, 20260, 20846, 21434, 22028, 25739] } },
844:           { type: 'STAT_HP_C', multiValues: { ancient: [24, 48, 72, 96, 120, 145, 169, 194, 218, 243, 268, 293, 318, 343, 368, 393, 418, 444, 469, 495, 520, 546, 572, 598, 624, 650, 676, 703, 729, 923, 949, 977, 1004, 1032, 1059, 1087, 1114, 1142, 1170, 1457] } }
845:         ],
846:       },
847:       { // 23
848:         refineLv: 23,
849:         effects: [
850:           { type: 'MAIN_STAT_C', multiValues: { ancient: [463, 930, 1400, 1873, 2350, 2829, 3312, 3799, 4289, 4782, 5278, 5778, 6282, 6788, 7299, 7813, 8330, 8851, 9376, 9904, 10436, 10971, 11511, 12054, 12600, 13151, 13705, 14263, 14825, 17409, 17990, 18576, 19164, 19758, 20355, 20956, 21562, 22172, 22786, 26608] } },
851:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 49, 74, 98, 123, 148, 173, 198, 223, 248, 273, 298, 324, 349, 375, 400, 426, 452, 478, 504, 530, 556, 583, 609, 636, 662, 689, 716, 743, 939, 967, 994, 1022, 1050, 1078, 1106, 1134, 1163, 1191, 1483] } }
852:         ],
853:       },
854:       { // 24
855:         refineLv: 24,
856:         effects: [
857:           { type: 'MAIN_STAT_C', multiValues: { ancient: [479, 962, 1449, 1939, 2432, 2928, 3428, 3932, 4438, 4949, 5463, 5980, 6501, 7026, 7554, 8086, 8621, 9161, 9704, 10250, 10801, 11355, 11913, 12475, 13041, 13611, 14185, 14762, 15344, 18005, 18606, 19212, 19822, 20436, 21054, 21677, 22304, 22935, 23571, 27507] } },
858:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 50, 75, 100, 125, 150, 175, 201, 226, 252, 277, 303, 329, 355, 381, 407, 433, 460, 486, 513, 539, 566, 593, 620, 647, 674, 701, 728, 755, 955, 983, 1011, 1040, 1068, 1097, 1125, 1154, 1183, 1211, 1508] } }
859:         ],
860:       },
861:       { // 25
862:         refineLv: 25,
863:         effects: [
864:           { type: 'MAIN_STAT_C', multiValues: { ancient: [496, 996, 1500, 2006, 2517, 3031, 3548, 4069, 4594, 5122, 5654, 6189, 6729, 7272, 7818, 8369, 8923, 9481, 10043, 10609, 11179, 11753, 12330, 12912, 13498, 14087, 14681, 15279, 15881, 18622, 19245, 19872, 20503, 21139, 21778, 22423, 23071, 23725, 24383, 28438] } },
865:           { type: 'STAT_HP_C', multiValues: { ancient: [25, 50, 76, 101, 127, 152, 178, 204, 230, 256, 282, 308, 335, 361, 388, 414, 441, 468, 495, 522, 549, 576, 603, 630, 658, 685, 713, 741, 769, 972, 1000, 1029, 1058, 1086, 1116, 1144, 1174, 1203, 1233, 1534] } }
866:         ],
867:       },
868:     ],
869:     effects: [
870:       {
871:         type: 'MAIN_STAT_C',
872:         multiValues: {
873:           ancient: [41155, 45302, 49483, 53703, 54887, 56111, 57376, 58684, 60035, 61431, 62875, 64366, 65976, 67642, 69366, 71150, 72997, 74909, 76887, 78935, 81054, 83248, 85518, 87868, 90300],
874:           serca: [78654, 80731, 82881, 85106, 87410, 89793, 92261, 94815, 97457, 100193, 103023, 105954, 108987, 112126, 115375, 118738, 121709, 124754, 127874, 131072, 134351, 137711, 141155, 144686, 148304]
875:         }
876:       },
877:       {
878:         type: 'STAT_HP_C',
879:         multiValues: {
880:           ancient: [4771, 5110, 5452, 5794, 5878, 5964, 6051, 6139, 6229, 6321, 6414, 6509, 6610, 6712, 6816, 6923, 7031, 7141, 7253, 7367, 7484, 7602, 7722, 7845, 7970],
881:           serca: [7498, 7615, 7735, 7858, 7982, 8108, 8237, 8368, 8501, 8637, 8775, 8916, 9059, 9205, 9353, 9504, 9635, 9768, 9903, 10039, 10178, 10318, 10461, 10605, 10751]
882:         }
883:       },
884:       {
885:         type: 'STAT_HP_P',
886:         grades: { low: [0, 35], mid: [36, 70], high: [71, 100] }
887:       }
888:     ]
889:   },
890: 
891:   
892:   { // 무기
893:     id: ID.WEAPON,
894:     name: NAMES[ID.WEAPON],
895:     iconPath: GET_ICON('WEAPON'),
896:     multiName: { ancient: '운명의 업화 무기', serca: '운명의 전율 무기' },
897:     initItemLv: { ancient: 1590, serca: 1675 },
898:     adv_refine: [
899:       { // 6
900:         refineLv: 6,
901:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [91787,92196,92608,93022,93439,93859,94281,94707,95135,95566,96000,96436,96876,97318,97764,98212,98664,99118,99575,100036,100499,100966,101435,101908,102384,102863,103345,103830,104319,106907,107433,107963,108498,109035,109577,110122,110672,111224,111780,115645] } }],
902:       },
903:       { // 7
904:         refineLv: 7,
905:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [93859,94281,94707,95135,95566,96000,96436,96876,97318,97764,98212,98664,99118,99575,100036,100499,100966,101435,101908,102384,102863,103345,103830,104319,104811,105327,105847,106371,106898,109577,110122,110672,111224,111780,112341,112905,113473,114046,114622,118591] } }],
906:       },
907:       { // 8
908:         refineLv: 8,
909:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [96000,96436,96876,97318,97764,98212,98664,99118,99575,100036,100499,100966,101435,101908,102384,102863,103345,103830,104319,104811,105327,105847,106371,106898,107429,107963,108502,109044,109589,112341,112905,113473,114046,114622,115202,115786,116374,116967,117563,121639] } }],
910:       },
911:       { // 9
912:         refineLv: 9,
913:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [98212,98664,99118,99575,100036,100499,100966,101435,101908,102384,102863,103345,103830,104319,104811,105327,105847,106371,106898,107429,107963,108502,109044,109589,110139,110692,111249,111810,112375,115202,115786,116374,116967,117563,118163,118767,119376,119989,120606,124793] } }],
914:       },
915:       { // 10
916:         refineLv: 10,
917:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [100499,100966,101435,101908,102384,102863,103345,103830,104319,104811,105327,105847,106371,106898,107429,107963,108502,109044,109589,110139,110692,111249,111810,112375,112944,113516,114093,114674,115258,118163,118767,119376,119989,120606,121228,121854,122483,123118,123757,128059] } }],
918:       },
919:       { // 11
920:         refineLv: 11,
921:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [102863,103345,103830,104319,104811,105327,105847,106371,106898,107429,107963,108502,109044,109589,110139,110692,111249,111810,112375,112944,113516,114093,114674,115258,115847,116439,117036,117637,118242,121228,121854,122483,123118,123757,124400,125047,125699,126356,127017,131439] } }],
922:       },
923:       { // 12
924:         refineLv: 12,
925:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [105327,105847,106371,106898,107429,107963,108502,109044,109589,110139,110692,111249,111810,112375,112944,113516,114093,114674,115258,115847,116439,117036,117637,118242,118851,119465,120082,120704,121331,124400,125047,125699,126356,127017,127683,128353,129028,129708,130392,134936] } }],
926:       },
927:       { // 13
928:         refineLv: 13,
929:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [107963,108502,109044,109589,110139,110692,111249,111810,112375,112944,113516,114093,114674,115258,115847,116439,117036,117637,118242,118851,119465,120082,120704,121331,121961,122596,123235,123879,124527,127683,128353,129028,129708,130392,131081,131774,132473,133177,133885,138556] } }],
930:       },
931:       { // 14
932:         refineLv: 14,
933:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [110692,111249,111810,112375,112944,113516,114093,114674,115258,115847,116439,117036,117637,118242,118851,119465,120082,120704,121331,121961,122596,123235,123879,124527,125180,125837,126499,127165,127836,131081,131774,132473,133177,133885,134598,135316,136039,136766,137500,142303] } }],
934:       },
935:       { // 15
936:         refineLv: 15,
937:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [113516,114093,114674,115258,115847,116439,117036,117637,118242,118851,119465,120082,120704,121331,121961,122596,123235,123879,124527,125180,125837,126499,127165,127836,128511,129191,129876,130566,131260,134598,135316,136039,136766,137500,138237,138981,139729,140482,141241,146182] } }],
938:       },
939:       { // 16
940:         refineLv: 16,
941:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [116439,117036,117637,118242,118851,119465,120082,120704,121331,121961,122596,123235,123879,124527,125180,125837,126499,127165,127836,128511,129191,129876,130566,131260,131959,132663,133372,134085,134804,138237,138981,139729,140482,141241,142005,142774,143548,144328,145114,150196] } }],
942:       },
943:       { // 17
944:         refineLv: 17,
945:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [119465,120082,120704,121331,121961,122596,123235,123879,124527,125180,125837,126499,127165,127836,128511,129191,129876,130566,131260,131959,132663,133372,134085,134804,135527,136256,136990,137728,138472,142005,142774,143548,144328,145114,145904,146700,147502,148309,149121,154350] } }],
946:       },
947:       { // 18
948:         refineLv: 18,
949:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [122596,123235,123879,124527,125180,125837,126499,127165,127836,128511,129191,129876,130566,131260,131959,132663,133372,134085,134804,135527,136256,136990,137728,138472,139221,139975,140734,141499,142269,145904,146700,147502,148309,149121,149940,150764,151593,152428,153270,158649] } }],
950:       },
951:       { // 19
952:         refineLv: 19,
953:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [125837,126499,127165,127836,128511,129191,129876,130566,131260,131959,132663,133372,134085,134804,135527,136256,136990,137728,138472,139221,139975,140734,141499,142269,143044,143824,144610,145401,146198,149940,150764,151593,152428,153270,154116,154969,155828,156693,157563,163099] } }],
954:       },
955:       { // 20
956:         refineLv: 20,
957:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [129191,129876,130566,131260,131959,132663,133372,134085,134804,135527,136256,136990,137728,138472,139221,139975,140734,141499,142269,143044,143824,144610,145401,146198,147000,147808,148621,149440,150265,154116,154969,155828,156693,157563,158439,159322,160211,161105,162007,167706] } }],
958:       },
959:       { // 21
960:         refineLv: 21,
961:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [132663,133372,134085,134804,135527,136256,136990,137728,138472,139221,139975,140734,141499,142269,143044,143824,144610,145401,146198,147000,147808,148621,149440,150265,151095,151931,152773,153621,154474,158439,159322,160211,161105,162007,162914,163828,164747,165673,166606,172473] } }],
962:       },
963:       { // 22
964:         refineLv: 22,
965:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [136256,136990,137728,138472,139221,139975,140734,141499,142269,143044,143824,144610,145401,146198,147000,147808,148621,149440,150265,151095,151931,152773,153621,154474,155333,156199,157070,157947,158831,162914,163828,164747,165673,166606,167545,168490,169443,170401,171367,177406] } }],
966:       },
967:       { // 23
968:         refineLv: 23,
969:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [139975,140734,141499,142269,143044,143824,144610,145401,146198,147000,147808,148621,149440,150265,151095,151931,152773,153621,154474,155333,156199,157070,157947,158831,159720,160616,161517,162425,163340,167545,168490,169443,170401,171367,172338,173317,174302,175294,176293,182514] } }],
970:       },
971:       { // 24
972:         refineLv: 24,
973:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [143824,144610,145401,146198,147000,147808,148621,149440,150265,151095,151931,152773,153621,154474,155333,156199,157070,157947,158831,159720,160616,161517,162425,163340,164260,165187,166121,167060,168007,172338,173317,174302,175294,176293,177299,178312,179332,180358,181392,187799] } }],
974:       },
975:       { // 25
976:         refineLv: 25,
977:         effects: [{ type: 'MAIN_STAT_C', multiValues: { ancient: [147808,148621,149440,150265,151095,151931,152773,153621,154474,155333,156199,157070,157947,158831,159720,160616,161517,162425,163340,164260,165187,166121,167060,168007,168959,169919,170885,171857,172837,177299,178312,179332,180358,181392,182434,183481,184537,185600,186670,193270] } }],
978:       },
979:     ],
980:     effects: [
981:       {
982:         type: 'WEAPON_ATK_C',
983:         multiValues: {
984:           ancient: [67051,73796,80599,87463,89390,91381,93439,95566,97764,100036,102384,104811,107429,110139,112944,115847,118851,121961,125180,128511,131959,135527,139221,143044,147000],
985:           serca: [128059,131439,134936,138556,142303,146182,150196,154350,158649,163099,167706,172473,177406,182514,187799,193270,198101,203054,208130,213333,218667,224133,229737,235480,241367]
986:         }
987:       },
988:       {
989:         type: 'ADD_DMG',
990:         grades: { low: [0, 35], mid: [36, 70], high: [71, 100] }
991:       }
992:     ]
993:   },
994: ]
```

## File: src/data/gems.ts
```typescript
 1: // @/data/gems.ts
 2: 
 3: import { BaseSimData } from '@/types/sim-types';
 4: import { ID_AA, ID_BB } from '@/constants/id-config';
 5: 
 6: // 공통 Base ID (60 10 0 0 00)
 7: const BASE = (ID_AA.GEM * 1000000) + (ID_BB.COMMON * 10000);
 8: 
 9: export const ID = {
10:     GEMS: BASE,
11: }
12: 
13: export const NAMES = {
14:     [ID.GEMS]: '보석',
15: }
16: 
17: // todo: target은 사용자가 선택한 스킬 ID를 계산 시점에 동적으로 넣어준다.
18: // 좀더 만저야함. 겁화, 멸화, 작열, 홍염, 광희 종류가 있음.
19: export const GEM_DATA: BaseSimData[] = [
20:   {
21:     id: ID.GEMS,
22:     name: NAMES[ID.GEMS],
23:     effects: [
24:       { type: "DMG_INC", value: Array.from({ length: 10 }, (_, i) => 0.08 + (i*0.04)) },
25:       { type: "CDR_P", value: Array.from({ length: 10 }, (_, i) => 0.06 + (i*0.02)) },
26:       { type: "BASE_ATK_P", value: [0, 0, 0.001, 0.002, 0.003, 0.004, 0.006, 0.008, 0.01, 0.012] }
27:     ]
28:   }
29: ]
```

## File: src/data/arc-grid/guardian-knight.ts
```typescript
  1: // @/data/arc-grid/guardain-knight.ts
  2: 
  3: import { ArkGridCoreData, GET_GRID_ICON } from '@/types/ark-grid';
  4: import { ID_AA, ID_BB } from '@/constants/id-config';
  5: import { ID as SK_ID } from '@/data/skills/guardian-knight-skills';
  6: 
  7: // 공통 Base ID (80 81 0 0 00)
  8: const BASE = (ID_AA.ARK_GRID * 1000000) + (ID_BB.GUARDIANKNIGHT * 10000);
  9: 
 10: // BB: 직업(질서 코어), 공통(혼돈 코어)
 11: // C: 1(해, SN), 2(달, MN), 3(별, ST)
 12: // D: 1(업화의 계승자, HELLFIRE, H), 2(드레드 로어, DREADFUL, D)
 13: // EE: 인게임 순서
 14: export const ID = {
 15:   SNH_01: BASE + 1101, SNH_02: BASE + 1102, SNH_03: BASE + 1103,
 16:   SND_01: BASE + 1201, SND_02: BASE + 1202, SND_03: BASE + 1203,
 17:   
 18:   MNH_01: BASE + 2101, MNH_02: BASE + 2102, MNH_03: BASE + 2103,
 19:   MND_01: BASE + 2201, MND_02: BASE + 2202, MND_03: BASE + 2203,
 20:   
 21:   STH_01: BASE + 3101, STH_02: BASE + 3102, STH_03: BASE + 3103,
 22:   STD_01: BASE + 3201, STD_02: BASE + 3202, STD_03: BASE + 3203,
 23: };
 24: 
 25: export const NAMES = {
 26:   [ID.SNH_01]: '피니셔', [ID.SNH_02]: '매니페스트', [ID.SNH_03]: '붉은 날개',
 27:   [ID.SND_01]: '차지 인핸스', [ID.SND_02]: '브랜디쉬', [ID.SND_03]: '에이펙스',
 28: 
 29:   [ID.MNH_01]: '노바 플레임', [ID.MNH_02]: '리버레이션', [ID.MNH_03]: '복수귀',
 30:   [ID.MND_01]: '위압', [ID.MND_02]: '플러리쉬', [ID.MND_03]: '도미넌트',
 31:   
 32:   [ID.STH_01]: '라스트 스탠드', [ID.STH_02]: '엑스큐셔너', [ID.STH_03]: '추격 시작',
 33:   [ID.STD_01]: '그랜드 피날레', [ID.STD_02]: '일당백', [ID.STD_03]: '파멸',
 34: } as const;
 35: 
 36: export const ARKGRID_GUARDIAN_KNIGHT_DATA: ArkGridCoreData[] = [
 37:   // ── [🌞 해 코어] ──────────────────────────────────
 38:   { // <해1> 피니셔 (업화의 계승자)
 39:     id: ID.SNH_01,
 40:     name: NAMES[ID.SNH_01],
 41:     iconPath: GET_GRID_ICON('O_SN'),
 42:     thresholds: [
 43:       { point: 10, effects: [{ type: 'DMG_INC', value: [0.015] }] },
 44:       { point: 14, effects: [{ type: 'DMG_INC', value: [0.05] }] },
 45:       {
 46:         point: 17,
 47:         effects: [
 48:           {
 49:             type: 'DMG_INC', multiValues: { relic: [0.25], ancient: [0.3] },
 50:             target: { skillIds: [SK_ID.RENDING_FINISHER.BODY, SK_ID.EXPLOSION_FINISHER.BODY] }
 51:           }
 52:         ]
 53:       },
 54:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.007], target: {skillIds: [SK_ID.EXPLOSION_FINISHER.BODY]} }] },
 55:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.007], target: {skillIds: [SK_ID.EXPLOSION_FINISHER.BODY]} }] },
 56:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.007], target: {skillIds: [SK_ID.EXPLOSION_FINISHER.BODY]} }] }
 57:     ]
 58:   },
 59:   { // <해2> 메니페스트 (업화의 계승자)
 60:     id: ID.SNH_02,
 61:     name: NAMES[ID.SNH_02],
 62:     iconPath: GET_GRID_ICON('O_SN'),
 63:     thresholds: [
 64:       { 
 65:         point: 10, 
 66:         effects: [
 67:           {
 68:             type: 'GK_QI_COST', value: [2],
 69:             target: { skillIds: [SK_ID.RENDING_FINISHER.BODY, SK_ID.BLAZE_SWEEP.BODY] }
 70:           }
 71:         ]
 72:       },
 73:       { 
 74:         point: 14, 
 75:         effects: [
 76:           { 
 77:             type: 'DMG_INC', value: [-0.7], 
 78:             target: { skillIds: [SK_ID.ABADDON_FLAME.BODY, SK_ID.AVENGING_SPEAR.BODY, SK_ID.BLAZE_FLASH.BODY, SK_ID.WING_LASH.BODY] } 
 79:           },
 80:           { type: 'CDR_C', value: [12], target: { skillIds: [SK_ID.RENDING_FINISHER.BODY] } },
 81:           { type: 'SPEED_ATK', value: [0.1] },
 82:           { type: 'SPEED_MOV', value: [0.1] },
 83:           { type: 'DMG_INC', value: [0.5], target: {categories: ['ENLIGHTEN']} },
 84:         ] 
 85:       },
 86:       {
 87:         point: 17,
 88:         effects: [
 89:           {
 90:             type: 'DMG_INC', multiValues: { relic: [0.24], ancient: [0.3] }, // 레조넌스 6중첩 기준 (0.04*6 / 0.05*6)
 91:             target: { skillIds: [SK_ID.INFERNO_BURST.BODY, SK_ID.EXPLOSION_FINISHER.BODY] }
 92:           }
 93:         ]
 94:       },
 95:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.0032], target: { categories: ['ENLIGHTEN'] } }] },
 96:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.0032], target: { categories: ['ENLIGHTEN'] } }] },
 97:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.0032], target: { categories: ['ENLIGHTEN'] } }] }
 98:     ]
 99:   },
100:   { // <해3> 붉은날개 (업화의 계승자)
101:     id: ID.SNH_03,
102:     name: NAMES[ID.SNH_03],
103:     iconPath: GET_GRID_ICON('O_SN'),
104:     thresholds: [
105:       { point: 10, effects: [{ type: "DMG_INC", value: [0.015] }] },
106:       { 
107:         point: 14, 
108:         effects: [
109:           { type: "DMG_INC", value: [-0.9], target: {skillIds: [SK_ID.ABADDON_FLAME.BODY]} },
110:           { 
111:             type: "DMG_INC", value: [0.7], subGroup: 'SNH_03',
112:             target: {skillIds: [SK_ID.AVENGING_SPEAR.BODY]}
113:           }
114:         ] 
115:       },
116:       {
117:         point: 17,
118:         effects: [
119:           {
120:             // 14P의 0.7을 대체하여 1.0 / 1.14가 됨
121:             type: "DMG_INC", multiValues: { relic: [0.3], ancient: [0.44] }, subGroup: 'SNH_03', 
122:             target: { skillIds: [SK_ID.AVENGING_SPEAR.BODY] }
123:           }
124:         ]
125:       },
126:       { point: 18, effects: [{ type: "DMG_INC", value: [0.0023], target: { categories: ['GOD_FORM'] } }] },
127:       { point: 19, effects: [{ type: "DMG_INC", value: [0.0023], target: { categories: ['GOD_FORM'] } }] },
128:       { point: 20, effects: [{ type: "DMG_INC", value: [0.0023], target: { categories: ['GOD_FORM'] } }] }
129:     ]
130:   },
131: 
132:   { // <해1> 차지 인핸스 (드레드 로어)
133:     id: ID.SND_01,
134:     name: NAMES[ID.SND_01],
135:     iconPath: GET_GRID_ICON('O_SN'),
136:     thresholds: [
137:       { 
138:         point: 10, 
139:         effects: [
140:           { type: 'DMG_INC', value: [-0.7], target: {skillIds: [SK_ID.SOARING_STRIKE.BODY]} },
141:           { type: 'DMG_INC', value: [0.04], target: {skillTypes: ['CHARGE']} }
142:         ] 
143:       },
144:       { 
145:         point: 14, 
146:         effects: [
147:           // todo: 소울 디바이드(일반, 초각성스킬)제외인데 어떻게 할지 고민
148:           { type: 'DMG_INC', value: [-0.45], target: { skillTypes: ['NORMAL'] } }, 
149:           { 
150:             type: 'DMG_INC', value: [1.38], 
151:             target: { skillIds: [SK_ID.QUAKE_SMASH.BODY, SK_ID.PIERCING_SHOCK.BODY, SK_ID.RENDING_FINISHER.BODY] } 
152:           }
153:         ] 
154:       },
155:       { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.06], ancient: [0.075] }, target: { skillTypes: ['CHARGE'] } }] },
156:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.002], target: { skillTypes: ['CHARGE'] } }] },
157:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.002], target: { skillTypes: ['CHARGE'] } }] },
158:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.002], target: { skillTypes: ['CHARGE'] } }] }
159:     ]
160:   },
161:   { // <해2> 브랜디쉬 (드레드 로어)
162:     id: ID.SND_02,
163:     name: NAMES[ID.SND_02],
164:     iconPath: GET_GRID_ICON('O_SN'),
165:     thresholds: [
166:       { point: 10, effects: [{ type: 'DMG_INC', value: [0.015] }] },
167:       { 
168:         point: 14, 
169:         effects: [
170:           { type: 'DMG_INC', value: [-0.3], target: { skillIds: [SK_ID.PIERCING_SHOCK.BODY] } },
171:           { type: 'DMG_INC', value: [0.2], target: { skillIds: [SK_ID.GUILLOTINE_SPIN.BODY] } }
172:         ] 
173:       },
174:       { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0], ancient: [0.05] }, target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } }] },
175:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
176:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
177:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.0016] }] }
178:     ]
179:   },
180:   { // <해3> 에이펙스 (드레드 로어)
181:     id: ID.SND_03,
182:     name: NAMES[ID.SND_03],
183:     iconPath: GET_GRID_ICON('O_SN'),
184:     thresholds: [
185:       { point: 10, effects: [{ type: 'DMG_INC', value: [0.015] }] },
186:       { point: 14, effects: [{ type: 'DMG_INC', subGroup: 'SND_03', value: [0.06] }] },
187:       // 14P의 0.6을 대체하여 0.11 / 0.12가 됨
188:       { point: 17, effects: [{ type: 'DMG_INC', subGroup: 'SND_03', multiValues: { relic: [0.11], ancient: [0.12] } }] },
189:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
190:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
191:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.0016] }] }
192:     ]
193:   },
194: 
195:   // ── [🌙 달 코어] ──────────────────────────────────
196:   { // <달1> 노바 플레임 (업화의 계승자)
197:     id: ID.MNH_01,
198:     name: NAMES[ID.MNH_01],
199:     iconPath: GET_GRID_ICON('O_MN'),
200:     thresholds: [
201:       { point: 10, effects: [{ type: 'DMG_INC', value: [0.015] }] },
202:       { point: 14 }, // 화신화 사용 시 '운명'이 발동한다.
203:       // todo: 조건이 화신상태에서 주는 피해량 증가임, 화신상태에서 쓰는 일반스킬도 데미지 늘어나는지 검토 필요
204:       { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.05], ancient: [0.065] }, target: { categories: ['GOD_FORM'] } }] },
205:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.0023], target: { categories: ['GOD_FORM'] } }] },
206:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.0023], target: { categories: ['GOD_FORM'] } }] },
207:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.0023], target: { categories: ['GOD_FORM'] } }] }
208:     ]
209:   },
210:   { // <달2> 리버레이션 (업화의 계승자)
211:     id: ID.MNH_02,
212:     name: NAMES[ID.MNH_02],
213:     iconPath: GET_GRID_ICON('O_MN'),
214:     thresholds: [
215:       { point: 10 }, // 더 이상 발현 스킬이 소켓을 잠그지 않는다.
216:       { point: 14 }, // 발현 스킬 사용 시 '운명'이 발동한다.
217:       { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.08], ancient: [0.1] }, target: { categories: ['ENLIGHTEN'] } }] },
218:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.0032], target: { categories: ['ENLIGHTEN'] } }] },
219:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.0032], target: { categories: ['ENLIGHTEN'] } }] },
220:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.0032], target: { categories: ['ENLIGHTEN'] } }] }
221:     ]
222:   },
223:   { // <달3> 복수귀 (업화의 계승자)
224:     id: ID.MNH_03,
225:     name: NAMES[ID.MNH_03],
226:     iconPath: GET_GRID_ICON('O_MN'),
227:     thresholds: [
228:       { point: 10, effects: [{ type: 'DMG_INC', value: [0.015] }] },
229:       { point: 14, effects: [] }, // 화신화 사용 시 '운명'이 발동한다.
230:       { 
231:         point: 17, 
232:         effects: [
233:           { type: 'CDR_C', value: [-28.0], target: { skillIds: [SK_ID.AVENGING_SPEAR.BODY] } },
234:           { type: 'DMG_INC', multiValues: { relic: [1.0], ancient: [1.14] }, target: { skillIds: [SK_ID.AVENGING_SPEAR.BODY] } }
235:         ] 
236:       },
237:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.0023], target: { categories: ['GOD_FORM'] } }] },
238:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.0023], target: { categories: ['GOD_FORM'] } }] },
239:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.0023], target: { categories: ['GOD_FORM'] } }] }
240:     ]
241:   },
242: 
243:   { // <달1> 위압 (드레드 로어)
244:     id: ID.MND_01,
245:     name: NAMES[ID.MND_01],
246:     iconPath: GET_GRID_ICON('O_MN'),
247:     thresholds: [
248:       { point: 10, effects: [{ type: 'DMG_INC', value: [0.02], target: { skillTypes: ['CHARGE'] } }] },
249:       { point: 14 }, // 가디언 피어 사용 시 '운명'이 발동한다.
250:       { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.4], ancient: [0.46] }, target: { skillIds: [SK_ID.PIERCING_SHOCK.BODY] } }] },
251:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.002], target: { skillTypes: ['CHARGE'] } }] },
252:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.002], target: { skillTypes: ['CHARGE'] } }] },
253:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.002], target: { skillTypes: ['CHARGE'] } }] }
254:     ]
255:   },
256:   { // <달2> 플러리쉬 (드레드 로어)
257:     id: ID.MND_02,
258:     name: NAMES[ID.MND_02],
259:     iconPath: GET_GRID_ICON('O_MN'),
260:     thresholds: [
261:       { point: 10, effects: [{ type: 'DMG_INC', value: [0.015] }] },
262:       { point: 14 }, // 클리브 사용 시 '운명'이 발동한다.
263:       { 
264:         point: 17, 
265:         effects: [{ 
266:           type: 'DMG_INC', multiValues: { relic: [0.1], ancient: [0.125] },
267:           target: { skillIds: [SK_ID.GUILLOTINE_SPIN.BODY, SK_ID.FRENZY_SWEEP.BODY] } 
268:         }] 
269:       },
270:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
271:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
272:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.0016] }] }
273:     ]
274:   },
275:   { // <달3> 도미넌트 (드레드 로어)
276:     id: ID.MND_03,
277:     name: NAMES[ID.MND_03],
278:     iconPath: GET_GRID_ICON('O_MN'),
279:     thresholds: [
280:       { point: 10, effects: [{ type: 'DMG_INC', value: [0.015] }] },
281:       { point: 14 }, // 가디언 피어 사용 시 '운명'이 발동한다.
282:       // todo: 초월 상태에서 피해 증가, 그냥 상시 초월상태 or 사이클의 몇퍼센트 고려, 초월 상태따로 선언한 곳이 없음.
283:       { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.04], ancient: [0.055] } }] },
284:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
285:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.0016] }] },
286:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.0016] }] }
287:     ]
288:   },
289: 
290:   // ── [⭐ 별 코어] (업화의 계승자) ──────────────────────────────────
291:   { // <별1> 라스트 스탠드 (업화의 계승자)
292:     id: ID.STH_01,
293:     name: NAMES[ID.STH_01],
294:     iconPath: GET_GRID_ICON('O_ST'),
295:     thresholds: [
296:       { point: 10 }, // 렌딩 피니셔의 시전 속도가 20.0% 증가한다.
297:       { point: 14, effects: [{ type: 'DMG_INC', value: [0.08], target: { skillIds: [SK_ID.BLAZE_FLASH.BODY, SK_ID.WING_LASH.BODY] } }] },
298:       { 
299:         point: 17, 
300:         effects: [{ 
301:           // todo: 익스플로전 피니셔의 '푸른 심장' 트라이포드 적용 시 피해 증가 및 피격 이상 면역
302:           type: 'DMG_INC', multiValues: { relic: [0.2], ancient: [0.27] }, 
303:           target: { skillIds: [SK_ID.EXPLOSION_FINISHER.BODY] }
304:         }] 
305:       },
306:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.007], target: { skillIds: [SK_ID.EXPLOSION_FINISHER.BODY] } }] },
307:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.007], target: { skillIds: [SK_ID.EXPLOSION_FINISHER.BODY] } }] },
308:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.007], target: { skillIds: [SK_ID.EXPLOSION_FINISHER.BODY] } }] }
309:     ]
310:   },
311:   { // <별2> 엑스큐셔너 (업화의 계승자)
312:     id: ID.STH_02,
313:     name: NAMES[ID.STH_02],
314:     iconPath: GET_GRID_ICON('O_ST'),
315:     thresholds: [
316:       { point: 10, effects: [{ type: 'DMG_INC', value: [0.05], target: { categories: ['ENLIGHTEN'] } }] },
317:       // todo: 임페일 쇼크의 '즉결심판' 트라이포드 적용 시 재사용 대기시간이 "추가"로 감소한다, 트라이포드의 기존 6초감소에 10초 더 감소
318:       { point: 14, effects: [{ type: 'CDR_C', value: [10.0], target: { skillIds: [SK_ID.PIERCING_SHOCK.BODY] } }] },
319:       { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.1], ancient: [0.15] }, target: { skillIds: [SK_ID.RENDING_FINISHER.BODY] } }] },
320:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.RENDING_FINISHER.BODY] } }] },
321:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.RENDING_FINISHER.BODY] } }] },
322:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.RENDING_FINISHER.BODY] } }] }
323:     ]
324:   },
325:   { // <별3> 추격 시작 (업화의 계승자)
326:     id: ID.STH_03,
327:     name: NAMES[ID.STH_03],
328:     iconPath: GET_GRID_ICON('O_ST'),
329:     thresholds: [
330:       { point: 10 }, // 리벤지 블로우 사용 시 엠버레스 오브 게이지를 10.0% 회복하고, 리벤지 스피어의 시전 속도가 20.0% 증가한다.
331:       { point: 14, effects: [{ type: 'DMG_INC', value: [0.2], target: { skillIds: [SK_ID.VENGEFUL_BLOW.BODY] } }] },
332:        // todo: 블레이즈 플래시의 '맹렬한 추격' 트라이포드 적용 시
333:       { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.16], ancient: [0.25] }, target: { skillIds: [SK_ID.BLAZE_FLASH.BODY] }}] },
334:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.AVENGING_SPEAR.BODY] } }] },
335:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.AVENGING_SPEAR.BODY] } }] },
336:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.AVENGING_SPEAR.BODY] } }] }
337:     ]
338:   },
339: 
340:   { // <별1> 그랜드 피날레 (드레드 로어)
341:     id: ID.STD_01,
342:     name: NAMES[ID.STD_01],
343:     iconPath: GET_GRID_ICON('O_ST'),
344:     thresholds: [
345:       // todo: 렌딩 피니셔의 '응축된 힘' 트라이포드 적용 시
346:       { point: 10, effects: [{ type: 'CDR_C', value: [6.0], target: { skillIds: [SK_ID.RENDING_FINISHER.BODY] } }] },
347:       { 
348:         point: 14, 
349:         effects: [
350:           // todo: 차지 조작 피증 12% + 죽음의 일격 트포일 때 피증 20% 합인지 곱인지 검토
351:           { type: 'DMG_INC', value: [0.12], target: { skillIds: [SK_ID.PIERCING_SHOCK.BODY] } },
352:           { type: 'DMG_INC', value: [0.20], target: { skillIds: [SK_ID.PIERCING_SHOCK.BODY] } }
353:         ] 
354:       },
355:       // todo: 퀘이크 스매시의 '말살' 트라이포드 적용 시
356:       { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.14], ancient: [0.18] }, target: { skillIds: [SK_ID.QUAKE_SMASH.BODY] } }] },
357:       { point: 18, effects: [{ type: 'CRIT_DMG_INC', value: [0.0021], target: { skillTypes: ['CHARGE'] } }] },
358:       { point: 19, effects: [{ type: 'CRIT_DMG_INC', value: [0.0021], target: { skillTypes: ['CHARGE'] } }] },
359:       { point: 20, effects: [{ type: 'CRIT_DMG_INC', value: [0.0021], target: { skillTypes: ['CHARGE'] } }] }
360:     ]
361:   },
362:   { // <별2> 일당백 (드레드 로어)
363:     id: ID.STD_02,
364:     name: NAMES[ID.STD_02],
365:     iconPath: GET_GRID_ICON('O_ST'),
366:     thresholds: [
367:       // todo: 클리브 경직 면역 추가
368:       { point: 10, effects: [{ type: 'DMG_INC', value: [0.08], target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } }] },
369:       // todo: 길로틴 스핀의 '천부적인 힘' 트라이포드 적용 시
370:       { point: 14, effects: [{ type: 'DMG_INC', value: [0.08], target: { skillIds: [SK_ID.GUILLOTINE_SPIN.BODY] } }] },
371:       // todo: 프렌지 스윕의 '맹습' 트라이포드 적용 시
372:       { 
373:         point: 17, 
374:         effects: [
375:           { type: 'CDR_C', value: [-18.0], target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } },
376:           { type: 'DMG_INC', multiValues: { relic: [0.8], ancient: [0.88] }, target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } }
377:         ] 
378:       },
379:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } }] },
380:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } }] },
381:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.008], target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } }] }
382:     ]
383:   },
384:   { // <별3> 파멸 (드레드 로어)
385:     id: ID.STD_03,
386:     name: NAMES[ID.STD_03],
387:     iconPath: GET_GRID_ICON('O_ST'),
388:     thresholds: [
389:       { point: 10, effects: [{ type: 'DMG_INC', value: [0.1], target: { skillIds: [SK_ID.GUILLOTINE_SPIN.BODY] } }] },
390:       // todo: 프렌지 스윕의 '파멸의 오브' 트라이포드 적용 시
391:       { point: 14, effects: [{ type: 'DMG_INC', value: [0.15], target: { skillIds: [SK_ID.FRENZY_SWEEP.BODY] } }] },
392:       { point: 17, effects: [{ type: 'DMG_INC', multiValues: { relic: [0.15], ancient: [0.2] }, target: { skillIds: [SK_ID.QUAKE_SMASH.BODY] } }] },
393:       { point: 18, effects: [{ type: 'DMG_INC', value: [0.009], target: { skillIds: [SK_ID.QUAKE_SMASH.BODY] } }] },
394:       { point: 19, effects: [{ type: 'DMG_INC', value: [0.009], target: { skillIds: [SK_ID.QUAKE_SMASH.BODY] } }] },
395:       { point: 20, effects: [{ type: 'DMG_INC', value: [0.009], target: { skillIds: [SK_ID.QUAKE_SMASH.BODY] } }] }
396:     ]
397:   },
398: ]
```

## File: src/data/arc-passive/evolution.ts
```typescript
  1: /**
  2:  * @/data/arc-passive/evolution.ts
  3:  *
  4:  * 아크패시브 진화 DB
  5:  *
  6:  * [설계 원칙]
  7:  *   - 
  8:  *
  9:  * ⚠️ 
 10:  */
 11: 
 12: import { ArkPassiveSectionData } from '@/types/ark-passive';
 13: import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';
 14: 
 15: // ============================================================
 16: // 아크패시브-진화 ID 상수
 17: // ============================================================
 18: 
 19: // 공통 Base ID (70 10 1 0 00)
 20: const BASE = (ID_AA.ARK_PASSIVE * 1000000) + (ID_BB.COMMON * 10000) + (ID_C.ARK_EVOLUTION * 1000);
 21: 
 22: // 스킬별 ID
 23: // D: 티어(1,2,3,4,5)
 24: // EE: 해당 티어의 노드
 25: export const ID = {
 26:     T1_1: BASE + 101, T1_2: BASE + 102, T1_3: BASE + 103, T1_4: BASE + 104, T1_5: BASE + 105, T1_6: BASE + 106,
 27:     T2_1: BASE + 201, T2_2: BASE + 202, T2_3: BASE + 203, T2_4: BASE + 204, T2_5: BASE + 205, T2_6: BASE + 206,
 28:     T3_1: BASE + 301, T3_2: BASE + 302, T3_3: BASE + 303, T3_4: BASE + 304, T3_5: BASE + 305, T3_6: BASE + 306,
 29:     T4_1: BASE + 401, T4_2: BASE + 402, T4_3: BASE + 403, T4_4: BASE + 404, T4_5: BASE + 405, T4_6: BASE + 406,
 30:     T5_1: BASE + 501, T5_2: BASE + 502, T5_3: BASE + 503, T5_4: BASE + 504, T5_5: BASE + 505, T5_6: BASE + 506,
 31: };
 32: 
 33: export const NAMES = {
 34:     [ID.T1_1]: '치명', [ID.T1_2]: '특화', [ID.T1_3]: '제압',
 35:     [ID.T1_4]: '신속', [ID.T1_5]: '인내', [ID.T1_6]: '숙련',
 36: 
 37:     [ID.T2_1]: '끝없는 마나', [ID.T2_2]: '금단의 주문', [ID.T2_3]: '예리한 감각',
 38:     [ID.T2_4]: '한계 돌파', [ID.T2_5]: '최적화 훈련', [ID.T2_6]: '축복의 여신',
 39: 
 40:     [ID.T3_1]: '무한한 마력', [ID.T3_2]: '혼신의 강타', [ID.T3_3]: '일격',
 41:     [ID.T3_4]: '파괴 전차', [ID.T3_5]: '타이밍 지배', [ID.T3_6]: '정열의 춤사위',
 42: 
 43:     [ID.T4_1]: '회심', [ID.T4_2]: '달인', [ID.T4_3]: '분쇄',
 44:     [ID.T4_4]: '선각자', [ID.T4_5]: '진군', [ID.T4_6]: '기원',
 45: 
 46:     [ID.T5_1]: '뭉툭한 가시', [ID.T5_2]: '음속 돌파', [ID.T5_3]: '인파이팅',
 47:     [ID.T5_4]: '입식 타격가', [ID.T5_5]: '마나 용광로', [ID.T5_6]: '안정된 관리자'
 48: } as const;
 49: 
 50: export const EVOLUTION_DATA: ArkPassiveSectionData = {
 51:     tierMeta: { 1: 40, 2: 30, 3: 20, 4: 20, 5: 30 },
 52:     karma: {
 53:         rankBonus: { type: 'EVO_DMG', value: Array.from({ length: 6 }, (_, i) => (i + 1) * 0.01) },
 54:         levelBonus: { type: 'STAT_HP_C', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 400) }
 55:     },
 56:     nodes: [
 57:         // ── 티어 1 ─────────────────────────────────────────────
 58:         { // 치명
 59:             id: ID.T1_1,
 60:             name: NAMES[ID.T1_1],
 61:             iconPath: `/images/arc-passive/evolution/${ID.T1_1}.webp`,
 62:             pointCost: 1,
 63:             effects: [{
 64:                 type: 'STAT_CRIT', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 50)
 65:             }]
 66:         },
 67:         { // 특화
 68:             id: ID.T1_2,
 69:             name: NAMES[ID.T1_2],
 70:             iconPath: '/icons/ark-passive/evolution/stat_2.png',
 71:             pointCost: 1,
 72:             effects: [{
 73:                 type: 'STAT_SPEC', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 50)
 74:             }]
 75:         },
 76:         { // 제압
 77:             id: ID.T1_3,
 78:             name: NAMES[ID.T1_3],
 79:             iconPath: '/icons/ark-passive/evolution/stat_3.png',
 80:             pointCost: 1,
 81:             effects: [{
 82:                 type: 'STAT_DOM', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 50)
 83:             }]
 84:         },
 85:         { // 신속
 86:             id: ID.T1_4,
 87:             name: NAMES[ID.T1_4],
 88:             iconPath: '/icons/ark-passive/evolution/stat_4.png',
 89:             pointCost: 1,
 90:             effects: [{
 91:                 type: 'STAT_SWIFT', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 50)
 92:             }]
 93:         },
 94:         { // 인내
 95:             id: ID.T1_5,
 96:             name: NAMES[ID.T1_5],
 97:             iconPath: '/icons/ark-passive/evolution/stat_5.png',
 98:             pointCost: 1,
 99:             effects: [{
100:                 type: 'STAT_END', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 50)
101:             }]
102:         },
103:         { // 숙련
104:             id: ID.T1_6,
105:             name: NAMES[ID.T1_6],
106:             iconPath: '/icons/ark-passive/evolution/stat_6.png',
107:             pointCost: 1,
108:             effects: [{
109:                 type: 'STAT_EXP', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 50)
110:             }]
111:         },
112:         // ── 티어 2 ─────────────────────────────────────────────
113:         { // 끝없는 마나
114:             id: ID.T2_1,
115:             name: NAMES[ID.T2_1],
116:             iconPath: `/images/arc-passive/evolution/${ID.T2_1}.webp`,
117:             pointCost: 10,
118:             effects: [{
119:                 type: 'CDR_P', value: [0.07, 0.14], target: { resourceTypes: ['MANA'] }
120:             }]
121:         },
122:         { // 금단의 주문
123:             id: ID.T2_2,
124:             name: NAMES[ID.T2_2],
125:             iconPath: `/images/arc-passive/evolution/${ID.T2_2}.webp`,
126:             pointCost: 10,
127:             effects: [
128:                 { type: 'EVO_DMG', value: [0.05, 0.1] },
129:                 { type: 'EVO_DMG', value: [0.05, 0.1], target: { resourceTypes: ['MANA'] } }
130:             ]
131:         },
132:         { // 예리한 감각
133:             id: ID.T2_3,
134:             name: NAMES[ID.T2_3],
135:             iconPath: `/images/arc-passive/evolution/${ID.T2_3}.webp`,
136:             pointCost: 10,
137:             effects: [
138:                 { type: 'CRIT_CHANCE', value: [0.04, 0.08] },
139:                 { type: 'EVO_DMG', value: [0.05, 0.1] }
140:             ]
141:         },
142:         { // 한계 돌파
143:             id: ID.T2_4,
144:             name: NAMES[ID.T2_4],
145:             iconPath: `/images/arc-passive/evolution/${ID.T2_4}.webp`,
146:             pointCost: 10,
147:             effects: [
148:                 { type: 'EVO_DMG', value: [0.1, 0.2, 0.3] }
149:             ]
150:         },
151:         { // 최적화 훈련
152:             id: ID.T2_5,
153:             name: NAMES[ID.T2_5],
154:             iconPath: `/images/arc-passive/evolution/${ID.T2_5}.webp`,
155:             pointCost: 10,
156:             effects: [
157:                 { type: 'CDR_P', value: [0.04, 0.08] },
158:                 { type: 'EVO_DMG', value: [0.05, 0.1] }
159:             ]
160:         },
161:         { // 축복의 여신
162:             id: ID.T2_6,
163:             name: NAMES[ID.T2_6],
164:             iconPath: `/images/arc-passive/evolution/${ID.T2_6}.webp`,
165:             pointCost: 10,
166:             effects: [
167:                 { type: 'SPEED_MOV', value: [0.03, 0.06, 0.09] },
168:                 { type: 'SPEED_ATK', value: [0.03, 0.06, 0.09] }
169:             ]
170:         },
171: 
172:         // ── 티어 3 ─────────────────────────────────────────────
173:         { // 무한한 마력
174:             id: ID.T3_1,
175:             name: NAMES[ID.T3_1],
176:             iconPath: `/images/arc-passive/evolution/${ID.T3_1}.webp`,
177:             pointCost: 10,
178:             effects: [
179:                 { type: 'EVO_DMG', value: [0.08, 0.16] },
180:                 { type: 'CDR_P', value: [0.07, 0.14], target: {resourceTypes: ['MANA']} }
181:             ]
182:         },
183:         { // 혼신의 강타
184:             id: ID.T3_2,
185:             name: NAMES[ID.T3_2],
186:             iconPath: `/images/arc-passive/evolution/${ID.T3_2}.webp`,
187:             pointCost: 10,
188:             effects: [
189:                 { type: 'CRIT_CHANCE', value: [0.12, 0.24] },
190:                 { type: 'EVO_DMG', value: [0.02, 0.04] }
191:             ]
192:         },
193:         { // 일격
194:             id: ID.T3_3,
195:             name: NAMES[ID.T3_3],
196:             iconPath: `/images/arc-passive/evolution/${ID.T3_3}.webp`,
197:             pointCost: 10,
198:             effects: [
199:                 { type: 'CRIT_CHANCE', value: [0.1, 0.2] },
200:                 { type: 'CRIT_DMG', value: [0.16, 0.32], target: {attackType: ['BACK_ATK', 'HEAD_ATK']} }
201:             ]
202:         },
203:         { // 파괴 전차
204:             id: ID.T3_4,
205:             name: NAMES[ID.T3_4],
206:             iconPath: `/images/arc-passive/evolution/${ID.T3_4}.webp`,
207:             pointCost: 10,
208:             effects: [
209:                 { type: 'EVO_DMG', value: [0.12, 0.24] },
210:                 { type: 'SPEED_MOV', value: [0.04, 0.08] }
211:             ]
212:         },
213:         { // 타이밍 지배
214:             id: ID.T3_5,
215:             name: NAMES[ID.T3_5],
216:             iconPath: `/images/arc-passive/evolution/${ID.T3_5}.webp`,
217:             pointCost: 10,
218:             effects: [
219:                 { type: 'CDR_P', value: [0.05, 0.1] },
220:                 { type: 'EVO_DMG', value: [0.08, 0.16] }
221:             ]
222:         },
223:         { // 정열의 춤사위
224:             id: ID.T3_6,
225:             name: NAMES[ID.T3_6],
226:             iconPath: `/images/arc-passive/evolution/${ID.T3_6}.webp`,
227:             pointCost: 10,
228:             effects: [
229:                 { type: 'EVO_DMG', value: [0.07, 0.14] }
230:             ]
231:         },
232:         // ── 티어 4 ─────────────────────────────────────────────
233:         { // 회심
234:             id: ID.T4_1,
235:             name: NAMES[ID.T4_1],
236:             iconPath: `/images/arc-passive/evolution/${ID.T4_1}.webp`,
237:             pointCost: 10,
238:             effects: [
239:                 { type: 'CRIT_DMG_INC', value: [0.12] }
240:             ]
241:         },
242:         { // 달인
243:             id: ID.T4_2,
244:             name: NAMES[ID.T4_2],
245:             iconPath: `/images/arc-passive/evolution/${ID.T4_2}.webp`,
246:             pointCost: 10,
247:             effects: [
248:                 { type: 'CRIT_CHANCE', value: [0.07] },
249:                 { type: 'ADD_DMG', value: [0.085] }
250:             ]
251:         },
252:         { // 분쇄
253:             id: ID.T4_3,
254:             name: NAMES[ID.T4_3],
255:             iconPath: `/images/arc-passive/evolution/${ID.T4_3}.webp`,
256:             pointCost: 10,
257:             effects: [
258:                 { type: 'EVO_DMG', value: [0.2] }
259:             ]
260:         },
261:         { // 선각자
262:             id: ID.T4_4,
263:             name: NAMES[ID.T4_4],
264:             iconPath: `/images/arc-passive/evolution/${ID.T4_4}.webp`,
265:             pointCost: 10,
266:             effects: [
267:                 { type: 'STAT_HP_P', value: [0.06] },
268:                 { type: 'CDR_P', value: [0.05] }
269:             ]
270:         },
271:         { // 진군
272:             id: ID.T4_5,
273:             name: NAMES[ID.T4_5],
274:             iconPath: `/images/arc-passive/evolution/${ID.T4_5}.webp`,
275:             pointCost: 10,
276:             effects: [
277:                 { type: 'STAT_HP_P', value: [0.06] },
278:                 { type: 'SPEED_ATK', value: [0.04] },
279:                 { type: 'SPEED_MOV', value: [0.04] }
280:             ]
281:         },
282:         { // 기원
283:             id: ID.T4_6,
284:             name: NAMES[ID.T4_6],
285:             iconPath: `/images/arc-passive/evolution/${ID.T4_6}.webp`,
286:             pointCost: 10,
287:             effects: [
288:                 { type: 'STAT_HP_P', value: [0.06] }
289:             ]
290:         },
291: 
292:         // ── 티어 5 ─────────────────────────────────────────────
293:         { // 뭉툭한 가시
294:             id: ID.T5_1,
295:             name: NAMES[ID.T5_1],
296:             iconPath: `/images/arc-passive/evolution/${ID.T5_1}.webp`,
297:             pointCost: 15,
298:             effects: [
299:                 { type: 'EVO_DMG', value: [0.075, 0.15] }
300:             ]
301:         },
302:         { // 음속 돌파
303:             id: ID.T5_2,
304:             name: NAMES[ID.T5_2],
305:             iconPath: `/images/arc-passive/evolution/${ID.T5_2}.webp`,
306:             pointCost: 15,
307:             effects: [
308:                 { type: 'EVO_DMG', value: [0.04, 0.08] }
309:             ]
310:         },
311:         { // 인파이팅
312:             id: ID.T5_3,
313:             name: NAMES[ID.T5_3],
314:             iconPath: `/images/arc-passive/evolution/${ID.T5_3}.webp`,
315:             pointCost: 15,
316:             effects: [
317:                 { type: 'EVO_DMG', value: [0.09, 0.18] }
318:             ]
319:         },
320:         { // 입식 타격가
321:             id: ID.T5_4,
322:             name: NAMES[ID.T5_4],
323:             iconPath: `/images/arc-passive/evolution/${ID.T5_4}.webp`,
324:             pointCost: 15,
325:             effects: [
326:                 { type: 'EVO_DMG', value: [0.105, 0.21] }
327:             ]
328:         },
329:         { // 마나 용광로
330:             id: ID.T5_5,
331:             name: NAMES[ID.T5_5],
332:             iconPath: `/images/arc-passive/evolution/${ID.T5_5}.webp`,
333:             pointCost: 15,
334:             effects: [
335:                 { type: 'EVO_DMG', value: [0.12, 0.24] }
336:             ]
337:         },
338:         { // 안정된 관리자
339:             id: ID.T5_6,
340:             name: NAMES[ID.T5_6],
341:             iconPath: `/images/arc-passive/evolution/${ID.T5_6}.webp`,
342:             pointCost: 15,
343:         },
344:     ]
345: };
```

## File: src/data/arc-passive/index.ts
```typescript
 1: /**
 2:  * @/data/arc-passive/index.ts
 3:  *
 4:  * 아크패시브 전체 re-export 파일
 5:  *
 6:  * [설계 원칙]
 7:  *   - 
 8:  *
 9:  * ⚠️ 
10:  */
11: 
12: import { ArkPassiveSectionData, ArkPassiveNodeData } from '@/types/ark-passive';
13: import { LEAP_COMMON_DATA } from './leap/common';
14: import { LEAP_GUARDIAN_KNIGHT_DATA } from './leap/guardian-knight';
15: 
16: // 직업명(String)을 키로 사용하는 매핑 테이블
17: const JOB_LEAP_MAP: Record<string, ArkPassiveNodeData[]> = {
18:   '가디언나이트': LEAP_GUARDIAN_KNIGHT_DATA,
19: };
20: 
21: export const getLeapDataByName = (jobName: string): ArkPassiveSectionData => {
22:   // 1. 매핑 테이블에서 해당 직업의 2티어 노드 배열을 가져옴
23:   const specificNodes = JOB_LEAP_MAP[jobName] || [];
24: 
25:   return {
26:     // 2. common.ts의 tierMeta, karma 등 공통 규격을 그대로 사용
27:     ...LEAP_COMMON_DATA,
28:     // 3. 노드 배열 병합: [공통 1티어 6개] + [직업 전용 2티어 4개]
29:     nodes: [
30:       ...LEAP_COMMON_DATA.nodes,
31:       ...specificNodes
32:     ]
33:   };
34: };
```

## File: src/data/arc-passive/leap/common.ts
```typescript
 1: /**
 2:  * @/data/arc-passive/leap/common.ts
 3:  *
 4:  * 아크패시브 도약 1티어 DB
 5:  *
 6:  * [설계 원칙]
 7:  *   - 
 8:  *
 9:  * ⚠️ 
10:  */
11: 
12: import { ArkPassiveSectionData } from '@/types/ark-passive';
13: import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';
14: 
15: // ============================================================
16: // 아크패시브-도약 ID 상수
17: // ============================================================
18: 
19: // 공통 Base ID (7010 3 0 00)
20: const BASE = (ID_AA.ARK_PASSIVE * 1000000) + (ID_BB.COMMON * 10000) + (ID_C.ARK_LEAP * 1000);
21: 
22: // 스킬별 ID
23: // D: 티어(1,2), 2티어는 직업별로 작성
24: // EE: 해당 티어의 노드
25: export const ID = {
26:     T1_1: BASE + 101, T1_2: BASE + 102, T1_3: BASE + 103, T1_4: BASE + 104, T1_5: BASE + 105, T1_6: BASE + 106,
27: };
28: 
29: export const NAMES = {
30:     [ID.T1_1]: '초월적인 힘', [ID.T1_2]: '충전된 분노', [ID.T1_3]: '각성 증폭기',
31:     [ID.T1_4]: '풀려난 힘', [ID.T1_5]: '잠재력 해방', [ID.T1_6]: '즉각적인 주문',
32: } as const;
33: 
34: export const LEAP_COMMON_DATA: ArkPassiveSectionData = {
35:     tierMeta: { 1: 40, 2: 30 },
36:     karma: {
37:         levelBonus: {
38:             type: 'DMG_INC', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 0.005),
39:             target: {categories:['HYPER_ULTIMATE']}
40:         }
41:     },
42:     nodes: [
43:     // ── 티어 1 ──────────────────────────────────────────
44:         { // 초월적인 힘
45:             id: ID.T1_1,
46:             name: NAMES[ID.T1_1],
47:             iconPath: `/images/arc-passive/leap/${ID.T1_1}.webp`,
48:             pointCost: 4,
49:             effects: [
50:                 { type: 'DMG_INC', value: [0.1, 0.2, 0.3, 0.4, 0.5], target: {categories:['HYPER_ULTIMATE']} }
51:             ]
52:         },
53:         { // 충전된 분노
54:             id: ID.T1_2,
55:             name: NAMES[ID.T1_2],
56:             iconPath: `/images/arc-passive/leap/${ID.T1_2}.webp`,
57:             pointCost: 4
58:         },
59:         {
60:             id: ID.T1_3,
61:             name: NAMES[ID.T1_3], // 각성 증폭기
62:             iconPath: `/images/arc-passive/leap/${ID.T1_3}.webp`,
63:             pointCost: 2
64:         },
65:         { // 풀려난 힘
66:             id: ID.T1_4,
67:             name: NAMES[ID.T1_4],
68:             iconPath: `/images/arc-passive/leap/${ID.T1_4}.webp`,
69:             pointCost: 4,
70:             effects: [
71:                 { type: 'DMG_INC', value: [0.03, 0.06, 0.09, 0.12, 0.15], target: {categories:['HYPER_SKILL']} }
72:             ]
73:         },
74:         { // 잠재력 해방
75:             id: ID.T1_5,
76:             name: NAMES[ID.T1_5],
77:             iconPath: `/images/arc-passive/leap/${ID.T1_5}.webp`,
78:             pointCost: 4,
79:             effects: [
80:                 { type: 'CDR_P', value: [0.02, 0.04, 0.06, 0.08, 0.1], target: {categories:['HYPER_SKILL']} }
81:             ]
82:         },
83:         { // 즉각적인 주문
84:             id: ID.T1_6,
85:             name: NAMES[ID.T1_6],
86:             iconPath: `/images/arc-passive/leap/${ID.T1_6}.webp`,
87:             pointCost: 2
88:         },
89:     ]
90: }
```

## File: src/data/equipment/accessory.ts
```typescript
  1: // @/data/equipment/accessory.ts
  2: 
  3: import { BaseSimData } from '@/types/sim-types';
  4: import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';
  5: 
  6: // 공통 Base ID (10 10 2 0 00)
  7: const BASE = (ID_AA.EQUIPMENT * 1000000) + (ID_BB.COMMON * 10000) + (ID_C.EQ_ACCESSORY * 1000);
  8: 
  9: // D: 1(4티어 유물,R), 2(4티어 고대,A)
 10: // EE: 01~19(목걸이,N), 21~39(귀걸이,E), 41~59(반지,R)
 11: // EE: 각 항에서 1,2번은 기본효과, 나머지는 연마 효과
 12: export const ID = {
 13:   // ── 등급: 유물 ──────────────────────────────────
 14: 
 15:   // ── 등급: 고대 ──────────────────────────────────
 16:   AN_1: BASE + 201, AN_2: BASE + 202,
 17:   AN_3: BASE + 203, AN_4: BASE + 204, AN_8: BASE + 208,
 18:   AN_9: BASE + 209,
 19: 
 20:   AE_1: BASE + 221, AE_2: BASE + 222,
 21:   AE_3: BASE + 223, AE_4: BASE + 224, AE_8: BASE + 228,
 22:   AE_9: BASE + 229,
 23: 
 24:   AR_1: BASE + 241, AR_2: BASE + 242,
 25:   AR_3: BASE + 243, AR_4: BASE + 244, AR_8: BASE + 248,
 26:   AR_9: BASE + 249,
 27: };
 28: 
 29: //todo: 목걸이는 colorValue가 상중하로 안나뉘고 5개의 범위로 나뉜다.
 30: export const ACCESSORY_DATA: BaseSimData[] = [
 31:   // ── 목걸이 ──────────────────────────────────
 32:   { // 주스탯
 33:     id: ID.AN_1,
 34:     effects: [{
 35:         type: "MAIN_STAT_C", subGroup: 'MAIN_STAT_C_GROUP',
 36:         grades: { low: [15178, 17068], mid: [17069, 17589], high: [17590, 17857] }
 37:       }]
 38:   },
 39:   { // 생명력
 40:     id: ID.AN_2,
 41:     effects: [{
 42:         type: "STAT_HP_C",
 43:         grades: { low: [3754, 3860], mid: [3861, 3999], high: [4000, 4103] }
 44:       }]
 45:   },
 46:   { // 추가 피해
 47:     id: ID.AN_3,
 48:     effects: [{
 49:         type: "ADD_DMG",
 50:         grades: { low: [0.007, 0.007], mid: [0.016, 0.016], high: [0.026, 0.026] }
 51:       }]
 52:   },
 53:   { // 피해 증가
 54:     id: ID.AN_4,
 55:     effects: [{
 56:         type: "DMG_INC",
 57:         grades: { low: [0.0055, 0.0055], mid: [0.012, 0.012], high: [0.02, 0.02] }
 58:       }]
 59:   },
 60:   { // 공격력C
 61:     id: ID.AN_8,
 62:     effects: [{
 63:         type: "ATK_C",
 64:         grades: { low: [80, 80], mid: [195, 195], high: [390, 390] }
 65:       }]
 66:   },
 67:   { // 무기공격력C
 68:     id: ID.AN_9,
 69:     effects: [{
 70:         type: "WEAPON_ATK_C",
 71:         grades: { low: [195, 195], mid: [480, 480], high: [960, 960] }
 72:       }]
 73:   },
 74: 
 75:   // ── 귀걸이 ──────────────────────────────────
 76:   { // 주스탯
 77:     id: ID.AE_1,
 78:     effects: [{
 79:         type: "MAIN_STAT_C", subGroup: 'MAIN_STAT_C_GROUP',
 80:         grades: { low: [11806, 12446], mid: [12447, 13275], high: [13276, 13889] }
 81:       }]
 82:   },
 83:   { // 생명력
 84:     id: ID.AE_2,
 85:     effects: [{
 86:         type: "STAT_HP_C",
 87:         grades: { low: [2682, 2758], mid: [2759, 2857], high: [2858, 2931] }
 88:       }]
 89:   },
 90:   { // 공격력P
 91:     id: ID.AE_3,
 92:     effects: [{
 93:         type: "ATK_P",
 94:         grades: { low: [0.004, 0.004], mid: [0.0095, 0.0095], high: [0.0155, 0.0155] }
 95:       }]
 96:   },
 97:   { // 무기공격력P
 98:     id: ID.AE_4,
 99:     effects: [{
100:         type: "WEAPON_ATK_P",
101:         grades: { low: [0.008, 0.008], mid: [0.018, 0.018], high: [0.03, 0.03] }
102:       }]
103:   },
104:   { // 공격력C
105:     id: ID.AE_8,
106:     effects: [{
107:         type: "ATK_C",
108:         grades: { low: [80, 80], mid: [195, 195], high: [390, 390] }
109:       }]
110:   },
111:   { // 무기공격력C
112:     id: ID.AE_9,
113:     effects: [{
114:         type: "WEAPON_ATK_C",
115:         grades: { low: [195, 195], mid: [480, 480], high: [960, 960] }
116:       }]
117:   },
118: 
119:   // ── 반지 ──────────────────────────────────
120:   { // 주스탯
121:     id: ID.AR_1,
122:     effects: [{
123:         type: "MAIN_STAT_C", subGroup: 'MAIN_STAT_C_GROUP',
124:         grades: { low: [10962, 11556], mid: [11557, 12327], high: [12328, 12897] }
125:       }]
126:   },
127:   { // 생명력
128:     id: ID.AR_2,
129:     effects: [{
130:         type: "STAT_HP_C",
131:         grades: { low: [2146, 2206], mid: [2207, 2285], high: [2286, 2345] }
132:       }]
133:   },
134:   { // 치명타 적중률
135:     id: ID.AR_3,
136:     effects: [{
137:         type: "CRIT_CHANCE",
138:         grades: { low: [0.004, 0.004], mid: [0.0095, 0.0095], high: [0.0155, 0.0155] }
139:       }]
140:   },
141:   { // 치명타 피해
142:     id: ID.AR_4,
143:     effects: [{
144:         type: "CRIT_DMG",
145:         grades: { low: [0.011, 0.011], mid: [0.024, 0.024], high: [0.04, 0.04] }
146:       }]
147:   },
148:   { // 공격력C
149:     id: ID.AR_8,
150:     effects: [{
151:         type: "ATK_C",
152:         grades: { low: [80, 80], mid: [195, 195], high: [390, 390] }
153:       }]
154:   },
155:   { // 무기공격력C
156:     id: ID.AR_9,
157:     effects: [{
158:         type: "WEAPON_ATK_C",
159:         grades: { low: [195, 195], mid: [480, 480], high: [960, 960] }
160:       }]
161:   },
162: ]
```

## File: src/data/arc-passive/elighten/guardian-knight.ts
```typescript
  1: /**
  2:  * @/data/arc-passive/elighten/guardian-knight.ts
  3:  *
  4:  * 아크패시브 깨달음(가디언나이트) DB
  5:  *
  6:  * [설계 원칙]
  7:  *   - 
  8:  *
  9:  * ⚠️ 
 10:  */
 11: 
 12: import { ArkPassiveSectionData } from '@/types/ark-passive';
 13: import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';
 14: import { ID as SK_ID } from '@/data/skills/guardian-knight-skills';
 15: 
 16: // ============================================================
 17: // 아크패시브 깨달음(가디언나이트) ID 상수
 18: // ============================================================
 19: 
 20: // 공통 Base ID (7081 2 0 00)
 21: const BASE = (ID_AA.ARK_PASSIVE * 1000000) + (ID_BB.GUARDIANKNIGHT * 10000) + (ID_C.ARK_ENLIGHTEN * 1000);
 22: 
 23: // 스킬별 ID
 24: // D: 티어(1,2,3,4)
 25: // EE: 해당 티어의 노드
 26: export const ID = {
 27:   T1_1: BASE + 101, T1_2: BASE + 102,
 28:   T2_1: BASE + 201, T2_2: BASE + 202,
 29:   T3_1: BASE + 301, T3_2: BASE + 302, T3_3: BASE + 303, T3_4: BASE + 304,
 30:   T4_1: BASE + 401, T4_2: BASE + 402, T4_3: BASE + 403, T4_4: BASE + 404,
 31: };
 32: 
 33: export const NAMES = {
 34:   [ID.T1_1]: '업화의 계승자', [ID.T1_2]: '드레드 로어',
 35:   [ID.T2_1]: '깨어나는 힘', [ID.T2_2]: '완전 연소',
 36:   [ID.T3_1]: '초비행', [ID.T3_2]: '힘의 제어', [ID.T3_3]: '돌파의 외침', [ID.T3_4]: '날카로운 비늘',
 37:   [ID.T4_1]: '잔불', [ID.T4_2]: '완전 융화', [ID.T4_3]: '한계 초월', [ID.T4_4]: '할버드의 대가',
 38: } as const;
 39: 
 40: export const ELIGHTEN_GUARDIAN_KNIGHT_DATA: ArkPassiveSectionData = {
 41:   tierMeta: { 1: 24, 2: 24, 3: 34, 4: 34 },
 42:   karma: {
 43:     levelBonus: { type: 'WEAPON_ATK_P', value: Array.from({ length: 30 }, (_, i) => (i + 1) * 0.001) }
 44:   },
 45:   nodes: [
 46:     // ── 티어 1 ──────────────────────────────────
 47:     { // 업화의 계승자
 48:       id: ID.T1_1,
 49:       name: NAMES[ID.T1_1],
 50:       iconPath: `/images/arc-passive/enlightenment/${ID.T1_1}.webp`,
 51:       pointCost: 8,
 52:       effects: [
 53:         { type: 'SPEED_ATK', value: [0.11, 0.13, 0.15], target: { categories: ['GOD_FORM'] } },
 54:         { type: 'SPEED_MOV', value: [0.11, 0.13, 0.15], target: { categories: ['GOD_FORM'] } }
 55:       ]
 56:     },
 57:     { // 드레드 로어
 58:       id: ID.T1_2,
 59:       name: NAMES[ID.T1_2],
 60:       iconPath: `/images/arc-passive/enlightenment/${ID.T1_2}.webp`,
 61:       pointCost: 24,
 62:       // 일반 스킬 헤드 어택 변경 로직 포함
 63:     },
 64:     // ── 티어 2 ──────────────────────────────────────────────────
 65:     { // 깨어나는 힘
 66:       id: ID.T2_1,
 67:       name: NAMES[ID.T2_1],
 68:       iconPath: `/images/arc-passive/enlightenment/${ID.T2_1}.webp`,
 69:       pointCost: 8,
 70:       // precedeNode: ID.T1_1, // 업화의 계승자 3레벨 필요
 71:       effects: [
 72:         { type: 'CRIT_CHANCE', value: [0.06, 0.13, 0.2] }
 73:       ]
 74:     },
 75:     { // 완전 연소
 76:       id: ID.T2_2,
 77:       name: NAMES[ID.T2_2],
 78:       iconPath: `/images/arc-passive/enlightenment/${ID.T2_2}.webp`,
 79:       pointCost: 8,
 80:       // precedeNode: ID.T1_2, // 드레드 로어 1레벨 필요
 81:       effects: [
 82:         { type: 'CRIT_CHANCE', value: [0.05, 0.1, 0.15] },
 83:       ]
 84:     },
 85:     // ── 티어 3 ──────────────────────────────────────────────────
 86:     { // 초비행
 87:       id: ID.T3_1,
 88:       name: NAMES[ID.T3_1],
 89:       iconPath: `/images/arc-passive/enlightenment/${ID.T3_1}.webp`,
 90:       pointCost: 2,
 91:       effects: [
 92:         { type: 'DMG_INC', value: [0.01, 0.02, 0.03, 0.04, 0.05] }
 93:       ]
 94:     },
 95:     { // 힘의 제어
 96:       id: ID.T3_2,
 97:       name: NAMES[ID.T3_2],
 98:       iconPath: `/images/arc-passive/enlightenment/${ID.T3_2}.webp`,
 99:       pointCost: 8,
100:       // precedeNode: ID.T2_1,
101:       effects: [
102:         { type: 'GK_QI_DMG', value: [0.06, 0.08, 0.1] }
103:       ]
104:     },
105:     { // 돌파의 외침
106:       id: ID.T3_3,
107:       name: NAMES[ID.T3_3],
108:       iconPath: `/images/arc-passive/enlightenment/${ID.T3_3}.webp`,
109:       pointCost: 8,
110:       // precedeNode: ID.T2_2,
111:       effects: [
112:         { type: 'DMG_INC', value: [0.06, 0.13, 0.2], target: { categories: ['BASIC'] } }
113:       ]
114:     },
115:     { // 날카로운 비늘 todo: 가디언스케일 해제시 데미지 추가 로직
116:       id: ID.T3_4,
117:       name: NAMES[ID.T3_4],
118:       iconPath: `/images/arc-passive/enlightenment/${ID.T3_4}.webp`,
119:       pointCost: 2,
120:       effects: [
121:         { type: 'DMG_INC', value: [0.01, 0.02, 0.03, 0.04, 0.05] }
122:       ]
123:     },
124:     // ── 티어 4 ──────────────────────────────────────────────────
125:     { // 잔불
126:       id: ID.T4_1,
127:       name: NAMES[ID.T4_1],
128:       iconPath: `/images/arc-passive/enlightenment/${ID.T4_1}.webp`,
129:       pointCost: 2,
130:       effects: [
131:         { type: 'DMG_INC', value: [0.01, 0.02, 0.03, 0.04, 0.05] },
132:         { type: 'SPEED_ATK', value: [0.05], target: { categories: ['ENLIGHTEN'] } },
133:         { type: 'SPEED_MOV', value: [0.05], target: { categories: ['ENLIGHTEN'] } }
134:       ]
135:     },
136:     { // 완전 융화
137:       id: ID.T4_2,
138:       name: NAMES[ID.T4_2],
139:       iconPath: `/images/arc-passive/enlightenment/${ID.T4_2}.webp`,
140:       pointCost: 8,
141:       // precedeNode: ID.T3_2,
142:       effects: [
143:         { type: 'DMG_INC', value: [0.0, 0.04, 0.08] },
144:         { type: 'DMG_INC', value: [0.0, 0.6, 1.2], target: { skillIds: [SK_ID.INFERNO_BURST.BODY] } },
145:         { type: 'DMG_INC', value: [0.5, 0.5, 0.5], target: { skillIds: [SK_ID.INFERNO_BURST.BODY] } }
146:       ]
147:     },
148:     { // 한계 초월 todo: 가디언피어 사용시 5초간 초월상태, 공격속도 증가, 특정스킬5개 피해증가, 2회 제한, 가디언피어 레벨별뎀증 추가 로직
149:       id: ID.T4_3,
150:       name: NAMES[ID.T4_3],
151:       iconPath: `/images/arc-passive/enlightenment/${ID.T4_3}.webp`,
152:       pointCost: 8,
153:       // precedeNode: ID.T3_3
154:     },
155:     { // 할버드의 대가
156:       id: ID.T4_4,
157:       name: NAMES[ID.T4_4],
158:       iconPath: `/images/arc-passive/enlightenment/${ID.T4_4}.webp`,
159:       pointCost: 2,
160:       effects: [
161:         { type: 'CRIT_DMG_INC', value: [0.04, 0.07, 0.08, 0.11, 0.12] }
162:       ]
163:     }
164:   ]
165: }
```

## File: src/data/arc-passive/leap/guardian-knight.ts
```typescript
 1: /**
 2:  * @/data/arc-passive/leap/guardian-knight.ts
 3:  *
 4:  * 아크패시브 도약 2티어 가디언 나이트 DB
 5:  *
 6:  * [설계 원칙]
 7:  *   - 
 8:  *
 9:  * ⚠️ 
10:  */
11: 
12: import { ArkPassiveNodeData } from '@/types/ark-passive';
13: import { ID_AA, ID_BB, ID_C } from '@/constants/id-config';
14: import { ID as SK_ID } from '@/data/skills/guardian-knight-skills';
15: 
16: // ============================================================
17: // 아크패시브-도약 ID 상수
18: // ============================================================
19: 
20: // 공통 Base ID (7081 3 0 00)
21: const BASE = (ID_AA.ARK_PASSIVE * 1000000) + (ID_BB.GUARDIANKNIGHT * 10000) + (ID_C.ARK_LEAP * 1000);
22: 
23: // 스킬별 ID
24: // D: 티어(1,2)
25: // EE: 해당 티어의 노드
26: export const ID = {
27:     T2_1: BASE + 201, T2_2: BASE + 202, T2_3: BASE + 203, T2_4: BASE + 204
28: };
29: 
30: export const NAMES = {
31:     [ID.T2_1]: '일점 돌파', [ID.T2_2]: '파멸의 피', [ID.T2_3]: '궤도 충돌', [ID.T2_4]: '대강하',
32: } as const;
33: 
34: export const LEAP_GUARDIAN_KNIGHT_DATA: ArkPassiveNodeData[] = [
35:     { // 일점 돌파
36:         id: ID.T2_1,
37:         name: NAMES[ID.T2_1],
38:         iconPath: `/images/arc-passive/leap/${ID.T2_1}.webp`,
39:         pointCost: 10,
40:         //todo: 4개 노드 상호 배타적 조건, 트포에있는 오버라이드 필요함
41:         // exclusiveWith: [ID.T2_2, ID.T2_3, ID.T2_4],
42:         effects: [
43:             { type: 'DMG_INC', value: [0.15, 0.34, 0.53], target: {skillIds: [SK_ID.SOUL_DIVIDE.BODY]} }
44:         ]
45:     },
46:     { // 파멸의 피
47:         id: ID.T2_2,
48:         name: NAMES[ID.T2_2],
49:         iconPath: `/images/arc-passive/leap/${ID.T2_2}.webp`,
50:         pointCost: 10,
51:         // exclusiveWith: [ID.T2_1, ID.T2_3, ID.T2_4],
52:         effects: [
53:             { type: 'DMG_INC', value: [0.2, 0.4, 0.6], target: {skillIds: [SK_ID.SOUL_DIVIDE.BODY]} }
54:         ]
55:     },
56:     { // 궤도 충돌
57:         id: ID.T2_3,
58:         name: NAMES[ID.T2_3],
59:         iconPath: `/images/arc-passive/leap/${ID.T2_3}.webp`,
60:         pointCost: 10,
61:         // exclusiveWith: [ID.T2_1, ID.T2_2, ID.T2_4],
62:         effects: [
63:             { type: 'DMG_INC', value: [0.32, 0.49, 0.66], target: {skillIds: [SK_ID.DEEP_IMPACT.BODY]} }
64:         ]
65:     },
66:     { // 대강하
67:         id: ID.T2_4,
68:         name: NAMES[ID.T2_4],
69:         iconPath: `/images/arc-passive/leap/${ID.T2_4}.webp`,
70:         pointCost: 10,
71:         // exclusiveWith: [ID.T2_1, ID.T2_2, ID.T2_3],
72:         effects: [
73:             { type: 'DMG_INC', value: [0.0, 0.16, 0.32], target: {skillIds: [SK_ID.DEEP_IMPACT.BODY]} },
74:             { type: 'GK_QI_COST', value: [4], target: {skillIds: [SK_ID.DEEP_IMPACT.BODY]} }
75:         ]
76:     }
77: ]
```

## File: src/types/raw-types.ts
```typescript
  1: /**
  2:  * @/types/raw-types.ts
  3:  * 로스트아크 API 응답 구조 타입 선언
  4:  * 변환/계산 로직 없음 — API가 주는 형태 그대로 기록
  5:  */
  6: 
  7: // ============================================================
  8: // profile
  9: // ============================================================
 10: 
 11: export interface RawStat {
 12:   Type   : string;
 13:   Value  : string;   // "569" — 쉼표 없는 숫자 문자열
 14:   Tooltip: string[];
 15: }
 16: 
 17: export interface RawProfile {
 18:   CharacterImage    : string;
 19:   CharacterName     : string;
 20:   CharacterClassName: string;
 21:   CharacterLevel    : number;
 22:   ItemAvgLevel      : string;  // "1,710.00" — 쉼표 포함
 23:   CombatPower       : string;  // "2,397.67" — 쉼표 포함
 24:   ServerName        : string;
 25:   GuildName         : string | null;
 26:   GuildMemberGrade  : string | null;
 27:   ExpeditionLevel   : number;
 28:   TownLevel         : number;
 29:   TownName          : string;
 30:   Title             : string | null;
 31:   HonorPoint        : number;
 32:   UsingSkillPoint   : number;
 33:   TotalSkillPoint   : number;
 34:   Stats             : RawStat[];
 35: }
 36: 
 37: // ============================================================
 38: // equipment
 39: // ============================================================
 40: 
 41: export interface RawEquipment {
 42:   Type   : string;
 43:   Name   : string;
 44:   Icon   : string;
 45:   Grade  : string;
 46:   Tooltip: string;  // JSON 문자열
 47: }
 48: 
 49: // ============================================================
 50: // avatars
 51: // ============================================================
 52: 
 53: export interface RawAvatar {
 54:   Type   : string;
 55:   Name   : string;
 56:   Icon   : string;
 57:   Grade  : string;
 58:   IsSet  : boolean;
 59:   IsInner: boolean;
 60:   Tooltip: string;
 61: }
 62: 
 63: // ============================================================
 64: // engravings
 65: // ============================================================
 66: 
 67: export interface RawArkPassiveEffect {
 68:   Name             : string;
 69:   Grade            : string;
 70:   Level            : number;
 71:   AbilityStoneLevel: number | null;
 72:   Description      : string;
 73: }
 74: 
 75: export interface RawEngravings {
 76:   Engravings       : null;
 77:   Effects          : null;
 78:   ArkPassiveEffects: RawArkPassiveEffect[];
 79: }
 80: 
 81: // ============================================================
 82: // gems
 83: // ============================================================
 84: 
 85: export interface RawGemSkillEffect {
 86:   GemSlot    : number;
 87:   Name       : string;
 88:   Description: string[];
 89:   Option     : string;
 90:   Icon       : string;
 91: }
 92: 
 93: export interface RawGemEffects {
 94:   Description: string;
 95:   Skills     : RawGemSkillEffect[];
 96: }
 97: 
 98: export interface RawGem {
 99:   Slot   : number;
100:   Level  : number;
101:   Grade  : string;
102:   Icon   : string;
103:   Name   : string;
104:   Tooltip: string;
105: }
106: 
107: export interface RawGems {
108:   Gems   : RawGem[];
109:   Effects: RawGemEffects;
110: }
111: 
112: // ============================================================
113: // cards
114: // ============================================================
115: 
116: export interface RawCardSetItem {
117:   Name       : string;
118:   Description: string;
119: }
120: 
121: export interface RawCardEffect {
122:   Index    : number;
123:   CardSlots: number[];
124:   Items    : RawCardSetItem[];
125: }
126: 
127: export interface RawCards {
128:   Cards  : any[];
129:   Effects: RawCardEffect[];
130: }
131: 
132: // ============================================================
133: // arkPassive
134: // ============================================================
135: 
136: export interface RawArkPassivePoint {
137:   Name       : string;
138:   Value      : number;
139:   Description: string;
140: }
141: 
142: export interface RawArkPassiveEffectEntry {
143:   Name       : string;
144:   Description: string;
145:   Icon       : string;
146:   ToolTip    : string;
147: }
148: 
149: export interface RawArkPassive {
150:   Title       : string;
151:   IsArkPassive: boolean;
152:   Points      : RawArkPassivePoint[];
153:   Effects     : RawArkPassiveEffectEntry[];
154: }
155: 
156: // ============================================================
157: // arkGrid
158: // ============================================================
159: 
160: export interface RawArkGridSlot {
161:   Index: number;
162:   Name : string;
163:   Point: number;
164:   Grade: string;
165:   Icon : string;
166: }
167: 
168: export interface RawArkGridEffect {
169:   Name   : string;
170:   Level  : number;
171:   Tooltip: string;
172: }
173: 
174: export interface RawArkGrid {
175:   Slots  : RawArkGridSlot[];
176:   Effects: RawArkGridEffect[];
177: }
178: 
179: // ============================================================
180: // skills
181: // ============================================================
182: 
183: export interface RawTripod {
184:   Tier      : number;
185:   Slot      : number;
186:   Name      : string;
187:   IsSelected: boolean;
188:   Icon      : string;
189:   Tooltip   : string;
190: }
191: 
192: export interface RawRune {
193:   Name   : string;
194:   Grade  : string;
195:   Icon   : string;
196:   Tooltip: string;
197: }
198: 
199: export interface RawSkill {
200:   Name     : string;
201:   Icon     : string;
202:   Level    : number;
203:   Type     : string;
204:   SkillType: number;
205:   Tripods  : RawTripod[];
206:   Rune     : RawRune | null;
207:   Tooltip  : string;
208: }
209: 
210: // ============================================================
211: // API 응답 최상위
212: // ============================================================
213: 
214: export interface RawCharacterData {
215:   profile     : RawProfile;
216:   equipment   : RawEquipment[];
217:   avatars     : RawAvatar[];
218:   engravings  : RawEngravings;
219:   gems        : RawGems;
220:   cards       : RawCards;
221:   arkPassive  : RawArkPassive;
222:   arkGrid     : RawArkGrid;
223:   skills      : RawSkill[];
224:   colosseums  : any;
225:   collectibles: any[];
226:   _metadata: {
227:     characterName     : string;
228:     fetchedAt         : string;
229:     requestedEndpoints: string[];
230:   };
231: }
```

## File: src/data/skills/guardian-knight-skills.ts
```typescript
   1: /**
   2:  * @/data/skills/guardian-knight-skills.ts
   3:  *
   4:  * 가디언나이트 스킬 DB
   5:  *
   6:  * [설계 원칙]
   7:  *   - GK_SKILL_IDS 를 이 파일에서 직접 정의합니다.
   8:  *   - effects → EffectEntry (type, value, operation, target?)
   9:  *   - memo    → 계산 무관 메모
  10:  *   - target.skillCategory 로 발현/화신 구분
  11:  *
  12:  * ⚠️ 화상/폭발 등 addDamageSources 의 임시값은 추후 실제값으로 교체 필요
  13:  * ⚠️ QI_SPECIALIZATION_COEFF 는 guardian-knight-effects.ts 에서 관리
  14:  */
  15: 
  16: import { SkillData } from '@/types/skill';
  17: import { ID_AA, ID_BB } from '@/constants/id-config';
  18: 
  19: // ============================================================
  20: // 스킬 ID 상수
  21: // ============================================================
  22: 
  23: // 공통 Base ID (3081 0000) 
  24: const BASE = (ID_AA.SKILL * 1000000) + (ID_BB.GUARDIANKNIGHT * 10000);
  25: 
  26: // 스킬별 ID
  27: // CC : 11~99 각 스킬 분류
  28: // DD : 00(스킬 본체), 10(1티어 트포), 20(2티어 트포), 30(3티어 트포)
  29: export const ID = {
  30:   CLEAVE: {
  31:     BODY: BASE + 1100,
  32:     T1_1: BASE + 1111, T1_2: BASE + 1112, T1_3: BASE + 1113,
  33:     T2_1: BASE + 1121, T2_2: BASE + 1122, T2_3: BASE + 1123,
  34:     T3_1: BASE + 1131, T3_2: BASE + 1132,
  35: },
  36:   WILD_UPPERCUT: {
  37:     BODY: BASE + 1200,
  38:     T1_1: BASE + 1211, T1_2: BASE + 1212, T1_3: BASE + 1213,
  39:     T2_1: BASE + 1221, T2_2: BASE + 1222, T2_3: BASE + 1223,
  40:     T3_1: BASE + 1231, T3_2: BASE + 1232
  41:   },
  42:   THRUST: {
  43:     BODY: BASE + 1300,
  44:     T1_1: BASE + 1311, T1_2: BASE + 1312, T1_3: BASE + 1313,
  45:     T2_1: BASE + 1321, T2_2: BASE + 1322, T2_3: BASE + 1323,
  46:     T3_1: BASE + 1331, T3_2: BASE + 1332
  47:   },
  48:   GUILLOTINE_SPIN: {
  49:     BODY: BASE + 1400,
  50:     T1_1: BASE + 1411, T1_2: BASE + 1412, T1_3: BASE + 1413,
  51:     T2_1: BASE + 1421, T2_2: BASE + 1422, T2_3: BASE + 1423,
  52:     T3_1: BASE + 1431, T3_2: BASE + 1432
  53:   },
  54:   PIERCING_SHOCK: {
  55:     BODY: BASE + 1500,
  56:     T1_1: BASE + 1511, T1_2: BASE + 1512, T1_3: BASE + 1513,
  57:     T2_1: BASE + 1521, T2_2: BASE + 1522, T2_3: BASE + 1523,
  58:     T3_1: BASE + 1531, T3_2: BASE + 1532
  59:   },
  60:   METEOR_CRASH: {
  61:     BODY: BASE + 1600,
  62:     T1_1: BASE + 1611, T1_2: BASE + 1612, T1_3: BASE + 1613,
  63:     T2_1: BASE + 1621, T2_2: BASE + 1622, T2_3: BASE + 1623,
  64:     T3_1: BASE + 1631, T3_2: BASE + 1632
  65:   },
  66:   QUAKE_SMASH: {
  67:     BODY: BASE + 1700,
  68:     T1_1: BASE + 1711, T1_2: BASE + 1712, T1_3: BASE + 1713,
  69:     T2_1: BASE + 1721, T2_2: BASE + 1722, T2_3: BASE + 1723,
  70:     T3_1: BASE + 1731, T3_2: BASE + 1732
  71:   },
  72:   FRENZY_SWEEP: {
  73:     BODY: BASE + 1800,
  74:     T1_1: BASE + 1811, T1_2: BASE + 1812, T1_3: BASE + 1813,
  75:     T2_1: BASE + 1821, T2_2: BASE + 1822, T2_3: BASE + 1823,
  76:     T3_1: BASE + 1831, T3_2: BASE + 1832
  77:   },
  78:   VENGEFUL_BLOW: {
  79:     BODY: BASE + 1900,
  80:     T1_1: BASE + 1911, T1_2: BASE + 1912, T1_3: BASE + 1913,
  81:     T2_1: BASE + 1921, T2_2: BASE + 1922,
  82:     T3_1: BASE + 1931, T3_2: BASE + 1932
  83:   },
  84:   AVENGING_SPEAR: {
  85:     BODY: BASE + 2000,
  86:     T1_1: BASE + 2011, T1_2: BASE + 2012, T1_3: BASE + 2013,
  87:     T2_1: BASE + 2021, T2_2: BASE + 2022,
  88:     T3_1: BASE + 2031, T3_2: BASE + 2032
  89:   },
  90:   SPINNING_FLAME: {
  91:     BODY: BASE + 2100,
  92:     T1_1: BASE + 2111, T1_2: BASE + 2112, T1_3: BASE + 2113,
  93:     T2_1: BASE + 2121, T2_2: BASE + 2122,
  94:     T3_1: BASE + 2131, T3_2: BASE + 2132
  95:   },
  96:   ABADDON_FLAME: {
  97:     BODY: BASE + 2200,
  98:     T1_1: BASE + 2211, T1_2: BASE + 2212, T1_3: BASE + 2213,
  99:     T2_1: BASE + 2221, T2_2: BASE + 2222,
 100:     T3_1: BASE + 2231, T3_2: BASE + 2232
 101:   },
 102:   SOARING_STRIKE: {
 103:     BODY: BASE + 2300,
 104:     T1_1: BASE + 2311, T1_2: BASE + 2312, T1_3: BASE + 2313,
 105:     T2_1: BASE + 2321, T2_2: BASE + 2322,
 106:     T3_1: BASE + 2331, T3_2: BASE + 2332
 107:   },
 108:   WING_LASH: {
 109:     BODY: BASE + 2400,
 110:     T1_1: BASE + 2411, T1_2: BASE + 2412, T1_3: BASE + 2413,
 111:     T2_1: BASE + 2421, T2_2: BASE + 2422,
 112:     T3_1: BASE + 2431, T3_2: BASE + 2432
 113:   },
 114:   BLAZE_SWEEP: {
 115:     BODY: BASE + 2500,
 116:     T1_1: BASE + 2511, T1_2: BASE + 2512, T1_3: BASE + 2513,
 117:     T2_1: BASE + 2521, T2_2: BASE + 2522,
 118:     T3_1: BASE + 2531, T3_2: BASE + 2532
 119:   },
 120:   BLAZE_FLASH: {
 121:     BODY: BASE + 2600,
 122:     T1_1: BASE + 2611, T1_2: BASE + 2612, T1_3: BASE + 2613,
 123:     T2_1: BASE + 2621, T2_2: BASE + 2622,
 124:     T3_1: BASE + 2631, T3_2: BASE + 2632
 125:   },
 126:   RENDING_FINISHER: {
 127:     BODY: BASE + 2700,
 128:     T1_1: BASE + 2711, T1_2: BASE + 2712, T1_3: BASE + 2713,
 129:     T2_1: BASE + 2721, T2_2: BASE + 2722,
 130:     T3_1: BASE + 2731, T3_2: BASE + 2732
 131:   },
 132:   EXPLOSION_FINISHER: {
 133:     BODY: BASE + 2800,
 134:     T1_1: BASE + 2811, T1_2: BASE + 2812, T1_3: BASE + 2813,
 135:     T2_1: BASE + 2821, T2_2: BASE + 2822,
 136:     T3_1: BASE + 2831, T3_2: BASE + 2832
 137:   },
 138:   SOUL_DIVIDE: { BODY: BASE + 2900 },
 139:   DEEP_IMPACT: { BODY: BASE + 3000 },
 140:   GUARDIAN_BACKLASH: { BODY: BASE + 3100 },
 141:   BREATH_OF_EMBERES: { BODY: BASE + 3200 },
 142:   GUARDIANS_CRASH: { BODY: BASE + 3300 },
 143:   AWAKEN: { BODY: BASE + 3400 },
 144:   INFERNO_BURST: { BODY: BASE + 3500 },
 145:   GUARDIAN_FEAR: { BODY: BASE + 3600 }
 146: } as const;
 147: 
 148: // ID와 NAME 맵핑
 149: export const NAMES = {
 150:   [ID.CLEAVE.BODY]: '클리브',
 151:   [ID.CLEAVE.T1_1]: '피해 증폭', [ID.CLEAVE.T1_2]: '돌진', [ID.CLEAVE.T1_3]: '재빠른 손놀림',
 152:   [ID.CLEAVE.T2_1]: '증강', [ID.CLEAVE.T2_2]: '약육강식', [ID.CLEAVE.T2_3]: '약점 포착',
 153:   [ID.CLEAVE.T3_1]: '화염 폭풍', [ID.CLEAVE.T3_2]: '휩쓸기',
 154: 
 155:   [ID.WILD_UPPERCUT.BODY]: '와일드 어퍼',
 156:   [ID.WILD_UPPERCUT.T1_1]: '신속한 준비', [ID.WILD_UPPERCUT.T1_2]: '우직함', [ID.WILD_UPPERCUT.T1_3]: '재빠른 손놀림',
 157:   [ID.WILD_UPPERCUT.T2_1]: '돌진', [ID.WILD_UPPERCUT.T2_2]: '섬광', [ID.WILD_UPPERCUT.T2_3]: '강타',
 158:   [ID.WILD_UPPERCUT.T3_1]: '강화된 일격', [ID.WILD_UPPERCUT.T3_2]: '사전 준비',
 159:   
 160:   [ID.THRUST.BODY]: '쓰러스트',
 161:   [ID.THRUST.T1_1]: '피해 증폭', [ID.THRUST.T1_2]: '부위 파괴 강화', [ID.THRUST.T1_3]: '단단한 비늘',
 162:   [ID.THRUST.T2_1]: '연속돌진', [ID.THRUST.T2_2]: '질풍', [ID.THRUST.T2_3]: '먹이 사냥',
 163:   [ID.THRUST.T3_1]: '파멸의 오브', [ID.THRUST.T3_2]: '약점 포착',
 164:   
 165:   [ID.GUILLOTINE_SPIN.BODY]: '길로틴 스핀',
 166:   [ID.GUILLOTINE_SPIN.T1_1]: '약육강식', [ID.GUILLOTINE_SPIN.T1_2]: '강화된 일격', [ID.GUILLOTINE_SPIN.T1_3]: '뇌진탕',
 167:   [ID.GUILLOTINE_SPIN.T2_1]: '천부적인 힘', [ID.GUILLOTINE_SPIN.T2_2]: '강인함', [ID.GUILLOTINE_SPIN.T2_3]: '변화무쌍',
 168:   [ID.GUILLOTINE_SPIN.T3_1]: '무자비', [ID.GUILLOTINE_SPIN.T3_2]: '파멸의 기운',
 169: 
 170:   [ID.PIERCING_SHOCK.BODY]: '임페일 쇼크',
 171:   [ID.PIERCING_SHOCK.T1_1]: '기운 갈취', [ID.PIERCING_SHOCK.T1_2]: '화력 조절', [ID.PIERCING_SHOCK.T1_3]: '부위 파괴 강화',
 172:   [ID.PIERCING_SHOCK.T2_1]: '응축된 힘', [ID.PIERCING_SHOCK.T2_2]: '즉결심판', [ID.PIERCING_SHOCK.T2_3]: '약점 포착',
 173:   [ID.PIERCING_SHOCK.T3_1]: '파멸의 오브', [ID.PIERCING_SHOCK.T3_2]: '죽음의 일격',
 174:   
 175:   [ID.METEOR_CRASH.BODY]: '미티어 크래시',
 176:   [ID.METEOR_CRASH.T1_1]: '단단한 비늘', [ID.METEOR_CRASH.T1_2]: '화력 조절', [ID.METEOR_CRASH.T1_3]: '기운 갈취',
 177:   [ID.METEOR_CRASH.T2_1]: '대지 붕괴', [ID.METEOR_CRASH.T2_2]: '화염 지옥', [ID.METEOR_CRASH.T2_3]: '파멸의 낙뢰',
 178:   [ID.METEOR_CRASH.T3_1]: '대재앙', [ID.METEOR_CRASH.T3_2]: '통찰력',
 179:   
 180:   [ID.QUAKE_SMASH.BODY]: '퀘이크 스매시',
 181:   [ID.QUAKE_SMASH.T1_1]: '단단한 비늘', [ID.QUAKE_SMASH.T1_2]: '부위 파괴 강화', [ID.QUAKE_SMASH.T1_3]: '재빠른 손놀림',
 182:   [ID.QUAKE_SMASH.T2_1]: '강철의 울림', [ID.QUAKE_SMASH.T2_2]: '말살', [ID.QUAKE_SMASH.T2_3]: '약점 포착',
 183:   [ID.QUAKE_SMASH.T3_1]: '파멸의 오브', [ID.QUAKE_SMASH.T3_2]: '가디언의 비늘',
 184:   
 185:   [ID.FRENZY_SWEEP.BODY]: '프렌지 스윕',
 186:   [ID.FRENZY_SWEEP.T1_1]: '단단한 비늘', [ID.FRENZY_SWEEP.T1_2]: '뇌진탕', [ID.FRENZY_SWEEP.T1_3]: '재빠른 손놀림',
 187:   [ID.FRENZY_SWEEP.T2_1]: '가디언의 송곳니', [ID.FRENZY_SWEEP.T2_2]: '맹습', [ID.FRENZY_SWEEP.T2_3]: '파멸의 오브',
 188:   [ID.FRENZY_SWEEP.T3_1]: '어둠의 발톱', [ID.FRENZY_SWEEP.T3_2]: '화염 폭발',
 189:   
 190:   [ID.VENGEFUL_BLOW.BODY]: '리벤지 블로우',
 191:   [ID.VENGEFUL_BLOW.T1_1]: '기운 강화', [ID.VENGEFUL_BLOW.T1_2]: '전방위 타격', [ID.VENGEFUL_BLOW.T1_3]: '철벽',
 192:   [ID.VENGEFUL_BLOW.T2_1]: '강화 비늘', [ID.VENGEFUL_BLOW.T2_2]: '반격의 시간',
 193:   [ID.VENGEFUL_BLOW.T3_1]: '간섭 거부', [ID.VENGEFUL_BLOW.T3_2]: '응징',
 194:   
 195:   [ID.AVENGING_SPEAR.BODY]: '리벤지 스피어',
 196:   [ID.AVENGING_SPEAR.T1_1]: '단단한 비늘', [ID.AVENGING_SPEAR.T1_2]: '기운 강화', [ID.AVENGING_SPEAR.T1_3]: '간결한 손놀림',
 197:   [ID.AVENGING_SPEAR.T2_1]: '강화된 일격', [ID.AVENGING_SPEAR.T2_2]: '넓은 타격',
 198:   [ID.AVENGING_SPEAR.T3_1]: '기동력 강화', [ID.AVENGING_SPEAR.T3_2]: '종언의 일격',
 199:   
 200:   [ID.SPINNING_FLAME.BODY]: '스피닝 플레임',
 201:   [ID.SPINNING_FLAME.T1_1]: '피해 증폭', [ID.SPINNING_FLAME.T1_2]: '화력 조절', [ID.SPINNING_FLAME.T1_3]: '기운 강화',
 202:   [ID.SPINNING_FLAME.T2_1]: '추적하는 갑주', [ID.SPINNING_FLAME.T2_2]: '화염 폭풍',
 203:   [ID.SPINNING_FLAME.T3_1]: '지속력 강화', [ID.SPINNING_FLAME.T3_2]: '약점 포착',
 204: 
 205:   [ID.ABADDON_FLAME.BODY]: '아바돈 플레임',
 206:   [ID.ABADDON_FLAME.T1_1]: '피해 증폭', [ID.ABADDON_FLAME.T1_2]: '과소비', [ID.ABADDON_FLAME.T1_3]: '기운 강화',
 207:   [ID.ABADDON_FLAME.T2_1]: '사전 준비', [ID.ABADDON_FLAME.T2_2]: '원거리 사격',
 208:   [ID.ABADDON_FLAME.T3_1]: '무자비한 폭격', [ID.ABADDON_FLAME.T3_2]: '업화',
 209: 
 210:   [ID.SOARING_STRIKE.BODY]: '윙 스팅어',
 211:   [ID.SOARING_STRIKE.T1_1]: '재빠른 손놀림', [ID.SOARING_STRIKE.T1_2]: '화력 조절', [ID.SOARING_STRIKE.T1_3]: '기운 강화',
 212:   [ID.SOARING_STRIKE.T2_1]: '엠버레스의 날개', [ID.SOARING_STRIKE.T2_2]: '날개 응축',
 213:   [ID.SOARING_STRIKE.T3_1]: '넓은 타격', [ID.SOARING_STRIKE.T3_2]: '불굴의 강타',
 214: 
 215:   [ID.WING_LASH.BODY]: '윙 래시',
 216:   [ID.WING_LASH.T1_1]: '재빠른 손놀림', [ID.WING_LASH.T1_2]: '과소비', [ID.WING_LASH.T1_3]: '기운 강화',
 217:   [ID.WING_LASH.T2_1]: '강화된 일격', [ID.WING_LASH.T2_2]: '천공의 날개',
 218:   [ID.WING_LASH.T3_1]: '공간절삭', [ID.WING_LASH.T3_2]: '파멸의 날개',
 219: 
 220:   [ID.BLAZE_SWEEP.BODY]: '블레이즈 스윕',
 221:   [ID.BLAZE_SWEEP.T1_1]: '재빠른 손놀림', [ID.BLAZE_SWEEP.T1_2]: '전투의 달인', [ID.BLAZE_SWEEP.T1_3]: '전방위 타격',
 222:   [ID.BLAZE_SWEEP.T2_1]: '꿰뚫는 진격', [ID.BLAZE_SWEEP.T2_2]: '약점 포착',
 223:   [ID.BLAZE_SWEEP.T3_1]: '몰아치는 발톱', [ID.BLAZE_SWEEP.T3_2]: '정제된 분노',
 224: 
 225:   [ID.BLAZE_FLASH.BODY]: '블레이즈 플래시',
 226:   [ID.BLAZE_FLASH.T1_1]: '재빠른 손놀림', [ID.BLAZE_FLASH.T1_2]: '전투의 달인', [ID.BLAZE_FLASH.T1_3]: '부위 파괴 강화',
 227:   [ID.BLAZE_FLASH.T2_1]: '강화된 일격', [ID.BLAZE_FLASH.T2_2]: '깨어난 본능',
 228:   [ID.BLAZE_FLASH.T3_1]: '엠버레스의 춤사위', [ID.BLAZE_FLASH.T3_2]: '맹렬한 추격',
 229: 
 230:   [ID.RENDING_FINISHER.BODY]: '렌딩 피니셔',
 231:   [ID.RENDING_FINISHER.T1_1]: '재빠른 손놀림', [ID.RENDING_FINISHER.T1_2]: '단단한 비늘', [ID.RENDING_FINISHER.T1_3]: '정면 승부',
 232:   [ID.RENDING_FINISHER.T2_1]: '응축된 힘', [ID.RENDING_FINISHER.T2_2]: '약점 포착',
 233:   [ID.RENDING_FINISHER.T3_1]: '깨어난 본능', [ID.RENDING_FINISHER.T3_2]: '공간절삭',
 234: 
 235:   [ID.EXPLOSION_FINISHER.BODY]: '익스플로전 피니셔',
 236:   [ID.EXPLOSION_FINISHER.T1_1]: '재빠른 손놀림', [ID.EXPLOSION_FINISHER.T1_2]: '단단한 비늘', [ID.EXPLOSION_FINISHER.T1_3]: '뇌진탕',
 237:   [ID.EXPLOSION_FINISHER.T2_1]: '응축된 힘', [ID.EXPLOSION_FINISHER.T2_2]: '약점 포착',
 238:   [ID.EXPLOSION_FINISHER.T3_1]: '깨어난 본능', [ID.EXPLOSION_FINISHER.T3_2]: '엠버레스의 헌신',
 239:   
 240:   [ID.SOUL_DIVIDE.BODY]: '소울 디바이드',
 241:   [ID.DEEP_IMPACT.BODY]: '딥 임팩트',
 242:   [ID.GUARDIAN_BACKLASH.BODY]: '가디언 백래시',
 243:   [ID.BREATH_OF_EMBERES.BODY]: '브레스 오브 엠버레스',
 244:   [ID.GUARDIANS_CRASH.BODY]: '가디언즈 크래시',
 245:   [ID.AWAKEN.BODY]: '어웨이큰',
 246:   [ID.INFERNO_BURST.BODY]: '인페르노 버스트',
 247:   [ID.GUARDIAN_FEAR.BODY]: '가디언 피어'
 248: } as const;
 249: 
 250: // todo: 나중에 모든 직업의 ID를 불러올때 이런식으로 작성해서 모아놓는 index파일을 만들자.
 251: export const GK_ID = ID;
 252: export const GK_NAMES = NAMES;
 253: 
 254: // ============================================================
 255: // 스킬 DB
 256: // ============================================================
 257: 
 258: /**
 259:  * todo: ID.PIERCING_SHOCK.T2_2 기본피해량 1.4 검토
 260:  * ID.METEOR_CRASH.T2 기본공격의 N% 검토, 스킬 속성 추가 고려, ID.METEOR_CRASH.T2_2 화상 상수계수 추가
 261:  * ID.QUAKE_SMASH.BODY: 기본이 홀딩 스킬인 얘들 최대 홀딩피 피해증가 적용 기능 추가
 262:  * 기본피해량을 1-기본피해량으로 해서 그냥 DB에 피해증가수치를 적을지 피해타입을 분류해서 적용할지 검토
 263:  * 
 264:  * 2타만 피해증가 적용 방법 검토: ID.AVENGING_SPEAR.T3_2, ID.PIERCING_SHOCK.T3_2, ID.BLAZE_SWEEP.T3_1,
 265:  * ID.BLAZE_FLASH.T3_1, ID.BLAZE_FLASH.T3_2
 266:  * 
 267:  * 마법/물리 데미지 적용 여부 검토
 268:  */
 269: export const SKILLS_GUARDIAN_KNIGHT_DB: SkillData[] = [
 270: // ── [일반 스킬, category: 'BASIC'] ──────────────────────────────────
 271:   { // ────── 클리브 ────────────────────────────────────
 272:     id: ID.CLEAVE.BODY,
 273:     name: NAMES[ID.CLEAVE.BODY],
 274:     iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.BODY}.webp`,
 275:     category: [ 'BASIC' ],
 276:     typeId: 'NORMAL',
 277:     attackId: 'NON_DIRECTIONAL',
 278:     destruction: 0,
 279:     stagger: '',
 280:     superArmorId: 'NONE',
 281:     cooldown: 6,
 282: 
 283:     levels:[{
 284:           name: '1타', isCombined: true, hits: 1,
 285:           constants: [306, 542, 692, 812, 908, 984, 1050, 1110, 1155, 1201, 1202, 1202, 1202, 1202],
 286:           coefficients: [1.66, 2.95, 3.76, 4.41, 4.93, 5.35, 5.71, 6.03, 6.28, 6.53, 6.53, 6.53, 6.53, 6.53],
 287:         }],
 288: 
 289:     tripods: [
 290:       // ── 1티어 ─────────────────────────────────────────────
 291:       {
 292:         id: ID.CLEAVE.T1_1, name: NAMES[ID.CLEAVE.T1_1],
 293:         iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T1_1}.webp`,
 294:         slot: 1, index: 1,
 295:         memo: [{ type: '적 받는 피해 증가', value: 0.06}]
 296:       },
 297:       {
 298:         id: ID.CLEAVE.T1_2, name: NAMES[ID.CLEAVE.T1_2],
 299:         iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T1_2}.webp`,
 300:         slot: 1, index: 2,
 301:         memo: [{ type: '돌진 거리 증가', value: 4 }]
 302:       },
 303:       {
 304:         id: ID.CLEAVE.T1_3, name: NAMES[ID.CLEAVE.T1_3],
 305:         iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T1_3}.webp`,
 306:         slot: 1, index: 3,
 307:         memo: [{ type: '시전 속도 증가', value: 0.1 }]
 308:       },
 309:       // ── 2티어 ─────────────────────────────────────────────
 310:       {
 311:         id: ID.CLEAVE.T2_1, name: NAMES[ID.CLEAVE.T2_1],
 312:         iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T2_1}.webp`,
 313:         slot: 2, index: 1,
 314:         effects: [{
 315:           type: 'DMG_INC', value: [0.4], target: { skillIds: [ID.CLEAVE.BODY] }
 316:         }],
 317:         memo: [{ type: '기운 추가 회복', value: 1 }]
 318:       },
 319:       {
 320:         id: ID.CLEAVE.T2_2, name: NAMES[ID.CLEAVE.T2_2],
 321:         iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T2_2}.webp`,
 322:         slot: 2, index: 2,
 323:         memo: [{ type: '하급 및 일반 몬스터에게 주는 피해', value: 1.2 }]
 324:       },
 325:       {
 326:         id: ID.CLEAVE.T2_3, name: NAMES[ID.CLEAVE.T2_3],
 327:         iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T2_3}.webp`,
 328:         slot: 2, index: 3,
 329:         effects: [{
 330:           type: 'DMG_INC', value: [0.6], target: { skillIds: [ID.CLEAVE.BODY] }
 331:         }]
 332:       },
 333:       // ── 3티어 ─────────────────────────────────────────────
 334:       {
 335:         id: ID.CLEAVE.T3_1, name: NAMES[ID.CLEAVE.T3_1],
 336:         iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T3_1}.webp`,
 337:         slot: 3, index: 1,
 338:         effects: [{
 339:           type: 'DMG_INC', value: [0.6], target: { skillIds: [ID.CLEAVE.BODY] }
 340:         }],
 341:         addDamageSources: [{
 342:           name: '화상', isCombined: false, hits: 6,
 343:           constants: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
 344:           coefficients: [4.0, 7.08, 9.05, 10.62, 11.87, 12.85, 13.7, 14.48, 15.08, 15.68, 15.68, 15.69, 15.69, 15.69],
 345:         }]
 346:       },
 347:       {
 348:         id: ID.CLEAVE.T3_2, name: NAMES[ID.CLEAVE.T3_2],
 349:         iconPath: `/images/skills/guardian-knight/${ID.CLEAVE.T3_2}.webp`,
 350:         slot: 3, index: 2,
 351:         effects: [{
 352:           type: 'DMG_INC', value: [0.7], target: { skillIds: [ID.CLEAVE.BODY] }
 353:         }],
 354:         memo: [{ type: '공격 범위 증가', value: 0.3 }]
 355:       }
 356:     ]
 357:   },
 358:   { // ────── 와일드 어퍼 ────────────────────────────────────
 359:     id: ID.WILD_UPPERCUT.BODY,
 360:     name: NAMES[ID.WILD_UPPERCUT.BODY],
 361:     iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.BODY}.webp`,
 362:     category: [ 'BASIC' ],
 363:     typeId: 'COMBO',
 364:     attackId: 'NON_DIRECTIONAL',
 365:     destruction: 1,
 366:     stagger: '하',
 367:     superArmorId: 'NONE',
 368:     cooldown: 8,
 369:     
 370:     levels: [
 371:       {
 372:         name: '1타', isCombined: true, hits: 1,
 373:         constants: [111, 196, 251, 294, 329, 357, 380, 402, 419, 436, 436, 436, 436, 436],
 374:         coefficients: [0.6, 1.06, 1.36, 1.59, 1.78, 1.93, 2.06, 2.18, 2.27, 2.36, 2.36, 2.36, 2.36, 2.36],
 375:       },
 376:       {
 377:         name: '2타', isCombined: true, hits: 1,
 378:         constants: [258, 457, 584, 685, 765, 829, 883, 934, 972, 1010, 1010, 1011, 1011, 1011],
 379:         coefficients: [1.4, 2.48, 3.17, 3.72, 4.15, 4.5, 4.79, 5.07, 5.27, 5.48, 5.48, 5.48, 5.48, 5.48],
 380:       }
 381:     ],
 382: 
 383:     tripods: [
 384:       // ── 1티어 ─────────────────────────────────────────────
 385:       {
 386:         id: ID.WILD_UPPERCUT.T1_1, name: NAMES[ID.WILD_UPPERCUT.T1_1],
 387:         iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T1_1}.webp`,
 388:         slot: 1, index: 1,
 389:         memo: [{ type: '카운터 성공 시 쿨감', value: 3 }]
 390:       },
 391:       {
 392:         id: ID.WILD_UPPERCUT.T1_2, name: NAMES[ID.WILD_UPPERCUT.T1_2],
 393:         iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T1_2}.webp`,
 394:         slot: 1, index: 2,
 395:         overrides: { superArmorId: 'STIFF_IMMUNE' }
 396:       },
 397:       {
 398:         id: ID.WILD_UPPERCUT.T1_3, name: NAMES[ID.WILD_UPPERCUT.T1_3],
 399:         iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T1_3}.webp`,
 400:         slot: 1, index: 3,
 401:         memo: [{ type: '시전 속도 증가', value: 0.1 }]
 402:       },
 403:       // ── 2티어 ─────────────────────────────────────────────
 404:       {
 405:         id: ID.WILD_UPPERCUT.T2_1, name: NAMES[ID.WILD_UPPERCUT.T2_1],
 406:         iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T2_1}.webp`,
 407:         slot: 2, index: 1,
 408:         effects: [{
 409:           type: 'DMG_INC', value: [0.4], target: { skillIds: [ID.WILD_UPPERCUT.BODY] }
 410:         }],
 411:         memo: [{ type: '돌진 거리', value: 4 }]
 412:       },
 413:       {
 414:         id: ID.WILD_UPPERCUT.T2_2, name: NAMES[ID.WILD_UPPERCUT.T2_2],
 415:         iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T2_2}.webp`,
 416:         slot: 2, index: 2,
 417:         effects: [{
 418:           type: 'DMG_INC', value: [0.33], target: { skillIds: [ID.WILD_UPPERCUT.BODY] }
 419:         }],
 420:         overrides: { typeId: 'NORMAL' }
 421:       },
 422:       {
 423:         id: ID.WILD_UPPERCUT.T2_3, name: NAMES[ID.WILD_UPPERCUT.T2_3],
 424:         iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T2_3}.webp`,
 425:         slot: 2, index: 3,
 426:         effects: [{
 427:           type: 'DMG_INC', value: [0.9], target: { skillIds: [ID.WILD_UPPERCUT.BODY] }
 428:         }]
 429:       },
 430:       // ── 3티어 ─────────────────────────────────────────────
 431:       {
 432:         id: ID.WILD_UPPERCUT.T3_1, name: NAMES[ID.WILD_UPPERCUT.T3_1],
 433:         iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T3_1}.webp`,
 434:         slot: 3, index: 1,
 435:         effects: [{
 436:           type: 'DMG_INC', value: [0.8], target: { skillIds: [ID.WILD_UPPERCUT.BODY] }
 437:         }],
 438:       },
 439:       {
 440:         id: ID.WILD_UPPERCUT.T3_2, name: NAMES[ID.WILD_UPPERCUT.T3_2],
 441:         iconPath: `/images/skills/guardian-knight/${ID.WILD_UPPERCUT.T3_2}.webp`,
 442:         slot: 3, index: 2,
 443:         memo: [{ type: '스택형으로 변경', value: 2 }]
 444:       }
 445:     ]
 446:   },
 447:   { // ────── 쓰러스트 ────────────────────────────────────
 448:     id: ID.THRUST.BODY,
 449:     name: NAMES[ID.THRUST.BODY],
 450:     iconPath: `/images/skills/guardian-knight/${ID.THRUST.BODY}.webp`,
 451:     category: [ 'BASIC' ],
 452:     typeId: 'NORMAL',
 453:     attackId: 'NON_DIRECTIONAL',
 454:     destruction: 0,
 455:     stagger: '하',
 456:     superArmorId: 'STIFF_IMMUNE',
 457:     cooldown: 8,
 458: 
 459:     levels: [
 460:       {
 461:         name: '1타', isCombined: true, hits: 1,
 462:         constants: [387, 687, 878, 1031, 1152, 1248, 1330, 1407, 1465, 1523, 1523, 1524, 1524, 1525],
 463:         coefficients: [2.1, 3.73, 4.77, 5.6, 6.26, 6.78, 7.23, 7.64, 7.96, 8.27, 8.27, 8.28, 8.28, 8.28],
 464:       }
 465:     ],
 466: 
 467:     tripods: [
 468:       // ── 1티어 ─────────────────────────────────────────────
 469:       {
 470:         id: ID.THRUST.T1_1, name: NAMES[ID.THRUST.T1_1],
 471:         iconPath: `/images/skills/guardian-knight/${ID.THRUST.T1_1}.webp`,
 472:         slot: 1, index: 1,
 473:         memo: [{ type: '적 받는 피해 증가', value: 0.06 }]
 474:       },
 475:       {
 476:         id: ID.THRUST.T1_2, name: NAMES[ID.THRUST.T1_2],
 477:         iconPath: `/images/skills/guardian-knight/${ID.THRUST.T1_2}.webp`,
 478:         slot: 1, index: 2,
 479:         overrides: { destruction: 1 }
 480:       },
 481:       {
 482:         id: ID.THRUST.T1_3, name: NAMES[ID.THRUST.T1_3],
 483:         iconPath: `/images/skills/guardian-knight/${ID.THRUST.T1_3}.webp`,
 484:         slot: 1, index: 3,
 485:         memo: [{ type: '피격 시 받는 피해 감소', value: 0.2 }]
 486:       },
 487:       // ── 2티어 ─────────────────────────────────────────────
 488:       {
 489:         id: ID.THRUST.T2_1, name: NAMES[ID.THRUST.T2_1],
 490:         iconPath: `/images/skills/guardian-knight/${ID.THRUST.T2_1}.webp`,
 491:         slot: 2, index: 1,
 492:         overrides: { typeId: 'CHAIN' },
 493:         memo: [{ type: '기운 추가 회복', value: -1 }]
 494:       },
 495:       {
 496:         id: ID.THRUST.T2_2, name: NAMES[ID.THRUST.T2_2],
 497:         iconPath: `/images/skills/guardian-knight/${ID.THRUST.T2_2}.webp`,
 498:         slot: 2, index: 2,
 499:         effects: [{
 500:           type: 'DMG_INC', value: [0.4],
 501:           target: { skillIds: [ID.THRUST.BODY] }
 502:         }]
 503:       },
 504:       {
 505:         id: ID.THRUST.T2_3, name: NAMES[ID.THRUST.T2_3],
 506:         iconPath: `/images/skills/guardian-knight/${ID.THRUST.T2_3}.webp`,
 507:         slot: 2, index: 3,
 508:         effects: [{
 509:           type: 'DMG_INC', value: [0.7],
 510:           target: { skillIds: [ID.THRUST.BODY] }
 511:         }]
 512:       },
 513:       // ── 3티어 ─────────────────────────────────────────────
 514:       {
 515:         id: ID.THRUST.T3_1, name: NAMES[ID.THRUST.T3_1],
 516:         iconPath: `/images/skills/guardian-knight/${ID.THRUST.T3_1}.webp`,
 517:         slot: 3, index: 1,
 518:         effects: [{
 519:           type: 'DMG_INC', value: [1.1],
 520:           target: { skillIds: [ID.THRUST.BODY] }
 521:         }]
 522:       },
 523:       {
 524:         id: ID.THRUST.T3_2, name: NAMES[ID.THRUST.T3_2],
 525:         iconPath: `/images/skills/guardian-knight/${ID.THRUST.T3_2}.webp`,
 526:         slot: 3, index: 2,
 527:         effects: [{
 528:           type: 'DMG_INC', value: [0.9],
 529:           target: { skillIds: [ID.THRUST.BODY] }
 530:         }]
 531:       }
 532:     ]
 533:   },
 534:   { // ────── 길로틴 스핀 ────────────────────────────────────
 535:     id: ID.GUILLOTINE_SPIN.BODY,
 536:     name: NAMES[ID.GUILLOTINE_SPIN.BODY],
 537:     iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.BODY}.webp`,
 538:     category: [ 'BASIC' ],
 539:     typeId: 'NORMAL',
 540:     attackId: 'NON_DIRECTIONAL',
 541:     destruction: 1,
 542:     stagger: '중상',
 543:     superArmorId: 'STIFF_IMMUNE',
 544:     cooldown: 24,
 545: 
 546:     levels: [
 547:       {
 548:         name: '1타', isCombined: true, hits: 1, // 회전 공격
 549:         constants: [777, 1378, 1761, 2069, 2313, 2504, 2670, 2820, 2936, 3053, 3054, 3055, 3056, 3056],
 550:         coefficients: [4.22, 7.48, 9.56, 11.23, 12.56, 13.59, 14.5, 15.31, 15.94, 16.57, 16.57, 16.58, 16.58, 16.58],
 551:       },
 552:       {
 553:         name: '2타', isCombined: true, hits: 1, // 내려치기
 554:         constants: [437, 774, 989, 1162, 1298, 1405, 1499, 1585, 1649, 1714, 1715, 1715, 1716, 1716],
 555:         coefficients: [2.37, 4.2, 5.37, 6.31, 7.05, 7.63, 8.14, 8.6, 8.95, 9.3, 9.31, 9.31, 9.31, 9.31],
 556:       }
 557:     ],
 558: 
 559:     tripods: [
 560:       // ── 1티어 ─────────────────────────────────────────────
 561:       {
 562:         id: ID.GUILLOTINE_SPIN.T1_1, name: NAMES[ID.GUILLOTINE_SPIN.T1_1],
 563:         iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T1_1}.webp`,
 564:         slot: 1, index: 1,
 565:         memo: [{ type: '하급 및 일반 몬스터에게 주는 피해', value: 0.65 }]
 566:       },
 567:       {
 568:         id: ID.GUILLOTINE_SPIN.T1_2, name: NAMES[ID.GUILLOTINE_SPIN.T1_2],
 569:         iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T1_2}.webp`,
 570:         slot: 1, index: 2,
 571:         effects: [{
 572:           type: 'DMG_INC', value: [0.35],
 573:           target: { skillIds: [ID.GUILLOTINE_SPIN.BODY] }
 574:         }]
 575:       },
 576:       {
 577:         id: ID.GUILLOTINE_SPIN.T1_3, name: NAMES[ID.GUILLOTINE_SPIN.T1_3],
 578:         iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T1_3}.webp`,
 579:         slot: 1, index: 3,
 580:         overrides: { stagger: '상' }
 581:       },
 582:       // ── 2티어 ─────────────────────────────────────────────
 583:       {
 584:         id: ID.GUILLOTINE_SPIN.T2_1, name: NAMES[ID.GUILLOTINE_SPIN.T2_1],
 585:         iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T2_1}.webp`,
 586:         slot: 2, index: 1,
 587:         effects: [{
 588:           type: 'DMG_INC', value: [0.8],
 589:           target: { skillIds: [ID.GUILLOTINE_SPIN.BODY] }
 590:         }]
 591:       },
 592:       {
 593:         id: ID.GUILLOTINE_SPIN.T2_2, name: NAMES[ID.GUILLOTINE_SPIN.T2_2],
 594:         iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T2_2}.webp`,
 595:         slot: 2, index: 2,
 596:         effects: [{
 597:           type: 'DMG_INC', value: [0.65],
 598:           target: { skillIds: [ID.GUILLOTINE_SPIN.BODY] }
 599:         }],
 600:         overrides: { superArmorId: 'PUSH_IMMUNE' }
 601:       },
 602:       {
 603:         id: ID.GUILLOTINE_SPIN.T2_3, name: NAMES[ID.GUILLOTINE_SPIN.T2_3],
 604:         iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T2_3}.webp`,
 605:         slot: 2, index: 3,
 606:         effects: [{
 607:           type: 'DMG_INC', value: [0.55],
 608:           target: { skillIds: [ID.GUILLOTINE_SPIN.BODY] }
 609:         }]
 610:       },
 611:       // ── 3티어 ─────────────────────────────────────────────
 612:       {
 613:         id: ID.GUILLOTINE_SPIN.T3_1, name: NAMES[ID.GUILLOTINE_SPIN.T3_1],
 614:         iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T3_1}.webp`,
 615:         slot: 3, index: 1,
 616:         memo: [{ type: '공격 범위 증가', value: 0.3 }, { type: '적중 시 쿨감(최대)', value: 12 }]
 617:       },
 618:       {
 619:         id: ID.GUILLOTINE_SPIN.T3_2, name: NAMES[ID.GUILLOTINE_SPIN.T3_2],
 620:         iconPath: `/images/skills/guardian-knight/${ID.GUILLOTINE_SPIN.T3_2}.webp`,
 621:         slot: 3, index: 2,
 622:         effects: [{
 623:           type: 'DMG_INC', value: [1.2],
 624:           target: { skillIds: [ID.GUILLOTINE_SPIN.BODY] }
 625:         }],
 626:         memo: [{ type: '기운 추가 회복', value: -1 }]
 627:       }
 628:     ]
 629:   },
 630:   { // ────── 임페일 쇼크 ────────────────────────────────────
 631:     id: ID.PIERCING_SHOCK.BODY,
 632:     name: NAMES[ID.PIERCING_SHOCK.BODY],
 633:     iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.BODY}.webp`,
 634:     category: [ 'BASIC' ],
 635:     typeId: 'NORMAL',
 636:     attackId: 'NON_DIRECTIONAL',
 637:     destruction: 0,
 638:     stagger: '상',
 639:     superArmorId: 'STIFF_IMMUNE',
 640:     cooldown: 24,
 641: 
 642:     levels: [
 643:       {
 644:         name: '1타', isCombined: true, hits: 1,
 645:         constants: [176, 312, 399, 468, 523, 566, 604, 638, 664, 689, 690, 690, 690, 690],
 646:         coefficients: [0.95, 1.69, 2.16, 2.54, 2.84, 3.07, 3.28, 3.46, 3.61, 3.74, 3.74, 3.74, 3.74, 3.74],
 647:       },
 648:       {
 649:         name: '2타', isCombined: true, hits: 1,
 650:         constants: [825, 1461, 1868, 2193, 2450, 2653, 2829, 2992, 3114, 3237, 3238, 3239, 3240, 3240],
 651:         coefficients: [4.48, 7.93, 10.14, 11.9, 13.3, 14.4, 15.36, 16.24, 16.9, 17.57, 17.58, 17.58, 17.58, 17.58],
 652:       }
 653:     ],
 654: 
 655:     tripods: [
 656:       // ── 1티어 ─────────────────────────────────────────────
 657:       {
 658:         id: ID.PIERCING_SHOCK.T1_1, name: NAMES[ID.PIERCING_SHOCK.T1_1],
 659:         iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T1_1}.webp`,
 660:         slot: 1, index: 1,
 661:         memo: [{ type: '기운 추가 회복', value: 3 }]
 662:       },
 663:       {
 664:         id: ID.PIERCING_SHOCK.T1_2, name: NAMES[ID.PIERCING_SHOCK.T1_2],
 665:         iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T1_2}.webp`,
 666:         slot: 1, index: 2,
 667:         memo: [{ type: '오브 게이지 회복량 증가', value: 0.3 }]
 668:       },
 669:       {
 670:         id: ID.PIERCING_SHOCK.T1_3, name: NAMES[ID.PIERCING_SHOCK.T1_3],
 671:         iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T1_3}.webp`,
 672:         slot: 1, index: 3,
 673:         overrides: { destruction: 1 }
 674:       },
 675:       // ── 2티어 ─────────────────────────────────────────────
 676:       {
 677:         id: ID.PIERCING_SHOCK.T2_1, name: NAMES[ID.PIERCING_SHOCK.T2_1],
 678:         iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T2_1}.webp`,
 679:         slot: 2, index: 1,
 680:         overrides: { typeId: 'CHARGE' },
 681:         effects: [{
 682:           type: 'DMG_INC', value: [0.7],
 683:           target: { skillIds: [ID.PIERCING_SHOCK.BODY] }
 684:         }]
 685:       },
 686:       {
 687:         id: ID.PIERCING_SHOCK.T2_2, name: NAMES[ID.PIERCING_SHOCK.T2_2],
 688:         iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T2_2}.webp`,
 689:         slot: 2, index: 2,
 690:         effects: [
 691:           {
 692:             type: 'DMG_INC', value: [1.4],
 693:             target: { skillIds: [ID.PIERCING_SHOCK.BODY] }
 694:           },
 695:           {
 696:             type: 'CDR_C', value: [6],
 697:             target: { skillIds: [ID.PIERCING_SHOCK.BODY] }
 698:           }
 699:         ]
 700:       },
 701:       {
 702:         id: ID.PIERCING_SHOCK.T2_3, name: NAMES[ID.PIERCING_SHOCK.T2_3],
 703:         iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T2_3}.webp`,
 704:         slot: 2, index: 3,
 705:         effects: [{
 706:           type: 'DMG_INC', value: [0.9],
 707:           target: { skillIds: [ID.PIERCING_SHOCK.BODY] }
 708:         }]
 709:       },
 710:       // ── 3티어 ─────────────────────────────────────────────
 711:       {
 712:         id: ID.PIERCING_SHOCK.T3_1, name: NAMES[ID.PIERCING_SHOCK.T3_1],
 713:         iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T3_1}.webp`,
 714:         slot: 3, index: 1,
 715:         effects: [{
 716:           type: 'DMG_INC', value: [1.2],
 717:           target: { skillIds: [ID.PIERCING_SHOCK.BODY] }
 718:         }],
 719:         memo: [{ type: '게이지 회복량 감소', value: 0.5 }]
 720:       },
 721:       {
 722:         id: ID.PIERCING_SHOCK.T3_2, name: NAMES[ID.PIERCING_SHOCK.T3_2],
 723:         iconPath: `/images/skills/guardian-knight/${ID.PIERCING_SHOCK.T3_2}.webp`,
 724:         slot: 3, index: 2,
 725:         effects: [{
 726:           type: 'DMG_INC', value: [0.9],
 727:           target: { skillIds: [ID.PIERCING_SHOCK.BODY] }
 728:         }]
 729:       }
 730:     ]
 731:   },
 732:   { // ────── 미티어 크래시 ────────────────────────────────────
 733:     id: ID.METEOR_CRASH.BODY,
 734:     name: NAMES[ID.METEOR_CRASH.BODY],
 735:     iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.BODY}.webp`,
 736:     category: [ 'BASIC' ],
 737:     typeId: 'POINT',
 738:     attackId: 'NON_DIRECTIONAL',
 739:     destruction: 0,
 740:     stagger: '중',
 741:     superArmorId: 'STIFF_IMMUNE',
 742:     cooldown: 15,
 743: 
 744:     levels: [
 745:       {
 746:         name: '1타', isCombined: true, hits: 1,
 747:         constants: [736, 1303, 1666, 1955, 2185, 2366, 2523, 2667, 2777, 2886, 2887, 2888, 2889, 2889],
 748:         coefficients: [4.0, 7.08, 9.05, 10.62, 11.87, 12.85, 13.7, 14.48, 15.08, 15.68, 15.68, 15.69, 15.69, 15.69],
 749:       }
 750:     ],
 751: 
 752:     tripods: [
 753:       // ── 1티어 ─────────────────────────────────────────────
 754:       {
 755:         id: ID.METEOR_CRASH.T1_1, name: NAMES[ID.METEOR_CRASH.T1_1],
 756:         iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T1_1}.webp`,
 757:         slot: 1, index: 1,
 758:         memo: [{ type: '피격 시 받는 피해 감소', value: 0.2 }]
 759:       },
 760:       {
 761:         id: ID.METEOR_CRASH.T1_2, name: NAMES[ID.METEOR_CRASH.T1_2],
 762:         iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T1_2}.webp`,
 763:         slot: 1, index: 2,
 764:         memo: [{ type: '오브 게이지 회복량 증가', value: 0.3 }]
 765:       },
 766:       {
 767:         id: ID.METEOR_CRASH.T1_3, name: NAMES[ID.METEOR_CRASH.T1_3],
 768:         iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T1_3}.webp`,
 769:         slot: 1, index: 3,
 770:         memo: [{ type: '기운 추가 회복', value: 2 }]
 771:       },
 772:       // ── 2티어 ─────────────────────────────────────────────
 773:       {
 774:         id: ID.METEOR_CRASH.T2_1, name: NAMES[ID.METEOR_CRASH.T2_1],
 775:         iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T2_1}.webp`,
 776:         slot: 2, index: 1,
 777:         effects: [{
 778:           type: 'DMG_INC', value: [0.3],
 779:           target: { skillIds: [ID.METEOR_CRASH.BODY] }
 780:         }]
 781:       },
 782:       {
 783:         id: ID.METEOR_CRASH.T2_2, name: NAMES[ID.METEOR_CRASH.T2_2],
 784:         iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T2_2}.webp`,
 785:         slot: 2, index: 2,
 786:         effects: [{
 787:           type: 'DMG_INC', value: [0.4],
 788:           target: { skillIds: [ID.METEOR_CRASH.BODY] }
 789:         }],
 790:         addDamageSources: [{
 791:           name: '화상', isCombined: false, hits: 6,
 792:           constants: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
 793:           coefficients: [4.0, 7.08, 9.05, 10.62, 11.87, 12.85, 13.7, 14.48, 15.08, 15.68, 15.68, 15.69, 15.69, 15.69],
 794:         }]
 795:       },
 796:       {
 797:         id: ID.METEOR_CRASH.T2_3, name: NAMES[ID.METEOR_CRASH.T2_3],
 798:         iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T2_3}.webp`,
 799:         slot: 2, index: 3,
 800:         effects: [{
 801:           type: 'DMG_INC', value: [0.45],
 802:           target: { skillIds: [ID.METEOR_CRASH.BODY] }
 803:         }]
 804:       },
 805:       // ── 3티어 ─────────────────────────────────────────────
 806:       {
 807:         id: ID.METEOR_CRASH.T3_1, name: NAMES[ID.METEOR_CRASH.T3_1],
 808:         iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T3_1}.webp`,
 809:         slot: 3, index: 1,
 810:         effects: [{
 811:           type: 'DMG_INC', value: [0.65],
 812:           target: { skillIds: [ID.METEOR_CRASH.BODY] }
 813:         }],
 814:         memo: [{ type: '공격 범위 증가', value: 0.5 }]
 815:       },
 816:       {
 817:         id: ID.METEOR_CRASH.T3_2, name: NAMES[ID.METEOR_CRASH.T3_2],
 818:         iconPath: `/images/skills/guardian-knight/${ID.METEOR_CRASH.T3_2}.webp`,
 819:         slot: 3, index: 2,
 820:         effects: [{
 821:           type: 'DMG_INC', value: [0.55],
 822:           target: { skillIds: [ID.METEOR_CRASH.BODY] }
 823:         }],
 824:         memo: [{ type: '사용 거리 증가', value: 5 }]
 825:       }
 826:     ]
 827:   },
 828:   { // ────── 퀘이크 스매시 ────────────────────────────────────
 829:     id: ID.QUAKE_SMASH.BODY,
 830:     name: NAMES[ID.QUAKE_SMASH.BODY],
 831:     iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.BODY}.webp`,
 832:     category: [ 'BASIC' ],
 833:     typeId: 'HOLDING',
 834:     attackId: 'NON_DIRECTIONAL',
 835:     destruction: 2,
 836:     stagger: '최상',
 837:     superArmorId: 'STIFF_IMMUNE',
 838:     cooldown: 40,
 839: 
 840:     levels: [
 841:       {
 842:         name: '1타', isCombined: true, hits: 1,
 843:         constants: [1810, 3207, 4099, 4812, 5376, 5822, 6208, 6564, 6832, 7099, 7102, 7104, 7106, 7107],
 844:         coefficients: [9.84, 17.43, 22.28, 26.15, 29.22, 31.64, 33.74, 35.67, 37.13, 38.58, 38.6, 38.61, 38.62, 38.63],
 845:       }
 846:     ],
 847: 
 848:     tripods: [
 849:       // ── 1티어 ─────────────────────────────────────────────
 850:       {
 851:         id: ID.QUAKE_SMASH.T1_1, name: NAMES[ID.QUAKE_SMASH.T1_1],
 852:         iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T1_1}.webp`,
 853:         slot: 1, index: 1,
 854:         memo: [{ type: '피격 시 받는 피해 감소', value: 0.2 }]
 855:       },
 856:       {
 857:         id: ID.QUAKE_SMASH.T1_2, name: NAMES[ID.QUAKE_SMASH.T1_2],
 858:         iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T1_2}.webp`,
 859:         slot: 1, index: 2,
 860:         overrides: { destruction: 3 } // 부위 파괴 +1
 861:       },
 862:       {
 863:         id: ID.QUAKE_SMASH.T1_3, name: NAMES[ID.QUAKE_SMASH.T1_3],
 864:         iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T1_3}.webp`,
 865:         slot: 1, index: 3,
 866:         memo: [{ type: '시전 속도 증가', value: 0.1 }]
 867:       },
 868:       // ── 2티어 ─────────────────────────────────────────────
 869:       {
 870:         id: ID.QUAKE_SMASH.T2_1, name: NAMES[ID.QUAKE_SMASH.T2_1],
 871:         iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T2_1}.webp`,
 872:         slot: 2, index: 1,
 873:         overrides: { typeId: 'NORMAL' },
 874:         effects: [{
 875:           type: 'DMG_INC', value: [0.8],
 876:           target: { skillIds: [ID.QUAKE_SMASH.BODY] }
 877:         }],
 878:         memo: [{ type: '기운 추가 회복', value: 2 }]
 879:       },
 880:       {
 881:         id: ID.QUAKE_SMASH.T2_2, name: NAMES[ID.QUAKE_SMASH.T2_2],
 882:         iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T2_2}.webp`,
 883:         slot: 2, index: 2,
 884:         overrides: { typeId: 'CHARGE' },
 885:         effects: [{
 886:           type: 'DMG_INC', value: [1.85],
 887:           target: { skillIds: [ID.QUAKE_SMASH.BODY] }
 888:         }]
 889:       },
 890:       {
 891:         id: ID.QUAKE_SMASH.T2_3, name: NAMES[ID.QUAKE_SMASH.T2_3],
 892:         iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T2_3}.webp`,
 893:         slot: 2, index: 3,
 894:         effects: [{
 895:           type: 'DMG_INC', value: [0.9],
 896:           target: { skillIds: [ID.QUAKE_SMASH.BODY] }
 897:         }]
 898:       },
 899:       // ── 3티어 ─────────────────────────────────────────────
 900:       {
 901:         id: ID.QUAKE_SMASH.T3_1, name: NAMES[ID.QUAKE_SMASH.T3_1],
 902:         iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T3_1}.webp`,
 903:         slot: 3, index: 1,
 904:         effects: [{
 905:           type: 'DMG_INC', value: [1.2],
 906:           target: { skillIds: [ID.QUAKE_SMASH.BODY] }
 907:         }],
 908:         memo: [{ type: '게이지 회복량 감소', value: 0.5 }]
 909:       },
 910:       {
 911:         id: ID.QUAKE_SMASH.T3_2, name: NAMES[ID.QUAKE_SMASH.T3_2],
 912:         iconPath: `/images/skills/guardian-knight/${ID.QUAKE_SMASH.T3_2}.webp`,
 913:         slot: 3, index: 2,
 914:         overrides: { superArmorId: 'PUSH_IMMUNE' },
 915:         effects: [{
 916:           type: 'DMG_INC', value: [0.95],
 917:           target: { skillIds: [ID.QUAKE_SMASH.BODY] }
 918:         }]
 919:       }
 920:     ]
 921:   },
 922:   { // ────── 프렌지 스윕 ────────────────────────────────────
 923:     id: ID.FRENZY_SWEEP.BODY,
 924:     name: NAMES[ID.FRENZY_SWEEP.BODY],
 925:     iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.BODY}.webp`,
 926:     category: [ 'BASIC' ],
 927:     typeId: 'NORMAL',
 928:     attackId: 'NON_DIRECTIONAL',
 929:     destruction: 0,
 930:     stagger: '중상',
 931:     superArmorId: 'STIFF_IMMUNE',
 932:     cooldown: 36,
 933: 
 934:     levels: [
 935:       {
 936:         name: '1타', isCombined: true, hits: 1,
 937:         constants: [1324, 2348, 3003, 3524, 3938, 4263, 4547, 4810, 5006, 5202, 5205, 5206, 5207, 5208],
 938:         coefficients: [7.2, 12.76, 16.32, 19.15, 21.4, 23.17, 24.71, 26.14, 27.21, 28.27, 28.29, 28.29, 28.3, 28.31],
 939:       },
 940:       {
 941:         name: '2타', isCombined: true, hits: 1,
 942:         constants: [881, 1561, 1996, 2343, 2618, 2834, 3023, 3196, 3327, 3457, 3458, 3459, 3460, 3461],
 943:         coefficients: [4.79, 8.48, 10.85, 12.73, 14.23, 15.4, 16.43, 17.37, 18.08, 18.79, 18.79, 18.8, 18.8, 18.81],
 944:       }
 945:     ],
 946: 
 947:     tripods: [
 948:       // ── 1티어 ─────────────────────────────────────────────
 949:       {
 950:         id: ID.FRENZY_SWEEP.T1_1, name: NAMES[ID.FRENZY_SWEEP.T1_1],
 951:         iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T1_1}.webp`,
 952:         slot: 1, index: 1,
 953:         memo: [{ type: '피격 시 받는 피해 감소', value: 0.2 }]
 954:       },
 955:       {
 956:         id: ID.FRENZY_SWEEP.T1_2, name: NAMES[ID.FRENZY_SWEEP.T1_2],
 957:         iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T1_2}.webp`,
 958:         slot: 1, index: 2,
 959:         overrides: { stagger: '상' }
 960:       },
 961:       {
 962:         id: ID.FRENZY_SWEEP.T1_3, name: NAMES[ID.FRENZY_SWEEP.T1_3],
 963:         iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T1_3}.webp`,
 964:         slot: 1, index: 3,
 965:         memo: [{ type: '시전 속도 증가', value: 0.15 }]
 966:       },
 967:       // ── 2티어 ─────────────────────────────────────────────
 968:       {
 969:         id: ID.FRENZY_SWEEP.T2_1, name: NAMES[ID.FRENZY_SWEEP.T2_1],
 970:         iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T2_1}.webp`,
 971:         slot: 2, index: 1,
 972:         effects: [{
 973:           type: 'DMG_INC', value: [1.755],
 974:           target: { skillIds: [ID.FRENZY_SWEEP.BODY] }
 975:         }]
 976:       },
 977:       {
 978:         id: ID.FRENZY_SWEEP.T2_2, name: NAMES[ID.FRENZY_SWEEP.T2_2],
 979:         iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T2_2}.webp`,
 980:         slot: 2, index: 2,
 981:         effects: [{
 982:           type: 'DMG_INC', value: [1.44],
 983:           target: { skillIds: [ID.FRENZY_SWEEP.BODY] }
 984:         }]
 985:       },
 986:       {
 987:         id: ID.FRENZY_SWEEP.T2_3, name: NAMES[ID.FRENZY_SWEEP.T2_3],
 988:         iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T2_3}.webp`,
 989:         slot: 2, index: 3,
 990:         effects: [{
 991:           type: 'DMG_INC', value: [0.8],
 992:           target: { skillIds: [ID.FRENZY_SWEEP.BODY] }
 993:         }],
 994:         memo: [{ type: '게이지 회복량 감소', value: 0.5 }]
 995:       },
 996:       // ── 3티어 ─────────────────────────────────────────────
 997:       {
 998:         id: ID.FRENZY_SWEEP.T3_1, name: NAMES[ID.FRENZY_SWEEP.T3_1],
 999:         iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T3_1}.webp`,
1000:         slot: 3, index: 1,
1001:         effects: [{
1002:           type: 'DMG_INC', value: [0.84],
1003:           target: { skillIds: [ID.FRENZY_SWEEP.BODY] }
1004:         }]
1005:       },
1006:       {
1007:         id: ID.FRENZY_SWEEP.T3_2, name: NAMES[ID.FRENZY_SWEEP.T3_2],
1008:         iconPath: `/images/skills/guardian-knight/${ID.FRENZY_SWEEP.T3_2}.webp`,
1009:         slot: 3, index: 2,
1010:         effects: [{
1011:           type: 'DMG_INC', value: [0.8],
1012:           target: { skillIds: [ID.FRENZY_SWEEP.BODY] }
1013:         }],
1014:         addDamageSources: [{
1015:           name: '화상', isCombined: false, hits: 6,
1016:           constants: [73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73, 73],
1017:           coefficients: [4.0, 7.08, 9.05, 10.62, 11.87, 12.85, 13.7, 14.48, 15.08, 15.68, 15.68, 15.69, 15.69, 15.69],
1018:         }]
1019:       }
1020:     ]
1021:   },
1022: 
1023:   // ── [발현/화신 스킬, category: 'ENLIGHTEN'/'GOD_FORM'] ──────────────────────────────────  
1024:   { // ────── 리벤지 블로우 ────────────────────────────────────
1025:     id: ID.VENGEFUL_BLOW.BODY,
1026:     name: NAMES[ID.VENGEFUL_BLOW.BODY],
1027:     iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.BODY}.webp`,
1028:     category: [ 'ENLIGHTEN' ], // 발현 스킬
1029:     typeId: 'HOLDING',
1030:     attackId: 'HEAD_ATK',
1031:     resource: { typeId: 'QI_EMBERES', isStatic: true, value: 4 },
1032:     destruction: 0,
1033:     stagger: '중',
1034:     superArmorId: 'PUSH_IMMUNE',
1035:     cooldown: 15,
1036: 
1037:     levels: [
1038:       {
1039:         name: '1타', isCombined: true, hits: 1,
1040:         constants: [905, 1603, 2048, 2404, 2686, 2908, 3101, 3279, 3413, 3546, 3547, 3549, 3549, 3550],
1041:         coefficients: [4.92, 8.71, 11.13, 13.06, 14.6, 15.8, 16.85, 17.82, 18.55, 19.27, 19.28, 19.29, 19.29, 19.3],
1042:       }
1043:     ],
1044: 
1045:     tripods: [
1046:       // ── 1티어 ─────────────────────────────────────────────
1047:       {
1048:         id: ID.VENGEFUL_BLOW.T1_1, name: NAMES[ID.VENGEFUL_BLOW.T1_1],
1049:         iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.T1_1}.webp`,
1050:         slot: 1, index: 1,
1051:         effects: [{
1052:           type: 'GK_QI_DMG', value: [0.05],
1053:           target: { skillIds: [ID.VENGEFUL_BLOW.BODY] }
1054:         }]
1055:       },
1056:       {
1057:         id: ID.VENGEFUL_BLOW.T1_2, name: NAMES[ID.VENGEFUL_BLOW.T1_2],
1058:         iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.T1_2}.webp`,
1059:         slot: 1, index: 2,
1060:         overrides: { attackId: 'NON_DIRECTIONAL' },
1061:         effects: [{
1062:           type: 'DMG_INC', value: [0.15],
1063:           target: { skillIds: [ID.VENGEFUL_BLOW.BODY] }
1064:         }]
1065:       },
1066:       {
1067:         id: ID.VENGEFUL_BLOW.T1_3, name: NAMES[ID.VENGEFUL_BLOW.T1_3],
1068:         iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.T1_3}.webp`,
1069:         slot: 1, index: 3,
1070:         memo: [{ type: '준비 동작 속도 증가 및 유지 시간 증가', value: 1 }]
1071:       },
1072:       // ── 2티어 ─────────────────────────────────────────────
1073:       {
1074:         id: ID.VENGEFUL_BLOW.T2_1, name: NAMES[ID.VENGEFUL_BLOW.T2_1],
1075:         iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.T2_1}.webp`,
1076:         slot: 2, index: 1,
1077:         effects: [{
1078:           type: 'DMG_INC', value: [0.45],
1079:           target: { skillIds: [ID.VENGEFUL_BLOW.BODY] }
1080:         }],
1081:         memo: [{ type: '보호막 수치 증가', value: 0.2 }]
1082:       },
1083:       {
1084:         id: ID.VENGEFUL_BLOW.T2_2, name: NAMES[ID.VENGEFUL_BLOW.T2_2],
1085:         iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.T2_2}.webp`,
1086:         slot: 2, index: 2,
1087:         effects: [{
1088:           type: 'CDR_C', value: [6],
1089:           target: { skillIds: [ID.VENGEFUL_BLOW.BODY] }
1090:         }]
1091:       },
1092:       // ── 3티어 ─────────────────────────────────────────────
1093:       {
1094:         id: ID.VENGEFUL_BLOW.T3_1, name: NAMES[ID.VENGEFUL_BLOW.T3_1],
1095:         iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.T3_1}.webp`,
1096:         slot: 3, index: 1,
1097:         link: { slot: 2, index: 1 },
1098:         overrides: { superArmorId: 'DEBUFF_IMMUNE' }
1099:       },
1100:       {
1101:         id: ID.VENGEFUL_BLOW.T3_2, name: NAMES[ID.VENGEFUL_BLOW.T3_2],
1102:         iconPath: `/images/skills/guardian-knight/${ID.VENGEFUL_BLOW.T3_2}.webp`,
1103:         slot: 3, index: 2,
1104:         link: { slot: 2, index: 2 },
1105:         effects: [{
1106:           type: 'DMG_INC', value: [0.8],
1107:           target: { skillIds: [ID.VENGEFUL_BLOW.BODY] }
1108:         }]
1109:       }
1110:     ]
1111:   },
1112:   { // ────── 리벤지 스피어 ────────────────────────────────────
1113:     id: ID.AVENGING_SPEAR.BODY,
1114:     name: NAMES[ID.AVENGING_SPEAR.BODY],
1115:     iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.BODY}.webp`,
1116:     category: [ 'GOD_FORM' ],
1117:     typeId: 'HOLDING',
1118:     attackId: 'NON_DIRECTIONAL',
1119:     resource: { typeId: 'QI_EMBERES', isStatic: true, value: 4 },
1120:     destruction: 0,
1121:     stagger: '중',
1122:     superArmorId: 'NONE',
1123:     cooldown: 21,
1124: 
1125:     levels: [
1126:       {
1127:         name: '1타', isCombined: true, hits: 1,
1128:         constants: [395, 700, 893, 1051, 1173, 1275, 1363, 1440, 1503, 1562, 1563, 1564, 1564, 1564],
1129:         coefficients: [2.15, 3.8, 4.85, 5.71, 6.37, 6.93, 7.41, 7.83, 8.17, 8.49, 8.49, 8.5, 8.5, 8.5],
1130:       },
1131:       {
1132:         name: '2타', isCombined: true, hits: 1,
1133:         constants: [169, 301, 384, 451, 504, 547, 583, 617, 643, 668, 668, 669, 669, 669],
1134:         coefficients: [0.92, 1.64, 2.09, 2.45, 2.74, 2.97, 3.17, 3.35, 3.5, 3.63, 3.63, 3.64, 3.64, 3.64],
1135:       }
1136:     ],
1137: 
1138:     tripods: [
1139:       // ── 1티어 ─────────────────────────────────────────────
1140:       {
1141:         id: ID.AVENGING_SPEAR.T1_1, name: NAMES[ID.AVENGING_SPEAR.T1_1],
1142:         iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.T1_1}.webp`,
1143:         slot: 1, index: 1,
1144:         memo: [{ type: '피격 시 데미지 감소', value: 0.2 }]
1145:       },
1146:       {
1147:         id: ID.AVENGING_SPEAR.T1_2, name: NAMES[ID.AVENGING_SPEAR.T1_2],
1148:         iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.T1_2}.webp`,
1149:         slot: 1, index: 2,
1150:         effects: [{
1151:           type: 'GK_QI_DMG', value: [0.1],
1152:           target: { skillIds: [ID.AVENGING_SPEAR.BODY] }
1153:         }]
1154:       },
1155:       {
1156:         id: ID.AVENGING_SPEAR.T1_3, name: NAMES[ID.AVENGING_SPEAR.T1_3],
1157:         iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.T1_3}.webp`,
1158:         slot: 1, index: 3
1159:       },
1160:       // ── 2티어 ─────────────────────────────────────────────
1161:       {
1162:         id: ID.AVENGING_SPEAR.T2_1, name: NAMES[ID.AVENGING_SPEAR.T2_1],
1163:         iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.T2_1}.webp`,
1164:         slot: 2, index: 1,
1165:         effects: [{
1166:           type: 'DMG_INC', value: [0.55],
1167:           target: { skillIds: [ID.AVENGING_SPEAR.BODY] }
1168:         }]
1169:       },
1170:       {
1171:         id: ID.AVENGING_SPEAR.T2_2, name: NAMES[ID.AVENGING_SPEAR.T2_2],
1172:         iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.T2_2}.webp`,
1173:         slot: 2, index: 2,
1174:         effects: [{
1175:           type: 'DMG_INC', value: [0.45],
1176:           target: { skillIds: [ID.AVENGING_SPEAR.BODY] }
1177:         }]
1178:       },
1179:       // ── 3티어 ─────────────────────────────────────────────
1180:       {
1181:         id: ID.AVENGING_SPEAR.T3_1, name: NAMES[ID.AVENGING_SPEAR.T3_1],
1182:         iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.T3_1}.webp`,
1183:         slot: 3, index: 1,
1184:         link: { slot: 2, index: 1 },
1185:         effects: [{
1186:           type: 'DMG_INC', value: [0.7],
1187:           target: { skillIds: [ID.AVENGING_SPEAR.BODY] }
1188:         }],
1189:         memo: [{ type: '공격 중 이동 속도 증가', value: 0.4 }]
1190:       },
1191:       {
1192:         id: ID.AVENGING_SPEAR.T3_2, name: NAMES[ID.AVENGING_SPEAR.T3_2],
1193:         iconPath: `/images/skills/guardian-knight/${ID.AVENGING_SPEAR.T3_2}.webp`,
1194:         slot: 3, index: 2,
1195:         link: { slot: 2, index: 2 },
1196:         effects: [{
1197:           type: 'DMG_INC', value: [2.8],
1198:           target: { skillIds: [ID.AVENGING_SPEAR.BODY] }
1199:         }],
1200:       }
1201:     ]
1202:   },
1203:   { // ────── 스피닝 플레임 ────────────────────────────────────
1204:     id: ID.SPINNING_FLAME.BODY,
1205:     name: NAMES[ID.SPINNING_FLAME.BODY],
1206:     iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.BODY}.webp`,
1207:     category: [ 'ENLIGHTEN' ], // 발현 스킬
1208:     typeId: 'NORMAL',
1209:     attackId: 'NON_DIRECTIONAL',
1210:     resource: { typeId: 'QI_EMBERES', isStatic: true, value: 4 },
1211:     destruction: 0,
1212:     stagger: '하',
1213:     superArmorId: 'NONE',
1214:     cooldown: 10,
1215: 
1216:     levels: [
1217:       {
1218:         name: '1타', isCombined: true, hits: 1,
1219:         constants: [158, 281, 358, 421, 470, 509, 542, 573, 597, 620, 620, 620, 620, 621],
1220:         coefficients: [0.86, 1.53, 1.95, 2.29, 2.56, 2.77, 2.95, 3.12, 3.25, 3.37, 3.37, 3.37, 3.37, 3.38],
1221:       },
1222:       {
1223:         name: '2타', isCombined: true, hits: 1,
1224:         constants: [158, 280, 358, 421, 471, 508, 543, 576, 598, 621, 621, 621, 621, 622],
1225:         coefficients: [0.86, 1.52, 1.95, 2.29, 2.56, 2.76, 2.95, 3.13, 3.25, 3.38, 3.38, 3.38, 3.38, 3.38],
1226:       }
1227:     ],
1228: 
1229:     tripods: [
1230:       // ── 1티어 ─────────────────────────────────────────────
1231:       {
1232:         id: ID.SPINNING_FLAME.T1_1, name: NAMES[ID.SPINNING_FLAME.T1_1],
1233:         iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.T1_1}.webp`,
1234:         slot: 1, index: 1,
1235:         memo: [{ type: '적 받는 피해 증가', value: 0.06 }]
1236:       },
1237:       {
1238:         id: ID.SPINNING_FLAME.T1_2, name: NAMES[ID.SPINNING_FLAME.T1_2],
1239:         iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.T1_2}.webp`,
1240:         slot: 1, index: 2,
1241:         memo: [{ type: '오브 게이지 회복량 증가', value: 0.3 }]
1242:       },
1243:       {
1244:         id: ID.SPINNING_FLAME.T1_3, name: NAMES[ID.SPINNING_FLAME.T1_3],
1245:         iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.T1_3}.webp`,
1246:         slot: 1, index: 3,
1247:         effects: [{
1248:           type: 'GK_QI_DMG', value: [0.05],
1249:           target: { skillIds: [ID.SPINNING_FLAME.BODY] }
1250:         }]
1251:       },
1252:       // ── 2티어 ─────────────────────────────────────────────
1253:       {
1254:         id: ID.SPINNING_FLAME.T2_1, name: NAMES[ID.SPINNING_FLAME.T2_1],
1255:         iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.T2_1}.webp`,
1256:         slot: 2, index: 1,
1257:         effects: [{
1258:           type: 'DMG_INC', value: [0.35],
1259:           target: { skillIds: [ID.SPINNING_FLAME.BODY] }
1260:         }]
1261:       },
1262:       {
1263:         id: ID.SPINNING_FLAME.T2_2, name: NAMES[ID.SPINNING_FLAME.T2_2],
1264:         iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.T2_2}.webp`,
1265:         slot: 2, index: 2,
1266:         effects: [{
1267:           type: 'DMG_INC', value: [0.5],
1268:           target: { skillIds: [ID.SPINNING_FLAME.BODY] }
1269:         }]
1270:       },
1271:       // ── 3티어 ─────────────────────────────────────────────
1272:       {
1273:         id: ID.SPINNING_FLAME.T3_1, name: NAMES[ID.SPINNING_FLAME.T3_1],
1274:         iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.T3_1}.webp`,
1275:         slot: 3, index: 1,
1276:         link: { slot: 2, index: 1 },
1277:         effects: [{
1278:           type: 'DMG_INC', value: [0.8],
1279:           target: { skillIds: [ID.SPINNING_FLAME.BODY] }
1280:         }]
1281:       },
1282:       {
1283:         id: ID.SPINNING_FLAME.T3_2, name: NAMES[ID.SPINNING_FLAME.T3_2],
1284:         iconPath: `/images/skills/guardian-knight/${ID.SPINNING_FLAME.T3_2}.webp`,
1285:         slot: 3, index: 2,
1286:         link: { slot: 2, index: 2 },
1287:         effects: [{
1288:           type: 'DMG_INC', value: [0.9],
1289:           target: { skillIds: [ID.SPINNING_FLAME.BODY] }
1290:         }]
1291:       }
1292:     ]
1293:   },
1294:   { // ────── 아바돈 플레임 ────────────────────────────────────
1295:     id: ID.ABADDON_FLAME.BODY,
1296:     name: NAMES[ID.ABADDON_FLAME.BODY],
1297:     iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.BODY}.webp`,
1298:     category: [ 'GOD_FORM' ], // 화신 스킬
1299:     typeId: 'POINT',
1300:     attackId: 'NON_DIRECTIONAL',
1301:     resource: { typeId: 'QI_EMBERES', isStatic: true, value: 4 },
1302:     destruction: 0,
1303:     stagger: '중',
1304:     superArmorId: 'NONE',
1305:     cooldown: 18,
1306: 
1307:     levels: [
1308:       {
1309:         name: '1타', isCombined: true, hits: 1,
1310:         constants: [503, 892, 1142, 1342, 1500, 1620, 1728, 1828, 1901, 1971, 1972, 1972, 1973, 1973],
1311:         coefficients: [2.73, 4.85, 6.21, 7.3, 8.16, 8.81, 9.4, 9.94, 10.34, 10.72, 10.73, 10.73, 10.74, 10.74],
1312:       }
1313:     ],
1314: 
1315:     tripods: [
1316:       // ── 1티어 ─────────────────────────────────────────────
1317:       {
1318:         id: ID.ABADDON_FLAME.T1_1, name: NAMES[ID.ABADDON_FLAME.T1_1],
1319:         iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.T1_1}.webp`,
1320:         slot: 1, index: 1,
1321:         memo: [{ type: '적 받는 피해 증가', value: 0.06 }]
1322:       },
1323:       {
1324:         id: ID.ABADDON_FLAME.T1_2, name: NAMES[ID.ABADDON_FLAME.T1_2],
1325:         iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.T1_2}.webp`,
1326:         slot: 1, index: 2,
1327:         effects: [{
1328:           type: 'GK_QI_COST', value: [2],
1329:           target: { skillIds: [ID.ABADDON_FLAME.BODY] }
1330:         }]
1331:       },
1332:       {
1333:         id: ID.ABADDON_FLAME.T1_3, name: NAMES[ID.ABADDON_FLAME.T1_3],
1334:         iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.T1_3}.webp`,
1335:         slot: 1, index: 3,
1336:         effects: [{
1337:           type: 'GK_QI_DMG', value: [0.1],
1338:           target: { skillIds: [ID.ABADDON_FLAME.BODY] }
1339:         }]
1340:       },
1341:       // ── 2티어 ─────────────────────────────────────────────
1342:       {
1343:         id: ID.ABADDON_FLAME.T2_1, name: NAMES[ID.ABADDON_FLAME.T2_1],
1344:         iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.T2_1}.webp`,
1345:         slot: 2, index: 1,
1346:         effects: [{
1347:           type: 'DMG_INC', value: [0.4],
1348:           target: { skillIds: [ID.ABADDON_FLAME.BODY] }
1349:         }]
1350:       },
1351:       {
1352:         id: ID.ABADDON_FLAME.T2_2, name: NAMES[ID.ABADDON_FLAME.T2_2],
1353:         iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.T2_2}.webp`,
1354:         slot: 2, index: 2,
1355:         effects: [{
1356:           type: 'DMG_INC', value: [0.6],
1357:           target: { skillIds: [ID.ABADDON_FLAME.BODY] }
1358:         }],
1359:         memo: [{ type: '시전 거리 증가', value: 4 }]
1360:       },
1361:       // ── 3티어 ─────────────────────────────────────────────
1362:       {
1363:         id: ID.ABADDON_FLAME.T3_1, name: NAMES[ID.ABADDON_FLAME.T3_1],
1364:         iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.T3_1}.webp`,
1365:         slot: 3, index: 1,
1366:         link: { slot: 2, index: 1 },
1367:         effects: [{
1368:           type: 'DMG_INC', value: [0.92],
1369:           target: { skillIds: [ID.ABADDON_FLAME.BODY] }
1370:         }]
1371:       },
1372:       {
1373:         id: ID.ABADDON_FLAME.T3_2, name: NAMES[ID.ABADDON_FLAME.T3_2],
1374:         iconPath: `/images/skills/guardian-knight/${ID.ABADDON_FLAME.T3_2}.webp`,
1375:         slot: 3, index: 2,
1376:         link: { slot: 2, index: 2 },
1377:         effects: [{
1378:           type: 'DMG_INC', value: [1.8],
1379:           target: { skillIds: [ID.ABADDON_FLAME.BODY] }
1380:         }]
1381:       }
1382:     ]
1383:   },
1384:   { // ────── 윙 스팅어 ────────────────────────────────────
1385:     id: ID.SOARING_STRIKE.BODY,
1386:     name: NAMES[ID.SOARING_STRIKE.BODY],
1387:     iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.BODY}.webp`,
1388:     category: [ 'ENLIGHTEN' ], // 발현 스킬
1389:     typeId: 'NORMAL',
1390:     attackId: 'NON_DIRECTIONAL',
1391:     resource: { typeId: 'QI_EMBERES', isStatic: true, value: 4 },
1392:     destruction: 1,
1393:     stagger: '하',
1394:     superArmorId: 'STIFF_IMMUNE',
1395:     cooldown: 9,
1396: 
1397:     levels: [
1398:       {
1399:         name: '1타', isCombined: true, hits: 1,
1400:         constants: [384, 680, 869, 1021, 1141, 1236, 1318, 1394, 1450, 1507, 1508, 1508, 1509, 1509],
1401:         coefficients: [2.09, 3.69, 4.72, 5.55, 6.2, 6.72, 7.16, 7.57, 7.88, 8.19, 8.2, 8.2, 8.2, 8.2],
1402:       }
1403:     ],
1404: 
1405:     tripods: [
1406:       // ── 1티어 ─────────────────────────────────────────────
1407:       {
1408:         id: ID.SOARING_STRIKE.T1_1, name: NAMES[ID.SOARING_STRIKE.T1_1],
1409:         iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.T1_1}.webp`,
1410:         slot: 1, index: 1,
1411:         memo: [{ type: '시전 속도 증가', value: 0.1 }]
1412:       },
1413:       {
1414:         id: ID.SOARING_STRIKE.T1_2, name: NAMES[ID.SOARING_STRIKE.T1_2],
1415:         iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.T1_2}.webp`,
1416:         slot: 1, index: 2,
1417:         memo: [{ type: '오브 게이지 회복량 증가', value: 0.3 }]
1418:       },
1419:       {
1420:         id: ID.SOARING_STRIKE.T1_3, name: NAMES[ID.SOARING_STRIKE.T1_3],
1421:         iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.T1_3}.webp`,
1422:         slot: 1, index: 3,
1423:         effects: [{
1424:           type: 'GK_QI_DMG', value: [0.05],
1425:           target: { skillIds: [ID.SOARING_STRIKE.BODY] }
1426:         }]
1427:       },
1428:       // ── 2티어 ─────────────────────────────────────────────
1429:       {
1430:         id: ID.SOARING_STRIKE.T2_1, name: NAMES[ID.SOARING_STRIKE.T2_1],
1431:         iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.T2_1}.webp`,
1432:         slot: 2, index: 1,
1433:         effects: [{
1434:           type: 'DMG_INC', value: [0.65],
1435:           target: { skillIds: [ID.SOARING_STRIKE.BODY] }
1436:         }]
1437:       },
1438:       {
1439:         id: ID.SOARING_STRIKE.T2_2, name: NAMES[ID.SOARING_STRIKE.T2_2],
1440:         iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.T2_2}.webp`,
1441:         slot: 2, index: 2,
1442:         overrides: { typeId: 'CHARGE' },
1443:         effects: [{
1444:           type: 'DMG_INC', value: [0.8],
1445:           target: { skillIds: [ID.SOARING_STRIKE.BODY] }
1446:         }],
1447:         memo: [{ type: '미차지 시 피해 감소', value: 0.5 }]
1448:       },
1449:       // ── 3티어 ─────────────────────────────────────────────
1450:       {
1451:         id: ID.SOARING_STRIKE.T3_1, name: NAMES[ID.SOARING_STRIKE.T3_1],
1452:         iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.T3_1}.webp`,
1453:         slot: 3, index: 1,
1454:         link: { slot: 2, index: 1 },
1455:         effects: [{
1456:           type: 'DMG_INC', value: [0.7],
1457:           target: { skillIds: [ID.SOARING_STRIKE.BODY] }
1458:         }],
1459:         memo: [{ type: '공격 거리 증가', value: 0.4 }]
1460:       },
1461:       {
1462:         id: ID.SOARING_STRIKE.T3_2, name: NAMES[ID.SOARING_STRIKE.T3_2],
1463:         iconPath: `/images/skills/guardian-knight/${ID.SOARING_STRIKE.T3_2}.webp`,
1464:         slot: 3, index: 2,
1465:         link: { slot: 2, index: 2 },
1466:         overrides: { superArmorId: 'PUSH_IMMUNE' },
1467:         effects: [{
1468:           type: 'DMG_INC', value: [0.7],
1469:           target: { skillIds: [ID.SOARING_STRIKE.BODY] }
1470:         }]
1471:       }
1472:     ]
1473:   },
1474:   { // ────── 윙 래시 ────────────────────────────────────
1475:     id: ID.WING_LASH.BODY,
1476:     name: NAMES[ID.WING_LASH.BODY],
1477:     iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.BODY}.webp`,
1478:     category: [ 'GOD_FORM' ], // 화신 스킬
1479:     typeId: 'NORMAL',
1480:     attackId: 'NON_DIRECTIONAL',
1481:     resource: { typeId: 'QI_EMBERES', isStatic: true, value: 4 },
1482:     destruction: 1,
1483:     stagger: '하',
1484:     superArmorId: 'NONE',
1485:     cooldown: 18,
1486: 
1487:     levels: [
1488:       {
1489:         name: '1타', isCombined: true, hits: 1,
1490:         constants: [527, 933, 1192, 1399, 1564, 1694, 1806, 1910, 1988, 2066, 2067, 2067, 2068, 2068],
1491:         coefficients: [2.86, 5.07, 6.48, 7.6, 8.5, 9.21, 9.82, 10.38, 10.81, 11.23, 11.24, 11.24, 11.25, 11.25],
1492:       }
1493:     ],
1494: 
1495:     tripods: [
1496:       // ── 1티어 ─────────────────────────────────────────────
1497:       {
1498:         id: ID.WING_LASH.T1_1, name: NAMES[ID.WING_LASH.T1_1],
1499:         iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.T1_1}.webp`,
1500:         slot: 1, index: 1,
1501:         memo: [{ type: '시전 속도 증가', value: 0.1 }]
1502:       },
1503:       {
1504:         id: ID.WING_LASH.T1_2, name: NAMES[ID.WING_LASH.T1_2],
1505:         iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.T1_2}.webp`,
1506:         slot: 1, index: 2,
1507:         effects: [{
1508:           type: 'GK_QI_COST', value: [2],
1509:           target: { skillIds: [ID.WING_LASH.BODY] }
1510:         }]
1511:       },
1512:       {
1513:         id: ID.WING_LASH.T1_3, name: NAMES[ID.WING_LASH.T1_3],
1514:         iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.T1_3}.webp`,
1515:         slot: 1, index: 3,
1516:         effects: [{
1517:           type: 'GK_QI_DMG', value: [0.1],
1518:           target: { skillIds: [ID.WING_LASH.BODY] }
1519:         }]
1520:       },
1521:       // ── 2티어 ─────────────────────────────────────────────
1522:       {
1523:         id: ID.WING_LASH.T2_1, name: NAMES[ID.WING_LASH.T2_1],
1524:         iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.T2_1}.webp`,
1525:         slot: 2, index: 1,
1526:         effects: [{
1527:           type: 'DMG_INC', value: [0.6],
1528:           target: { skillIds: [ID.WING_LASH.BODY] }
1529:         }]
1530:       },
1531:       {
1532:         id: ID.WING_LASH.T2_2, name: NAMES[ID.WING_LASH.T2_2],
1533:         iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.T2_2}.webp`,
1534:         slot: 2, index: 2,
1535:         effects: [{
1536:           type: 'DMG_INC', value: [0.4],
1537:           target: { skillIds: [ID.WING_LASH.BODY] }
1538:         }]
1539:       },
1540:       // ── 3티어 ─────────────────────────────────────────────
1541:       {
1542:         id: ID.WING_LASH.T3_1, name: NAMES[ID.WING_LASH.T3_1],
1543:         iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.T3_1}.webp`,
1544:         slot: 3, index: 1,
1545:         link: { slot: 2, index: 1 },
1546:         effects: [{
1547:           type: 'DMG_INC', value: [0.9],
1548:           target: { skillIds: [ID.WING_LASH.BODY] }
1549:         }]
1550:       },
1551:       {
1552:         id: ID.WING_LASH.T3_2, name: NAMES[ID.WING_LASH.T3_2],
1553:         iconPath: `/images/skills/guardian-knight/${ID.WING_LASH.T3_2}.webp`,
1554:         slot: 3, index: 2,
1555:         link: { slot: 2, index: 2 },
1556:         overrides: { typeId: 'COMBO' },
1557:         effects: [{
1558:           type: 'DMG_INC', value: [1.0],
1559:           target: { skillIds: [ID.WING_LASH.BODY] }
1560:         }]
1561:       }
1562:     ]
1563:   },
1564:   { // ────── 블레이즈 스윕 ────────────────────────────────────
1565:     id: ID.BLAZE_SWEEP.BODY,
1566:     name: NAMES[ID.BLAZE_SWEEP.BODY],
1567:     iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.BODY}.webp`,
1568:     category: [ 'ENLIGHTEN' ],
1569:     typeId: 'NORMAL',
1570:     attackId: 'HEAD_ATK',
1571:     resource: { typeId: 'QI_EMBERES', isStatic: true, value: 5 },
1572:     destruction: 0,
1573:     stagger: '중상',
1574:     superArmorId: 'STIFF_IMMUNE',
1575:     cooldown: 24,
1576: 
1577:     levels: [
1578:       {
1579:         name: '1타', isCombined: true, hits: 1,
1580:         constants: [131, 232, 297, 348, 389, 422, 449, 475, 494, 513, 513, 513, 513, 513],
1581:         coefficients: [0.71, 1.26, 1.61, 1.89, 2.11, 2.29, 2.44, 2.58, 2.68, 2.79, 2.79, 2.79, 2.79, 2.79],
1582:       },
1583:       {
1584:         name: '2타', isCombined: true, hits: 1,
1585:         constants: [527, 933, 1192, 1399, 1564, 1694, 1806, 1910, 1988, 2066, 2067, 2067, 2068, 2068],
1586:         coefficients: [2.86, 5.07, 6.48, 7.6, 8.5, 9.21, 9.82, 10.38, 10.81, 11.23, 11.24, 11.24, 11.25, 11.25],
1587:       }
1588:     ],
1589: 
1590:     tripods: [
1591:       // ── 1티어 ─────────────────────────────────────────────
1592:       {
1593:         id: ID.BLAZE_SWEEP.T1_1, name: NAMES[ID.BLAZE_SWEEP.T1_1],
1594:         iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.T1_1}.webp`,
1595:         slot: 1, index: 1,
1596:         memo: [{ type: '돌진 시전 속도 증가', value: 0.2 }]
1597:       },
1598:       {
1599:         id: ID.BLAZE_SWEEP.T1_2, name: NAMES[ID.BLAZE_SWEEP.T1_2],
1600:         iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.T1_2}.webp`,
1601:         slot: 1, index: 2,
1602:         memo: [{ type: '적중한 적 1명 당 쿨타임 감소(1명 당 0.5초)', value: 6 }]
1603:       },
1604:       {
1605:         id: ID.BLAZE_SWEEP.T1_3, name: NAMES[ID.BLAZE_SWEEP.T1_3],
1606:         iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.T1_3}.webp`,
1607:         slot: 1, index: 3,
1608:         overrides: { attackId: 'NON_DIRECTIONAL' },
1609:         effects: [{
1610:           type: 'DMG_INC', value: [0.15],
1611:           target: { skillIds: [ID.BLAZE_SWEEP.BODY] }
1612:         }]
1613:       },
1614:       // ── 2티어 ─────────────────────────────────────────────
1615:       {
1616:         id: ID.BLAZE_SWEEP.T2_1, name: NAMES[ID.BLAZE_SWEEP.T2_1],
1617:         iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.T2_1}.webp`,
1618:         slot: 2, index: 1,
1619:         effects: [{
1620:           type: 'DMG_INC', value: [0.96],
1621:           target: { skillIds: [ID.BLAZE_SWEEP.BODY] }
1622:         }]
1623:       },
1624:       {
1625:         id: ID.BLAZE_SWEEP.T2_2, name: NAMES[ID.BLAZE_SWEEP.T2_2],
1626:         iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.T2_2}.webp`,
1627:         slot: 2, index: 2,
1628:         effects: [{
1629:           type: 'DMG_INC', value: [0.7],
1630:           target: { skillIds: [ID.BLAZE_SWEEP.BODY] }
1631:         }]
1632:       },
1633:       // ── 3티어 ─────────────────────────────────────────────
1634:       {
1635:         id: ID.BLAZE_SWEEP.T3_1, name: NAMES[ID.BLAZE_SWEEP.T3_1],
1636:         iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.T3_1}.webp`,
1637:         slot: 3, index: 1,
1638:         link: { slot: 2, index: 1 },
1639:         effects: [{
1640:           type: 'DMG_INC', value: [1.8],
1641:           target: { skillIds: [ID.BLAZE_SWEEP.BODY] }
1642:         }]
1643:       },
1644:       {
1645:         id: ID.BLAZE_SWEEP.T3_2, name: NAMES[ID.BLAZE_SWEEP.T3_2],
1646:         iconPath: `/images/skills/guardian-knight/${ID.BLAZE_SWEEP.T3_2}.webp`,
1647:         slot: 3, index: 2,
1648:         link: { slot: 2, index: 2 },
1649:         effects: [
1650:           {
1651:             type: 'DMG_INC', value: [0.6],
1652:             target: { skillIds: [ID.BLAZE_SWEEP.BODY] }
1653:           },
1654:           {
1655:             type: 'CDR_C', value: [6],
1656:             target: { skillIds: [ID.BLAZE_SWEEP.BODY] }
1657:           }
1658:         ]
1659:       }
1660:     ]
1661:   },
1662:   { // ────── 블레이즈 플래시 ──────────────────────────────────
1663:     id: ID.BLAZE_FLASH.BODY,
1664:     name: NAMES[ID.BLAZE_FLASH.BODY],
1665:     iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.BODY}.webp`,
1666:     category: [ 'GOD_FORM' ],
1667:     typeId: 'COMBO',
1668:     attackId: 'NON_DIRECTIONAL',
1669:     resource: { typeId: 'QI_EMBERES', isStatic: true, value: 5 }, 
1670:     destruction: 0,
1671:     stagger: '중상',
1672:     superArmorId: 'NONE',
1673:     cooldown: 24,
1674: 
1675:     levels: [
1676:       {
1677:         name: '1타', isCombined: true, hits: 1,
1678:         constants: [316, 560, 716, 841, 940, 1017, 1086, 1148, 1195, 1241, 1242, 1242, 1242, 1243],
1679:         coefficients: [1.71, 3.04, 3.89, 4.57, 5.11, 5.53, 5.9, 6.24, 6.49, 6.74, 6.75, 6.75, 6.75, 6.76],
1680:       },
1681:       {
1682:         name: '2타', isCombined: true, hits: 1,
1683:         constants: [474, 841, 1074, 1261, 1409, 1526, 1628, 1721, 1791, 1861, 1862, 1863, 1863, 1863],
1684:         coefficients: [2.58, 4.57, 5.84, 6.85, 7.66, 8.29, 8.85, 9.35, 9.73, 10.11, 10.12, 10.12, 10.12, 10.12],
1685:       }
1686:     ],
1687: 
1688:     tripods: [
1689:       // ── 1티어 ─────────────────────────────────────────────
1690:       {
1691:         id: ID.BLAZE_FLASH.T1_1, name: NAMES[ID.BLAZE_FLASH.T1_1],
1692:         iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.T1_1}.webp`,
1693:         slot: 1, index: 1,
1694:         memo: [{ type: '최초 돌진 시전 속도 증가', value: 0.2 }]
1695:       },
1696:       {
1697:         id: ID.BLAZE_FLASH.T1_2, name: NAMES[ID.BLAZE_FLASH.T1_2],
1698:         iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.T1_2}.webp`,
1699:         slot: 1, index: 2,
1700:         memo: [{ type: '적중한 적 1명 당 쿨타임 감소(1명 당 0.5초)', value: 6 }]
1701:       },
1702:       {
1703:         id: ID.BLAZE_FLASH.T1_3, name: NAMES[ID.BLAZE_FLASH.T1_3],
1704:         iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.T1_3}.webp`,
1705:         slot: 1, index: 3,
1706:         overrides: { destruction: 1 },
1707:       },
1708:       // ── 2티어 ─────────────────────────────────────────────
1709:       {
1710:         id: ID.BLAZE_FLASH.T2_1, name: NAMES[ID.BLAZE_FLASH.T2_1],
1711:         iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.T2_1}.webp`,
1712:         slot: 2, index: 1,
1713:         effects: [{
1714:           type: 'DMG_INC', value: [0.6],
1715:           target: { skillIds: [ID.BLAZE_FLASH.BODY] }
1716:         }]
1717:       },
1718:       {
1719:         id: ID.BLAZE_FLASH.T2_2, name: NAMES[ID.BLAZE_FLASH.T2_2],
1720:         iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.T2_2}.webp`,
1721:         slot: 2, index: 2,
1722:         effects: [
1723:           {
1724:             type: 'DMG_INC', value: [0.4],
1725:             target: { skillIds: [ID.BLAZE_FLASH.BODY] }
1726:           },
1727:           {
1728:             type: 'GK_QI_DMG', value: [0.1],
1729:             target: { skillIds: [ID.BLAZE_FLASH.BODY] }
1730:           }
1731:         ],
1732:       },
1733:       // ── 3티어 ─────────────────────────────────────────────
1734:       {
1735:         id: ID.BLAZE_FLASH.T3_1, name: NAMES[ID.BLAZE_FLASH.T3_1],
1736:         iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.T3_1}.webp`,
1737:         slot: 3, index: 1,
1738:         link: { slot: 2, index: 1 },
1739:         effects: [{
1740:           type: 'DMG_INC', value: [1.5],
1741:           target: { skillIds: [ID.BLAZE_FLASH.BODY] }
1742:         }]
1743:       },
1744:       {
1745:         id: ID.BLAZE_FLASH.T3_2, name: NAMES[ID.BLAZE_FLASH.T3_2],
1746:         iconPath: `/images/skills/guardian-knight/${ID.BLAZE_FLASH.T3_2}.webp`,
1747:         slot: 3, index: 2,
1748:         link: { slot: 2, index: 2 },
1749:         effects: [{
1750:           type: 'DMG_INC', value: [0.8],
1751:           target: { skillIds: [ID.BLAZE_FLASH.BODY] }
1752:         }]
1753:       }
1754:     ]
1755:   },
1756:   { // ────── 렌딩 피니셔 ──────────────────────────────────
1757:     id: ID.RENDING_FINISHER.BODY,
1758:     name: NAMES[ID.RENDING_FINISHER.BODY],
1759:     iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.BODY}.webp`,
1760:     category: [ 'ENLIGHTEN' ],
1761:     typeId: 'NORMAL',
1762:     attackId: 'NON_DIRECTIONAL',
1763:     resource: { typeId: 'QI_EMBERES', isStatic: true, value: 6 },
1764:     destruction: 0,
1765:     stagger: '중상',
1766:     superArmorId: 'STIFF_IMMUNE',
1767:     cooldown: 30,
1768: 
1769:     levels: [
1770:       {
1771:         name: '1타', isCombined: true, hits: 1,
1772:         constants: [880, 1559, 1992, 2338, 2613, 2830, 3018, 3192, 3322, 3452, 3454, 3455, 3456, 3456],
1773:         coefficients: [4.78, 8.47, 10.82, 12.71, 14.2, 15.38, 16.4, 17.35, 18.06, 18.76, 18.77, 18.78, 18.78, 18.78],
1774:       }
1775:     ],
1776: 
1777:     tripods: [
1778:       // ── 1티어 ─────────────────────────────────────────────
1779:       {
1780:         id: ID.RENDING_FINISHER.T1_1, name: NAMES[ID.RENDING_FINISHER.T1_1],
1781:         iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.T1_1}.webp`,
1782:         slot: 1, index: 1,
1783:         memo: [{ type: '시전 속도 증가', value: 0.15 }]
1784:       },
1785:       {
1786:         id: ID.RENDING_FINISHER.T1_2, name: NAMES[ID.RENDING_FINISHER.T1_2],
1787:         iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.T1_2}.webp`,
1788:         slot: 1, index: 2,
1789:         memo: [{ type: '받는 피해 감소', value: 0.2 }]
1790:       },
1791:       {
1792:         id: ID.RENDING_FINISHER.T1_3, name: NAMES[ID.RENDING_FINISHER.T1_3],
1793:         iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.T1_3}.webp`,
1794:         slot: 1, index: 3,
1795:         overrides: { attackId: 'HEAD_ATK' },
1796:       },
1797:       // ── 2티어 ─────────────────────────────────────────────
1798:       {
1799:         id: ID.RENDING_FINISHER.T2_1, name: NAMES[ID.RENDING_FINISHER.T2_1],
1800:         iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.T2_1}.webp`,
1801:         slot: 2, index: 1,
1802:         overrides: { typeId: 'CHARGE', superArmorId: 'PUSH_IMMUNE' },
1803:         effects: [{
1804:           type: 'DMG_INC', value: [0.5],
1805:           target: { skillIds: [ID.RENDING_FINISHER.BODY] }
1806:         }]
1807:       },
1808:       {
1809:         id: ID.RENDING_FINISHER.T2_2, name: NAMES[ID.RENDING_FINISHER.T2_2],
1810:         iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.T2_2}.webp`,
1811:         slot: 2, index: 2,
1812:         effects: [{
1813:           type: 'DMG_INC', value: [0.7],
1814:           target: { skillIds: [ID.RENDING_FINISHER.BODY] }
1815:         }]
1816:       },
1817:       // ── 3티어 ─────────────────────────────────────────────
1818:       {
1819:         id: ID.RENDING_FINISHER.T3_1, name: NAMES[ID.RENDING_FINISHER.T3_1],
1820:         iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.T3_1}.webp`,
1821:         slot: 3, index: 1,
1822:         link: { slot: 2, index: 1 },
1823:         effects: [
1824:           {
1825:             type: 'DMG_INC', value: [0.5],
1826:             target: { skillIds: [ID.RENDING_FINISHER.BODY] }
1827:           },
1828:           {
1829:             type: 'GK_QI_DMG', value: [0.1],
1830:             target: { skillIds: [ID.RENDING_FINISHER.BODY] }
1831:           }
1832:         ]
1833:       },
1834:       {
1835:         id: ID.RENDING_FINISHER.T3_2, name: NAMES[ID.RENDING_FINISHER.T3_2],
1836:         iconPath: `/images/skills/guardian-knight/${ID.RENDING_FINISHER.T3_2}.webp`,
1837:         slot: 3, index: 2,
1838:         link: { slot: 2, index: 1 },
1839:         effects: [{
1840:           type: 'DMG_INC', value: [1.0],
1841:           target: { skillIds: [ID.RENDING_FINISHER.BODY] }
1842:         }]
1843:       }
1844:     ]
1845:   },
1846:   { // ────── 익스플로전 피니셔 ──────────────────────────────────
1847:     id: ID.EXPLOSION_FINISHER.BODY,
1848:     name: NAMES[ID.EXPLOSION_FINISHER.BODY],
1849:     iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.BODY}.webp`,
1850:     category: [ 'GOD_FORM' ],
1851:     typeId: 'NORMAL',
1852:     attackId: 'NON_DIRECTIONAL',
1853:     resource: { typeId: 'QI_EMBERES', isStatic: true, value: 6 },
1854:     destruction: 0,
1855:     stagger: '상',
1856:     superArmorId: 'NONE',
1857:     cooldown: 52,
1858: 
1859:     levels: [
1860:       {
1861:         name: '1타', isCombined: true, hits: 1,
1862:         constants: [1100, 1950, 2492, 2926, 3268, 3540, 3775, 3992, 4154, 4317, 4319, 4320, 4321, 4322],
1863:         coefficients: [5.98, 10.59, 13.53, 15.88, 17.75, 19.22, 20.5, 21.68, 22.57, 23.45, 23.46, 23.47, 23.48, 23.48],
1864:       }
1865:     ],
1866: 
1867:     tripods: [
1868:       // ── 1티어 ─────────────────────────────────────────────
1869:       {
1870:         id: ID.EXPLOSION_FINISHER.T1_1, name: NAMES[ID.EXPLOSION_FINISHER.T1_1],
1871:         iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.T1_1}.webp`,
1872:         slot: 1, index: 1,
1873:         memo: [{ type: '시전 속도 증가', value: 0.1 }]
1874:       },
1875:       {
1876:         id: ID.EXPLOSION_FINISHER.T1_2, name: NAMES[ID.EXPLOSION_FINISHER.T1_2],
1877:         iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.T1_2}.webp`,
1878:         slot: 1, index: 2,
1879:         memo: [{ type: '받는 피해 감소', value: 0.2 }]
1880:       },
1881:       {
1882:         id: ID.EXPLOSION_FINISHER.T1_3, name: NAMES[ID.EXPLOSION_FINISHER.T1_3],
1883:         iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.T1_3}.webp`,
1884:         slot: 1, index: 3,
1885:         overrides: { stagger: '최상' },
1886:       },
1887:       // ── 2티어 ─────────────────────────────────────────────
1888:       {
1889:         id: ID.EXPLOSION_FINISHER.T2_1, name: NAMES[ID.EXPLOSION_FINISHER.T2_1],
1890:         iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.T2_1}.webp`,
1891:         slot: 2, index: 1,
1892:         overrides: { typeId: 'CHARGE', superArmorId: 'PUSH_IMMUNE' },
1893:         effects: [{
1894:           type: 'DMG_INC', value: [0.7],
1895:           target: { skillIds: [ID.EXPLOSION_FINISHER.BODY] }
1896:         }]
1897:       },
1898:       {
1899:         id: ID.EXPLOSION_FINISHER.T2_2, name: NAMES[ID.EXPLOSION_FINISHER.T2_2],
1900:         iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.T2_2}.webp`,
1901:         slot: 2, index: 2,
1902:         effects: [{
1903:           type: 'DMG_INC', value: [0.7],
1904:           target: { skillIds: [ID.EXPLOSION_FINISHER.BODY] }
1905:         }]
1906:       },
1907:       // ── 3티어 ─────────────────────────────────────────────
1908:       {
1909:         id: ID.EXPLOSION_FINISHER.T3_1, name: NAMES[ID.EXPLOSION_FINISHER.T3_1],
1910:         iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.T3_1}.webp`,
1911:         slot: 3, index: 1,
1912:         link: { slot: 2, index: 1 },
1913:         effects: [
1914:           {
1915:             type: 'DMG_INC', value: [0.75],
1916:             target: { skillIds: [ID.EXPLOSION_FINISHER.BODY] }
1917:           }
1918:         ],
1919:         addDamageSources: [
1920:           {
1921:             name: '화염지대', isCombined: false, hits: 1,
1922:             constants: [217, 217, 217, 217, 217, 217, 217, 217, 217, 217, 217, 217, 217, 217],
1923:             coefficients: [4.0, 7.08, 9.05, 10.62, 11.87, 12.85, 13.7, 14.48, 15.08, 15.68, 15.68, 15.69, 15.69, 15.69],
1924:           }
1925:         ]
1926:       },
1927:       {
1928:         id: ID.EXPLOSION_FINISHER.T3_2, name: NAMES[ID.EXPLOSION_FINISHER.T3_2],
1929:         iconPath: `/images/skills/guardian-knight/${ID.EXPLOSION_FINISHER.T3_2}.webp`,
1930:         slot: 3, index: 2,
1931:         link: { slot: 2, index: 1 },
1932:         effects: [
1933:           {
1934:             type: 'DMG_INC', value: [0.5],
1935:             target: { skillIds: [ID.EXPLOSION_FINISHER.BODY] }
1936:           },
1937:           {
1938:             type: 'GK_QI_COST', value: [4],
1939:             target: { skillIds: [ID.EXPLOSION_FINISHER.BODY] }
1940:           }
1941:         ]
1942:       }
1943:     ]
1944:   },  
1945: 
1946:   // ── [초각성 스킬, category: 'HYPER_SKILL'] ────────────────────────────────── 
1947:   { // ────── 소울 디바이드 ──────────────────────────────────
1948:     id: ID.SOUL_DIVIDE.BODY,
1949:     name: NAMES[ID.SOUL_DIVIDE.BODY],
1950:     iconPath: `/images/skills/guardian-knight/${ID.SOUL_DIVIDE.BODY}.webp`,
1951:     category: ['BASIC', 'HYPER_SKILL'],
1952:     typeId: 'NORMAL',
1953:     attackId: 'NON_DIRECTIONAL',
1954:     destruction: 1,
1955:     stagger: '상',
1956:     superArmorId: 'STIFF_IMMUNE',
1957:     cooldown: 70,
1958: 
1959:     levels: [
1960:       {
1961:         name: '1타', isCombined: true, hits: 1,
1962:         constants: [13807],
1963:         coefficients: [75.04],
1964:       },
1965:       {
1966:         name: '2타', isCombined: true, hits: 1,
1967:         constants: [55232],
1968:         coefficients: [300.17],
1969:       }
1970:     ]
1971:   },
1972:   { // ────── 딥 임팩트 ──────────────────────────────────
1973:     id: ID.DEEP_IMPACT.BODY,
1974:     name: NAMES[ID.DEEP_IMPACT.BODY],
1975:     iconPath: `/images/skills/guardian-knight/${ID.DEEP_IMPACT.BODY}.webp`,
1976:     category: [ 'GOD_FORM', 'HYPER_SKILL' ],
1977:     typeId: 'POINT',
1978:     attackId: 'NON_DIRECTIONAL',
1979:     resource: { typeId: 'QI_EMBERES', isStatic: true, value: 6 },
1980:     destruction: 1,
1981:     stagger: '최상',
1982:     superArmorId: 'PUSH_IMMUNE',
1983:     cooldown: 90,
1984: 
1985:     levels: [
1986:       {
1987:         name: '1타', isCombined: true, hits: 1,
1988:         constants: [1341],
1989:         coefficients: [7.29],
1990:       },
1991:       {
1992:         name: '2타', isCombined: true, hits: 1,
1993:         constants: [25445],
1994:         coefficients: [138.35],
1995:       }
1996:     ]
1997:   },
1998: 
1999:   // ── [각성기/초각성기, category: 'ULTIMATE'/'HYPER_ULTIMATE'] ────────────────────────────────── 
2000:   { // ────── 가디언 백래시 ──────────────────────────────────
2001:     id: ID.GUARDIAN_BACKLASH.BODY,
2002:     name: NAMES[ID.GUARDIAN_BACKLASH.BODY],
2003:     iconPath: `/images/skills/guardian-knight/${ID.GUARDIAN_BACKLASH.BODY}.webp`,
2004:     category: [ 'ULTIMATE' ],
2005:     typeId: 'NORMAL',
2006:     attackId: 'NON_DIRECTIONAL',
2007:     destruction: 0,
2008:     stagger: '최상',
2009:     superArmorId: 'DEBUFF_IMMUNE',
2010:     cooldown: 300,
2011: 
2012:     levels: [
2013:       {
2014:         name: '1타', isCombined: true, hits: 1,
2015:         constants: [31370],
2016:         coefficients: [170.49],
2017:       },
2018:       {
2019:         name: '2타', isCombined: true, hits: 1,
2020:         constants: [31354],
2021:         coefficients: [170.4],
2022:       }
2023:     ]
2024:   },
2025:   { // ────── 브레스 오브 엠버레스 ────────────────────────────────── 
2026:     id: ID.BREATH_OF_EMBERES.BODY,
2027:     name: NAMES[ID.BREATH_OF_EMBERES.BODY],
2028:     iconPath: `/images/skills/guardian-knight/${ID.BREATH_OF_EMBERES.BODY}.webp`,
2029:     category: [ 'HYPER_ULTIMATE' ],
2030:     typeId: 'NORMAL',
2031:     attackId: 'NON_DIRECTIONAL',
2032:     destruction: 0,
2033:     stagger: '최상',
2034:     superArmorId: 'DEBUFF_IMMUNE',
2035:     cooldown: 300,
2036: 
2037:     levels: [
2038:       {
2039:         name: '1타', isCombined: true, hits: 6,
2040:         constants: [424617],
2041:         coefficients: [2307.7],
2042:       }
2043:     ]
2044:   },
2045:   { // ────── 가디언즈 크래시 ──────────────────────────────────
2046:     id: ID.GUARDIANS_CRASH.BODY,
2047:     name: NAMES[ID.GUARDIANS_CRASH.BODY],
2048:     iconPath: `/images/skills/guardian-knight/${ID.GUARDIANS_CRASH.BODY}.webp`,
2049:     category: ['ULTIMATE'],
2050:     typeId: 'NORMAL',
2051:     attackId: 'NON_DIRECTIONAL',
2052:     destruction: 2,
2053:     stagger: '최상',
2054:     superArmorId: 'DEBUFF_IMMUNE',
2055:     cooldown: 300,
2056: 
2057:     levels: [
2058:       {
2059:         name: '1타', isCombined: true, hits: 1,
2060:         constants: [87303],
2061:         coefficients: [474.47],
2062:       }
2063:     ]
2064:   },
2065:   { // ────── 어웨이큰 ──────────────────────────────────
2066:     id: ID.AWAKEN.BODY,
2067:     name: NAMES[ID.AWAKEN.BODY],
2068:     iconPath: `/images/skills/guardian-knight/${ID.AWAKEN.BODY}.webp`,
2069:     category: ['HYPER_ULTIMATE'],
2070:     typeId: 'NORMAL',
2071:     attackId: 'NON_DIRECTIONAL',
2072:     destruction: 2,
2073:     stagger: '최상',
2074:     superArmorId: 'DEBUFF_IMMUNE',
2075:     cooldown: 300,
2076: 
2077:     levels: [
2078:       {
2079:         name: '1타', isCombined: true, hits: 1,
2080:         constants: [2725180],
2081:         coefficients: [14810.76],
2082:       }
2083:     ]
2084:   },
2085: 
2086:   // ── [아덴 스킬, category: ''] ────────────────────────────────── 
2087:   { // ────── 인페르노 버스트 ──────────────────────────────────
2088:     id: ID.INFERNO_BURST.BODY,
2089:     name: NAMES[ID.INFERNO_BURST.BODY],
2090:     iconPath: `/images/skills/guardian-knight/${ID.INFERNO_BURST.BODY}.webp`,
2091:     category: ['GOD_FORM'],
2092:     typeId: 'NORMAL',
2093:     attackId: 'NON_DIRECTIONAL',
2094:     destruction: 0,
2095:     stagger: '상',
2096:     superArmorId: 'PUSH_IMMUNE',
2097:     cooldown: 90,
2098: 
2099:     levels: [
2100:       {
2101:         name: '1타', isCombined: true, hits: 1,
2102:         constants: [13260],
2103:         coefficients: [72.1],
2104:       }
2105:     ]
2106:   },
2107:   { // ────── 가디언 피어 ──────────────────────────────────
2108:     id: ID.GUARDIAN_FEAR.BODY,
2109:     name: NAMES[ID.GUARDIAN_FEAR.BODY],
2110:     iconPath: `/images/skills/guardian-knight/${ID.GUARDIAN_FEAR.BODY}.webp`,
2111:     category: ['BASIC'],
2112:     typeId: 'NORMAL',
2113:     attackId: 'HEAD_ATK',
2114:     destruction: 0,
2115:     stagger: '',
2116:     superArmorId: 'PUSH_IMMUNE',
2117:     cooldown: 1,
2118: 
2119:     levels: [
2120:       {
2121:         name: '1타', isCombined: true, hits: 1,
2122:         constants: [5939],
2123:         coefficients: [32.27],
2124:       }
2125:     ]
2126:   },
2127: ];
```

## File: src/utils/data-normalizer.ts
```typescript
  1: /**
  2:  * @/utils/data-normalizer.ts
  3:  * RawCharacterData → CharacterDisplayData 변환
  4:  * UI 표시용 데이터만 생성 — 계산용 수치는 useCalculatorStore 담당
  5:  */
  6: 
  7: import { RawCharacterData } from '@/types/raw-types';
  8: import {
  9:   ColoredText,
 10:   ColoredValue,
 11:   CharacterDisplayData,
 12:   CharacterProfileDisplay,
 13:   CombatStatsDisplay,
 14:   EquipmentDisplay,
 15:   EquipmentSetType,
 16:   AccessoryDisplay,
 17:   AccessoryBaseEffect,
 18:   AccessoryPolishEffect,
 19:   OptionGrade,
 20:   BraceletDisplay,
 21:   BraceletEffect,
 22:   AbilityStoneDisplay,
 23:   BoJuDisplay,
 24:   AvatarDisplay,
 25:   EngravingDisplay,
 26:   GemDisplay,
 27:   GemSummaryDisplay,
 28:   CardSetDisplay,
 29:   ArkPassivePointDisplay,
 30:   ArkPassiveEffectDisplay,
 31:   ArkGridDisplay,
 32:   SkillDisplay,
 33:   SelectedTripodDisplay,
 34:   EquippedRuneDisplay,
 35: } from '@/types/character-types';
 36: 
 37: import { COMBAT_EQUIP_DATA } from '@/data/equipment/combat-equip';
 38: import { ACCESSORY_DATA }    from '@/data/equipment/accessory';
 39: 
 40: 
 41: // ============================================================
 42: // 내부 파싱 유틸
 43: // ============================================================
 44: 
 45: /** HTML 태그 제거 */
 46: const stripHtml = (html: string): string =>
 47:   html.replace(/<[^>]+>/g, '').trim();
 48: 
 49: /** 첫 번째 font color 추출 */
 50: const extractColor = (html: string): string | undefined => {
 51:   const m = html.match(/color='([^']+)'/i);
 52:   return m ? m[1] : undefined;
 53: };
 54: 
 55: /** 문자열에서 첫 번째 숫자 추출 */
 56: const extractRawNumber = (str: string): number => {
 57:   const m = stripHtml(str).match(/([\d.]+)/);
 58:   return m ? parseFloat(m[1]) : 0;
 59: };
 60: 
 61: /** 퍼센트 문자열 → 소수 */
 62: const extractPercent = (str: string): number =>
 63:   extractRawNumber(str) / 100;
 64: 
 65: /** HTML 수치 문자열 → ColoredValue */
 66: const toColoredValue = (html: string): ColoredValue => {
 67:   const isPercent = html.includes('%');
 68:   const value     = isPercent ? extractPercent(html) : extractRawNumber(html);
 69:   return { value, color: extractColor(html) };
 70: };
 71: 
 72: /** HTML 문자열 → ColoredText */
 73: const toColoredText = (html: string): ColoredText => ({
 74:   text : stripHtml(html),
 75:   color: extractColor(html),
 76: });
 77: 
 78: /** Tooltip JSON 파싱 */
 79: const parseTooltip = (tooltipStr: string): Record<string, any> => {
 80:   try { return JSON.parse(tooltipStr); }
 81:   catch { return {}; }
 82: };
 83: 
 84: /** 장비 이름에서 재련 단계 추출 */
 85: const extractRefineStep = (name: string): number => {
 86:   const m = name.match(/^\+(\d+)/);
 87:   return m ? parseInt(m[1]) : 0;
 88: };
 89: 
 90: /** leftStr2에서 아이템 티어 추출 */
 91: const extractItemTier = (leftStr2: string): number => {
 92:   const m = leftStr2.match(/티어\s*(\d+)/);
 93:   return m ? parseInt(m[1]) : 0;
 94: };
 95: 
 96: /** 등급명 → 색상 상수 */
 97: const GRADE_COLORS: Record<string, string> = {
 98:   '고대': '#E3C7A1', '유물': '#FA5D00', '전설': '#F99200',
 99:   '영웅': '#CE43FC', '희귀': '#00B0FA', '일반': '#FFFFFF',
100: };
101: 
102: /** 등급명 → ColoredText */
103: const toGradeColoredText = (grade: string): ColoredText => ({
104:   text : grade,
105:   color: GRADE_COLORS[grade],
106: });
107: 
108: /** 아크패시브 카테고리 색상 */
109: const ARK_PASSIVE_COLORS: Record<string, string> = {
110:   '진화': '#F1D594', '깨달음': '#83E9FF', '도약': '#C2EA55',
111: };
112: 
113: /** 스킬 분류 색상 */
114: const SKILL_CATEGORY_COLORS: Record<string, string> = {
115:   '일반 스킬': '#83DCB7', '발현 스킬': '#FE9A2E',
116:   '화신 스킬': '#FF0000', '각성기'  : '#E73517', '초각성기': '#E73517',
117: };
118: 
119: 
120: // ============================================================
121: // DB 조회 헬퍼
122: // ============================================================
123: 
124: /**
125:  * 장비 이름으로 세트 타입 판별
126:  *
127:  * combat-equip.ts의 multiName을 기준으로 매칭합니다.
128:  * multiName 예: { ancient: '운명의 업화 투구', serca: '운명의 전율 투구' }
129:  * "운명의 업화" → AEGIR_ANCIENT
130:  * "운명의 전율" → SERCA_ANCIENT
131:  * 매칭 없음    → UNKNOWN
132:  */
133: const findEquipSetType = (itemName: string): EquipmentSetType => {
134:   for (const db of COMBAT_EQUIP_DATA) {
135:     if (db.multiName.serca   && itemName.includes(db.multiName.serca.split(' ')[2]   ?? '')) return 'SERCA_ANCIENT';
136:     if (db.multiName.ancient && itemName.includes(db.multiName.ancient.split(' ')[2] ?? '')) return 'AEGIR_ANCIENT';
137:     if (db.multiName.relic   && itemName.includes(db.multiName.relic.split(' ')[2]   ?? '')) return 'NORMAL_RELIC';
138:   }
139:   return 'UNKNOWN';
140: };
141: 
142: /**
143:  * 연마효과 수치로 상/중/하 등급 판별
144:  *
145:  * accessory.ts의 grades 범위를 기준으로 판별합니다.
146:  * grades.high[0] 이상 → HIGH
147:  * grades.mid[0]  이상 → MID
148:  * 그 외           → LOW
149:  *
150:  * color가 명시된 경우 color 우선 적용 (API가 색상을 직접 주는 경우)
151:  */
152: const findPolishGrade = (
153:   effectType : string,
154:   value      : number,
155:   colorHint ?: string,
156: ): OptionGrade => {
157:   // API 색상이 있으면 색상 기준으로 우선 판별
158:   if (colorHint === '#FE9600') return 'HIGH';
159:   if (colorHint === '#CE43FC') return 'MID';
160:   if (colorHint === '#00B5FF') return 'LOW';
161: 
162:   // DB grades 범위로 판별
163:   for (const db of ACCESSORY_DATA) {
164:     const eff = db.effects?.find(e => e.type === effectType && e.grades);
165:     if (!eff?.grades) continue;
166:     if (value >= eff.grades.high[0]) return 'HIGH';
167:     if (value >= eff.grades.mid[0])  return 'MID';
168:     return 'LOW';
169:   }
170: 
171:   // DB에 해당 타입 없으면 LOW 기본값
172:   return 'LOW';
173: };
174: 
175: /**
176:  * 연마효과 label → effectType 감지
177:  * 순서 중요 — 무기공격력을 공격력보다 먼저 검사
178:  */
179: const POLISH_EFFECT_TYPE_LIST: Array<[string, string]> = [
180:   ['적에게 주는 피해', 'DMG_INC'     ],
181:   ['추가 피해'       , 'ADD_DMG'     ],
182:   ['무기 공격력'     , 'WEAPON_ATK_P'],
183:   ['공격력'          , 'ATK_P'       ],
184:   ['치명타 피해'     , 'CRIT_DMG'    ],
185:   ['치명타 적중률'   , 'CRIT_CHANCE' ],
186: ];
187: 
188: const detectPolishEffectType = (label: string, value: number): string => {
189:   // 공격력 C/P 구분: % 여부로 판단 (value < 1이면 퍼센트)
190:   if (label.includes('공격력') && !label.includes('무기') && value >= 1) return 'ATK_C';
191:   for (const [key, typeId] of POLISH_EFFECT_TYPE_LIST) {
192:     if (label.includes(key)) return typeId;
193:   }
194:   return 'UNKNOWN';
195: };
196: 
197: 
198: // ============================================================
199: // 섹션별 정규화
200: // ============================================================
201: 
202: // ── 프로필 ──────────────────────────────────────────────────
203: 
204: export const normalizeProfile = (raw: RawCharacterData): CharacterProfileDisplay => {
205:   const p = raw.profile;
206:   return {
207:     name           : p.CharacterName,
208:     className      : p.CharacterClassName,
209:     characterLevel : p.CharacterLevel,
210:     itemAvgLevel   : parseFloat(p.ItemAvgLevel.replace(/,/g, '')),
211:     combatPower    : parseFloat(p.CombatPower.replace(/,/g, '')),
212:     serverName     : p.ServerName,
213:     guildName      : p.GuildName        ?? '',
214:     guildGrade     : p.GuildMemberGrade ?? '',
215:     expeditionLevel: p.ExpeditionLevel,
216:     townLevel      : p.TownLevel,
217:     townName       : p.TownName,
218:     title          : p.Title ?? '없음',
219:     honorLevel     : p.HonorPoint,
220:     characterImage : p.CharacterImage,
221:   };
222: };
223: 
224: // ── 전투 특성 ────────────────────────────────────────────────
225: 
226: export const normalizeCombatStats = (raw: RawCharacterData): CombatStatsDisplay => {
227:   const statsMap = Object.fromEntries(
228:     raw.profile.Stats.map(s => [s.Type, parseInt(s.Value.replace(/,/g, ''))])
229:   );
230:   return {
231:     critical      : statsMap['치명']        ?? 0,
232:     specialization: statsMap['특화']        ?? 0,
233:     swiftness     : statsMap['신속']        ?? 0,
234:     domination    : statsMap['제압']        ?? 0,
235:     endurance     : statsMap['인내']        ?? 0,
236:     expertise     : statsMap['숙련']        ?? 0,
237:     maxHp         : statsMap['최대 생명력'] ?? 0,
238:     attackPower   : statsMap['공격력']      ?? 0,
239:   };
240: };
241: 
242: // ── 전투 장비 ────────────────────────────────────────────────
243: 
244: export const normalizeEquipment = (raw: RawCharacterData): EquipmentDisplay[] => {
245:   const weaponTypes = ['무기', '투구', '상의', '하의', '장갑', '어깨'];
246:   return raw.equipment
247:     .filter(eq => weaponTypes.includes(eq.Type))
248:     .map(eq => {
249:       const tooltip = parseTooltip(eq.Tooltip);
250:       const titleEl = tooltip['Element_001']?.value ?? {};
251:       const tier    = extractItemTier(titleEl.leftStr2 ?? '');
252:       return {
253:         type      : eq.Type,
254:         name      : eq.Name,
255:         icon      : eq.Icon,
256:         grade     : toGradeColoredText(eq.Grade),
257:         refineStep: extractRefineStep(eq.Name),
258:         quality   : titleEl.qualityValue ?? 0,
259:         itemTier  : tier,
260:         setType   : findEquipSetType(eq.Name),
261:       };
262:     });
263: };
264: 
265: // ── 악세서리 ────────────────────────────────────────────────
266: 
267: export const normalizeAccessories = (raw: RawCharacterData): AccessoryDisplay[] => {
268:   const accTypes = ['목걸이', '귀걸이', '반지'];
269:   return raw.equipment
270:     .filter(eq => accTypes.includes(eq.Type))
271:     .map(eq => {
272:       const tooltip = parseTooltip(eq.Tooltip);
273:       const titleEl = tooltip['Element_001']?.value ?? {};
274:       const tier    = extractItemTier(titleEl.leftStr2 ?? '');
275: 
276:       // 기본 효과 파싱 (주스탯, 체력)
277:       const baseEffects: AccessoryBaseEffect[] = [];
278:       const baseStr: string = tooltip['Element_004']?.value?.Element_001 ?? '';
279:       baseStr.split(/<br\s*\/?>/i).filter(Boolean).forEach(line => {
280:         const clean = stripHtml(line);
281:         const m     = clean.match(/(힘|민첩|지능|체력)\s*\+(\d+)/);
282:         if (m) {
283:           const isNonMain = line.toLowerCase().includes('#686660');
284:           baseEffects.push({
285:             statType: { text: m[1], color: isNonMain ? '#686660' : undefined },
286:             value   : { value: parseInt(m[2]), color: undefined },
287:           });
288:         }
289:       });
290: 
291:       // 연마 효과 파싱
292:       const polishEffects: AccessoryPolishEffect[] = [];
293:       const polishStr: string = tooltip['Element_006']?.value?.Element_001 ?? '';
294:       polishStr.split(/<br\s*\/?>/i).filter(Boolean).forEach(line => {
295:         const clean     = stripHtml(line);
296:         const labelM    = clean.match(/^([가-힣\s]+)/);
297:         const labelText = labelM ? labelM[1].trim() : clean;
298:         const cv        = toColoredValue(line);
299:         const effectType = detectPolishEffectType(labelText, cv.value);
300: 
301:         polishEffects.push({
302:           label: { text: labelText, color: undefined },
303:           value: cv,
304:           grade: findPolishGrade(effectType, cv.value, cv.color),
305:         });
306:       });
307: 
308:       return {
309:         type         : eq.Type,
310:         name         : eq.Name,
311:         icon         : eq.Icon,
312:         grade        : toGradeColoredText(eq.Grade),
313:         quality      : titleEl.qualityValue ?? 0,
314:         itemTier     : tier,
315:         baseEffects,
316:         polishEffects,
317:       };
318:     });
319: };
320: 
321: // ── 팔찌 ────────────────────────────────────────────────────
322: 
323: export const normalizeBracelet = (raw: RawCharacterData): BraceletDisplay | null => {
324:   const bracelet = raw.equipment.find(eq => eq.Type === '팔찌');
325:   if (!bracelet) return null;
326: 
327:   const tooltip   = parseTooltip(bracelet.Tooltip);
328:   const effectStr: string = tooltip['Element_005']?.value?.Element_001 ?? '';
329: 
330:   /** 팔찌 효과 키워드 → { effectType, isFixed } */
331:   const BRACELET_EFFECT_MAP: Record<string, { effectType: string; isFixed: boolean }> = {
332:     '신속'            : { effectType: 'STAT_SWIFT', isFixed: true  },
333:     '특화'            : { effectType: 'STAT_SPEC',  isFixed: true  },
334:     '치명'            : { effectType: 'STAT_CRIT',  isFixed: true  },
335:     '헤드어택'        : { effectType: 'DMG_INC',    isFixed: false },
336:     '치명타 피해'     : { effectType: 'CRIT_DMG',   isFixed: false },
337:     '치명타로 적중 시': { effectType: 'CRIT_DMG_INC', isFixed: false },
338:     '추가 피해'       : { effectType: 'ADD_DMG',    isFixed: false },
339:     '무기 공격력'     : { effectType: 'WEAPON_ATK_C', isFixed: false },
340:   };
341: 
342:   const effects: BraceletEffect[] = effectStr
343:     .split(/<br\s*\/?>/i)
344:     .filter(Boolean)
345:     .map(line => {
346:       const clean    = stripHtml(line);
347:       let effectType = 'UNKNOWN';
348:       let isFixed    = false;
349: 
350:       for (const [key, val] of Object.entries(BRACELET_EFFECT_MAP)) {
351:         if (clean.includes(key)) {
352:           effectType = val.effectType;
353:           isFixed    = val.isFixed;
354:           break;
355:         }
356:       }
357: 
358:       const labelM    = clean.match(/^([^+\d]+)/);
359:       const labelText = labelM ? labelM[1].trim() : clean;
360:       const cv        = toColoredValue(line);
361: 
362:       return {
363:         label  : { text: labelText, color: undefined },
364:         value  : cv,
365:         isFixed,
366:         grade  : isFixed
367:           ? undefined
368:           : findPolishGrade(effectType, cv.value, cv.color),
369:       };
370:     });
371: 
372:   return {
373:     name  : bracelet.Name,
374:     icon  : bracelet.Icon,
375:     grade : toGradeColoredText(bracelet.Grade),
376:     effects,
377:   };
378: };
379: 
380: // ── 어빌리티 스톤 ────────────────────────────────────────────
381: 
382: export const normalizeAbilityStone = (raw: RawCharacterData): AbilityStoneDisplay | null => {
383:   const stone = raw.equipment.find(eq => eq.Type === '어빌리티 스톤');
384:   if (!stone) return null;
385: 
386:   const tooltip        = parseTooltip(stone.Tooltip);
387:   const engravingGroup = tooltip['Element_007']?.value?.Element_000?.contentStr ?? {};
388:   const bonusStr: string = tooltip['Element_006']?.value?.Element_001 ?? '';
389:   const baseAtkBonus   = bonusStr.includes('기본 공격력')
390:     ? extractPercent(bonusStr)
391:     : 0;
392: 
393:   const engravings: AbilityStoneDisplay['engravings'] = [];
394:   let   penalty:    AbilityStoneDisplay['penalty']    = null;
395: 
396:   Object.values(engravingGroup).forEach((item: any) => {
397:     const content: string = item?.contentStr ?? '';
398:     const clean = stripHtml(content);
399:     const m     = clean.match(/\[([^\]]+)\]\s*Lv\.(\d+)/);
400:     if (!m) return;
401:     const name  = m[1];
402:     const level = parseInt(m[2]);
403: 
404:     if (content.toLowerCase().includes('#fe2e2e')) {
405:       penalty = {
406:         name : { text: name, color: '#FE2E2E' },
407:         level: { value: level, color: undefined },
408:       };
409:     } else {
410:       engravings.push({
411:         name : { text: name, color: '#FFFFAC' },
412:         level: { value: level, color: undefined },
413:       });
414:     }
415:   });
416: 
417:   return {
418:     name: stone.Name, icon: stone.Icon,
419:     grade: toGradeColoredText(stone.Grade),
420:     baseAtkBonus, engravings, penalty,
421:   };
422: };
423: 
424: // ── 보주 ────────────────────────────────────────────────────
425: 
426: export const normalizeBoJu = (raw: RawCharacterData): BoJuDisplay | null => {
427:   const boju = raw.equipment.find(eq => eq.Type === '보주');
428:   if (!boju) return null;
429: 
430:   const tooltip   = parseTooltip(boju.Tooltip);
431:   const effectStr: string = tooltip['Element_004']?.value?.Element_001 ?? '';
432:   const seasonM   = effectStr.match(/시즌(\d+)\s*달성\s*최대\s*낙원력\s*:\s*([\d,]+)/);
433: 
434:   return {
435:     name        : boju.Name,
436:     icon        : boju.Icon,
437:     grade       : toGradeColoredText(boju.Grade),
438:     seasonLabel : seasonM ? `시즌${seasonM[1]}` : '',
439:     paradoxPower: seasonM ? parseInt(seasonM[2].replace(/,/g, '')) : 0,
440:   };
441: };
442: 
443: // ── 아바타 ──────────────────────────────────────────────────
444: 
445: export const normalizeAvatars = (raw: RawCharacterData): AvatarDisplay[] => {
446:   const targetTypes = ['무기 아바타', '상의 아바타', '하의 아바타'];
447:   const grouped: Record<string, typeof raw.avatars> = {};
448: 
449:   raw.avatars
450:     .filter(av => targetTypes.includes(av.Type))
451:     .forEach(av => {
452:       if (!grouped[av.Type]) grouped[av.Type] = [];
453:       grouped[av.Type].push(av);
454:     });
455: 
456:   return Object.entries(grouped).map(([type, avatars]) => {
457:     const bonuses = avatars.map(av => {
458:       const tooltip  = parseTooltip(av.Tooltip);
459:       const bonusStr: string = tooltip['Element_005']?.value?.Element_001 ?? '';
460:       return { avatar: av, bonus: bonusStr.includes('%') ? extractPercent(bonusStr) : 0 };
461:     });
462:     const best = bonuses.reduce((a, b) => a.bonus >= b.bonus ? a : b);
463:     return {
464:       type         : type,
465:       name         : best.avatar.Name,
466:       icon         : best.avatar.Icon,
467:       grade        : toGradeColoredText(best.avatar.Grade),
468:       mainStatBonus: best.bonus,
469:     };
470:   });
471: };
472: 
473: // ── 각인 ────────────────────────────────────────────────────
474: 
475: export const normalizeEngravings = (raw: RawCharacterData): EngravingDisplay[] =>
476:   raw.engravings.ArkPassiveEffects.map(eff => ({
477:     name             : { text: eff.Name,  color: '#FFFFAC' },
478:     grade            : toGradeColoredText(eff.Grade),
479:     level            : eff.Level,
480:     abilityStoneLevel: eff.AbilityStoneLevel,
481:     description      : stripHtml(eff.Description),
482:     icon             : '',
483:   }));
484: 
485: // ── 보석 ────────────────────────────────────────────────────
486: 
487: export const normalizeGems = (raw: RawCharacterData): GemSummaryDisplay => {
488:   const gemMap = Object.fromEntries(raw.gems.Gems.map(g => [g.Slot, g]));
489:   const gems: GemDisplay[] = raw.gems.Effects.Skills.map(skill => {
490:     const gem     = gemMap[skill.GemSlot];
491:     const desc    = skill.Description[0] ?? '';
492:     const isDmg   = desc.includes('피해');
493:     const effectValue = extractPercent(desc);
494:     return {
495:       slot        : skill.GemSlot,
496:       level       : gem?.Level  ?? 0,
497:       grade       : toGradeColoredText(gem?.Grade ?? ''),
498:       icon        : gem?.Icon   ?? skill.Icon,
499:       skillName   : { text: skill.Name, color: '#FFD200' },
500:       effectLabel : { text: isDmg ? '피해' : '재사용 대기시간', color: undefined },
501:       effectValue : { value: effectValue, color: isDmg ? '#99ff99' : '#87CEEB' },
502:       baseAtkBonus: extractPercent(skill.Option),
503:     };
504:   });
505:   return {
506:     gems,
507:     totalBaseAtk: { value: extractPercent(raw.gems.Effects.Description), color: '#B7FB00' },
508:   };
509: };
510: 
511: // ── 카드 ────────────────────────────────────────────────────
512: 
513: export const normalizeCards = (raw: RawCharacterData): CardSetDisplay | null => {
514:   if (!raw.cards.Effects?.length) return null;
515:   const effect     = raw.cards.Effects[0];
516:   const totalAwake = raw.cards.Cards.reduce((sum: number, c: any) => sum + c.AwakeCount, 0);
517:   const setNameM   = effect.Items[0]?.Name.match(/^(.+?)\s+\d+세트/);
518: 
519:   const activeItems = effect.Items
520:     .filter(item => {
521:       const awakeM = item.Name.match(/\((\d+)각성합계\)/);
522:       if (!awakeM) {
523:         const setM = item.Name.match(/(\d+)세트$/);
524:         return setM ? totalAwake >= parseInt(setM[1]) * 5 : true;
525:       }
526:       return totalAwake >= parseInt(awakeM[1]);
527:     })
528:     .map(item => ({
529:       name       : item.Name,
530:       description: stripHtml(item.Description),
531:       value      : item.Description.includes('%')
532:         ? toColoredValue(item.Description)
533:         : undefined,
534:     }));
535: 
536:   return {
537:     setName: setNameM ? setNameM[1] : '',
538:     totalAwake,
539:     activeItems,
540:   };
541: };
542: 
543: // ── 아크패시브 ───────────────────────────────────────────────
544: 
545: export const normalizeArkPassive = (raw: RawCharacterData) => {
546:   const p = raw.arkPassive;
547: 
548:   const getPoint = (name: string) => {
549:     const found = p.Points.find(pt => pt.Name === name);
550:     return { value: found?.Value ?? 0, description: found?.Description ?? '' };
551:   };
552: 
553:   const points: ArkPassivePointDisplay = {
554:     evolution: getPoint('진화'),
555:     insight  : getPoint('깨달음'),
556:     leap     : getPoint('도약'),
557:     title    : p.Title,
558:   };
559: 
560:   const PATTERN = /(진화|깨달음|도약)\s+(\d+)티어\s+(.+?)\s+Lv\.(\d+)/;
561: 
562:   const effects: ArkPassiveEffectDisplay[] = p.Effects.map(eff => {
563:     const clean    = stripHtml(eff.Description);
564:     const m        = clean.match(PATTERN);
565:     const ttJson   = parseTooltip(eff.ToolTip);
566:     const descRaw: string = ttJson['Element_002']?.value ?? '';
567:     const desc     = stripHtml(descRaw.split('||')[0]);
568:     const category = m ? m[1] : eff.Name;
569:     return {
570:       category   : { text: category, color: ARK_PASSIVE_COLORS[category] },
571:       name       : { text: m ? m[3] : clean, color: undefined },
572:       tier       : m ? parseInt(m[2]) : 0,
573:       level      : m ? parseInt(m[4]) : 0,
574:       description: desc,
575:       icon       : eff.Icon,
576:     };
577:   });
578: 
579:   return { points, effects };
580: };
581: 
582: // ── 아크그리드 ───────────────────────────────────────────────
583: 
584: export const normalizeArkGrid = (raw: RawCharacterData): ArkGridDisplay => {
585:   const cores = raw.arkGrid.Slots.map(slot => ({
586:     index: slot.Index,
587:     name : { text: slot.Name,   color: GRADE_COLORS[slot.Grade] },
588:     point: { value: slot.Point, color: '#B7FB00' as string | undefined },
589:     grade: toGradeColoredText(slot.Grade),
590:     icon : slot.Icon,
591:   }));
592: 
593:   const effects = raw.arkGrid.Effects.map(eff => ({
594:     label: { text: eff.Name, color: undefined as string | undefined },
595:     level: eff.Level,
596:     value: { value: extractPercent(eff.Tooltip), color: extractColor(eff.Tooltip) },
597:   }));
598: 
599:   return { cores, effects };
600: };
601: 
602: // ── 스킬 ────────────────────────────────────────────────────
603: 
604: export const normalizeSkills = (raw: RawCharacterData): SkillDisplay[] => {
605:   const gemSkillNames = raw.gems.Effects.Skills.map(s => s.Name);
606: 
607:   const isSkillUsed = (skill: typeof raw.skills[0]): boolean => {
608:     if (skill.SkillType === 100 || skill.SkillType === 101) return true;
609:     if (skill.Level >= 4 || skill.Rune !== null) return true;
610:     return gemSkillNames.some(
611:       name => skill.Name.includes(name) || name.includes(skill.Name)
612:     );
613:   };
614: 
615:   return raw.skills.filter(isSkillUsed).map(skill => {
616:     const tooltip      = parseTooltip(skill.Tooltip);
617:     const titleEl      = tooltip['Element_001']?.value ?? {};
618:     const levelStr     : string = titleEl.level ?? '';
619:     const categoryM    = levelStr.match(/\[([^\]]+)\]/);
620:     const categoryText = categoryM ? categoryM[1] : '일반 스킬';
621: 
622:     const selectedTripods: SelectedTripodDisplay[] = skill.Tripods
623:       .filter(t => t.IsSelected)
624:       .map(t => ({
625:         tier: t.Tier,
626:         slot: t.Slot,
627:         name: { text: t.Name, color: '#FFBB63' },
628:         icon: t.Icon,
629:       }));
630: 
631:     const rune: EquippedRuneDisplay | null = skill.Rune ? {
632:       name : { text: skill.Rune.Name,  color: GRADE_COLORS[skill.Rune.Grade] },
633:       grade: toGradeColoredText(skill.Rune.Grade),
634:       icon : skill.Rune.Icon,
635:     } : null;
636: 
637:     return {
638:       name           : skill.Name,
639:       icon           : skill.Icon,
640:       level          : skill.Level,
641:       type           : skill.Type,
642:       skillType      : skill.SkillType,
643:       category       : { text: categoryText, color: SKILL_CATEGORY_COLORS[categoryText] },
644:       isUsed         : true,
645:       selectedTripods,
646:       rune,
647:     };
648:   });
649: };
650: 
651: 
652: // ============================================================
653: // 최상위 통합
654: // ============================================================
655: 
656: export const normalizeCharacter = (raw: RawCharacterData): CharacterDisplayData => ({
657:   profile     : normalizeProfile(raw),
658:   combatStats : normalizeCombatStats(raw),
659:   equipment   : normalizeEquipment(raw),
660:   accessories : normalizeAccessories(raw),
661:   bracelet    : normalizeBracelet(raw),
662:   abilityStone: normalizeAbilityStone(raw),
663:   boJu        : normalizeBoJu(raw),
664:   avatars     : normalizeAvatars(raw),
665:   engravings  : normalizeEngravings(raw),
666:   gems        : normalizeGems(raw),
667:   cards       : normalizeCards(raw),
668:   arkPassive  : normalizeArkPassive(raw),
669:   arkGrid     : normalizeArkGrid(raw),
670:   skills      : normalizeSkills(raw),
671: });
```

## File: src/types/character-types.ts
```typescript
  1: /**
  2:  * @/types/character-types.ts
  3:  * UI 표시용 가공 타입
  4:  * data-normalizer.ts 가 RawCharacterData → 이 타입으로 변환
  5:  * 계산용 수치는 포함하지 않음 — useCalculatorStore 참조
  6:  */
  7: 
  8: /**
  9:  * color 없으면 기본색(흰색) 처리
 10:  */
 11: export interface ColoredValue {
 12:   value : number;
 13:   color?: string;
 14: }
 15: export interface ColoredText {
 16:   text : string;
 17:   color?: string;
 18: }
 19: 
 20: // ============================================================
 21: // 공통
 22: // ============================================================
 23: 
 24: /** 상/중/하 옵션 등급 */
 25: export type OptionGrade = 'HIGH' | 'MID' | 'LOW';
 26: 
 27: /** 장비 세트 타입 */
 28: export type EquipmentSetType =
 29:   | 'NORMAL_RELIC'
 30:   | 'AEGIR_ANCIENT'
 31:   | 'SERCA_ANCIENT'
 32:   | 'UNKNOWN';
 33: 
 34: // ============================================================
 35: // 프로필
 36: // ============================================================
 37: 
 38: export interface CharacterProfileDisplay {
 39:   name           : string;
 40:   className      : string;
 41:   characterLevel : number;
 42:   itemAvgLevel   : number;
 43:   combatPower    : number;
 44:   serverName     : string;
 45:   guildName      : string;
 46:   guildGrade     : string;
 47:   expeditionLevel: number;
 48:   townLevel      : number;
 49:   townName       : string;
 50:   title          : string;
 51:   honorLevel     : number;
 52:   characterImage : string;
 53: }
 54: 
 55: /** 전투 특성 표시용 */
 56: export interface CombatStatsDisplay {
 57:   critical      : number;
 58:   specialization: number;
 59:   swiftness     : number;
 60:   domination    : number;
 61:   endurance     : number;
 62:   expertise     : number;
 63:   maxHp         : number;
 64:   attackPower   : number;
 65: }
 66: 
 67: // ============================================================
 68: // 장비
 69: // ============================================================
 70: 
 71: export interface EquipmentDisplay {
 72:   type      : string;
 73:   name      : string;
 74:   icon      : string;
 75:   grade     : ColoredText;
 76:   refineStep: number;
 77:   quality   : number;
 78:   itemTier  : number;
 79:   setType   : EquipmentSetType;
 80: }
 81: 
 82: // ============================================================
 83: // 악세서리
 84: // ============================================================
 85: 
 86: /** 악세서리 기본 효과 (주스탯, 체력) — UI 표시용 */
 87: export interface AccessoryBaseEffect {
 88:   statType: ColoredText;
 89:   value   : ColoredValue;
 90: }
 91: 
 92: /** 악세서리 연마 효과 — UI 표시용 */
 93: export interface AccessoryPolishEffect {
 94:   label: ColoredText;   // "추가 피해"
 95:   value: ColoredValue;  // 0.016, color
 96:   grade: OptionGrade;
 97: }
 98: 
 99: export interface AccessoryDisplay {
100:   type         : string;
101:   name         : string;
102:   icon         : string;
103:   grade        : ColoredText;
104:   quality      : number;
105:   itemTier     : number;
106:   baseEffects  : AccessoryBaseEffect[];
107:   polishEffects: AccessoryPolishEffect[];
108: }
109: 
110: // ============================================================
111: // 팔찌
112: // ============================================================
113: 
114: export interface BraceletEffect {
115:   label  : ColoredText;
116:   value  : ColoredValue;
117:   isFixed: boolean;
118:   grade? : OptionGrade;
119: }
120: 
121: export interface BraceletDisplay {
122:   name   : string;
123:   icon   : string;
124:   grade  : ColoredText;
125:   effects: BraceletEffect[];
126: }
127: 
128: // ============================================================
129: // 어빌리티 스톤
130: // ============================================================
131: 
132: export interface AbilityStoneDisplay {
133:   name        : string;
134:   icon        : string;
135:   grade       : ColoredText;
136:   baseAtkBonus: number;
137:   engravings: {
138:     name : ColoredText;
139:     level: ColoredValue;
140:   }[];
141:   penalty: {
142:     name : ColoredText;
143:     level: ColoredValue;
144:   } | null;
145: }
146: 
147: // ============================================================
148: // 보주
149: // ============================================================
150: 
151: export interface BoJuDisplay {
152:   name        : string;
153:   icon        : string;
154:   grade       : ColoredText;
155:   seasonLabel : string;
156:   paradoxPower: number;
157: }
158: 
159: // ============================================================
160: // 아바타
161: // ============================================================
162: 
163: /**
164:  * todo: 자동화할려면 API에서 넘어오는 IsSet, IsInner 필요 여부?
165:  *       아니면 모든 아바타를 스캔후 같은 부위에 여러 아바타 일경우 Grade가 높은 아바타만 표시?
166:  */
167: export interface AvatarDisplay {
168:   type         : string;
169:   name         : string;
170:   icon         : string;
171:   grade        : ColoredText;
172:   mainStatBonus: number;
173: }
174: 
175: // ============================================================
176: // 각인
177: // ============================================================
178: 
179: export interface EngravingDisplay {
180:   name             : ColoredText;
181:   grade            : ColoredText;
182:   level            : number;
183:   abilityStoneLevel: number | null;
184: }
185: 
186: // ============================================================
187: // 보석
188: // ============================================================
189: 
190: export interface GemDisplay {
191:   slot        : number;
192:   level       : number;
193:   grade       : ColoredText;
194:   icon        : string;
195:   skillName   : ColoredText;
196:   effectLabel : ColoredText;
197:   effectValue : ColoredValue;
198:   baseAtkBonus: number;
199: }
200: 
201: export interface GemSummaryDisplay {
202:   gems        : GemDisplay[];
203:   totalBaseAtk: ColoredValue;
204: }
205: 
206: // ============================================================
207: // 카드
208: // ============================================================
209: 
210: export interface CardSetDisplay {
211:   setName    : string;
212:   totalAwake : number;
213:   activeItems: {
214:     name       : string;
215:     description: string;
216:     value?     : ColoredValue;
217:   }[];
218: }
219: 
220: // ============================================================
221: // 아크패시브
222: // ============================================================
223: 
224: export interface ArkPassivePointDisplay {
225:   evolution: { value: number; description: string };
226:   insight  : { value: number; description: string };
227:   leap     : { value: number; description: string };
228:   title    : string;
229: }
230: 
231: export interface ArkPassiveEffectDisplay {
232:   category   : ColoredText;
233:   name       : ColoredText;
234:   tier       : number;
235:   level      : number;
236:   description: string;
237:   icon       : string;
238: }
239: 
240: // ============================================================
241: // 아크그리드
242: // ============================================================
243: 
244: export interface ArkGridCoreDisplay {
245:   index: number;
246:   name : ColoredText;
247:   point: ColoredValue;
248:   grade: ColoredText;
249:   icon : string;
250: }
251: 
252: export interface ArkGridEffectDisplay {
253:   label: ColoredText;
254:   level: number;
255:   value: ColoredValue;
256: }
257: 
258: export interface ArkGridDisplay {
259:   cores  : ArkGridCoreDisplay[];
260:   effects: ArkGridEffectDisplay[];
261: }
262: 
263: // ============================================================
264: // 스킬
265: // ============================================================
266: 
267: export interface SelectedTripodDisplay {
268:   tier : number;
269:   slot : number;
270:   name : ColoredText;
271:   icon : string;
272: }
273: 
274: export interface EquippedRuneDisplay {
275:   name : ColoredText;
276:   grade: ColoredText;
277:   icon : string;
278: }
279: 
280: export interface SkillDisplay {
281:   name           : string;
282:   icon           : string;
283:   level          : number;
284:   type           : string;
285:   skillType      : number;
286:   category       : ColoredText;
287:   isUsed         : boolean;
288:   selectedTripods: SelectedTripodDisplay[];
289:   rune           : EquippedRuneDisplay | null;
290: }
291: 
292: // ============================================================
293: // 전체 캐릭터 DisplayData
294: // ============================================================
295: 
296: export interface CharacterDisplayData {
297:   profile     : CharacterProfileDisplay;
298:   combatStats : CombatStatsDisplay;
299:   equipment   : EquipmentDisplay[];
300:   accessories : AccessoryDisplay[];
301:   bracelet    : BraceletDisplay | null;
302:   abilityStone: AbilityStoneDisplay | null;
303:   boJu        : BoJuDisplay | null;
304:   avatars     : AvatarDisplay[];
305:   engravings  : EngravingDisplay[];
306:   gems        : GemSummaryDisplay;
307:   cards       : CardSetDisplay | null;
308:   arkPassive  : {
309:     points : ArkPassivePointDisplay;
310:     effects: ArkPassiveEffectDisplay[];
311:   };
312:   arkGrid     : ArkGridDisplay;
313:   skills      : SkillDisplay[];
314: }
```

## File: src/data/engravings.ts
```typescript
  1: // @/data/engravings
  2: 
  3: import { EngravingData } from '../types/engraving';
  4: import { ID_AA, ID_BB } from '@/constants/id-config';
  5: 
  6: const BASE = (ID_AA.ENGRAVING * 1000000) + (ID_BB.COMMON * 10000);
  7: 
  8: export const NAMES = {
  9:   [BASE + 1] : '각성',      [BASE + 4] : '결투의 대가',   [BASE + 5] : '구슬동자',
 10:   [BASE + 7] : '급소 타격',   [BASE + 8] : '기습의 대가',   [BASE + 10]: '달인의 저력',
 11:   [BASE + 11]: '돌격대장',    [BASE + 12]: '마나 효율 증가', [BASE + 13]: '마나의 흐름',
 12:   [BASE + 14]: '바리케이드',   [BASE + 20]: '속전속결',     [BASE + 21]: '슈퍼 차지',
 13:   [BASE + 23]: '시선 집중',   [BASE + 25]: '아드레날린',    [BASE + 26]: '안정된 상태',
 14:   [BASE + 28]: '에테르 포식자', [BASE + 30]: '예리한 둔기',   [BASE + 31]: '원한',
 15:   [BASE + 32]: '위기 모면',   [BASE + 33]: '저주받은 인형',  [BASE + 34]: '전문의',
 16:   [BASE + 35]: '정기 흡수',   [BASE + 36]: '정밀 단도',    [BASE + 37]: '중갑 착용',
 17:   [BASE + 38]: '질량 증가',   [BASE + 39]: '최대 마나 증가', [BASE + 41]: '타격의 대가',
 18:   [BASE + 43]: '폭발물 전문가'
 19: } as const;
 20: 
 21: /**todo: 구슬동자/급소타격/BASE + 32위기모면/[BASE + 34]: '전문의'/중갑착용/[BASE + 39]: '최대 마나 증가'/BASE + 43 폭발물 전문가
 22:  *  돌격대장 데미지처리 / 유물,어빌 타겟(마나효율증가,속전속결,시선집중,정기흡수) /
 23:  * 예리한 둔기 피해감소 / BASE + 36정밀단도 effect추가 /  
 24:  * 어떻게 할지 생각*/  
 25: export const ENGRAVINGS_DB: EngravingData[] = [
 26:   {
 27:   id: BASE + 1,
 28:   name: NAMES[BASE + 1],
 29:   effects: [{ type: 'CDR_P', value: [0.44], target: {categories:['ULTIMATE']} }],
 30:   iconPath: `/images/engravings/${BASE + 1}.webp`,
 31:   bonus: {
 32:     relic: { type: 'CDR_P', value: [0.015, 0.03, 0.045, 0.06] },
 33:     ability: { type: 'CDR_P', value: [0.06, 0.075, 0.105, 0.12] }
 34:     }
 35:   },
 36:   {
 37:     id: BASE + 4,
 38:     name: NAMES[BASE + 4],
 39:     effects: [
 40:       { type: 'DMG_INC', value:  [0.048] },
 41:       { type: 'DMG_INC', value:  [0.15], target: {attackType:['HEAD_ATK']} }
 42:     ],
 43:     iconPath: `/images/engravings/${BASE + 4}.webp`,
 44:     bonus: {
 45:       relic: { type: 'DMG_INC', value: [0.007, 0.014, 0.021, 0.028] },
 46:       ability: { type: 'DMG_INC', value: [0.027, 0.034, 0.047, 0.054] }
 47:       }
 48:   },
 49:   {
 50:     id: BASE + 5,
 51:     name: NAMES[BASE + 5],
 52:     iconPath: `/images/engravings/${BASE + 5}.webp`,
 53:   },
 54:   {
 55:     id: BASE + 7,
 56:     name: NAMES[BASE + 7],
 57:     iconPath: `/images/engravings/${BASE + 7}.webp`,
 58:   },
 59:   {
 60:     id: BASE + 8,
 61:     name: NAMES[BASE + 8],
 62:     effects: [
 63:       { type: 'DMG_INC', value: [0.048] },
 64:       { type: 'DMG_INC', value: [0.15], target: {attackType:['BACK_ATK']} }
 65:     ],
 66:     iconPath: `/images/engravings/${BASE + 8}.webp`,
 67:     bonus: {
 68:       relic: { type: 'DMG_INC', value: [0.007, 0.014, 0.021, 0.028] },
 69:       ability: { type: 'DMG_INC', value: [0.027, 0.034, 0.047, 0.054] }
 70:       }
 71:   },
 72:   {
 73:     id: BASE + 10,
 74:     name: NAMES[BASE + 10],
 75:     effects: [{ type: 'DMG_INC', value: [0.14] }],
 76:     iconPath: `/images/engravings/${BASE + 10}.webp`,
 77:     bonus: {
 78:       relic: { type: 'DMG_INC', value: [0.0075, 0.015, 0.0225, 0.03] },
 79:       ability: { type: 'DMG_INC', value: [0.03, 0.0375, 0.0525, 0.06] }
 80:       }
 81:   },
 82:   {
 83:     id: BASE + 11,
 84:     name: NAMES[BASE + 11],
 85:     effects: [{ type: 'DMG_INC', value: [0.40] }],
 86:     iconPath: `/images/engravings/${BASE + 11}.webp`,
 87:     bonus: {
 88:       relic: { type: 'DMG_INC', value: [0.02, 0.04, 0.06, 0.08] },
 89:       ability: { type: 'DMG_INC', value: [0.075, 0.094, 0.132, 0.15] }
 90:     }
 91:   },
 92:   {
 93:     id: BASE + 12,
 94:     name: NAMES[BASE + 12],
 95:     effects: [{ type: 'DMG_INC', value: [0.13], target: { resourceTypes: ['MANA'] } }],
 96:     iconPath: `/images/engravings/${BASE + 12}.webp`,
 97:     bonus: {
 98:       relic: { type: 'DMG_INC', value: [0.0075, 0.015, 0.0225, 0.03] },
 99:       ability: { type: 'DMG_INC', value: [0.03, 0.0375, 0.0525, 0.06] }
100:     }
101:   },
102:   {
103:     id: BASE + 13,
104:     name: NAMES[BASE + 13],
105:     effects: [{ type: 'CDR_P', value: [0.07] }],
106:     iconPath: `/images/engravings/${BASE + 13}.webp`,
107:     bonus: {
108:       relic: { type: 'CDR_P', value: [0.0075, 0.015, 0.0225, 0.03] },
109:     }
110:   },
111:   {
112:     id: BASE + 14,
113:     name: NAMES[BASE + 14],
114:     effects: [{ type: 'DMG_INC', value: [0.14] }],
115:     iconPath: `/images/engravings/${BASE + 14}.webp`,
116:     bonus: {
117:       relic: { type: 'DMG_INC', value: [0.0075, 0.015, 0.0225, 0.03] },
118:       ability: { type: 'DMG_INC', value: [0.03, 0.0375, 0.0525, 0.06] }
119:     }
120:   },
121:   {
122:     id: BASE + 20,
123:     name: NAMES[BASE + 20],
124:     effects: [{ type: 'DMG_INC', value: [0.18], target: { skillTypes: ['HOLDING', 'CASTING'] } }],
125:     iconPath: `/images/engravings/${BASE + 20}.webp`,
126:     bonus: {
127:       relic: { type: 'DMG_INC', value: [0.0075, 0.015, 0.0225, 0.03] },
128:       ability: { type: 'DMG_INC', value: [0.03, 0.0375, 0.0525, 0.06] }
129:     }
130:   },
131:   {
132:     id: BASE + 21,
133:     name: NAMES[BASE + 21],
134:     effects: [{ type: 'DMG_INC', value: [0.18], target: { skillTypes: ['CHARGE'] } }],
135:     iconPath: `/images/engravings/${BASE + 21}.webp`,
136:     bonus: {
137:       relic: { type: 'DMG_INC', value: [0.0075, 0.015, 0.0225, 0.03] },
138:       ability: { type: 'DMG_INC', value: [0.03, 0.0375, 0.0525, 0.06] }
139:     }
140:   },
141:   {
142:     id: BASE + 23,
143:     name: NAMES[BASE + 23],
144:     effects: [{ type: 'DMG_INC', value: [0.25] }],
145:     iconPath: `/images/engravings/${BASE + 23}.webp`,
146:     bonus: {
147:       relic: { type: 'DMG_INC', value: [0.0125, 0.025, 0.0375, 0.05] },
148:       ability: { type: 'DMG_INC', value: [0.04, 0.05, 0.07, 0.08] }
149:     }
150:   },
151:   {
152:     id: BASE + 25,
153:     name: NAMES[BASE + 25],
154:     effects: [
155:       { type: 'ATK_P', value: [0.054] },
156:       { type: 'CRIT_CHANCE', value: [0.14] }
157:     ],
158:     iconPath: `/images/engravings/${BASE + 25}.webp`,
159:     bonus: {
160:       relic: { type: 'CRIT_CHANCE', value: [0.015, 0.03, 0.045, 0.06] },
161:       ability: { type: 'ATK_P', value: [0.0288, 0.036, 0.0498, 0.057] }
162:     }
163:   },
164:   {
165:     id: BASE + 26,
166:     name: NAMES[BASE + 26],
167:     effects: [{ type: 'DMG_INC', value: [0.14] }],
168:     iconPath: `/images/engravings/${BASE + 26}.webp`,
169:     bonus: {
170:       relic: { type: 'DMG_INC', value: [0.0075, 0.015, 0.0225, 0.03] },
171:       ability: { type: 'DMG_INC', value: [0.03, 0.0375, 0.0525, 0.06] }
172:     }
173:   },
174:   {
175:     id: BASE + 28,
176:     name: NAMES[BASE + 28],
177:     effects: [{ type: 'ATK_P', value: [0.0126] }],
178:     iconPath: `/images/engravings/${BASE + 28}.webp`,
179:     bonus: {
180:       relic: { type: 'ATK_P', value: [0.009, 0.018, 0.027, 0.036] },
181:       ability: { type: 'ATK_P', value: [0.03, 0.039, 0.054, 0.06] }
182:     }
183:   },
184:   {
185:     id: BASE + 30,
186:     name: NAMES[BASE + 30],
187:     effects: [{ type: 'CRIT_DMG_INC', value: [0.44] }],
188:     iconPath: `/images/engravings/${BASE + 30}.webp`,
189:     bonus: {
190:       relic: { type: 'CRIT_DMG_INC', value: [0.02, 0.04, 0.06, 0.08] },
191:       ability: { type: 'CRIT_DMG_INC', value: [0.075, 0.094, 0.132, 0.15] }
192:     }
193:   },
194:   {
195:     id: BASE + 31,
196:     name: NAMES[BASE + 31],
197:     effects: [{ type: 'DMG_INC', value: [0.18] }],
198:     iconPath: `/images/engravings/${BASE + 31}.webp`,
199:     bonus: {
200:       relic: { type: 'DMG_INC', value: [0.0075, 0.015, 0.0225, 0.03] },
201:       ability: { type: 'DMG_INC', value: [0.03, 0.0375, 0.0525, 0.06] }
202:     }
203:   },
204:   {
205:     id: BASE + 32,
206:     name: NAMES[BASE + 32],
207:     iconPath: `/images/engravings/${BASE + 32}.webp`,
208:   },
209:   {
210:     id: BASE + 33,
211:     name: NAMES[BASE + 33],
212:     effects: [{ type: 'DMG_INC', value: [0.14] }],
213:     iconPath: `/images/engravings/${BASE + 33}.webp`,
214:     bonus: {
215:       relic: { type: 'DMG_INC', value: [0.0075, 0.015, 0.0225, 0.03] },
216:       ability: { type: 'DMG_INC', value: [0.03, 0.0375, 0.0525, 0.06] }
217:     }
218:   },
219:   {
220:     id: BASE + 34,
221:     name: NAMES[BASE + 34],
222:     iconPath: `/images/engravings/${BASE + 34}.webp`,
223:   },
224:   {
225:     id: BASE + 35,
226:     name: NAMES[BASE + 35],
227:     effects: [
228:       { type: 'SPEED_ATK', value: [0.13] },
229:       { type: 'SPEED_MOV', value: [0.13] }
230:     ],
231:     iconPath: `/images/engravings/${BASE + 35}.webp`,
232:     bonus: {
233:       relic: { type: 'SPEED_ATK', value: [0.0075, 0.015, 0.0225, 0.03] },
234:       ability: { type: 'SPEED_MOV', value: [0.03, 0.0375, 0.0525, 0.06] }
235:     }
236:   },
237:   {
238:     id: BASE + 36,
239:     name: NAMES[BASE + 36],
240:     effects: [{ type: 'CRIT_CHANCE', value: [0.18] }],
241:     iconPath: `/images/engravings/${BASE + 36}.webp`,
242:     bonus: {
243:       relic: { type: 'CRIT_CHANCE', value: [0.0075, 0.015, 0.0225, 0.03] },
244:       ability: { type: 'CRIT_CHANCE', value: [0.03, 0.0375, 0.0525, 0.06] }
245:     }
246:   },
247:   {
248:     id: BASE + 37,
249:     name: NAMES[BASE + 37],
250:     iconPath: `/images/engravings/${BASE + 37}.webp`,
251:   },
252:   {
253:     id: BASE + 38,
254:     name: NAMES[BASE + 38],
255:     effects: [
256:       { type: 'DMG_INC', value: [0.16] },
257:       { type: 'SPEED_ATK', value: [-0.10] }
258:     ],
259:     iconPath: `/images/engravings/${BASE + 38}.webp`,
260:     bonus: {
261:       relic: { type: 'DMG_INC', value: [0.0075, 0.015, 0.0225, 0.03] },
262:       ability: { type: 'DMG_INC', value: [0.03, 0.0375, 0.0525, 0.06] }
263:     }
264:   },
265:   {
266:     id: BASE + 39,
267:     name: NAMES[BASE + 39],
268:     iconPath: `/images/engravings/${BASE + 39}.webp`,
269:   },
270:   {
271:     id: BASE + 41,
272:     name: NAMES[BASE + 41],
273:     effects: [{ type: 'DMG_INC', value: [0.14], target: { attackType: ['NON_DIRECTIONAL'] } }],
274:     iconPath: `/images/engravings/${BASE + 41}.webp`,
275:     bonus: {
276:       relic: { type: 'DMG_INC', value: [0.0075, 0.015, 0.0225, 0.03] },
277:       ability: { type: 'DMG_INC', value: [0.03, 0.0375, 0.0525, 0.06] }
278:     }
279:   },
280:   {
281:     id: BASE + 43,
282:     name: NAMES[BASE + 43],
283:     iconPath: `/images/engravings/${BASE + 43}.webp`,
284:   },
285: ];
```
