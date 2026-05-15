/* GRADE BOUNDARIES */

const gradeBoundaries = {

    10:91,
    9:81,
    8:71,
    7:61,
    6:51,
    5:41

};

const grid =
document.getElementById("subjectGrid");

/* CREATE CARDS */

subjects.forEach((subject,index)=>{

    let fields = "";

    /* WITH PRACTICAL */

    if(subject.type==="with"){

        fields = `

        <div class="input-group">
            <label>Sessional Exam (out of 50)</label>

            <input type="number"
            id="sessional${index}"
            min="0"
            max="50">
        </div>

        <div class="input-group">
            <label>Assignments (out of 40)</label>

            <input type="number"
            id="assignment${index}"
            min="0"
            max="40">
        </div>

        <div class="input-group">
            <label>Lab Practicals (out of 100)</label>

            <input type="number"
            id="lab${index}"
            min="0"
            max="100">
        </div>

        <div class="input-group">
            <label>LPW Exam (out of 40)</label>

            <input type="number"
            id="lpw${index}"
            min="0"
            max="40">
        </div>

        `;

    }

    /* WITHOUT PRACTICAL */

    else if(subject.type==="without"){

        fields = `

        <div class="input-group">
            <label>Sessional Exam (out of 50)</label>

            <input type="number"
            id="sessional${index}"
            min="0"
            max="50">
        </div>

        <div class="input-group">
            <label>Assignments (out of 50)</label>

            <input type="number"
            id="assignment${index}"
            min="0"
            max="50">
        </div>

        `;

    }

    /* PRACTICAL + LPW ONLY */

    else if(subject.type==="practical_lpw_only"){

        fields = `

        <div class="input-group">
            <label>Lab Practicals (out of 100)</label>

            <input type="number"
            id="lab${index}"
            min="0"
            max="100">
        </div>

        <div class="input-group">
            <label>LPW Exam (out of 40)</label>

            <input type="number"
            id="lpw${index}"
            min="0"
            max="40">
        </div>

        `;

    }

    grid.innerHTML += `

    <div class="card glass">

        <h2>${subject.name}</h2>

        ${fields}

        <div class="input-group">

            <label>Target Grade Point</label>

            <select id="grade${index}">

                <option value="0">Select Grade</option>

                <option value="10">10 (O)</option>

                <option value="9">9 (A+)</option>

                <option value="8">8 (A)</option>

                <option value="7">7 (B+)</option>

                <option value="6">6 (B)</option>

                <option value="5">5 (C)</option>

            </select>

        </div>

        <div class="result">

            <h3>Required Marks</h3>

            <p id="result${index}">
                --
            </p>

            <div class="extra" id="extra${index}">
            </div>

        </div>

    </div>

    `;

});

/* INPUT LIMITS */

document.addEventListener("input",(e)=>{

    if(e.target.type==="number"){

        let min =
        parseFloat(e.target.min);

        let max =
        parseFloat(e.target.max);

        if(e.target.value > max){

            e.target.value = max;

        }

        if(e.target.value < min){

            e.target.value = min;

        }

    }

    subjects.forEach((subject,index)=>{

        calculateCourse(index);

    });

});

/* CALCULATE */

function calculateCourse(index){

    const subject =
    subjects[index];

    const targetGrade =
    parseInt(
        document.getElementById(`grade${index}`).value
    );

    const result =
    document.getElementById(`result${index}`);

    const extra =
    document.getElementById(`extra${index}`);

    if(targetGrade===0){

        result.innerHTML = "--";

        result.style.color = "white";

        extra.innerHTML = "";

        updateSGPA();

        return;

    }

    const targetMarks =
    gradeBoundaries[targetGrade];

    /* PRACTICAL + LPW ONLY */

    if(subject.type==="practical_lpw_only"){

        const lab =
        parseFloat(
            document.getElementById(`lab${index}`).value
        ) || 0;

        const lpw =
        parseFloat(
            document.getElementById(`lpw${index}`).value
        ) || 0;

        let total = 0;

        total += (lab/100)*50;

        total += (lpw/40)*50;

        if(total >= targetMarks){

            result.innerHTML =
            "Already Secured";

            result.style.color =
            "#57ff9a";

        }

        else{

            result.innerHTML =
            `${targetMarks}/100`;

            result.style.color =
            "#1d9bf0";

        }

        extra.innerHTML =
        "No SEE for this course";

        updateSGPA();

        return;

    }

    let current = 0;

    /* WITHOUT PRACTICAL */

    if(subject.type==="without"){

        const sessional =
        parseFloat(
            document.getElementById(`sessional${index}`).value
        ) || 0;

        const assignment =
        parseFloat(
            document.getElementById(`assignment${index}`).value
        ) || 0;

        current += (sessional/50)*25;

        current += (assignment/50)*25;

    }

    /* WITH PRACTICAL */

    else if(subject.type==="with"){

        const sessional =
        parseFloat(
            document.getElementById(`sessional${index}`).value
        ) || 0;

        const assignment =
        parseFloat(
            document.getElementById(`assignment${index}`).value
        ) || 0;

        const lab =
        parseFloat(
            document.getElementById(`lab${index}`).value
        ) || 0;

        const lpw =
        parseFloat(
            document.getElementById(`lpw${index}`).value
        ) || 0;

        current += (sessional/50)*15;

        current += (assignment/40)*10;

        current += (lab/100)*15;

        current += (lpw/40)*10;

    }

    const weightedSEERequired =
    targetMarks - current;

    const requiredSEE =
    (weightedSEERequired/50)*100;

    if(requiredSEE > 100){

        result.innerHTML =
        "Target Unrealistic";

        result.style.color =
        "#ff4d6d";

        extra.innerHTML =
        `${requiredSEE.toFixed(1)}/100 required`;

    }

    else if(requiredSEE <= 0){

        result.innerHTML =
        "Already Secured";

        result.style.color =
        "#57ff9a";

        extra.innerHTML =
        "";

    }

    else{

        result.innerHTML =
        `${requiredSEE.toFixed(1)}/100`;

        result.style.color =
        "#1d9bf0";

        extra.innerHTML =
        "";

    }

    updateSGPA();

}

/* UPDATE SGPA */

function updateSGPA(){

    let total = 0;

    subjects.forEach((subject,index)=>{

        const grade =
        parseInt(
            document.getElementById(`grade${index}`).value
        ) || 0;

        total += grade;

    });

    const sgpa =
    total / subjects.length;

    document.getElementById("sgpa").innerHTML =
    sgpa.toFixed(2);

}

updateSGPA();
