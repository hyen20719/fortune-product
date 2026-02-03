document.addEventListener('DOMContentLoaded', () => {
    const showFortuneButton = document.getElementById('show-fortune-button');
    const fortuneForm = document.getElementById('fortune-form');
    const viewResultButton = document.getElementById('view-result-button');
    const fortuneResult = document.getElementById('fortune-result');
    const resultText = document.getElementById('result-text');
    const userNameInput = document.getElementById('user-name');
    const tryAgainButton = document.getElementById('try-again-button');

    showFortuneButton.addEventListener('click', () => {
        fortuneForm.classList.remove('hidden');
        showFortuneButton.classList.add('hidden');
    });

    viewResultButton.addEventListener('click', () => {
        const userName = userNameInput.value;
        if (userName.trim() === '') {
            alert('이름을 입력해주세요.');
            return;
        }

        const fortunes = [
            `${userName}님, 오늘은 새로운 기회가 찾아오는 날입니다. 주변을 잘 살펴보세요!`,
            `오늘은 행운이 가득한 날! ${userName}님이 계획한 모든 일이 순조롭게 진행될 것입니다.`,
            `뜻밖의 좋은 소식이 ${userName}님을 기다리고 있습니다. 긍정적인 마음을 유지하세요.`,
            `${userName}님, 오늘은 잠시 쉬어가는 것이 좋겠습니다. 재충전의 시간을 가지세요.`,
            `주변 사람들과의 관계에서 좋은 일이 생길 것입니다. ${userName}님의 따뜻한 마음에 모두가 감동할 거예요.`
        ];

        const randomIndex = Math.floor(Math.random() * fortunes.length);
        const selectedFortune = fortunes[randomIndex];

        resultText.textContent = selectedFortune;
        fortuneForm.classList.add('hidden');
        fortuneResult.classList.remove('hidden');
    });

    tryAgainButton.addEventListener('click', () => {
        fortuneResult.classList.add('hidden');
        showFortuneButton.classList.remove('hidden');
        userNameInput.value = '';
    });
});
