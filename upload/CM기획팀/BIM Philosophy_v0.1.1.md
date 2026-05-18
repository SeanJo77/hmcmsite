# ▢ BIM Philosophy (정보관리 철학 및 원칙)
*버전: v0.1.1*

본 문건은 토목 인프라 시설물의 생애주기 전반에 걸친 정보관리 체계 구축을 위해, 국제 표준(ISO)에 기반한 원칙과 이를 구현하기 위한 구체적인 실행 가이드라인을 정의합니다.

---

## 1. BIM 및 DX의 정의 (Definition of BIM/DX)

> **[Standard Reference]**
> *“Use of a shared digital representation of a built asset to facilitate design, construction and operation processes to form a reliable basis for decisions.”*
> — **ISO 19650-1:2018, Clause 3.3.14** (BIM의 정의)

> **[Implementation Principle]**
> BIM은 단순한 3D CAD(Computer-Aided Design) 도메인이 아니라, 의사결정의 신뢰도를 높이기 위한 **'정보관리 체계(Information Management)'** 로 정의됩니다. 더 나아가 인프라 시설의 성공적인 디지털 전환(DX)은 단일 시설물의 폐쇄적 형상 정보(BIM)에 국한되지 않고, 수십 킬로미터에 달하는 광역의 지리적·공간적 맥락(**GIS**)과의 완벽한 융합을 바탕으로 완성됩니다.

---

## 2. 토목 BIM의 수행 목적 (BIM Statement)

> **[Standard Reference]**
> *“The concepts and principles contained in this document are aimed at enabling the business outcomes of the appointing party to be achieved (...) The greatest value from information management is achieved when the information is used to manage risks and improve the efficiency and effectiveness of the operational phase.”*
> — **ISO 19650-1:2018, Introduction**

> **[Implementation Principle]**
> 투입된 모델링 업무의 유용성은 시공 단계에서의 간섭 검토용으로 한정되지 않습니다. 정보 모델링의 궁극적 당위성은 건설 과정(PIM)에서 생성된 데이터를 유실 없이 보존하여 자산 운영 환경(AIM)을 위한 기반(Database)을 마련하는 데 있습니다. 즉, 시설물의 완공 시점에서 정보가 소멸되지 않고 장기적인 디지털 트윈(Digital Twin) 자산으로 전환되게 하는 것이 가장 중요한 목적입니다.

---

## 3. 정보 관리 수행 조건 (Execution Conditions)

본 과업은 필리핀 정부령 SO58(2025)에 명시된 3대 목표(투명성, 효율성, 기술적 정확성)를 완벽히 준수하기 위해 아래의 정보관리 원칙을 시스템적으로 강제합니다.

> **[Standard Reference]**
> *“Information containers should be managed using a common data environment (CDE) workflow (...) to share and approve information in a collaborative manner.”*
> — **ISO 19650-2:2018, Clause 5** (정보관리 프로세스)

> **[Implementation Guidelines]**
> *   **Transparency (투명성)**: 모든 데이터는 4단계 상태(WIP, Shared, Published, Archive) 관리가 강제된 CDE 워크플로 안에서 유통되어야 합니다. 특히 설계 변경(VO) 발생 시, 변경 이전과 이후의 모델이 CDE 플랫폼 내에서 비교·추적되어 물량의 변동 내역이 임의적 개입 없이 투명하게 검증되어야 합니다.
> *   **Efficiency (효율성)**: 불필요한 과잉 모델링 작업(낭비)을 지양합니다. 타당성 조사부터 상세설계 분기까지 각 의사결정 시점에 필요한 최소한의 공학적 모델링 수준만을 엄격히 통제하여 자원의 오용을 차단합니다.
> *   **Technical Accuracy (기술적 정확성)**: 토목 인프라는 형상을 시각적으로 '그려내는' 대상이 아니라, 지반 및 하중 특성에 따른 공학적 파라미터가 '연산'되는 대상입니다. 따라서 범용 건축 S/W의 무리한 활용을 거부하고, 토목 인프라 고유의 설계 기준(Design Codes)이 내장된 시설물별 전용 소프트웨어를 통해 기술적 무결성을 확보합니다.

---

## 4. 시스템(S/W) 구축의 지향점 및 접근권 (Data Accessibility)

> **[Standard Reference]**
> *“The appointing party should establish the rules for intellectual property rights (...) Information models should be developed using open data formats to ensure long-term accessibility and interoperability.”*
> — **ISO 19650-1:2018, Clause 12.4 및 ISO 16739-1**

> **[Implementation Principle: Data Availability over Ownership]**
> 특정 글로벌 S/W 라이선스가 없으면 열 수조차 없는 상업용 네이티브 파일을 법적으로 소유(Ownership)하는 것은 실효성이 없습니다. 시스템 구축의 최우선 목적은 발주자가 언제 어떠한 제약 없이도 정보에 접근할 수 있도록 하는 **'실효적 접근권(Accessibility)'** 의 쟁취입니다.
> 
> 이를 위해 특정 벤더에 발주처의 자산 데이터가 영구 종속되는 **기술 예속(Technological Lock-in)** 현상을 원천 차단합니다. 결과물 제출 시 시행자는 라이선스 비용이 없는 전용 뷰어를 발주처에 무상 제공하여 접근권을 보장해야 하며, 이와 동시에 특정 벤더에 묶이지 않는 **범용 포맷(모델의 경우 IFC, obj 등 / 데이터의 경우 JSON 등 다양한 Open Format 지원)** 으로의 이중 제출을 의무화합니다. 이를 통해 발주자의 영구적 자산 열람권과 시행자의 고유 지적재산권(IP) 보호라는 상충 문제를 동시에 해결합니다.

---

## 5. 정보 요구사항 및 이관 범위 (Information Requirements & Handover)

> **[Standard Reference]**
> *“Level of information need shall be specified using three metrics: geometrical information, alphanumerical information and documentation.”*
> — **ISO 7817-1:2024** (정보 요구수준 구성 체계)
> 
> *“The transition from a project information model to an asset information model is subject to authorization to ensure that only approved and validated information is transferred.”*
> — **ISO 19650-3:2020, Clause 5.5**

> **[Implementation Guidelines]**
> *   **LOIN 기반의 3축 독립 제어**: 기존 일원화된 그래픽 상세도(LOD) 요구의 한계를 벗어나, 기하학적 형태(Geometry)와 속성(Alphanumeric), 그리고 첨부 문서(Documentation)의 수준을 각기 달리하여 명세합니다.
> *   **선택적 이관(Selective Handover)**: 준공 후 유지관리를 위해 필요한 것은 거대한 시공용 3D 형상 데이터가 아닙니다. CDE로 수집된 방대한 프로젝트 정보(PIM) 전체 중 유지관리에 실질적으로 필요한 핵심 속성(예: 자재 스펙, 보수 연한 등)만을 선별 및 필터링하여 O&M 목적에 정렬된 데이터베이스 형태의 자산 정보(AIM)로 압축 및 이관하는 체계가 필수적으로 수반되어야 합니다.
