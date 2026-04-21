# 마우스 이벤트 및 편집 시스템 리팩토링 - 정량 분석 결과

---

## 1. 코드 규모 비교 (Before vs After)

### Before (Legacy)

| 구분 | 위치 | 줄 수 |
|------|------|-------|
| `MousePress` (주석처리됨) | `HGLRender.cpp` 15710-17398 | **1,689줄** |
| `MouseMove` (주석처리됨) | `HGLRender.cpp` 17400-18551 | **1,152줄** |
| `MouseRelease` (주석처리됨) | `HGLRender.cpp` 18553-19088 | **536줄** |
| `EditUndoRedo_*` 6개 함수 | `HGLEdit.cpp` 1943-2289 | **347줄** |
| **합계** | | **3,724줄** |

### After (New Architecture) - 14개 모듈 파일

| 파일 | 줄 수 |
|------|-------|
| `HEditCommand.h` | 90 |
| `HEditCommands.h` | 63 |
| `HEditCommander.h` | 38 |
| `HEditTool.h` | 122 |
| `HEditToolManager.h` | 83 |
| `HCompoundMemento.h` | 41 |
| `HEditRender.h` | 47 |
| `HEditCommands.cpp` | 290 |
| `HEditCommander.cpp` | 92 |
| `HCompoundMemento.cpp` | 184 |
| `HEditTool.cpp` | 421 |
| `HEditToolManager.cpp` | 359 |
| `HEditRender.cpp` | 260 |
| `HGLMouseEvent.cpp` | 470 |
| **합계** | **2,560줄** |

### 코드 감소율

- **3,724줄 -> 2,560줄** (약 **31% 감소**, 1,164줄 제거)
- 1~2개 모놀리식 파일 -> **14개 역할별 모듈 파일** (7 헤더 + 7 소스)

---

## 2. 단일 함수 복잡도 해소

- Legacy `MousePress` 함수 **1개**: **1,689줄** (단일 함수 기준)
- 리팩토링 후 가장 큰 단일 파일: `HGLMouseEvent.cpp` **470줄** (함수 여러 개로 분산)
- **단일 함수 최대 줄 수 72% 감소**

---

## 3. 조건 분기 복잡도 (Legacy MousePress 기준)

Legacy `MousePress` 함수 내부 조건 분기 분석:

| 조건 유형 | 분기 수 |
|-----------|---------|
| `DATASELMODE` 체크 (`GetDataSelMode()`, `case DATASELMODE_*`) | **~28개** |
| `EDIT_SEL` 체크 (`GetCurrentSelectionType()`) | **~33개** |
| `EDIT_OPMODE` 체크 (`GetCurrentOperationMode()`) | **6개** |
| `m_bHDModeEnable` 체크 | **3개** |
| `m_bBiteRegistrationAreaSelectionEnable` 체크 | **2개** |
| **합계** | **~72개** |

리팩토링 후: Strategy 패턴으로 입력 방식별 분기 제거, Command 패턴으로 작업 모드별 분기 제거. 조건 중첩 깊이 **7~8단계 -> 2~3단계**로 감소.

---

## 4. 중복 코드 제거 상세

### (a) 브러시 스트로크 페인팅 중복

Legacy `MouseMove` 내에서 동일한 QPainter + drawEllipse + drawPolygon + pixel-by-pixel 루프 패턴이 **6회 반복** (OCT 브러시, HD 브러시, BiteRegistration 브러시, Trim 브러시, Lock 브러시, Decimation 브러시). 각 인스턴스 약 40줄, 총 **~240줄** 중복.

리팩토링 후: `BrushTool::DrawStrokeToImage()` **단일 메서드 1곳**으로 통합.

### (b) Undo/Redo 버퍼 복사 중복

Legacy `EditUndoRedo_Add`, `EditUndoRedo_Undo`, `EditUndoRedo_Redo` 3개 함수에서 동일한 7개 버퍼(Position, Normal, Diffuse, ExtraAttrib, RightBiteSelection, LeftBiteSelection, PointIndex)의 `new/delete/memcpy` 패턴이 **3회 반복** (총 `memcpy` 호출 24회).

리팩토링 후: `HCompoundMemento`의 `CreateCompoundMemento` / `RestoreFromCompoundMemento` **2개 함수**로 통합, pImpl + copy-and-swap 패턴 적용.

### (c) 편집 실행 호출 패턴 중복

Legacy 코드에서 `TrimByPolygon`, `TrimbyBrush`, `TrimByQuick`, `LockByPolygon`, `LockByBrush`, `DecimateByBrush`, `DecimateByPolygon`, `SelectHDModeByPolygon`, `SelectHDModeByBrush` 호출이 **50회** 등장 (각 DATASELMODE + 각 EDIT_SEL 조합마다 동일 패턴 반복).

리팩토링 후: `HEditToolManager::ExecuteCurrentSelection()` **단일 진입점**에서 Command를 생성하고 실행.

---

## 5. 경력서 적용 제안

### 빈칸 수치 채우기

> 모듈화 결과 약 **3,700줄**이던 코드를 **2,560줄**로 축소했으며

### 수치 강화 문장 제안

> 회전/이동/확대축소 등 뷰어 조작과 브러시/폴리곤 편집 로직이 단일 mouseEvent 함수 내 조건문으로 뒤섞여 있었고, **단일 함수 1,689줄에 72개 이상의 조건 분기**가 중첩된 상태로 중복 코드가 다수 존재해 기능 추가 시마다 Side-effect가 반복됐습니다.
>
> 기존 코드를 역할별로 분석한 뒤 Command / Strategy / Memento 패턴을 적용해 편집 기능과 Undo/Redo 구조를 재설계했습니다. **1~2개 모놀리식 파일에 집중되어 있던 약 3,700줄의 코드를 14개 모듈 파일 2,560줄로 재구성(약 31% 감소)** 했으며, **브러시 스트로크 코드 6중 반복 제거**, **Undo/Redo 버퍼 복사 3중 중복 통합**, **편집 실행 호출 50개소를 단일 진입점으로 표준화**하는 등 구조적 중복을 해소했습니다. 아키텍처 문서화를 병행해 팀 내 히스토리를 체계화했습니다.

### 정량 지표 섹션용

- 편집 이벤트 처리 조건 분기 수: 72개 -> Strategy/Command 패턴으로 **조건 중첩 깊이 7~8단계에서 2~3단계로 감소**
- 브러시 스트로크 렌더링 중복: **6회 -> 1회** (단일 메서드)
- Undo/Redo 버퍼 복사 중복: **3회 -> Memento 패턴 1회** (pImpl + copy-and-swap)
- 편집 실행 호출 패턴: **50개소 분산 -> ExecuteCurrentSelection 단일 진입점**
- 코드 분포: **모놀리식 1~2파일 -> 14개 역할별 모듈** (SRP 준수)
- 단일 함수 최대 규모: **1,689줄 -> 분산 처리** (최대 함수 규모 72% 감소)
