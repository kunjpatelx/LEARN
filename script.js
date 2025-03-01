let selectedTechnique = '';

function selectTechnique(technique) {
    selectedTechnique = technique;
    document.getElementById('intro').style.display = 'none';
    document.getElementById('techniques').style.display = 'none';
    document.getElementById('topic-input').style.display = 'block';
}

async function startLearning() {
    const topic = document.getElementById('topic').value;
    if (!topic) {
        alert('Please enter a topic.');
        return;
    }
    document.getElementById('topic-input').style.display = 'none';
    document.getElementById('learning-steps').style.display = 'block';
    if (selectedTechnique === '5-step') {
        await start5StepLearning(topic);
    } else if (selectedTechnique === 'feynman') {
        await startFeynmanLearning(topic);
    } else if (selectedTechnique === 'pomodoro') {
        await startPomodoroLearning(topic);
    } else if (selectedTechnique === 'spaced-repetition') {
        await startSpacedRepetitionLearning(topic);
    } else if (selectedTechnique === 'mind-mapping') {
        await startMindMappingLearning(topic);
    }
}

async function start5StepLearning(topic) {
    const steps = [
        'Explain the topic in simple terms.',
        'Break it down further into smaller parts.',
        'Apply it practically with an example.',
        'Review and reinforce the key points.'
    ];
    await processSteps(topic, steps);
}

async function startFeynmanLearning(topic) {
    const steps = [
        'Explain the topic as if teaching it to a child.',
        'Identify gaps in your understanding.',
        'Fill those gaps with a clear explanation.',
        'Simplify your explanation further.'
    ];
    await processSteps(topic, steps);
}

async function startPomodoroLearning(topic) {
    const steps = [
        'Learn about the topic for 25 minutes (simulated here).',
        'Take a 5-minute break (simulated response).',
        'Review what you learned in the next 25 minutes.',
        'Summarize key points after a break.'
    ];
    await processSteps(topic, steps);
}

async function startSpacedRepetitionLearning(topic) {
    const steps = [
        'Introduce the topic with a basic overview.',
        'Review it after a short interval (e.g., 1 day).',
        'Reinforce it after a longer interval (e.g., 1 week).',
        'Master it with a final review.'
    ];
    await processSteps(topic, steps);
}

async function startMindMappingLearning(topic) {
    const steps = [
        'Create a central idea for the topic.',
        'Branch out key concepts related to it.',
        'Connect those concepts with details.',
        'Visualize the full mind map in words.'
    ];
    await processSteps(topic, steps);
}

async function processSteps(topic, steps) {
    for (let i = 0; i < steps.length; i++) {
        const stepDiv = document.createElement('div');
        stepDiv.innerHTML = `<h3>Step ${i + 1}: ${steps[i]}</h3>`;
        document.getElementById('learning-steps').appendChild(stepDiv);
        const response = await getLLMResponse(topic, steps[i]);
        const responseP = document.createElement('p');
        responseP.textContent = response;
        stepDiv.appendChild(responseP);
        if (i < steps.length - 1) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Your thoughts or questions';
            stepDiv.appendChild(input);
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            stepDiv.appendChild(nextButton);
            await new Promise(resolve => nextButton.onclick = resolve);
        }
    }
    addStartOverButton();
}

function addStartOverButton() {
    const backButton = document.createElement('button');
    backButton.textContent = 'Start Over';
    backButton.onclick = () => {
        document.getElementById('learning-steps').innerHTML = '';
        document.getElementById('learning-steps').style.display = 'none';
        document.getElementById('intro').style.display = 'block';
        document.getElementById('techniques').style.display = 'block';
    };
    document.getElementById('learning-steps').appendChild(backButton);
}

async function getLLMResponse(topic, prompt) {
    try {
        const response = await fetch('http://localhost:3000/api/llm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, prompt })
        });
        const data = await response.json();
        return data.text || 'Error fetching response.';
    } catch (error) {
        return `Error: ${error.message}`;
    }
}
