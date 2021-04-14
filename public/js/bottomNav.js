$(document).ready(() => {
  $("#bottom-nav-template").append(getBottomNavbar());
  executeQuiz();
});

function executeQuiz() {
  
}

/** Insert View */
function getBottomNavbar() {
  return `      
        <nav class="navbar navbar-dark">
            <div class="mr-auto d-inline-flex">
        
                <a class="nav-link nav-txt" href="/quiz" id="quiz-btn"><em class="fas fa-question-circle" aria-hidden="true"></em></a>
                <a class="nav-link nav-txt" href="/shelter" id="shelter-btn"><em class="fas fa-home" aria-hidden="true"></em></a>
                <a class="nav-link nav-txt" href="/emergencyContact" id="emergencyContact-btn"><em class="far fa-address-book" aria-hidden="true"></em></a>
                <!-- Emergency Button needs to be centered-->
                <a class="nav-link nav-txt" href="/emergencyButton" id="emergency-btn"><em class="fas fa-exclamation-circle" aria-hidden="true"></em></a>
                <a class="nav-link nav-txt" href="/activity" id="activity-btn"><em class="fa fa-hands-helping" aria-hidden="true"></em></a>
                <a class="nav-link nav-txt" href="#" id="smap-icon"><em class="fas fa-map-marked-alt" aria-hidden="true"></em></a>
                <a class="nav-link nav-txt" href="#" id="smap-icon"><em class="fa fa-book" aria-hidden="true"></em></a>
            </div>
        </nav> `;
}

