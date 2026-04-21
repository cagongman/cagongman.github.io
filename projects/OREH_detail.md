# OREH (오레)

> **1919년 파리위원부 서기장 황기환의 외교 활동을 모티브로 한 Unity 기반 모바일 스토리·퀴즈·AR 방탈출 게임**

---

## 📌 프로젝트 개요

| 항목 | 내용 |
|---|---|
| **장르** | 스토리 · 퀴즈 · AR 방탈출 (모바일) |
| **플랫폼** | Android / iOS |
| **개발 환경** | Unity 2022.3.28f1 LTS / C# |
| **백엔드** | Firebase Realtime Database |
| **AR** | AR Foundation 5.1 (ARCore / ARKit) |

플레이어는 1919년 파리위원부 서기장 황기환이 되어 외교 문서를 해독하며 역사를 체험한다. 각 스테이지는 **스토리 → 퀴즈 → AR 이미지 인식** 흐름으로 구성되며, 현실의 포토카드를 카메라로 비추면 단서가 증강되어 나타난다. 현재 1챕터(5스테이지) 완성, 6챕터 27스테이지 확장을 상정하고 설계했다.

---

## 🧱 아키텍처

```
┌─────────────────────────────────────────────────┐
│  Managers (Service Locator)                      │
│  Resource · Scene · UI · Firebase · Data         │
└──────────────┬──────────────────────────────────┘
               │
       ┌───────┴────────┐
  Scene_Base         UI_Base
  (Template Method)  (Bind<T> enum 바인딩)
       │                │
  Scene_Game        UI_Scene / UI_Popup (Stack)
  [State 패턴]      UI_Alert / UI_Transition
  ┌────┴──────┐
Story  Quiz  AR
State  State State
```

### Service Locator — `Managers.cs`
`Managers.Resource / Scene / UI / Firebase / Data` 를 정적 프로퍼티로 노출하는 중앙 허브. `DontDestroyOnLoad` 로 씬 전환 후에도 유지되며, 초기화는 `Task.WhenAll` 로 병렬 실행해 콜드 스타트를 단축한다.

### State 패턴 — `Scene_Game` + `States/`
단일 `Scene_Game`이 JSON의 `stageType`을 읽어 `StoryState / QuizState / ARState`로 전환한다. 스테이지마다 씬 스크립트를 추가하지 않고, 6챕터 27스테이지 전체를 하나의 클래스로 처리한다.

```csharp
public void Init() {
    var data = Managers.Data.GetCurrentStageData();
    TransitionTo(data.StageType switch {
        StageType.Story => new StoryState(),
        StageType.Quiz  => new QuizState(),
        StageType.AR    => new ARState(),
        _ => throw new ArgumentOutOfRangeException()
    });
}
```

### Bind\<T\>(enum) — `UI_Base`
enum 이름과 동일한 자식 GameObject를 리플렉션으로 자동 매칭한다. SerializeField 드래그 누락으로 인한 NPE를 원천 차단하고, **enum이 곧 하이어라키 계약**이 된다.

### UI Stack — `UIManager`
`Stack<UI_Popup>` LIFO 관리 + 팝업이 쌓일수록 `sortingOrder` 자동 증가. `Peek` 검증으로 역순 Close를 거부한다.

---

## 🔑 핵심 구현

**Data-Driven 스테이지 구조** — `OREH_Data.json` 한 줄 추가로 신규 스테이지 확장. `stageType` 필드가 State 패턴의 초기 상태를 결정한다.

```json
{ "stage": "1_4", "answer": "blue", "stageType": "Quiz" }
```

**씬 전환 크로스페이드** — `UI_Transition`이 `DontDestroyOnLoad`로 씬 경계를 넘어 생존하며, 페이드 인 상태에서 씬이 로드되고 이어서 페이드 아웃. 로딩 번쩍임(flash) 없음.

**스테이지 랩타이머** — 전역 누적 타이머에서 직전 완료 시점을 빼는 차분 방식. 별도 상태 없이 각 스테이지 소요 시간을 Firebase에 기록한다.

**AR 지연 활성화** — `UI_CameraPopup` 오픈 시점에만 `XRController`를 Instantiate해 상시 세션 유지로 인한 발열·배터리 이슈를 회피한다.

---

## 🧾 회고

### ✅ 잘된 점

- **State + Data-Driven 조합** — 단일 `Scene_Game`과 JSON 데이터로 27스테이지 전체를 처리하도록 설계해, 스테이지 추가 시 코드를 건드리지 않는다.
- **enum 바인딩** — 컴파일 타임에 UI 참조 계약이 고정되어 런타임 NPE 제로.
- **비동기 병렬 초기화** — Firebase/JSON 파싱을 `Task.WhenAll`로 동시 수행해 초기 로딩 단축.
- **팝업 스택 z-order 자동 관리** — sortingOrder 자동 증가 + Peek 검증으로 레이어 뒤섞임 차단.

### ⚠️ 아쉬운 점

- **정답 검증 규칙이 UI에 산재** — 한글 정답은 원문 비교, 영문 정답은 `ToLower()` 처리가 `UI_QuizScene` 안에 직접 하드코딩되어 있다. 퀴즈 형식이 늘어날수록 UI 코드가 오염될 구조.
- **트랜지션 중 입력 락 없음** — 페이드 진행 중 버튼 연타 시 다중 `LoadScene` 가능. `bool _isTransitioning` 가드 하나로 해결 가능한 누락.
- **`async void` 버튼 핸들러** — 다중 클릭 시 중복 Firebase 요청 발생. `_isProcessing` 플래그 + `try/finally` 패턴이 필요했다.

### 💭 다음에 적용하고 싶은 것 — Strategy 패턴

정답 검증 규칙이 UI에 하드코딩된 문제는 **Strategy 패턴**으로 깔끔하게 풀 수 있다. `IAnswerValidator` 인터페이스를 두고 `ExactMatchValidator` / `CaseInsensitiveValidator`를 분리하면, `UI_QuizScene`은 어떤 규칙이 적용되는지 알 필요 없이 `_validator.Validate(input, answer)`만 호출하면 된다. 새로운 퀴즈 형식이 추가되어도 UI 코드는 전혀 건드리지 않는다.
