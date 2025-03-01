let selectedTechnique = '';

function selectTechnique(technique) {
    selectedTechnique = technique;
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
    document.getElementById('learning-schedule').style.display = 'block';
    await generateLearningSchedule(topic);
}

async function generateLearningSchedule(topic) {
    const scheduleDiv = document.getElementById('learning-schedule');
    scheduleDiv.innerHTML = '<p class="loading">Loading schedule...</p>';

    let schedulePrompt = '';
    switch (selectedTechnique) {
        case '5-step':
            schedulePrompt = `Generate a detailed 5-day learning schedule for mastering ${topic} using a 5-step process: Identify, Explain simply, Break down, Apply practically, and Review/reinforce. Provide daily tasks with clear instructions and estimated times.`;
            break;
        case 'feynman':
            schedulePrompt = `Generate a 3-day learning schedule for mastering ${topic} using the Feynman Technique: Explain as if teaching a child, Identify gaps, Fill gaps, Simplify. Provide daily tasks with clear instructions and estimated times.`;
            break;
        case 'pomodoro':
            schedulePrompt = `Generate a 1-week learning schedule for ${topic} using the Pomodoro Technique (25-minute focus sessions with 5-minute breaks). Provide daily tasks, session counts, and clear instructions for each day.`;
            break;
        case 'spaced-repetition':
            schedulePrompt = `Generate a 2-week learning schedule for ${topic} using Spaced Repetition, with reviews at increasing intervals (e.g., Day 1, Day 3, Day 7, Day 14). Provide daily tasks and clear instructions.`;
            break;
        case 'mind-mapping':
            schedulePrompt = `Generate a 3-day learning schedule for ${topic} using Mind Mapping: Create a central idea, Branch out concepts, Connect details, Visualize. Provide daily tasks with clear instructions and estimated times.`;
            break;
        case 'sq3r':
            schedulePrompt = `Generate a 5-day learning schedule for ${topic} using the SQ3R Technique: Survey, Question, Read, Recite, Review. Provide daily tasks with clear instructions and estimated times.`;
            break;
        default:
            scheduleDiv.innerHTML = '<p>Technique not supported. Please select another.</p>';
            return;
    }

    try {
        const response = await getLLMResponse(topic, schedulePrompt);
        scheduleDiv.innerHTML = `
            <h2>Learning Schedule for ${topic} (${selectedTechnique.charAt(0).toUpperCase() + selectedTechnique.slice(1)} Technique)</h2>
            <p>${response}</p>
            <button onclick="downloadPDF('${topic}', '${selectedTechnique}')">Download Schedule as PDF</button>
        `;
    } catch (error) {
        scheduleDiv.innerHTML = `
            <p>Error fetching schedule: ${error.message}</p>
            <p>Unable to generate a schedule. Download instructions on how to implement learning manually:</p>
            <a href="/learning-instructions.pdf" download="learning-instructions.pdf">Download Learning Instructions (PDF)</a>
        `;
    }

    addStartOverButton();
}

function addStartOverButton() {
    const scheduleDiv = document.getElementById('learning-schedule');
    const backButton = document.createElement('button');
    backButton.textContent = 'Start Over';
    backButton.className = 'start-over-button';
    backButton.onclick = () => {
        document.getElementById('learning-schedule').innerHTML = '';
        document.getElementById('learning-schedule').style.display = 'none';
        document.getElementById('techniques').style.display = 'block';
    };
    scheduleDiv.appendChild(backButton);
}

async function getLLMResponse(topic, prompt) {
    try {
        const response = await fetch('/api/llm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, prompt })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.text || 'Error fetching response.';
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

function downloadPDF(topic, technique) {
    const element = document.getElementById('learning-schedule');
    const opt = {
        margin: 0.5,
        filename: `learning-schedule-${topic}-${technique}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
}
