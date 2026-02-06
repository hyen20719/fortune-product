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

    // 운세 메시지 (상세 버전)
    const FORTUNE_MESSAGES = {
        overall: [
            '2026년 병오(丙午)년은 당신에게 새로운 기회의 문이 열리는 해입니다. 그동안 묵묵히 준비해온 일들이 드디어 빛을 발하게 될 것입니다. 특히 상반기에는 귀인의 도움으로 예상치 못한 기회가 찾아올 수 있으니, 평소 인간관계를 소중히 여기세요. 자신감을 갖고 적극적으로 도전하되, 섣부른 판단은 피하고 신중하게 결정하는 지혜가 필요합니다. 하반기에는 그동안의 노력이 가시적인 성과로 나타나기 시작할 것입니다.',
            '올해는 변화와 성장의 기운이 강한 해입니다. 익숙한 환경에서 벗어나 새로운 도전을 시도해보세요. 처음에는 불안할 수 있지만, 용기를 내어 한 발짝 나아가면 뜻밖의 행운이 따를 것입니다. 특히 배움과 자기계발에 투자하는 것이 좋습니다. 새로운 기술을 익히거나 자격증을 취득하면 미래에 큰 도움이 됩니다. 다만 너무 급하게 모든 것을 바꾸려 하지 말고, 단계적으로 변화를 추구하세요.',
            '안정과 수확의 기운이 가득한 한 해입니다. 그동안 꾸준히 쌓아온 노력이 마침내 결실을 맺는 시기이니, 조급해하지 말고 차분하게 기다리세요. 급하게 서두르면 오히려 일을 그르칠 수 있습니다. 올해는 새로운 시작보다는 현재 하고 있는 일을 완성하고 마무리하는 데 집중하는 것이 좋습니다. 재정적으로도 안정을 찾을 수 있으며, 가정에서의 행복도 함께 찾아올 것입니다.',
            '올해는 자신의 내면을 돌아보고 성찰하는 시간이 필요한 해입니다. 바쁜 일상에서 잠시 멈추어 자신이 진정으로 원하는 것이 무엇인지 깊이 생각해보세요. 명상이나 독서, 혼자만의 여행 등을 통해 마음의 평화를 찾으면 더 큰 도약을 위한 에너지를 충전할 수 있습니다. 무리하게 앞으로 나아가려 하지 말고, 때로는 한 발짝 물러서서 전체를 조망하는 지혜가 필요합니다.',
            '인연의 기운이 강한 한 해입니다. 주변 사람들과의 관계에 정성을 다하면 좋은 기회가 자연스럽게 찾아올 것입니다. 특히 오래된 인연을 소중히 여기세요. 예전에 만났던 사람을 통해 새로운 기회가 열릴 수 있습니다. 새로운 만남도 적극적으로 추구하되, 첫인상에만 의존하지 말고 시간을 두고 상대를 파악하세요. 진심을 다해 사람을 대하면 그만큼의 보답이 돌아올 것입니다.'
        ],
        wealth: [
            '재물운이 전반적으로 상승하는 시기입니다. 특히 투자나 사업에 좋은 기회가 있으니 주변의 정보에 귀를 기울이세요. 다만 큰 수익을 노리는 무리한 투자보다는 안정적인 수익을 추구하는 것이 좋습니다. 부동산이나 장기 투자에 관심을 가져보세요. 부업이나 새로운 수입원을 찾는 것도 좋은 시기입니다. 금전 거래 시에는 반드시 서류를 꼼꼼히 확인하고, 보증은 신중하게 결정하세요.',
            '안정적인 재정 관리가 필요한 때입니다. 충동적인 지출을 삼가고 계획적인 소비 습관을 들이세요. 특히 불필요한 구독 서비스나 사용하지 않는 물건에 대한 지출을 점검해보세요. 저축과 투자의 균형을 맞추되, 비상금은 반드시 확보해두세요. 가계부를 작성하면 지출 패턴을 파악하는 데 도움이 됩니다. 하반기에는 재정 상황이 점차 나아질 것입니다.',
            '예상치 못한 수입이 있을 수 있는 해입니다. 복권 당첨이나 보너스, 선물 등 뜻밖의 횡재가 있을 수 있습니다. 다만 이런 행운에 지나친 기대를 걸거나 도박성 투자에 빠지지 않도록 주의하세요. 갑자기 들어온 돈은 바로 쓰지 말고 일정 기간 저축해두었다가 신중하게 사용하세요. 친구나 지인에게 금전을 빌려주는 것은 신중하게 결정하세요.',
            '협력과 동업을 통한 이익이 기대되는 해입니다. 혼자 힘으로 하는 것보다 믿을 수 있는 파트너와 함께할 때 더 큰 성과를 얻을 수 있습니다. 다만 동업 시에는 반드시 계약서를 작성하고 역할과 수익 배분을 명확히 하세요. 금전 관계는 친한 사이일수록 더욱 명확하게 해두는 것이 좋습니다. 공동 투자도 좋은 결과를 가져올 수 있습니다.',
            '장기적인 관점에서 재정 계획을 세워야 하는 해입니다. 단기적인 이익에 연연하기보다는 5년, 10년 후를 내다보는 투자가 좋습니다. 노후 대비나 자녀 교육비 등 미래를 위한 저축을 시작하기에 좋은 시기입니다. 재테크 공부를 시작하거나 전문가의 조언을 구하는 것도 도움이 됩니다. 신용 관리에도 신경 쓰세요.'
        ],
        love: [
            '새로운 인연이 찾아올 수 있는 설레는 시기입니다. 마음을 열고 다양한 모임이나 활동에 참여해보세요. 취미 활동이나 동호회를 통해 뜻이 맞는 사람을 만날 가능성이 높습니다. 첫 만남에서 강한 끌림을 느끼더라도 서두르지 말고 천천히 관계를 발전시키세요. 외모보다는 내면의 가치를 보는 눈을 기르면 더 좋은 인연을 만날 수 있습니다. 솔직하게 자신을 표현하는 것이 중요합니다.',
            '현재의 관계에 더 깊은 신뢰와 이해가 쌓이는 시기입니다. 오랜 연인이나 배우자와의 관계가 한 단계 성숙해질 수 있습니다. 진심 어린 대화를 통해 서로의 마음을 확인하세요. 함께 여행을 가거나 새로운 경험을 공유하면 관계가 더욱 돈독해집니다. 상대방의 작은 노력에도 감사를 표현하고, 당연하게 여기지 마세요. 사소한 배려가 큰 행복을 만듭니다.',
            '감정의 기복이 있을 수 있으니 차분함을 유지하세요. 사소한 일로 다투거나 오해가 생길 수 있으니, 상대방의 입장에서 생각해보려는 노력이 필요합니다. 화가 나더라도 즉각적으로 반응하지 말고 시간을 두고 냉정하게 상황을 판단하세요. 대화할 때는 비난보다는 자신의 감정을 솔직하게 표현하세요. 어려운 시기를 함께 극복하면 관계가 더욱 단단해질 것입니다.',
            '오래된 인연이 새롭게 다가올 수 있는 해입니다. 예전 연인이나 오랫동안 연락이 끊겼던 사람과 다시 만날 기회가 있을 수 있습니다. 과거의 관계를 돌아보고, 그때의 경험에서 배운 것이 무엇인지 생각해보세요. 다만 과거에 연연하기보다는 현재에 충실하세요. 새로운 만남이든 재회든, 서로 성장한 모습으로 만나는 것이 중요합니다.',
            '혼자만의 시간도 소중히 여기세요. 연애에 집착하기보다는 자기 자신을 사랑하고 가꾸는 것이 좋은 인연을 만나는 첫걸음입니다. 자신의 취미나 관심사에 집중하고, 내면의 성장에 힘쓰세요. 자존감이 높아지면 자연스럽게 좋은 인연이 찾아옵니다. 급하게 연애를 시작하려 하지 말고, 준비가 되었을 때 자연스럽게 시작하세요.'
        ],
        career: [
            '업무에서 두각을 나타낼 수 있는 시기입니다. 그동안 쌓아온 실력이 인정받을 기회가 찾아옵니다. 적극적으로 의견을 제시하고 리더십을 발휘하세요. 승진이나 이직에 좋은 기회가 있을 수 있으니, 평소 자기계발에 힘쓰고 인맥을 관리하세요. 새로운 프로젝트나 도전적인 업무가 주어지면 피하지 말고 받아들이세요. 성공적으로 완수하면 큰 인정을 받을 것입니다.',
            '새로운 분야에 도전해볼 좋은 때입니다. 지금까지 해보지 않았던 일이라도 두려움을 버리고 도전하세요. 배움에 열린 자세를 가지면 빠르게 성장할 수 있습니다. 교육이나 연수 기회가 있다면 적극적으로 참여하세요. 업종 변경이나 새로운 사업을 시작하기에도 좋은 시기입니다. 다만 충분한 준비와 계획이 선행되어야 합니다.',
            '팀워크가 중요한 시기입니다. 혼자 힘으로 모든 것을 해결하려 하지 말고, 동료들과 협력하세요. 서로의 장점을 살리면 더 큰 성과를 얻을 수 있습니다. 직장 내 인간관계에 신경 쓰고, 갈등이 있다면 대화로 풀어가세요. 상사나 선배의 조언에 귀를 기울이면 도움이 됩니다. 자신의 공을 내세우기보다는 팀의 성공을 위해 노력하세요.',
            '현재 하는 일에 집중하세요. 새로운 기회를 찾아 이리저리 흔들리기보다는 지금 맡은 업무에 충실할 때입니다. 기본에 충실하면 인정받을 기회가 자연스럽게 찾아옵니다. 업무 능력 향상을 위한 공부를 게을리하지 마세요. 작은 일도 소홀히 하지 않고 완벽하게 처리하면 신뢰를 얻을 수 있습니다. 묵묵히 노력하는 모습이 결국 빛을 발할 것입니다.',
            '이직이나 전환을 고려한다면 신중하게 결정하세요. 현재 직장에 불만이 있더라도 충동적으로 그만두지 마세요. 충분한 준비와 대안이 마련된 후에 움직이는 것이 좋습니다. 이직을 준비한다면 이력서와 포트폴리오를 미리 정리하고, 인맥을 통해 정보를 수집하세요. 면접 준비도 철저히 해야 합니다. 조급함보다는 신중함이 좋은 결과를 가져옵니다.'
        ],
        health: [
            '전반적으로 건강운이 양호한 한 해입니다. 하지만 방심하지 말고 규칙적인 생활 습관을 유지하세요. 충분한 수면과 균형 잡힌 식사, 적당한 운동이 건강의 기본입니다. 특히 면역력 관리에 신경 쓰세요. 계절이 바뀔 때 감기나 알레르기에 주의하고, 손 씻기와 위생 관리를 철저히 하세요. 정기적인 건강검진으로 작은 이상도 조기에 발견하세요.',
            '스트레스 관리가 특히 필요한 시기입니다. 업무나 인간관계에서 오는 압박이 건강에 영향을 줄 수 있습니다. 충분한 휴식을 취하고, 취미 활동을 통해 마음의 여유를 찾으세요. 명상이나 요가, 산책 등 마음을 안정시키는 활동이 도움이 됩니다. 혼자 끙끙 앓지 말고 가까운 사람에게 고민을 털어놓으세요. 필요하다면 전문가의 도움도 받아보세요.',
            '규칙적인 운동으로 체력을 키우세요. 격렬한 운동보다는 걷기, 수영, 자전거 타기 등 꾸준히 할 수 있는 유산소 운동이 좋습니다. 작은 습관이 큰 변화를 만듭니다. 출퇴근 시 한 정거장 일찍 내려 걷거나, 엘리베이터 대신 계단을 이용하는 것부터 시작하세요. 주말에는 야외 활동을 즐기며 햇빛을 충분히 쬐세요. 운동 동호회 가입도 좋은 방법입니다.',
            '식습관을 점검해보세요. 바쁜 일상에서 불규칙한 식사나 인스턴트 음식에 의존하고 있다면 개선이 필요합니다. 균형 잡힌 영양 섭취가 건강의 기본입니다. 채소와 과일을 충분히 먹고, 과도한 음주와 흡연은 삼가세요. 물을 충분히 마시고, 카페인 섭취는 적당히 조절하세요. 직접 요리해 먹는 습관을 들이면 건강과 절약 두 마리 토끼를 잡을 수 있습니다.',
            '정기 검진을 받아보세요. 별다른 증상이 없더라도 1년에 한 번은 종합검진을 받는 것이 좋습니다. 예방이 최선의 치료입니다. 특히 가족력이 있는 질환이나 나이대에 맞는 검사는 빠뜨리지 마세요. 치과 검진과 안과 검진도 정기적으로 받으세요. 작은 이상 신호도 무시하지 말고 조기에 전문의를 찾아가세요. 건강보험이나 실비보험도 점검해보세요.'
        ]
    };

    // 오늘의 운세 메시지 (상세 버전)
    const TODAY_MESSAGES = [
        '오늘은 당신의 매력이 한층 빛나는 날입니다. 자신감을 갖고 하루를 시작하세요. 평소 주저했던 일이 있다면 오늘 시도해보세요. 첫인상이 중요한 자리가 있다면 좋은 결과를 기대해도 좋습니다. 밝은 색상의 옷을 입으면 더욱 좋은 기운을 받을 수 있습니다.',
        '작은 친절이 큰 행운으로 돌아오는 날입니다. 주변 사람들에게 따뜻하게 대하고, 도움이 필요한 사람에게 손을 내밀어보세요. 예상치 못한 곳에서 감사의 마음이 돌아올 것입니다. 양보와 배려가 좋은 인연을 만드는 씨앗이 됩니다.',
        '창의적인 아이디어가 샘솟는 날입니다. 갑자기 떠오르는 생각이 있다면 꼭 메모해두세요. 나중에 큰 도움이 될 수 있습니다. 예술 활동이나 취미 생활에도 좋은 날이니, 평소 관심 있던 창작 활동을 시도해보세요.',
        '중요한 결정은 잠시 미루고, 오늘은 편안하게 보내는 것이 좋겠습니다. 급하게 결론 내리면 후회할 수 있으니 충분히 생각할 시간을 가지세요. 스트레스를 풀 수 있는 가벼운 활동을 하며 마음의 여유를 찾으세요.',
        '오래된 친구나 지인에게서 반가운 소식이 있을 수 있습니다. 연락이 끊겼던 사람에게 먼저 안부를 전해보는 것도 좋습니다. 동창회나 모임 소식이 있다면 참석해보세요. 뜻밖의 좋은 기회나 정보를 얻을 수 있습니다.',
        '새로운 시작을 위한 에너지가 충만한 날입니다. 미루어왔던 일을 시작하기에 좋은 날이니, 용기를 내어 첫 발을 내딛으세요. 운동을 시작하거나 새로운 취미를 배우기에도 좋습니다. 오늘의 시작이 큰 변화의 출발점이 될 것입니다.',
        '감정 조절이 특히 중요한 날입니다. 작은 일에 예민해지거나 화가 날 수 있으니, 차분함을 유지하며 상황을 객관적으로 바라보세요. 충동적인 말이나 행동은 삼가고, 깊은 호흡으로 마음을 가라앉히세요. 저녁에는 편안한 휴식이 도움됩니다.',
        '협력과 조화가 중요한 날입니다. 혼자 하는 것보다 함께할 때 더 좋은 결과를 얻을 수 있습니다. 팀 프로젝트나 공동 작업이 있다면 적극적으로 참여하세요. 다른 사람의 의견을 경청하고, 자신의 생각도 솔직하게 나누면 시너지가 발생합니다.',
        '금전적으로 좋은 기운이 있는 날입니다. 예상치 못한 수입이나 좋은 소식이 있을 수 있습니다. 다만 충동구매는 피하고, 필요한 것에만 지출하세요. 재테크나 투자에 관심이 있다면 정보를 수집하기 좋은 날입니다.',
        '건강에 조금 더 신경 써야 하는 날입니다. 무리하지 말고 충분한 휴식을 취하세요. 가벼운 스트레칭이나 산책으로 몸을 풀어주면 좋습니다. 따뜻한 음료를 마시며 여유로운 시간을 보내세요. 충분한 수면이 내일의 활력을 만듭니다.'
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

    function calculateYearPillar(year, month, day) {
        // 입춘(약 2월 4일) 이전 출생은 전년도로 계산
        let adjustedYear = year;
        if (month === 1 || (month === 2 && day < 4)) {
            adjustedYear = year - 1;
        }

        // 갑자년(1864년)을 기준으로 계산
        const baseYear = 1864;
        const diff = adjustedYear - baseYear;
        const cheonganIndex = ((diff % 10) + 10) % 10;
        const jijiIndex = ((diff % 12) + 12) % 12;

        return {
            cheongan: cheonganIndex,
            jiji: jijiIndex
        };
    }

    // 절기 기준 월지 결정 (각 월을 시작하는 절기의 대략적 양력 날짜)
    function getSajuMonthJiji(month, day) {
        const boundaries = [
            { month: 1, day: 6, jiji: 1 },    // 소한 → 축월
            { month: 2, day: 4, jiji: 2 },    // 입춘 → 인월
            { month: 3, day: 6, jiji: 3 },    // 경칩 → 묘월
            { month: 4, day: 5, jiji: 4 },    // 청명 → 진월
            { month: 5, day: 6, jiji: 5 },    // 입하 → 사월
            { month: 6, day: 6, jiji: 6 },    // 망종 → 오월
            { month: 7, day: 7, jiji: 7 },    // 소서 → 미월
            { month: 8, day: 8, jiji: 8 },    // 입추 → 신월
            { month: 9, day: 8, jiji: 9 },    // 백로 → 유월
            { month: 10, day: 8, jiji: 10 },   // 한로 → 술월
            { month: 11, day: 7, jiji: 11 },   // 입동 → 해월
            { month: 12, day: 7, jiji: 0 },    // 대설 → 자월
        ];

        let jiji = 0; // 기본값: 자월 (대설 이후 ~ 소한 이전)
        for (let i = boundaries.length - 1; i >= 0; i--) {
            const b = boundaries[i];
            if (month > b.month || (month === b.month && day >= b.day)) {
                jiji = b.jiji;
                break;
            }
        }
        return jiji;
    }

    function calculateMonthPillar(year, month, day) {
        // 년간에 따른 월간 계산 (년상기월법)
        const yearPillar = calculateYearPillar(year, month, day);
        const yearCheongan = yearPillar.cheongan;

        // 절기 기준 월지
        const monthJiji = getSajuMonthJiji(month, day);

        // 월간: 인월(2월)의 천간 기준값 = (년간 % 5) * 2 + 2
        // 각 월은 인월로부터의 오프셋만큼 증가
        const inwolBase = ((yearCheongan % 5) * 2 + 2) % 10;
        const monthOffset = ((monthJiji - 2) + 12) % 12;
        const monthCheongan = (inwolBase + monthOffset) % 10;

        return {
            cheongan: monthCheongan,
            jiji: monthJiji
        };
    }

    function calculateDayPillar(year, month, day) {
        // JDN(Julian Day Number) 공식으로 일주 계산
        // JavaScript Date 객체의 시간대/DST 문제를 완전히 제거
        const a = Math.floor((14 - month) / 12);
        const y = year + 4800 - a;
        const m = month + 12 * a - 3;
        const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y
            + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

        // 육십갑자 인덱스: (JDN + 49) % 60
        const idx = (jdn + 49) % 60;
        const cheonganIndex = idx % 10;
        const jijiIndex = idx % 12;

        return {
            cheongan: cheonganIndex,
            jiji: jijiIndex
        };
    }

    function calculateHourPillar(dayCheongan, hourJiji) {
        // 일상기시법(日上起時法)에 따른 시간 계산
        // 시간은 지지 인덱스(0=자시, 1=축시, ..., 11=해시)로 직접 전달
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
        const yearPillar = calculateYearPillar(year, month, day);
        const monthPillar = calculateMonthPillar(year, month, day);
        const dayPillar = calculateDayPillar(year, month, day);
        const hourPillar = hour !== null ? calculateHourPillar(dayPillar.cheongan, hour) : null;

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

        // 일주의 천간과 지지 분리
        const cheonganChar = ilju.charAt(0);
        const jijiChar = ilju.charAt(1);

        // 천간 특성
        const cheonganTraits = {
            '갑': { element: '목(木)', nature: '양(陽)', desc: '큰 나무와 같이 곧고 강직하며, 리더십이 있고 진취적입니다. 정의감이 강하고 독립심이 있습니다.' },
            '을': { element: '목(木)', nature: '음(陰)', desc: '풀이나 덩굴처럼 유연하고 부드러우며, 적응력이 뛰어납니다. 섬세하고 인내심이 강합니다.' },
            '병': { element: '화(火)', nature: '양(陽)', desc: '태양처럼 밝고 따뜻하며, 열정적이고 적극적입니다. 사교성이 좋고 명랑합니다.' },
            '정': { element: '화(火)', nature: '음(陰)', desc: '촛불처럼 은은하고 따뜻하며, 섬세하고 배려심이 깊습니다. 예술적 감각이 있습니다.' },
            '무': { element: '토(土)', nature: '양(陽)', desc: '큰 산처럼 묵직하고 안정적이며, 신뢰감을 줍니다. 중재 능력이 있고 포용력이 큽니다.' },
            '기': { element: '토(土)', nature: '음(陰)', desc: '비옥한 땅처럼 풍요롭고 실속 있으며, 현실적이고 꼼꼼합니다. 인내심이 강합니다.' },
            '경': { element: '금(金)', nature: '양(陽)', desc: '강철처럼 강하고 결단력 있으며, 의리가 있고 정의롭습니다. 원칙을 중시합니다.' },
            '신': { element: '금(金)', nature: '음(陰)', desc: '보석처럼 섬세하고 아름다우며, 완벽주의적 성향이 있습니다. 예리한 판단력을 가집니다.' },
            '임': { element: '수(水)', nature: '양(陽)', desc: '큰 바다처럼 넓고 깊으며, 지혜롭고 포용력이 있습니다. 창의적이고 진취적입니다.' },
            '계': { element: '수(水)', nature: '음(陰)', desc: '이슬처럼 맑고 순수하며, 섬세하고 직관력이 뛰어납니다. 감수성이 풍부합니다.' }
        };

        // 지지 특성
        const jijiTraits = {
            '자': { animal: '쥐', desc: '영리하고 재치 있으며, 사교성이 좋고 적응력이 뛰어납니다.' },
            '축': { animal: '소', desc: '성실하고 인내심이 강하며, 책임감 있고 믿음직합니다.' },
            '인': { animal: '호랑이', desc: '용감하고 진취적이며, 리더십이 있고 카리스마가 있습니다.' },
            '묘': { animal: '토끼', desc: '온화하고 부드러우며, 예술적 감각이 있고 평화를 사랑합니다.' },
            '진': { animal: '용', desc: '야망이 크고 카리스마가 있으며, 큰 꿈을 가지고 있습니다.' },
            '사': { animal: '뱀', desc: '지혜롭고 신중하며, 직관력이 뛰어나고 깊은 사고를 합니다.' },
            '오': { animal: '말', desc: '활동적이고 열정적이며, 자유를 사랑하고 독립심이 강합니다.' },
            '미': { animal: '양', desc: '온순하고 예술적이며, 평화로우며 조화를 추구합니다.' },
            '신': { animal: '원숭이', desc: '영리하고 재치 있으며, 다재다능하고 적응력이 좋습니다.' },
            '유': { animal: '닭', desc: '꼼꼼하고 완벽주의적이며, 책임감이 강하고 성실합니다.' },
            '술': { animal: '개', desc: '충직하고 의리 있으며, 정의감이 강하고 믿음직합니다.' },
            '해': { animal: '돼지', desc: '너그럽고 정직하며, 인복이 있고 행운이 따릅니다.' }
        };

        const cheongan = cheonganTraits[cheonganChar] || { element: '', nature: '', desc: '' };
        const jiji = jijiTraits[jijiChar] || { animal: '', desc: '' };

        container.innerHTML = `
            <div class="trait">
                <span class="trait-icon">${personality.icon}</span>
                <div class="trait-text">
                    <h4>"${personality.title}"</h4>
                    <p>${personality.traits.join(' • ')}</p>
                </div>
            </div>
            <div class="trait">
                <span class="trait-icon">🎋</span>
                <div class="trait-text">
                    <h4>일주(日柱) 분석: ${ilju}</h4>
                    <p>당신의 일주는 <strong>${ilju}</strong>입니다. 일주는 사주팔자에서 '나 자신'을 나타내는 핵심 기둥으로, 타고난 성격과 기질, 삶의 방향성을 결정하는 중요한 요소입니다. 사주명리학에서 일주는 60가지(육십갑자) 중 하나로, 각각 고유한 특성과 운명적 경향을 가지고 있습니다.</p>
                </div>
            </div>
            <div class="trait">
                <span class="trait-icon">☀️</span>
                <div class="trait-text">
                    <h4>일간(日干): ${cheonganChar} - ${cheongan.element} ${cheongan.nature}</h4>
                    <p>${cheongan.desc}</p>
                </div>
            </div>
            <div class="trait">
                <span class="trait-icon">🌙</span>
                <div class="trait-text">
                    <h4>일지(日支): ${jijiChar} - ${jiji.animal}띠의 기운</h4>
                    <p>${jiji.desc}</p>
                </div>
            </div>
            <div class="trait">
                <span class="trait-icon">💡</span>
                <div class="trait-text">
                    <h4>종합 성격 분석</h4>
                    <p>${cheonganChar}${jijiChar} 일주를 가진 당신은 ${cheongan.element}의 기운과 ${jiji.animal}띠의 특성이 결합되어, ${personality.traits[0].toLowerCase()} 특징이 두드러집니다. 이러한 기질은 대인관계와 직업 선택, 인생의 주요 결정에 영향을 미칩니다. 자신의 장점을 살리고 부족한 부분을 보완하면 더욱 풍요로운 삶을 살 수 있습니다.</p>
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
