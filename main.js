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

    const formElements = [userName, birthDate, birthTime]; // Exclude radio buttons from 'input' loop

    // --- Event Listeners ---

    // Validate form on input change for text, date, select
    formElements.forEach(el => {
        el.addEventListener('input', validateForm);
    });
    // Validate form on change for time unknown checkbox and gender radio buttons
    timeUnknown.addEventListener('change', validateForm);
    genderMale.addEventListener('change', validateForm);
    genderFemale.addEventListener('change', validateForm);

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
            '오호! 오늘은 마치 주인공처럼 스포트라이트를 받는 날이 되겠어요. 당신의 매력이 폴폴 풍겨 주변 사람들을 사로잡을 예감! 😉',
            '걱정은 잠시 내려놓으셔도 좋아요. 오늘은 물 흐르듯 잔잔하고 평화로운 하루가 당신을 기다리고 있답니다. 😌',
            '두둥! 예상치 못한 행운의 바람이 살랑~ 불어올 거예요. 작은 변화에도 귀 기울여보세요. 🍀',
            '오늘은 당신의 노력이 빛을 발하는 날! 그동안 갈고닦았던 실력을 마음껏 뽐내보시는 건 어떨까요? ✨',
            '새로운 인연과의 즐거운 만남이 기대되는군요. 혹시 아나요? 당신의 특별한 연결고리가 될지! 🤝'
        ];
        const advices = [
            '꿀팁 하나 드릴까요? 오늘은 당신의 미소 한 스푼이 만능 해결사가 될 거예요. 활짝 웃어보세요! 😊',
            '가끔은 잠시 멈춰 서서 나 자신을 돌보는 시간이 필요해요. 좋아하는 차 한 잔과 함께 여유를 즐겨보세요. ☕',
            '고민이 있다면 혼자 끙끙 앓지 마세요. 믿음직한 친구나 동료에게 살짝 기대보는 것도 좋은 방법이랍니다. 🫂',
            '건강이 최고! 오늘은 가볍게 스트레칭하며 몸을 깨우거나, 신선한 공기를 마시러 산책을 나서보는 건 어떨까요? 🚶‍♀️',
            '지루한 일상에 재미를 더해줄 무언가를 찾아보세요. 새로운 취미나 흥미로운 책 한 권이 당신을 기다려요! 📚'
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