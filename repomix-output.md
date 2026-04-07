# Directory Structure
```
src/types/character-types.ts
src/types/raw-types.ts
src/utils/data-normalizer.ts
```

# Files

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
176:  * 아크패시브 포인트 기여 추출
177:  * 장비/악세서리 툴팁에서 아크패시브 포인트 기여분을 파싱합니다.
178:  */
179: const extractArkPassivePoint = (
180:   tooltip: Record<string, any>
181: ): { category: ColoredText; point: ColoredValue } | null => {
182:   const candidates = ['Element_010', 'Element_007'];
183:   for (const key of candidates) {
184:     const content: string = tooltip[key]?.value?.Element_001 ?? '';
185:     if (content.includes('아크 패시브 포인트')) {
186:       const m = stripHtml(content).match(/(진화|깨달음|도약)\s*\+(\d+)/);
187:       if (m) return {
188:         category: { text: m[1], color: ARK_PASSIVE_COLORS[m[1]] },
189:         point   : { value: parseInt(m[2]), color: undefined },
190:       };
191:     }
192:   }
193:   return null;
194: };
195: 
196: /**
197:  * 연마효과 label → effectType 감지
198:  * 순서 중요 — 무기공격력을 공격력보다 먼저 검사
199:  */
200: const POLISH_EFFECT_TYPE_LIST: Array<[string, string]> = [
201:   ['적에게 주는 피해', 'DMG_INC'     ],
202:   ['추가 피해'       , 'ADD_DMG'     ],
203:   ['무기 공격력'     , 'WEAPON_ATK_P'],
204:   ['공격력'          , 'ATK_P'       ],
205:   ['치명타 피해'     , 'CRIT_DMG'    ],
206:   ['치명타 적중률'   , 'CRIT_CHANCE' ],
207: ];
208: 
209: const detectPolishEffectType = (label: string, value: number): string => {
210:   // 공격력 C/P 구분: % 여부로 판단 (value < 1이면 퍼센트)
211:   if (label.includes('공격력') && !label.includes('무기') && value >= 1) return 'ATK_C';
212:   for (const [key, typeId] of POLISH_EFFECT_TYPE_LIST) {
213:     if (label.includes(key)) return typeId;
214:   }
215:   return 'UNKNOWN';
216: };
217: 
218: 
219: // ============================================================
220: // 섹션별 정규화
221: // ============================================================
222: 
223: // ── 프로필 ──────────────────────────────────────────────────
224: 
225: export const normalizeProfile = (raw: RawCharacterData): CharacterProfileDisplay => {
226:   const p = raw.profile;
227:   return {
228:     name           : p.CharacterName,
229:     className      : p.CharacterClassName,
230:     characterLevel : p.CharacterLevel,
231:     itemAvgLevel   : parseFloat(p.ItemAvgLevel.replace(/,/g, '')),
232:     combatPower    : parseFloat(p.CombatPower.replace(/,/g, '')),
233:     serverName     : p.ServerName,
234:     guildName      : p.GuildName        ?? '',
235:     guildGrade     : p.GuildMemberGrade ?? '',
236:     expeditionLevel: p.ExpeditionLevel,
237:     townLevel      : p.TownLevel,
238:     townName       : p.TownName,
239:     title          : p.Title ?? '없음',
240:     honorLevel     : p.HonorPoint,
241:     characterImage : p.CharacterImage,
242:   };
243: };
244: 
245: // ── 전투 특성 ────────────────────────────────────────────────
246: 
247: export const normalizeCombatStats = (raw: RawCharacterData): CombatStatsDisplay => {
248:   const statsMap = Object.fromEntries(
249:     raw.profile.Stats.map(s => [s.Type, parseInt(s.Value.replace(/,/g, ''))])
250:   );
251:   return {
252:     critical      : statsMap['치명']        ?? 0,
253:     specialization: statsMap['특화']        ?? 0,
254:     swiftness     : statsMap['신속']        ?? 0,
255:     domination    : statsMap['제압']        ?? 0,
256:     endurance     : statsMap['인내']        ?? 0,
257:     expertise     : statsMap['숙련']        ?? 0,
258:     maxHp         : statsMap['최대 생명력'] ?? 0,
259:     attackPower   : statsMap['공격력']      ?? 0,
260:   };
261: };
262: 
263: // ── 전투 장비 ────────────────────────────────────────────────
264: 
265: export const normalizeEquipment = (raw: RawCharacterData): EquipmentDisplay[] => {
266:   const weaponTypes = ['무기', '투구', '상의', '하의', '장갑', '어깨'];
267:   return raw.equipment
268:     .filter(eq => weaponTypes.includes(eq.Type))
269:     .map(eq => {
270:       const tooltip = parseTooltip(eq.Tooltip);
271:       const titleEl = tooltip['Element_001']?.value ?? {};
272:       const tier    = extractItemTier(titleEl.leftStr2 ?? '');
273:       return {
274:         type      : eq.Type,
275:         name      : eq.Name,
276:         icon      : eq.Icon,
277:         grade     : toGradeColoredText(eq.Grade),
278:         refineStep: extractRefineStep(eq.Name),
279:         quality   : titleEl.qualityValue ?? 0,
280:         itemTier  : tier,
281:         setType   : findEquipSetType(eq.Name),
282:         arkPassivePoint: extractArkPassivePoint(tooltip),
283:       };
284:     });
285: };
286: 
287: // ── 악세서리 ────────────────────────────────────────────────
288: 
289: export const normalizeAccessories = (raw: RawCharacterData): AccessoryDisplay[] => {
290:   const accTypes = ['목걸이', '귀걸이', '반지'];
291:   return raw.equipment
292:     .filter(eq => accTypes.includes(eq.Type))
293:     .map(eq => {
294:       const tooltip = parseTooltip(eq.Tooltip);
295:       const titleEl = tooltip['Element_001']?.value ?? {};
296:       const tier    = extractItemTier(titleEl.leftStr2 ?? '');
297: 
298:       // 기본 효과 파싱 (주스탯, 체력)
299:       const baseEffects: AccessoryBaseEffect[] = [];
300:       const baseStr: string = tooltip['Element_004']?.value?.Element_001 ?? '';
301:       baseStr.split(/<br\s*\/?>/i).filter(Boolean).forEach(line => {
302:         const clean = stripHtml(line);
303:         const m     = clean.match(/(힘|민첩|지능|체력)\s*\+(\d+)/);
304:         if (m) {
305:           const isNonMain = line.toLowerCase().includes('#686660');
306:           baseEffects.push({
307:             statType: { text: m[1], color: isNonMain ? '#686660' : undefined },
308:             value   : { value: parseInt(m[2]), color: undefined },
309:           });
310:         }
311:       });
312: 
313:       // 연마 효과 파싱
314:       const polishEffects: AccessoryPolishEffect[] = [];
315:       const polishStr: string = tooltip['Element_006']?.value?.Element_001 ?? '';
316:       polishStr.split(/<br\s*\/?>/i).filter(Boolean).forEach(line => {
317:         const clean     = stripHtml(line);
318:         const labelM    = clean.match(/^([가-힣\s]+)/);
319:         const labelText = labelM ? labelM[1].trim() : clean;
320:         const cv        = toColoredValue(line);
321:         const effectType = detectPolishEffectType(labelText, cv.value);
322: 
323:         polishEffects.push({
324:           label: { text: labelText, color: undefined },
325:           value: cv,
326:           grade: findPolishGrade(effectType, cv.value, cv.color),
327:         });
328:       });
329: 
330:       return {
331:         type         : eq.Type,
332:         name         : eq.Name,
333:         icon         : eq.Icon,
334:         grade        : toGradeColoredText(eq.Grade),
335:         quality      : titleEl.qualityValue ?? 0,
336:         itemTier     : tier,
337:         baseEffects,
338:         polishEffects,
339:         arkPassivePoint: extractArkPassivePoint(tooltip),
340:       };
341:     });
342: };
343: 
344: // ── 팔찌 ────────────────────────────────────────────────────
345: 
346: export const normalizeBracelet = (raw: RawCharacterData): BraceletDisplay | null => {
347:   const bracelet = raw.equipment.find(eq => eq.Type === '팔찌');
348:   if (!bracelet) return null;
349: 
350:   const tooltip   = parseTooltip(bracelet.Tooltip);
351:   const effectStr: string = tooltip['Element_005']?.value?.Element_001 ?? '';
352: 
353:   /** 팔찌 효과 키워드 → { effectType, isFixed } */
354:   const BRACELET_EFFECT_MAP: Record<string, { effectType: string; isFixed: boolean }> = {
355:     '신속'            : { effectType: 'STAT_SWIFT', isFixed: true  },
356:     '특화'            : { effectType: 'STAT_SPEC',  isFixed: true  },
357:     '치명'            : { effectType: 'STAT_CRIT',  isFixed: true  },
358:     '헤드어택'        : { effectType: 'DMG_INC',    isFixed: false },
359:     '치명타 피해'     : { effectType: 'CRIT_DMG',   isFixed: false },
360:     '치명타로 적중 시': { effectType: 'CRIT_DMG_INC', isFixed: false },
361:     '추가 피해'       : { effectType: 'ADD_DMG',    isFixed: false },
362:     '무기 공격력'     : { effectType: 'WEAPON_ATK_C', isFixed: false },
363:   };
364: 
365:   const effects: BraceletEffect[] = effectStr
366:     .split(/<br\s*\/?>/i)
367:     .filter(Boolean)
368:     .map(line => {
369:       const clean    = stripHtml(line);
370:       let effectType = 'UNKNOWN';
371:       let isFixed    = false;
372: 
373:       for (const [key, val] of Object.entries(BRACELET_EFFECT_MAP)) {
374:         if (clean.includes(key)) {
375:           effectType = val.effectType;
376:           isFixed    = val.isFixed;
377:           break;
378:         }
379:       }
380: 
381:       const labelM    = clean.match(/^([^+\d]+)/);
382:       const labelText = labelM ? labelM[1].trim() : clean;
383:       const cv        = toColoredValue(line);
384: 
385:       return {
386:         label  : { text: labelText, color: undefined },
387:         value  : cv,
388:         isFixed,
389:         grade  : isFixed
390:           ? undefined
391:           : findPolishGrade(effectType, cv.value, cv.color),
392:       };
393:     });
394: 
395:   return {
396:     name  : bracelet.Name,
397:     icon  : bracelet.Icon,
398:     grade : toGradeColoredText(bracelet.Grade),
399:     effects,
400:   };
401: };
402: 
403: // ── 어빌리티 스톤 ────────────────────────────────────────────
404: 
405: export const normalizeAbilityStone = (raw: RawCharacterData): AbilityStoneDisplay | null => {
406:   const stone = raw.equipment.find(eq => eq.Type === '어빌리티 스톤');
407:   if (!stone) return null;
408: 
409:   const tooltip        = parseTooltip(stone.Tooltip);
410:   const engravingGroup = tooltip['Element_007']?.value?.Element_000?.contentStr ?? {};
411:   const bonusStr: string = tooltip['Element_006']?.value?.Element_001 ?? '';
412:   const baseAtkBonus   = bonusStr.includes('기본 공격력')
413:     ? extractPercent(bonusStr)
414:     : 0;
415: 
416:   const engravings: AbilityStoneDisplay['engravings'] = [];
417:   let   penalty:    AbilityStoneDisplay['penalty']    = null;
418: 
419:   Object.values(engravingGroup).forEach((item: any) => {
420:     const content: string = item?.contentStr ?? '';
421:     const clean = stripHtml(content);
422:     const m     = clean.match(/\[([^\]]+)\]\s*Lv\.(\d+)/);
423:     if (!m) return;
424:     const name  = m[1];
425:     const level = parseInt(m[2]);
426: 
427:     if (content.toLowerCase().includes('#fe2e2e')) {
428:       penalty = {
429:         name : { text: name, color: '#FE2E2E' },
430:         level: { value: level, color: undefined },
431:       };
432:     } else {
433:       engravings.push({
434:         name : { text: name, color: '#FFFFAC' },
435:         level: { value: level, color: undefined },
436:       });
437:     }
438:   });
439: 
440:   return {
441:     name: stone.Name, icon: stone.Icon,
442:     grade: toGradeColoredText(stone.Grade),
443:     baseAtkBonus, engravings, penalty,
444:   };
445: };
446: 
447: // ── 보주 ────────────────────────────────────────────────────
448: 
449: export const normalizeBoJu = (raw: RawCharacterData): BoJuDisplay | null => {
450:   const boju = raw.equipment.find(eq => eq.Type === '보주');
451:   if (!boju) return null;
452: 
453:   const tooltip   = parseTooltip(boju.Tooltip);
454:   const effectStr: string = tooltip['Element_004']?.value?.Element_001 ?? '';
455:   const seasonM   = effectStr.match(/시즌(\d+)\s*달성\s*최대\s*낙원력\s*:\s*([\d,]+)/);
456: 
457:   return {
458:     name        : boju.Name,
459:     icon        : boju.Icon,
460:     grade       : toGradeColoredText(boju.Grade),
461:     seasonLabel : seasonM ? `시즌${seasonM[1]}` : '',
462:     paradoxPower: seasonM ? parseInt(seasonM[2].replace(/,/g, '')) : 0,
463:   };
464: };
465: 
466: // ── 아바타 ──────────────────────────────────────────────────
467: 
468: export const normalizeAvatars = (raw: RawCharacterData): AvatarDisplay[] => {
469:   const targetTypes = ['무기 아바타', '상의 아바타', '하의 아바타'];
470:   const grouped: Record<string, typeof raw.avatars> = {};
471: 
472:   raw.avatars
473:     .filter(av => targetTypes.includes(av.Type))
474:     .forEach(av => {
475:       if (!grouped[av.Type]) grouped[av.Type] = [];
476:       grouped[av.Type].push(av);
477:     });
478: 
479:   return Object.entries(grouped).map(([type, avatars]) => {
480:     const bonuses = avatars.map(av => {
481:       const tooltip  = parseTooltip(av.Tooltip);
482:       const bonusStr: string = tooltip['Element_005']?.value?.Element_001 ?? '';
483:       return { avatar: av, bonus: bonusStr.includes('%') ? extractPercent(bonusStr) : 0 };
484:     });
485:     const best = bonuses.reduce((a, b) => a.bonus >= b.bonus ? a : b);
486:     return {
487:       type         : type,
488:       name         : best.avatar.Name,
489:       icon         : best.avatar.Icon,
490:       grade        : toGradeColoredText(best.avatar.Grade),
491:       mainStatBonus: best.bonus,
492:     };
493:   });
494: };
495: 
496: // ── 각인 ────────────────────────────────────────────────────
497: 
498: export const normalizeEngravings = (raw: RawCharacterData): EngravingDisplay[] =>
499:   raw.engravings.ArkPassiveEffects.map(eff => ({
500:     name             : { text: eff.Name,  color: '#FFFFAC' },
501:     grade            : toGradeColoredText(eff.Grade),
502:     level            : eff.Level,
503:     abilityStoneLevel: eff.AbilityStoneLevel,
504:     description      : stripHtml(eff.Description),
505:     icon             : '',
506:   }));
507: 
508: // ── 보석 ────────────────────────────────────────────────────
509: 
510: export const normalizeGems = (raw: RawCharacterData): GemSummaryDisplay => {
511:   const gemMap = Object.fromEntries(raw.gems.Gems.map(g => [g.Slot, g]));
512:   const gems: GemDisplay[] = raw.gems.Effects.Skills.map(skill => {
513:     const gem     = gemMap[skill.GemSlot];
514:     const desc    = skill.Description[0] ?? '';
515:     const isDmg   = desc.includes('피해');
516:     const effectValue = extractPercent(desc);
517:     return {
518:       slot        : skill.GemSlot,
519:       level       : gem?.Level  ?? 0,
520:       grade       : toGradeColoredText(gem?.Grade ?? ''),
521:       icon        : gem?.Icon   ?? skill.Icon,
522:       skillName   : { text: skill.Name, color: '#FFD200' },
523:       effectLabel : { text: isDmg ? '피해' : '재사용 대기시간', color: undefined },
524:       effectValue : { value: effectValue, color: isDmg ? '#99ff99' : '#87CEEB' },
525:       baseAtkBonus: extractPercent(skill.Option),
526:     };
527:   });
528:   return {
529:     gems,
530:     totalBaseAtk: { value: extractPercent(raw.gems.Effects.Description), color: '#B7FB00' },
531:   };
532: };
533: 
534: // ── 카드 ────────────────────────────────────────────────────
535: 
536: export const normalizeCards = (raw: RawCharacterData): CardSetDisplay | null => {
537:   if (!raw.cards.Effects?.length) return null;
538:   const effect     = raw.cards.Effects[0];
539:   const totalAwake = raw.cards.Cards.reduce((sum: number, c: any) => sum + c.AwakeCount, 0);
540:   const setNameM   = effect.Items[0]?.Name.match(/^(.+?)\s+\d+세트/);
541: 
542:   const activeItems = effect.Items
543:     .filter(item => {
544:       const awakeM = item.Name.match(/\((\d+)각성합계\)/);
545:       if (!awakeM) {
546:         const setM = item.Name.match(/(\d+)세트$/);
547:         return setM ? totalAwake >= parseInt(setM[1]) * 5 : true;
548:       }
549:       return totalAwake >= parseInt(awakeM[1]);
550:     })
551:     .map(item => ({
552:       name       : item.Name,
553:       description: stripHtml(item.Description),
554:       value      : item.Description.includes('%')
555:         ? toColoredValue(item.Description)
556:         : undefined,
557:     }));
558: 
559:   return {
560:     setName: setNameM ? setNameM[1] : '',
561:     totalAwake,
562:     activeItems,
563:   };
564: };
565: 
566: // ── 아크패시브 ───────────────────────────────────────────────
567: 
568: export const normalizeArkPassive = (raw: RawCharacterData) => {
569:   const p = raw.arkPassive;
570: 
571:   const getPoint = (name: string) => {
572:     const found = p.Points.find(pt => pt.Name === name);
573:     return { value: found?.Value ?? 0, description: found?.Description ?? '' };
574:   };
575: 
576:   const points: ArkPassivePointDisplay = {
577:     evolution: getPoint('진화'),
578:     insight  : getPoint('깨달음'),
579:     leap     : getPoint('도약'),
580:     title    : p.Title,
581:   };
582: 
583:   const PATTERN = /(진화|깨달음|도약)\s+(\d+)티어\s+(.+?)\s+Lv\.(\d+)/;
584: 
585:   const effects: ArkPassiveEffectDisplay[] = p.Effects.map(eff => {
586:     const clean    = stripHtml(eff.Description);
587:     const m        = clean.match(PATTERN);
588:     const ttJson   = parseTooltip(eff.ToolTip);
589:     const descRaw: string = ttJson['Element_002']?.value ?? '';
590:     const desc     = stripHtml(descRaw.split('||')[0]);
591:     const category = m ? m[1] : eff.Name;
592:     return {
593:       category   : { text: category, color: ARK_PASSIVE_COLORS[category] },
594:       name       : { text: m ? m[3] : clean, color: undefined },
595:       tier       : m ? parseInt(m[2]) : 0,
596:       level      : m ? parseInt(m[4]) : 0,
597:       description: desc,
598:       icon       : eff.Icon,
599:     };
600:   });
601: 
602:   return { points, effects };
603: };
604: 
605: // ── 아크그리드 ───────────────────────────────────────────────
606: 
607: export const normalizeArkGrid = (raw: RawCharacterData): ArkGridDisplay => {
608:   const cores = raw.arkGrid.Slots.map(slot => ({
609:     index: slot.Index,
610:     name : { text: slot.Name,   color: GRADE_COLORS[slot.Grade] },
611:     point: { value: slot.Point, color: '#B7FB00' as string | undefined },
612:     grade: toGradeColoredText(slot.Grade),
613:     icon : slot.Icon,
614:   }));
615: 
616:   const effects = raw.arkGrid.Effects.map(eff => ({
617:     label: { text: eff.Name, color: undefined as string | undefined },
618:     level: eff.Level,
619:     value: { value: extractPercent(eff.Tooltip), color: extractColor(eff.Tooltip) },
620:   }));
621: 
622:   return { cores, effects };
623: };
624: 
625: // ── 스킬 ────────────────────────────────────────────────────
626: 
627: export const normalizeSkills = (raw: RawCharacterData): SkillDisplay[] => {
628:   const gemSkillNames = raw.gems.Effects.Skills.map(s => s.Name);
629: 
630:   const isSkillUsed = (skill: typeof raw.skills[0]): boolean => {
631:     if (skill.SkillType === 100 || skill.SkillType === 101) return true;
632:     if (skill.Level >= 4 || skill.Rune !== null) return true;
633:     return gemSkillNames.some(
634:       name => skill.Name.includes(name) || name.includes(skill.Name)
635:     );
636:   };
637: 
638:   return raw.skills.filter(isSkillUsed).map(skill => {
639:     const tooltip      = parseTooltip(skill.Tooltip);
640:     const titleEl      = tooltip['Element_001']?.value ?? {};
641:     const levelStr     : string = titleEl.level ?? '';
642:     const categoryM    = levelStr.match(/\[([^\]]+)\]/);
643:     const categoryText = categoryM ? categoryM[1] : '일반 스킬';
644: 
645:     const selectedTripods: SelectedTripodDisplay[] = skill.Tripods
646:       .filter(t => t.IsSelected)
647:       .map(t => ({
648:         tier: t.Tier,
649:         slot: t.Slot,
650:         name: { text: t.Name, color: '#FFBB63' },
651:         icon: t.Icon,
652:       }));
653: 
654:     const rune: EquippedRuneDisplay | null = skill.Rune ? {
655:       name : { text: skill.Rune.Name,  color: GRADE_COLORS[skill.Rune.Grade] },
656:       grade: toGradeColoredText(skill.Rune.Grade),
657:       icon : skill.Rune.Icon,
658:     } : null;
659: 
660:     return {
661:       name           : skill.Name,
662:       icon           : skill.Icon,
663:       level          : skill.Level,
664:       type           : skill.Type,
665:       skillType      : skill.SkillType,
666:       category       : { text: categoryText, color: SKILL_CATEGORY_COLORS[categoryText] },
667:       isUsed         : true,
668:       selectedTripods,
669:       rune,
670:     };
671:   });
672: };
673: 
674: 
675: // ============================================================
676: // 최상위 통합
677: // ============================================================
678: 
679: export const normalizeCharacter = (raw: RawCharacterData): CharacterDisplayData => ({
680:   profile     : normalizeProfile(raw),
681:   combatStats : normalizeCombatStats(raw),
682:   equipment   : normalizeEquipment(raw),
683:   accessories : normalizeAccessories(raw),
684:   bracelet    : normalizeBracelet(raw),
685:   abilityStone: normalizeAbilityStone(raw),
686:   boJu        : normalizeBoJu(raw),
687:   avatars     : normalizeAvatars(raw),
688:   engravings  : normalizeEngravings(raw),
689:   gems        : normalizeGems(raw),
690:   cards       : normalizeCards(raw),
691:   arkPassive  : normalizeArkPassive(raw),
692:   arkGrid     : normalizeArkGrid(raw),
693:   skills      : normalizeSkills(raw),
694: });
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
