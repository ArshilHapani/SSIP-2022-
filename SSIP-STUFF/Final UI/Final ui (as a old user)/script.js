let sendForm = document.querySelector('#chatform'),
    textInput = document.querySelector('.chatbox'),
    chatList = document.querySelector('.chatlist'),
    userBubble = document.querySelectorAll('.userInput'),
    botBubble = document.querySelectorAll('.bot__output'),
    animateBotBubble = document.querySelectorAll('.bot__input--animation'),
    overview = document.querySelector('.chatbot__overview'),
    hasCorrectInput,
    imgLoader = false,
    animationCounter = 1,
    animationBubbleDelay = 600,
    input,
    previousInput,
    isReaction = false,
    unkwnCommReaction = "I didn't quite get that.",
    chatbotButton = document.querySelector(".submit-button")

sendForm.onkeydown = function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();

        //No mix ups with upper and lowercases
        let input = textInput.value.toLowerCase();

        //Empty textarea fix
        if (input.length > 0) {
            createBubble(input)
        }
    }
};

sendForm.addEventListener('submit', function (e) {
    //so form doesnt submit page (no page refresh)
    e.preventDefault();

    //No mix ups with upper and lowercases
    let input = textInput.value.toLowerCase();
   
    //Empty textarea fix
    if (input.length > 0) {
        createBubble(input)
    }
}) //end of eventlistener

let createBubble = function (input) {
    //create input bubble
    let chatBubble = document.createElement('li');
    chatBubble.classList.add('userInput');

    //adds input of textarea to chatbubble list item
    chatBubble.innerHTML = input;

    //adds chatBubble to chatlist
    chatList.appendChild(chatBubble)

    checkInput(input);
}

let checkInput = function (input) {
    hasCorrectInput = false;
    isReaction = false;
    //Checks all text values in possibleInput
    for (let textVal in possibleInput) {
        //If user reacts with "yes" and the previous input was in textVal
        if (input == "yes" || input.indexOf("yes") >= 0) {
            if (previousInput == textVal) {
                console.log("sausigheid");

                isReaction = true;
                hasCorrectInput = true;
                botResponse(textVal);
            }
        }
        if (input == "no" && previousInput == textVal) {
            unkwnCommReaction = "For a list of commands type: Commands";
            unknownCommand("I'm sorry to hear that :(")
            unknownCommand(unkwnCommReaction);
            hasCorrectInput = true;
        }
        //Is a word of the input also in possibleInput object?
        if (input == textVal || input.indexOf(textVal) >= 0 && isReaction == false) {
            console.log("succes");
            hasCorrectInput = true;
            botResponse(textVal);
        }
    }
    //When input is not in possibleInput
    if (hasCorrectInput == false) {
        console.log("failed");
        unknownCommand(unkwnCommReaction);
        hasCorrectInput = true;
    }
}

// debugger;

function botResponse(textVal) {
    //sets previous input to that what was called
    // previousInput = input;

    //create response bubble
    let userBubble = document.createElement('li');
    userBubble.classList.add('bot__output');

    if (isReaction == true) {
        if (typeof reactionInput[textVal] === "function") {
            //adds input of textarea to chatbubble list item
            userBubble.innerHTML = reactionInput[textVal]();
        } else {
            userBubble.innerHTML = reactionInput[textVal];
        }
    }

    if (isReaction == false) {
        //Is the command a function?
        if (typeof possibleInput[textVal] === "function") {
            // console.log(possibleInput[textVal] +" is a function");
            //adds input of textarea to chatbubble list item
            userBubble.innerHTML = possibleInput[textVal]();
        } else {
            userBubble.innerHTML = possibleInput[textVal];
        }
    }
    //add list item to chatlist
    chatList.appendChild(userBubble) //adds chatBubble to chatlist

    // reset text area input
    textInput.value = "";
}

function unknownCommand(unkwnCommReaction) {
    // animationCounter = 1;

    //create response bubble
    let failedResponse = document.createElement('li');

    failedResponse.classList.add('bot__output');
    failedResponse.classList.add('bot__output--failed');

    //Add text to failedResponse
    failedResponse.innerHTML = unkwnCommReaction; //adds input of textarea to chatbubble list item

    //add list item to chatlist
    chatList.appendChild(failedResponse) //adds chatBubble to chatlist

    animateBotOutput();

    // reset text area input
    textInput.value = "";

    //Sets chatlist scroll to bottom
    chatList.scrollTop = chatList.scrollHeight;

    animationCounter = 1;
}

function responseText(e) {

    let response = document.createElement('li');

    response.classList.add('bot__output');

    //Adds whatever is given to responseText() to response bubble
    response.innerHTML = e;

    chatList.appendChild(response);

    animateBotOutput();

    console.log(response.clientHeight);

    //Sets chatlist scroll to bottom
    setTimeout(function () {
        chatList.scrollTop = chatList.scrollHeight;
        console.log(response.clientHeight);
    }, 0)
}

function responseImg(e) {
    let image = new Image();

    image.classList.add('bot__output');
    //Custom class for styling
    image.classList.add('bot__outputImage');
    //Gets the image
    image.src = "/images/" + e;
    chatList.appendChild(image);

    animateBotOutput()
    if (image.completed) {
        chatList.scrollTop = chatList.scrollTop + image.scrollHeight;
    }
    else {
        image.addEventListener('load', function () {
            chatList.scrollTop = chatList.scrollTop + image.scrollHeight;
        })
    }
}

//change to SCSS loop
function animateBotOutput() {
    chatList.lastElementChild.style.animationDelay = (animationCounter * animationBubbleDelay) + "ms";
    animationCounter++;
    chatList.lastElementChild.style.animationPlayState = "running";
}

function commandReset(e) {
    animationCounter = 1;
    previousInput = Object.keys(possibleInput)[e];
}

// help
let possibleInput = {
    // "hlep" : this.help(),

    "help": function () {
        responseText("You can type a command in the chatbox")
        responseText("Something like &quot;GTU Result&rsquo; Syllabus&quot;")
        responseText("Did you find a bug or problem?<a href='' target='_blank'> Feedback us!</a>")
        commandReset(0);
        return
    },
    "exam time table": function () {
        responseText("Select link <br><a href='https://timetable.gtu.ac.in/' target='_blank'>Time Table</a>");

        commandReset(1);
        return
    },

    "exam fee": function () {
        responseText("Time Table")
        commandReset(2);
        return
    },

    "syllabus": function () {
        responseText("Type your Stream (Ex. 03 Diploma) <br><button class='syllabus' onclick='diplomaSelect()'>03 Diploma</button><button class='syllabus'>01 Bachelor</button><button class='syllabus'>07 Master</button>")
        commandReset(3);
        return
    },
    "03 diploma": function () {
        responseText("Type Branch (Ex. it 0316,ce 0307,civil 0306,ee 0309)<br><button class='syllabus' onclick='IT0316()'>Information Technology </button><button class='syllabus' onclick='CE0307()'>Computer Engineering</button><button class='syllabus' onclick='ME0319()'>Mechanical Engineering</button><br><button class='syllabus' onclick='CIVIL0306()'>Civil Engineering</button><button class='syllabus' onclick='EE0309()'>Electrical Engineering</button>")
        commandReset(4);
        return
    },
    "check payment": function () {
        responseText("Currently under development");
        commandReset(5);
        return
    },
    "commands": function () {
        responseText("This is a list of commands Vidhya knows:")
        responseText("About us, Exam Forms, Exam Time Table, Hall Ticket, Results, Admission, Syllabus,Circulars,More,Check Payment Status");
        commandReset(6);
        return
    },
    "about us": function () {
        responseText("What you want to know? Type it!<br>  <a href='https://www.old22.gtu.ac.in/page.aspx?p=AboutUs' class='InternalLink' target='_blank'>GTU</a> <br> <a href='AboutUs.html' class='InternalLink' target='_blank'>GTU bot</a>")
        commandReset(7);
        return
    },


    "it 0316": function () {
        responseText("Type your semister (Ex first 0316)<br> <button class='syllabus' onclick='its1()'>First</button><button class='syllabus' onclick='its2()'>Second</button><br><button class='syllabus' onclick='its3()'>Third</button><button class='syllabus' onclick='its4()'>Fourth</button><br><button class='syllabus' onclick='its5()'>Fifth</button><button class='syllabus' onclick='its6()'>Sixth</button>")
        commandReset(8);
        return
    },
    "first 0316": function () {
        //    responseText("Sem 1 <a href='https://i.postimg.cc/DyJFVPJz/IT-1-DIPLOMA.png' target='_blank'>Syllabus</a>");
        responseText("Sem 1 IT <a href='https://drive.google.com/file/d/1-FBhX79_TYthcx9DimrAWLGGcCBYjs2V/view?usp=sharing' target='_blank'>Syllabus</a>");
        commandReset(9);
        return
    },
    "second 0316": function () {
        // responseText("Sem 2 <a href='https://i.postimg.cc/xdTnZDLw/IT-2-DIPLOMA.png' target='_blank'>Syllabus</a>");
        responseText("Sem 2 IT <a href='https://drive.google.com/file/d/1Q_kkQwWMry-ef4Lguectf7iWl_-oCFY8/view?usp=sharing' target='_blank'>Syllabus</a>");
        commandReset(10);
        return
    },
    "third 0316": function () {
        responseText("Sem 3 IT <a href='https://drive.google.com/file/d/1Jq7xX4azJVsrc6cZ0LDs44EgJS6gzkgO/view?usp=sharing' target='_blank'>Syllabus</a>");
        commandReset(11);
        return
    },
    "fourth 0316": function () {
        responseText("Sem 4 IT <a href='https://drive.google.com/file/d/1lm-oNpESZan7Z78OsQWqPi1iX1zXQS2T/view?usp=sharing' target='_blank'>Syllabus</a>");
        commandReset(12);
        return
    },
    "fifth 0316": function () {
        responseText("Sem 5 IT <a href='https://drive.google.com/file/d/1yVY_5uyu8cmeM13R41vEF036rTto4-II/view?usp=sharing' target='_blank'>Syllabus</a>");
    },
    "sixth 0316": function () {
        responseText("Sem 6 IT <a href='https://drive.google.com/file/d/1hDiS8gPKjB8-fNgeiUESZDI1jWd9_hkM/view?usp=sharing' target='_blank'>Syllabus</a>");
    },

    "ce 0307": function () {
        responseText("Type your semister <br> <button class='syllabus'>0306 first</button><button class='syllabus'>0306 Second</button><br><button class='syllabus'>0306 Third</button><button class='syllabus'>0306 Fourth</button><br><button class='syllabus'>0306 Fifth</button><button class='syllabus'>0306 Sixth</button>")
        // commandReset(9);
        return
    },
    "first 0307": function () {
        responseText("Sem 1 CE <a href='https://drive.google.com/file/d/1thoK83lypMp5WpxoGA9qBFdvKjzfI5yf/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "second 0307": function () {
        responseText("Sem 2 CE <a href='https://drive.google.com/file/d/1EN6sCwUZO8_yaIfZ7bx__Y8le6LAkv4p/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "third 0307": function () {
        responseText("Sem 3 CE <a href='https://drive.google.com/file/d/1UaMZSAuIU-VhwrTQyaVCVqdkjPWLaA2w/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "fourth 0307": function () {
        responseText("Sem 4 CE <a href='https://drive.google.com/file/d/14LVlZXtDTjcMGjaYwANcj6UxnrBUHuSN/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "fifth 0307": function () {
        responseText("Sem 5 CE <a href='https://drive.google.com/file/d/1LoUS7IDh-_JpDs99410l6qm6X8yiPdeu/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "sixth 0307": function () {
        responseText("Sem 6 CE <a href='https://drive.google.com/file/d/1WwmkYgyCoJ5K8byLTLuUYu52ZhD4m26v/view?usp=sharing' target='_blank'>Syllabus</a>");

    },


    "civil 0306": function () {
        responseText("Type your semister <br> <button class='syllabus'>0307 First</button><button class='syllabus'>0307 Second</button><br><button class='syllabus'>0307 Third</button><button class='syllabus'>0307 Fourth</button><br><button class='syllabus'>0307 Fifth</button><button class='syllabus'>0307 Sixth</button>")
        // commandReset(10);
        return
    },
    "first 0306": function () {
        responseText("Sem 1 civil <a href='https://drive.google.com/file/d/17-D_haO2_1efqar0i3okBz2HVsIuJzIP/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "second 0306": function () {
        responseText("Sem 2 civil <a href='https://drive.google.com/file/d/1FrMxJwN6tmIshJUhMEAOMN8YUHBgF56K/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "third 0306": function () {
        responseText("Sem 3 civil <a href='https://drive.google.com/file/d/1dSCuZp49LAuruxhDwT9lUhtZpmXbbLqg/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "fourth 0306": function () {
        responseText("Sem 4 civil <a href='https://drive.google.com/file/d/14FxdoREd-fDr05OxG5qPtl2UOYbU5K2N/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "fifth 0306": function () {
        responseText("Sem 5 civil <a href='https://drive.google.com/file/d/1E9rdUm5PXdOjM2HNvEuighJdRUQNDjNd/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "sixth 0306": function () {
        responseText("Sem 6 civil <a href='https://drive.google.com/file/d/1Jxts37BU8HgWq5zktP34Z3MTb0Zgxe9m/view?usp=sharing' target='_blank'>Syllabus</a>");

    },



    "me 0319": function () {
        responseText("Type your semister <br> <button class='syllabus'>0319 First</button><button class='syllabus'>0319 Second</button><br><button class='syllabus'>0319 Third</button><button class='syllabus'>0319 Fourth</button><br><button class='syllabus'>0319 Fifth</button><button class='syllabus'>0319 Sixth</button>")
        // commandReset(11);
        return
    },
    "first 0319": function () {
        responseText("Sem 1 me <a href='https://drive.google.com/file/d/1id7c-LFdt1IaahQR0pPSRTPyVk6rJzea/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "second 0319": function () {
        responseText("Sem 2 me <a href='https://drive.google.com/file/d/1o4CI9Bwnmkn8h6x4RFwCM2OCrMflaFax/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "third 0319": function () {
        responseText("Sem 3 me <a href='https://drive.google.com/file/d/19GFGc0KYEk-7CeYzH0uNLBVCcgcpu7mb/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "fourth 0319": function () {
        responseText("Sem 4 me <a href='https://drive.google.com/file/d/1FnxoEL34VdSb-42UxWg5TU1WZ-U1l3Ay/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "fifth 0319": function () {
        responseText("Sem 5 me. <a href='https://drive.google.com/file/d/1V8DLRKISpMHWdip_Q07Ln1Nj0AdV1eLU/view?usp=sharing' target='_blank'>Syllabus</a>");

    },
    "sixth 0319": function () {
        responseText("Sem 6 me <a href='https://drive.google.com/file/d/1oZD2ax-MSHy0_CfNanNzKUIEKYTz5-Va/view?usp=sharing' target='_blank'>Syllabus</a>");

    },


    "ee 0309": function () {
        responseText("Type your semister <br> <button class='syllabus'>0309 First</button><button class='syllabus'>0309 Second</button><br><button class='syllabus'>0309 Third</button><button class='syllabus'>0309 Fourth</button><br><button class='syllabus'>0309 Fifth</button><button class='syllabus'>0309 Sixth</button>")
        // commandReset(12);
        return
    },


    "results": function () {
        responseText("What you want to know? Type it <br> <a href='https://www.gturesults.in/' target='_blank'>GTU Result Portal</a> <br><button class='syllabus'>My result</button>")
        commandReset(13);
        return
    },
    "my result": function () {
        responseText("Which semester reult , you want to see?<br><button class='syllabus'>1</button><button class='syllabus'>2</button><button class='syllabus'>3</button><br><button class='syllabus'>4</button><button class='syllabus'>5</button><button class='syllabus'>6</button>")
        commandReset(14);
        return
    },
    "exam form": function () {
        responseText("Select your link <br><a href='https://timetable.gtu.ac.in/' target='_blank'>Exam form</a>")
        commandReset(15);
        return
    },
    "hall ticket": function () {
        responseText("Select your hall ticket type <br> <a href='https://www.ccc.gtu.ac.in/DownloadHallTicket.aspx' target='_blank'>Hall ticket of GTU CCC</a><br><a href='https://student.gtu.ac.in/Login.aspx' target='_blank'>Download Hall ticket</a><br><b>Steps to download Hall ticket</b> <ul class='List_Style'><li>Visit the Gujarat Technological University Official website www.gtu.ac.in</li><li>GTU's Home page will appear on the screen.</li><li>On the home page click on Students Zone.</li><li>Under this section, you will find the students corners.</li><li>Click on it and select your year.</li><li>Find the Hall ticket link and click on it.</li><li>Enter your application number and submit.</li><li>Your Exam Hall Ticket will appear on the screen.</li><li>Download your hall ticket and take a hard copy of it.</li></ul>")
    },
    "more": function () {
        responseText("For more informaton visit <br> <a href='https://www.instagram.com/gtumedia/?hl=en' target='_blank'>Instagram</a><br><a href='https://www.facebook.com/gtuoffice/' target='_blank'>Facebook</a><br><a href='https://twitter.com/gtugujarat?lang=en' target='_blank'>Twitter</a>")
    },
    "circular": function () {
        responseText("<a href='https://www.gtu.ac.in/Circular.aspx' target='_blank'>GTU Circular</a>")
    },
    "admission": function () {
        responseText("<p>Admissions to the first year of the Professional Diploma Courses shall be given as under:<br><br>(a) All the Government Seats shall be filled in on the basis of merit list prepared by the Admission Committee, for admissions to the First Year of the Professional<br>Diploma Courses.<br><br>(b) All the Management Seats shall be filled in by the management of the respective Professional Educational lleges or Institutions, on the basis of inter-se merit list of the candidates whose names appear in the merit list prepared by the respective college or institution. <br>Procedure<ol listtype='1'><li>1) Registration</li><li>2) Document Verification</li><li>3) Publication of Merit List</li><li>4) Choice Filling</li><li>5) Seat Allotment</li></ol></p><a href='https://gsms.gtu.ac.in/admission/' target='_blank'> GTU Admission Process</a> ")
    },
    "feedback": function () {
        responseText("Feedback available for<br><a href='https://gsms.gtu.ac.in/student-feedback/' target='_blank'>GTU</a> <br><a href='rating.html' target='_blank'>GTU Bot</a>")
    },
    "scholarship": function () {
        responseText("Select link <br><a href='https://drive.google.com/file/d/1FU8rp74u2Jm-vX588KWR5Cg8FNRWJfES/view?usp=sharing' target='_blank'>Scholarship</a>")
    },
    "marking scheme": function () {
        responseText("Marking Schemes in GTU <br><a href='https://drive.google.com/file/d/1HqqP1IGfq_QHfIva0KDvaV4qtDEFM7rY/view?usp=sharing' target='_blank'>GTU Result</a><br><a href='https://drive.google.com/file/d/1q2s7NUrSx4jW6LZ-4u5x2V2M7QOTm_z_/view?usp=sharing' target='_blank'>Guess Mark System</a>")
    },
    "quick links": function () {
        responseText("Quick Links <br><a href='https://www.gtu.ac.in/' target='_blank'>Gujarat Technologcal University (GTU)</a><br><a href='http://www.jacpcldce.ac.in/' target='_blank'>Admission Committee for Professional Courses (ACPC)</a><br><a href='http://www.frcgujarat.org/' target='_blank'>Fee Regulatory Committee(Gujarat)FRC</a><br><a href='https://www.aicte-india.org/' target='_blank'>All India Council for Technical Education (AICTE)</a><br><a href='https://www.ugc.ac.in/' target='_blank'>University Grants Commission (UGC)</a>")
    },
    "/menu": function () {
        responseText("<a href='#button'>Go to menu</a>")
    }
}


let reactionInput = {
    "best work": function () {
        //Redirects you to a different page after 3 secs
        responseText("GTU have never done any best work :-) ");
        responseText("...")
        animationCounter = 1;
        return
    },
    // "Exam Time Table": function () {
    //     responseText("Time table");
    //     return
    // }


}
const About = () => {

    document.getElementById('chatbox').value = 'about us';

}
const ExamForm = () => {
    // textInput.textContent = "exam fees"
    document.getElementById('chatbox').value = 'exam form';

}
const ExamTimeTable = () => {
    // textInput.textContent = "exam time table"
    document.getElementById('chatbox').value = 'exam time table';
}
const HallTicket = () => {
    document.getElementById('chatbox').value = 'hall ticket';
}
const Result = () => {
    // let link = "https://www.gturesults.in/";
    // textInput.textContent = "results"
    document.getElementById('chatbox').value = 'results';
}
const Admission = () => {
    // let link = "https://gsms.gtu.ac.in/admission/";
    // window.open(link);
    document.getElementById('chatbox').value = 'admission';
}

const Syllabus = () => {
    // textInput.textContent = "syllabus"
    document.getElementById('chatbox').value = 'syllabus';
}

const CircularRedirect = () => {
    // let link = "https://www.gtu.ac.in/Circular.aspx";
    // let win = window.open(link)
    document.getElementById('chatbox').value = 'circular';
}
const CheckPayment = ()=>{
    document.getElementById('chatbox').value = 'check payment';
}
const More = ()=>{
    document.getElementById('chatbox').value = 'more';
}
const Feedback = () => {
    // let link = "rating.html"
    document.getElementById('chatbox').value = 'feedback';
    // window.open(link)
}

const Scholarship = () => {
    // let link = "https://drive.google.com/file/d/1FU8rp74u2Jm-vX588KWR5Cg8FNRWJfES/view?usp=sharing"
    document.getElementById('chatbox').value = 'scholarship';
    // window.open(link)
}
const MarkSystem = () =>{
    document.getElementById('chatbox').value = 'marking scheme';
}
const QuickLink = () =>{
    document.getElementById('chatbox').value = 'quick links';
}




const diplomaSelect = () => {
    // textInput.textContent = "Dipoma";
    document.getElementById('chatbox').value = '03 diploma';
}

const IT0316 = ()=>{
    document.getElementById('chatbox').value = 'it 0316';
}
const its1 = ()=>{
    document.getElementById('chatbox').value = 'first 0316';
}
const its2 = ()=>{
    document.getElementById('chatbox').value = 'second 0316';
}
const its3 = ()=>{
    document.getElementById('chatbox').value = 'third 0316';
}
const its4 = ()=>{
    document.getElementById('chatbox').value = 'fourth 0316';
}
const its5 = ()=>{
    document.getElementById('chatbox').value = 'fifth 0316';
}
const its6 = ()=>{
    document.getElementById('chatbox').value = 'sixth 0316';
}




const CE0307 = ()=>{
    document.getElementById('chatbox').value = 'ce 0307';
}
const ME0319 = ()=>{
    document.getElementById('chatbox').value = 'me 0319';
}
const Civil0306 = ()=>{
    document.getElementById('chatbox').value = 'civil 0306';
}
const EE0309 = ()=>{
    document.getElementById('chatbox').value = 'ee 0309';
}
