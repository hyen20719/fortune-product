/**
 * 사주명리 - 정통 사주팔자 분석 시스템
 * 천간(天干), 지지(地支), 오행(五行) 기반 운세 분석
 */

document.addEventListener('DOMContentLoaded', () => {
    // ===== 사주 데이터 정의 =====

    // 천간 (天干) - 10개
    const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    const CHEONGAN_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

    // 지지 (地支) - 12개
    const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
    const JIJI_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const JIJI_ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

    // 오행 (五行)
    const OHANG = {
        wood: { name: '목(木)', color: '#228B22', traits: '성장, 창의, 인자' },
        fire: { name: '화(火)', color: '#DC143C', traits: '열정, 예의, 활력' },
        earth: { name: '토(土)', color: '#DAA520', traits: '신뢰, 안정, 중용' },
        metal: { name: '금(金)', color: '#C0C0C0', traits: '결단, 의리, 정의' },
        water: { name: '수(水)', color: '#1E90FF', traits: '지혜, 유연, 침착' }
    };

    // 천간의 오행
    const CHEONGAN_OHANG = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];

    // 지지의 오행
    const JIJI_OHANG = ['water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water'];

    // 시간별 지지
    const HOUR_JIJI = [
        { start: 23, end: 1, jiji: 0 },   // 자시
        { start: 1, end: 3, jiji: 1 },    // 축시
        { start: 3, end: 5, jiji: 2 },    // 인시
        { start: 5, end: 7, jiji: 3 },    // 묘시
        { start: 7, end: 9, jiji: 4 },    // 진시
        { start: 9, end: 11, jiji: 5 },   // 사시
        { start: 11, end: 13, jiji: 6 },  // 오시
        { start: 13, end: 15, jiji: 7 },  // 미시
        { start: 15, end: 17, jiji: 8 },  // 신시
        { start: 17, end: 19, jiji: 9 },  // 유시
        { start: 19, end: 21, jiji: 10 }, // 술시
        { start: 21, end: 23, jiji: 11 }  // 해시
    ];

    // 일주별 성격 해석
    const ILJU_PERSONALITY = {
        '갑자': { title: '큰 바다의 소나무', traits: ['리더십이 강함', '독립적 성향', '큰 포부를 가짐'], icon: '🌲' },
        '갑인': { title: '산속의 대나무', traits: ['곧은 성품', '정직하고 강직함', '끈기가 있음'], icon: '🎋' },
        '갑진': { title: '용을 타고 나는 나무', traits: ['야망이 크고 진취적', '변화를 두려워하지 않음', '큰 성취 가능'], icon: '🐉' },
        '갑오': { title: '태양 아래 푸른 나무', traits: ['밝고 긍정적', '사교성이 좋음', '에너지가 넘침'], icon: '☀️' },
        '갑신': { title: '바위 위의 소나무', traits: ['강인한 정신력', '원칙주의자', '끈기와 인내심'], icon: '🏔️' },
        '갑술': { title: '산에 뿌리내린 나무', traits: ['안정감 추구', '신중한 성격', '책임감이 강함'], icon: '⛰️' },
        '을축': { title: '봄을 기다리는 새싹', traits: ['인내심이 강함', '때를 기다릴 줄 앎', '꾸준함'], icon: '🌱' },
        '을묘': { title: '봄날의 꽃', traits: ['부드럽고 온화함', '예술적 감각', '섬세한 감수성'], icon: '🌸' },
        '을사': { title: '뜨거운 열정의 풀', traits: ['열정적이고 적극적', '도전정신', '빠른 판단력'], icon: '🔥' },
        '을미': { title: '정원의 화초', traits: ['조화로운 성격', '협동심이 좋음', '평화를 추구'], icon: '🌷' },
        '을유': { title: '가을 들판의 풀', traits: ['실용적 사고', '현실감각이 뛰어남', '결과 중시'], icon: '🍂' },
        '을해': { title: '물가의 버드나무', traits: ['유연한 적응력', '감성이 풍부함', '예술적 재능'], icon: '🌊' },
        '병자': { title: '겨울밤의 태양', traits: ['내면의 강한 열정', '겉과 속이 다름', '깊은 사색'], icon: '🌅' },
        '병인': { title: '새벽을 여는 태양', traits: ['활력이 넘침', '진취적 기상', '리더의 자질'], icon: '🌄' },
        '병진': { title: '용과 함께하는 빛', traits: ['카리스마가 있음', '큰 포부', '사람들의 주목을 받음'], icon: '✨' },
        '병오': { title: '한낮의 태양', traits: ['강렬한 에너지', '정의감이 강함', '솔직담백'], icon: '🌞' },
        '병신': { title: '저녁노을', traits: ['성숙한 매력', '깊은 통찰력', '경험에서 배움'], icon: '🌇' },
        '병술': { title: '모닥불의 온기', traits: ['따뜻한 마음', '가정적', '사람들을 모으는 힘'], icon: '🔥' },
        '정축': { title: '촛불의 빛', traits: ['섬세하고 따뜻함', '헌신적', '작은 것에서 행복 발견'], icon: '🕯️' },
        '정묘': { title: '봄날의 등불', traits: ['희망을 주는 사람', '밝은 성격', '주변을 밝힘'], icon: '💡' },
        '정사': { title: '활활 타오르는 불꽃', traits: ['열정과 추진력', '결단력', '승부욕이 강함'], icon: '🔥' },
        '정미': { title: '난로의 온기', traits: ['안정감을 주는 사람', '포근한 성격', '가정적'], icon: '🏠' },
        '정유': { title: '등대의 불빛', traits: ['방향을 제시함', '지혜로운 조언', '신뢰감'], icon: '🗼' },
        '정해': { title: '달빛 아래 촛불', traits: ['낭만적 성향', '감수성이 예민', '예술적 재능'], icon: '🌙' },
        '무자': { title: '겨울 산의 대지', traits: ['묵묵히 견디는 힘', '인내와 지구력', '믿음직함'], icon: '🏔️' },
        '무인': { title: '봄산의 토양', traits: ['생명력을 키우는 힘', '포용력', '너그러움'], icon: '🌿' },
        '무진': { title: '큰 산과 용', traits: ['권위와 위엄', '큰 그릇', '리더십'], icon: '🏯' },
        '무오': { title: '뜨거운 사막의 땅', traits: ['열정적 추진력', '목표 지향적', '강한 의지'], icon: '🏜️' },
        '무신': { title: '바위산', traits: ['굳건한 신념', '변치 않는 원칙', '강인함'], icon: '🗿' },
        '무술': { title: '평원의 대지', traits: ['안정과 평화', '중재 능력', '조화를 추구'], icon: '🌾' },
        '기축': { title: '비옥한 논밭', traits: ['풍요를 가져다 줌', '실속 있는 성격', '근면함'], icon: '🌾' },
        '기묘': { title: '화단의 흙', traits: ['아름다움을 키움', '예술적 감각', '섬세함'], icon: '🌺' },
        '기사': { title: '화산의 토양', traits: ['변화의 에너지', '창조적 파괴', '혁신'], icon: '🌋' },
        '기미': { title: '정원의 흙', traits: ['조화와 균형', '실용적 사고', '꾸준함'], icon: '🏡' },
        '기유': { title: '가을 논의 흙', traits: ['결실을 맺는 힘', '성과 중시', '완성을 향함'], icon: '🍇' },
        '기해': { title: '강가의 흙', traits: ['유연한 적응력', '변화에 열림', '새로운 시작'], icon: '🏞️' },
        '경자': { title: '겨울 강물 속 쇠', traits: ['냉철한 판단력', '날카로운 지성', '분석력'], icon: '🧊' },
        '경인': { title: '봄날의 보검', traits: ['강직하고 곧음', '정의를 추구', '용맹함'], icon: '⚔️' },
        '경진': { title: '용의 비늘', traits: ['화려함과 권위', '강한 카리스마', '성공 지향'], icon: '🐲' },
        '경오': { title: '달군 쇠', traits: ['열정과 추진력', '변화를 이끌어냄', '행동력'], icon: '🔨' },
        '경신': { title: '날카로운 칼날', traits: ['결단력', '명확한 판단', '완벽주의'], icon: '🗡️' },
        '경술': { title: '땅에 묻힌 보물', traits: ['숨은 재능', '인내심', '때를 기다림'], icon: '💎' },
        '신축': { title: '겨울의 보석', traits: ['내면의 빛', '인내하며 빛남', '가치를 아는 눈'], icon: '💠' },
        '신묘': { title: '봄날의 장신구', traits: ['아름다움 추구', '세련된 감각', '예술적'], icon: '✨' },
        '신사': { title: '불에 단련된 금', traits: ['강인한 정신', '시련을 이겨냄', '성장'], icon: '🔥' },
        '신미': { title: '조각가의 작품', traits: ['완성도 추구', '디테일 중시', '장인정신'], icon: '🎨' },
        '신유': { title: '완벽한 보석', traits: ['빛나는 재능', '인정받는 힘', '성공'], icon: '💍' },
        '신해': { title: '바닷속 진주', traits: ['숨은 가치', '깊은 내면', '진정성'], icon: '🦪' },
        '임자': { title: '겨울 바다', traits: ['깊고 넓은 포용력', '지혜의 바다', '무한한 가능성'], icon: '🌊' },
        '임인': { title: '봄비', traits: ['생명을 키우는 힘', '부드러운 영향력', '성장 촉진'], icon: '🌧️' },
        '임진': { title: '용이 사는 바다', traits: ['큰 꿈과 포부', '무한한 잠재력', '성취 가능성'], icon: '🐉' },
        '임오': { title: '여름 소나기', traits: ['시원한 해결사', '적극적 행동', '즉각적 반응'], icon: '⛈️' },
        '임신': { title: '맑은 계곡물', traits: ['깨끗한 정신', '명료한 사고', '청렴함'], icon: '💧' },
        '임술': { title: '저수지', traits: ['자원을 모으는 힘', '계획성', '미래 대비'], icon: '🏞️' },
        '계축': { title: '겨울 논의 물', traits: ['잠재력을 키움', '때를 기다림', '내실을 다짐'], icon: '❄️' },
        '계묘': { title: '이슬', traits: ['섬세한 감수성', '순수함', '맑은 영혼'], icon: '💧' },
        '계사': { title: '온천수', traits: ['치유의 힘', '따뜻한 마음', '회복력'], icon: '♨️' },
        '계미': { title: '우물물', traits: ['깊은 지혜', '사람들을 살림', '봉사정신'], icon: '⛲' },
        '계유': { title: '가을비', traits: ['정화의 힘', '새로운 시작 준비', '마무리 능력'], icon: '🌧️' },
        '계해': { title: '큰 강', traits: ['무한한 흐름', '멈추지 않는 진행', '대세를 따름'], icon: '🌊' }
    };

    // 운세 메시지
    const FORTUNE_MESSAGES = {
        overall: [
            '올해는 새로운 기회가 열리는 시기입니다. 그동안 준비해온 일들이 빛을 발할 때이니, 자신감을 갖고 도전하세요.',
            '변화와 성장의 해입니다. 익숙한 것에서 벗어나 새로운 시도를 해보세요. 뜻밖의 행운이 따를 것입니다.',
            '안정과 수확의 시기입니다. 그동안의 노력이 결실을 맺으니, 조급해하지 말고 차분히 기다리세요.',
            '자신의 내면을 돌아보는 시간이 필요합니다. 성찰과 휴식을 통해 더 큰 도약을 준비하세요.',
            '인연이 중요한 해입니다. 주변 사람들과의 관계에 정성을 다하면 좋은 기회가 찾아올 것입니다.'
        ],
        wealth: [
            '재물운이 상승하는 시기입니다. 투자나 사업에 좋은 기회가 있으니 신중하게 판단하여 결정하세요.',
            '안정적인 재정 관리가 필요한 때입니다. 충동적인 지출을 삼가고 저축에 힘쓰세요.',
            '예상치 못한 수입이 있을 수 있습니다. 다만 지나친 욕심은 금물입니다.',
            '협력을 통한 이익이 기대됩니다. 혼자보다는 함께할 때 더 큰 성과를 얻을 수 있습니다.',
            '장기적인 관점에서 재정 계획을 세우세요. 단기적 이익보다 미래를 위한 투자가 좋습니다.'
        ],
        love: [
            '새로운 인연이 찾아올 수 있는 시기입니다. 마음을 열고 다양한 만남에 참여해보세요.',
            '현재의 관계에 더 깊은 신뢰와 이해가 쌓이는 시기입니다. 진심 어린 대화가 중요합니다.',
            '감정의 기복이 있을 수 있으니 차분함을 유지하세요. 서로를 이해하려는 노력이 필요합니다.',
            '오래된 인연이 새롭게 다가올 수 있습니다. 과거의 관계를 돌아볼 때입니다.',
            '혼자만의 시간도 소중합니다. 자기 자신을 사랑하는 것이 좋은 인연을 만나는 첫걸음입니다.'
        ],
        career: [
            '업무에서 두각을 나타낼 수 있는 시기입니다. 적극적으로 의견을 제시하고 리더십을 발휘하세요.',
            '새로운 분야에 도전해볼 좋은 때입니다. 두려움을 버리고 배움에 열린 자세를 가지세요.',
            '팀워크가 중요한 시기입니다. 협력을 통해 더 큰 성과를 얻을 수 있습니다.',
            '현재 하는 일에 집중하세요. 기본에 충실할 때 인정받을 기회가 옵니다.',
            '이직이나 전환을 고려한다면 신중하게 결정하세요. 충분한 준비가 필요합니다.'
        ],
        health: [
            '전반적으로 건강운이 양호합니다. 규칙적인 생활 습관을 유지하세요.',
            '스트레스 관리가 필요한 시기입니다. 충분한 휴식과 취미 활동으로 마음의 여유를 찾으세요.',
            '가벼운 운동으로 체력을 키우세요. 작은 습관이 큰 변화를 만듭니다.',
            '식습관을 점검해보세요. 균형 잡힌 영양 섭취가 건강의 기본입니다.',
            '정기 검진을 받아보세요. 예방이 최선의 치료입니다.'
        ]
    };

    // 오늘의 운세 메시지
    const TODAY_MESSAGES = [
        '오늘은 당신의 매력이 빛나는 날입니다. 자신감을 갖고 하루를 시작하세요.',
        '작은 친절이 큰 행운으로 돌아오는 날입니다. 주변 사람들에게 따뜻하게 대하세요.',
        '창의적인 아이디어가 떠오르는 날입니다. 메모해두었다가 활용해보세요.',
        '중요한 결정은 잠시 미루고, 오늘은 편안하게 보내는 것이 좋겠습니다.',
        '오래된 친구나 지인에게서 반가운 소식이 있을 수 있습니다.',
        '새로운 시작을 위한 에너지가 충만한 날입니다. 미루던 일을 시작해보세요.',
        '감정 조절이 중요한 날입니다. 차분함을 유지하며 상황을 지켜보세요.',
        '협력과 조화가 중요한 날입니다. 함께할 때 더 좋은 결과를 얻을 수 있습니다.'
    ];

    // 행운의 색
    const LUCKY_COLORS = ['빨강', '주황', '노랑', '초록', '파랑', '보라', '분홍', '하늘색', '금색', '은색'];

    // 행운의 방향
    const LUCKY_DIRECTIONS = ['동쪽', '서쪽', '남쪽', '북쪽', '동남쪽', '동북쪽', '서남쪽', '서북쪽'];

    // ===== DOM 요소 =====
    const form = document.getElementById('saju-form');
    const inputSection = document.getElementById('input-section');
    const resultSection = document.getElementById('result-section');
    const analyzeBtn = document.getElementById('analyze-btn');
    const restartBtn = document.getElementById('restart-btn');

    const birthYear = document.getElementById('birth-year');
    const birthMonth = document.getElementById('birth-month');
    const birthDay = document.getElementById('birth-day');
    const birthHour = document.getElementById('birth-hour');
    const timeUnknown = document.getElementById('time-unknown');
    const userName = document.getElementById('user-name');

    // ===== 초기화 =====
    initializeForm();
    setupEventListeners();

    function initializeForm() {
        // HTML에 이미 옵션이 있으면 추가하지 않음
        // 옵션은 HTML에 하드코딩되어 있음
        console.log('Form initialized');
    }

    function setupEventListeners() {
        // 폼 유효성 검사
        const formInputs = [userName, birthYear, birthMonth, birthDay];
        formInputs.forEach(input => {
            input.addEventListener('input', validateForm);
            input.addEventListener('change', validateForm);
        });

        // 성별 라디오 버튼
        document.querySelectorAll('input[name="gender"]').forEach(radio => {
            radio.addEventListener('change', validateForm);
        });

        // 시간 모름 체크박스
        timeUnknown.addEventListener('change', () => {
            birthHour.disabled = timeUnknown.checked;
            if (timeUnknown.checked) {
                birthHour.value = '';
            }
            validateForm();
        });

        // 월 변경 시 일수 조정
        birthMonth.addEventListener('change', updateDays);
        birthYear.addEventListener('change', updateDays);

        // 폼 제출
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            analyzeSaju();
        });

        // 다시하기
        restartBtn.addEventListener('click', resetForm);

        // 운세 탭
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.fortune-tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            });
        });
    }

    function validateForm() {
        const isValid =
            userName.value.trim() !== '' &&
            birthYear.value !== '' &&
            birthMonth.value !== '' &&
            birthDay.value !== '' &&
            document.querySelector('input[name="gender"]:checked') !== null &&
            (timeUnknown.checked || birthHour.value !== '');

        analyzeBtn.disabled = !isValid;
    }

    function updateDays() {
        const year = parseInt(birthYear.value);
        const month = parseInt(birthMonth.value);

        if (!year || !month) return;

        const daysInMonth = new Date(year, month, 0).getDate();
        const currentDay = parseInt(birthDay.value);

        // 현재 선택된 일이 해당 월의 일수보다 크면 마지막 날로 변경
        while (birthDay.options.length > 1) {
            birthDay.remove(1);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const option = new Option(`${day}일`, day);
            birthDay.add(option);
        }

        if (currentDay && currentDay <= daysInMonth) {
            birthDay.value = currentDay;
        }
    }

    // ===== 사주 계산 함수들 =====

    function calculateYearPillar(year) {
        // 갑자년(1864년)을 기준으로 계산
        const baseYear = 1864;
        const diff = year - baseYear;
        const cheonganIndex = ((diff % 10) + 10) % 10;
        const jijiIndex = ((diff % 12) + 12) % 12;

        return {
            cheongan: cheonganIndex,
            jiji: jijiIndex
        };
    }

    function calculateMonthPillar(year, month) {
        // 년간에 따른 월간 계산
        const yearPillar = calculateYearPillar(year);
        const yearCheongan = yearPillar.cheongan;

        // 월지는 인월(1월)부터 시작
        const monthJiji = (month + 1) % 12;

        // 년간에 따른 월간 계산 공식
        const monthCheonganBase = (yearCheongan % 5) * 2;
        const monthCheongan = (monthCheonganBase + month - 1) % 10;

        return {
            cheongan: monthCheongan,
            jiji: monthJiji
        };
    }

    function calculateDayPillar(year, month, day) {
        // 기준일: 1900년 1월 1일 = 갑자일
        const baseDate = new Date(1900, 0, 1);
        const targetDate = new Date(year, month - 1, day);
        const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));

        // 1900년 1월 1일은 갑자일이 아니므로 보정 필요 (실제로는 경자일)
        const correction = 36; // 갑자일까지의 보정값
        const adjustedDiff = diffDays + correction;

        const cheonganIndex = ((adjustedDiff % 10) + 10) % 10;
        const jijiIndex = ((adjustedDiff % 12) + 12) % 12;

        return {
            cheongan: cheonganIndex,
            jiji: jijiIndex
        };
    }

    function calculateHourPillar(dayCheongan, hour) {
        // 시지 계산
        let hourJiji;
        if (hour === 23 || hour === 0) hourJiji = 0;
        else hourJiji = Math.floor((hour + 1) / 2);

        // 일간에 따른 시간 계산
        const hourCheonganBase = (dayCheongan % 5) * 2;
        const hourCheongan = (hourCheonganBase + hourJiji) % 10;

        return {
            cheongan: hourCheongan,
            jiji: hourJiji
        };
    }

    function calculateOhang(pillars) {
        const ohangCount = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

        pillars.forEach(pillar => {
            if (pillar) {
                ohangCount[CHEONGAN_OHANG[pillar.cheongan]]++;
                ohangCount[JIJI_OHANG[pillar.jiji]]++;
            }
        });

        return ohangCount;
    }

    function getOhangSummary(ohangCount) {
        const total = Object.values(ohangCount).reduce((a, b) => a + b, 0);
        const strongest = Object.entries(ohangCount).reduce((a, b) => a[1] > b[1] ? a : b);
        const weakest = Object.entries(ohangCount).reduce((a, b) => a[1] < b[1] ? a : b);

        const ohangNames = {
            wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)'
        };

        let summary = `당신의 사주에서 ${ohangNames[strongest[0]]} 기운이 가장 강하게 나타납니다. `;

        if (weakest[1] === 0) {
            summary += `${ohangNames[weakest[0]]} 기운이 부족하니, 이를 보완하는 것이 좋겠습니다. `;
        }

        // 균형 분석
        const balanced = Object.values(ohangCount).every(v => v >= 1 && v <= 3);
        if (balanced) {
            summary += '전체적으로 오행의 균형이 좋은 편입니다.';
        } else {
            summary += '오행의 균형을 맞추기 위한 노력이 필요합니다.';
        }

        return summary;
    }

    function getPersonality(ilju) {
        const iljuKey = ilju.toLowerCase();
        if (ILJU_PERSONALITY[iljuKey]) {
            return ILJU_PERSONALITY[iljuKey];
        }

        // 기본 성격 (일주가 매칭되지 않을 경우)
        return {
            title: '독특한 기운을 가진 사람',
            traits: ['창의적인 성향', '독립적인 사고', '유연한 적응력'],
            icon: '✨'
        };
    }

    function generateHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    function analyzeSaju() {
        const name = userName.value.trim();
        const year = parseInt(birthYear.value);
        const month = parseInt(birthMonth.value);
        const day = parseInt(birthDay.value);
        const hour = timeUnknown.checked ? null : parseInt(birthHour.value);
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const calendarType = document.querySelector('input[name="calendar"]:checked').value;

        // 사주 팔자 계산
        const yearPillar = calculateYearPillar(year);
        const monthPillar = calculateMonthPillar(year, month);
        const dayPillar = calculateDayPillar(year, month, day);
        const hourPillar = hour !== null ? calculateHourPillar(dayPillar.cheongan, hour * 2) : null;

        // 일주 문자열
        const ilju = CHEONGAN[dayPillar.cheongan] + JIJI[dayPillar.jiji];

        // 오행 분석
        const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
        const ohangCount = calculateOhang(pillars.filter(p => p !== null));

        // 해시 생성 (운세 다양화용)
        const hashInput = `${name}${year}${month}${day}${hour || 'unknown'}${gender}`;
        const hash = generateHash(hashInput);

        // 결과 표시
        displayResults({
            name,
            year, month, day, hour,
            calendarType,
            yearPillar, monthPillar, dayPillar, hourPillar,
            ilju,
            ohangCount,
            hash
        });
    }

    function displayResults(data) {
        // 섹션 전환
        inputSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 이름 및 생년월일 표시
        document.getElementById('result-name').textContent = data.name;
        const calendarText = data.calendarType === 'lunar' ? '음력' : '양력';
        const hourText = data.hour !== null ?
            `${HOUR_JIJI.find((_, i) => i === data.hour)?.start || 0}시경` : '';
        document.getElementById('birth-info-display').textContent =
            `${calendarText} ${data.year}년 ${data.month}월 ${data.day}일 ${hourText}`;

        // 사주 팔자 표시
        displayPillar('year', data.yearPillar);
        displayPillar('month', data.monthPillar);
        displayPillar('day', data.dayPillar);
        if (data.hourPillar) {
            displayPillar('hour', data.hourPillar);
        } else {
            document.getElementById('hour-cheongan').textContent = '?';
            document.getElementById('hour-jiji').textContent = '?';
            document.getElementById('hour-element').textContent = '시간 미상';
        }

        // 오행 분석 표시
        displayOhang(data.ohangCount);

        // 성격 분석 표시
        displayPersonality(data.ilju);

        // 연간 운세 표시
        displayYearlyFortune(data.hash);

        // 오늘의 운세 표시
        displayTodayFortune(data.hash);

        // 조언 표시
        displayAdvice(data.hash, data.ohangCount);
    }

    function displayPillar(type, pillar) {
        const cheonganEl = document.getElementById(`${type}-cheongan`);
        const jijiEl = document.getElementById(`${type}-jiji`);
        const elementEl = document.getElementById(`${type}-element`);

        cheonganEl.textContent = CHEONGAN_HANJA[pillar.cheongan];
        jijiEl.textContent = JIJI_HANJA[pillar.jiji];

        const ohang = CHEONGAN_OHANG[pillar.cheongan];
        elementEl.textContent = `${CHEONGAN[pillar.cheongan]}${JIJI[pillar.jiji]} (${OHANG[ohang].name})`;
    }

    function displayOhang(ohangCount) {
        const maxCount = Math.max(...Object.values(ohangCount));

        Object.entries(ohangCount).forEach(([key, value]) => {
            const bar = document.getElementById(`${key}-bar`);
            const valueEl = document.getElementById(`${key}-value`);

            const percentage = maxCount > 0 ? (value / maxCount) * 100 : 0;

            setTimeout(() => {
                bar.style.width = `${percentage}%`;
            }, 300);

            valueEl.textContent = value;
        });

        document.getElementById('ohang-summary').textContent = getOhangSummary(ohangCount);
    }

    function displayPersonality(ilju) {
        const personality = getPersonality(ilju);
        const container = document.getElementById('personality-content');

        container.innerHTML = `
            <div class="trait">
                <span class="trait-icon">${personality.icon}</span>
                <div class="trait-text">
                    <h4>${personality.title}</h4>
                    <p>${personality.traits.join(' / ')}</p>
                </div>
            </div>
            <div class="trait">
                <span class="trait-icon">💫</span>
                <div class="trait-text">
                    <h4>일주 특성</h4>
                    <p>당신의 일주는 <strong>${ilju}</strong>입니다. 이는 당신의 본질적인 성격과 기질을 나타내며,
                    삶의 방향과 대인관계에서 중요한 역할을 합니다.</p>
                </div>
            </div>
        `;
    }

    function displayYearlyFortune(hash) {
        const categories = ['overall', 'wealth', 'love', 'career', 'health'];
        const ratings = [3, 4, 5];

        categories.forEach(category => {
            const container = document.getElementById(`tab-${category}`);
            const messageIndex = hash % FORTUNE_MESSAGES[category].length;
            const ratingIndex = (hash + category.length) % ratings.length;
            const rating = ratings[ratingIndex];

            const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
            const ratingText = rating >= 4 ? '매우 좋음' : rating >= 3 ? '양호' : '보통';

            container.innerHTML = `
                <div class="fortune-rating">
                    <span class="fortune-stars">${stars}</span>
                    <span class="fortune-rating-text">${ratingText}</span>
                </div>
                <p class="fortune-description">${FORTUNE_MESSAGES[category][messageIndex]}</p>
            `;
        });
    }

    function displayTodayFortune(hash) {
        // 오늘 날짜
        const today = new Date();
        const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
        document.getElementById('today-date').textContent = dateStr;

        // 점수 계산 (60-95 범위)
        const todayHash = hash + today.getDate() + today.getMonth();
        const score = (todayHash % 36) + 60;

        // 점수 표시 및 원형 프로그레스
        const scoreNumber = document.getElementById('today-score');
        const scoreCircle = document.getElementById('score-circle');
        const scoreLabel = document.getElementById('score-label');

        // SVG에 그라데이션 추가
        const svg = scoreCircle.closest('svg');
        if (!svg.querySelector('defs')) {
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            defs.innerHTML = `
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#D4AF37"/>
                    <stop offset="100%" style="stop-color:#F4E4BA"/>
                </linearGradient>
            `;
            svg.insertBefore(defs, svg.firstChild);
        }

        scoreCircle.style.stroke = 'url(#scoreGradient)';

        // 애니메이션
        setTimeout(() => {
            const circumference = 2 * Math.PI * 45;
            const offset = circumference - (score / 100) * circumference;
            scoreCircle.style.strokeDashoffset = offset;

            // 숫자 카운트 애니메이션
            let currentScore = 0;
            const interval = setInterval(() => {
                currentScore++;
                scoreNumber.textContent = currentScore;
                if (currentScore >= score) {
                    clearInterval(interval);
                }
            }, 20);
        }, 500);

        // 점수 레이블
        if (score >= 85) scoreLabel.textContent = '최고의 하루';
        else if (score >= 75) scoreLabel.textContent = '좋은 하루';
        else if (score >= 65) scoreLabel.textContent = '평온한 하루';
        else scoreLabel.textContent = '조심스러운 하루';

        // 키워드
        const allKeywords = ['금전운 상승', '인연', '건강', '학업', '창의력', '행운', '평화', '성취'];
        const keywordsContainer = document.getElementById('today-keywords');
        const selectedKeywords = [];
        for (let i = 0; i < 3; i++) {
            selectedKeywords.push(allKeywords[(todayHash + i * 3) % allKeywords.length]);
        }
        keywordsContainer.innerHTML = selectedKeywords.map(k =>
            `<span class="keyword">${k}</span>`
        ).join('');

        // 메시지
        const messageIndex = todayHash % TODAY_MESSAGES.length;
        document.getElementById('today-message').textContent = TODAY_MESSAGES[messageIndex];

        // 행운 아이템
        document.getElementById('lucky-color').textContent =
            LUCKY_COLORS[todayHash % LUCKY_COLORS.length];
        document.getElementById('lucky-number').textContent =
            (todayHash % 9) + 1;
        document.getElementById('lucky-direction').textContent =
            LUCKY_DIRECTIONS[todayHash % LUCKY_DIRECTIONS.length];
    }

    function displayAdvice(hash, ohangCount) {
        const container = document.getElementById('advice-content');

        // 부족한 오행 찾기
        const weakest = Object.entries(ohangCount).reduce((a, b) => a[1] < b[1] ? a : b);
        const ohangAdvice = {
            wood: '나무나 식물을 가까이 두거나, 동쪽 방향을 활용하세요. 초록색 소품도 좋습니다.',
            fire: '붉은 계열의 색상이나 남쪽 방향이 도움됩니다. 활동적인 취미를 가져보세요.',
            earth: '황색이나 갈색 계열을 활용하고, 중심부에서 활동하는 것이 좋습니다.',
            metal: '흰색이나 금색을 활용하고, 서쪽 방향이 길합니다. 금속 액세서리도 좋습니다.',
            water: '검정색이나 파란색을 활용하고, 북쪽 방향을 고려하세요. 물과 관련된 활동이 좋습니다.'
        };

        const adviceItems = [
            {
                icon: '🌿',
                text: weakest[1] === 0 ?
                    `${OHANG[weakest[0]].name} 기운이 부족합니다. ${ohangAdvice[weakest[0]]}` :
                    '오행의 균형이 비교적 잘 잡혀 있습니다. 현재의 조화를 유지하세요.'
            },
            {
                icon: '📅',
                text: '중요한 일은 오전 시간대에 진행하면 좋은 기운을 받을 수 있습니다.'
            },
            {
                icon: '🤝',
                text: '주변 사람들과의 관계를 소중히 하세요. 좋은 인연이 행운을 가져다 줍니다.'
            }
        ];

        container.innerHTML = adviceItems.map(item => `
            <div class="advice-item">
                <span class="advice-icon">${item.icon}</span>
                <span class="advice-text">${item.text}</span>
            </div>
        `).join('');
    }

    function resetForm() {
        resultSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        form.reset();
        birthHour.disabled = false;
        analyzeBtn.disabled = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
