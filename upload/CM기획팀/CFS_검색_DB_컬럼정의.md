# CFS 검색 DB 컬럼 정의

## 검색 기준

- 검색창은 선택된 날짜와 선택된 공구의 작업 데이터 안에서만 검색

## 검색 대상 컬럼

| 구분         | 테이블                       | 컬럼                       | 의미                    |
| ---------- | ------------------------- | ------------------------ | --------------------- |
| 공구         | `tb_it_daily_data`        | `proj_cd`                | 공구 정보                 |
| 공종         | `tb_it_daily_data`        | `process_name`           | 공종명                   |
| 작업 위치      | `tb_it_daily_data`        | `station`                | STA 위치                |
| 위치명 1      | `tb_it_daily_data`        | `location1`              | 위치명                   |
| 위치명 2      | `tb_it_daily_data`        | `location2`              | 위치명                   |
| 위치명 3      | `tb_it_daily_data`        | `location3`              | 위치명                   |
| STA 구간     | `tb_it_daily_data`        | `location_station_range` | STA 범위                |
| 작업 내용      | `tb_it_daily_data`        | `work_content`           | 작업 내용                 |
| 위험등급       | `tb_it_daily_data`        | `rate`                   | S/A/B/C 등급            |
| 주/야간 구분    | `tb_it_daily_data`        | `day_night`              | 야간 작업 포함 여부 검색        |
| CCTV 정보/상태 | `tb_it_daily_data`        | `cctv_text`              | CCTV 설치 유무, 상태, 명칭 검색 |
| 관리자 역할     | `tb_it_daily_data_admin`  | `position`               | 작업지휘자 / 신호수 등         |
| 관리자 이름/연락처 | `tb_it_daily_data_admin`  | `name`                   | 이름, 업체, 전화번호 포함       |
| 인원 역할      | `tb_it_daily_data_person` | `input_type`             | 보통인부 / 신호수 / 기능공 등    |
| 장비 종류      | `tb_it_daily_data_equip`  | `input_type`             | B/H, D/T, 크레인 등       |
| 장비 상세 규격   | `tb_it_daily_data_equip`  | `detail_spec`            | 0.6W, 25ton 등 규격 검색   |
| 검증 위치      | `tb_it_daily_location`    | `location_validated`     | 검증된 위치명               |
