document.addEventListener('DOMContentLoaded', () => {
    // Form Elements
    const fortuneForm = document.getElementById('fortune-form');
    const userName = document.getElementById('user-name');
    const birthDate = document.getElementById('birth-date');
    const birthTime = document.getElementById('birth-time');
    const timeUnknown = document.getElementById('time-unknown');
    const genderMale = document.getElementById('gender-male');
    const genderFemale = document.getElementById('gender-female');
    const viewResultButton = document.getElementById('view-result-button');

    // Result Elements
    const fortuneResult = document.getElementById('fortune-result');
    const fortuneScore = document.getElementById('fortune-score');
    const fortuneKeywords = document.getElementById('fortune-keywords');
    const resultTotal = document.getElementById('result-total');
    const resultAdvice = document.getElementById('result-advice');
    const tryAgainButton = document.getElementById('try-again-button');

    // Populate time options
    for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0');
        const option = new Option(`${hour}시`, hour);
        birthTime.add(option);
    }

    const formElements = [userName, birthDate, birthTime, genderMale, genderFemale];

    // --- Event Listeners ---

    // Validate form on input change
    formElements.forEach(el => {
        el.addEventListener('input', validateForm);
    });
    timeUnknown.addEventListener('change', validateForm);

    // Handle "Time Unknown" checkbox
    timeUnknown.addEventListener('change', () => {
        birthTime.disabled = timeUnknown.checked;
        validateForm();
    });

    // Handle form submission
    viewResultButton.addEventListener('click', () => {
        const sajuData = {
            name: userName.value,
            date: birthDate.value,
            time: timeUnknown.checked ? 'unknown' : birthTime.value,
            gender: genderMale.checked ? 'male' : 'female'
        };
        displayResult(generateSajuResult(sajuData));
    });

    // Handle "Try Again"
    tryAgainButton.addEventListener('click', () => {
        fortuneResult.classList.add('hidden');
        fortuneForm.style.display = '';
        
        // Reset form
        userName.value = '';
        birthDate.value = '';
        birthTime.value = '00';
        timeUnknown.checked = false;
        birthTime.disabled = false;
        genderMale.checked = false;
        genderFemale.checked = false;
        validateForm();
    });

    // --- Functions ---

    function validateForm() {
        const isNameValid = userName.value.trim() !== '';
        const isBirthDateValid = birthDate.value !== '';
        const isTimeValid = !birthTime.disabled || timeUnknown.checked;
        const isGenderValid = genderMale.checked || genderFemale.checked;

        if (isNameValid && isBirthDateValid && isTimeValid && isGenderValid) {
            viewResultButton.disabled = false;
        } else {
            viewResultButton.disabled = true;
        }
    }
    
    function generateSajuResult(data) {
        // Simple hash function for pseudo-randomness based on input
        const hashString = `${data.name}${data.date}${data.time}${data.gender}`;
        let hash = 0;
        for (let i = 0; i < hashString.length; i++) {
            const char = hashString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        const positiveHash = Math.abs(hash);

        // Generate Score
        const score = (positiveHash % 51) + 50; // Score between 50 and 100

        // Select Keywords
        const keywords = ['금전운', '사업운', '애정운', '건강운', '대인관계', '행운'];
        const selectedKeywords = [
            keywords[positiveHash % keywords.length],
            keywords[(positiveHash + 1) % keywords.length],
            keywords[(positiveHash + 2) % keywords.length]
        ].join(', ');

        // Select Fortunes
        const totals = [
            '하늘의 기운이 당신과 함께하니, 무엇을 하든 만사형통입니다. 자신감을 가지고 나아가세요.',
            '물 흐르듯 순탄한 하루가 예상됩니다. 작은 성과에 연연하지 말고 큰 그림을 보세요.',
            '예상치 못한 귀인이 나타나 도움을 줄 수 있습니다. 주변 사람들에게 항상 감사한 마음을 가지세요.',
            '노력한 만큼의 결실을 맺는 날입니다. 꾸준함이 빛을 발할 것입니다.',
            '변화의 기로에 서 있습니다. 신중한 선택이 미래의 큰 복을 불러올 것입니다.'
        ];
        const advices = [
            '말 한마디에 천 냥 빚을 갚는다는 것을 기억하세요. 긍정적이고 따뜻한 말을 사용하는 것이 좋습니다.',
            '과감한 도전보다는 안정을 추구하는 것이 유리한 날입니다. 현재의 것을 잘 지키세요.',
            '혼자 해결하기 어려운 문제는 주변에 도움을 청하세요. 협력을 통해 더 큰 시너지를 낼 수 있습니다.',
            '건강을 돌보는 것이 무엇보다 중요합니다. 가벼운 산책이나 스트레칭으로 몸과 마음을 챙기세요.',
            '새로운 것을 배우기에 아주 좋은 날입니다. 지적 호기심을 마음껏 펼쳐보세요.'
        ];

        return {
            score: `${score}점`,
            keywords: selectedKeywords,
            total: totals[positiveHash % totals.length],
            advice: advices[positiveHash % advices.length]
        };
    }

    function displayResult(result) {
        fortuneForm.style.display = 'none';
        
        fortuneScore.textContent = result.score;
        fortuneKeywords.textContent = result.keywords;
        resultTotal.textContent = result.total;
        resultAdvice.textContent = result.advice;

        fortuneResult.classList.remove('hidden');
    }

    // Initial validation check
    validateForm();
});