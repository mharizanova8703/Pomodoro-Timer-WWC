$(document).ready(function () {
    var breakCounter = 5;
    var sessionCounter = 25;
    var sessionTime = 1500;
    var breakTime = 300;
    var isRunning = false;
    var intervalId = null;

    $('#break-increment').click(function () {
        if (breakCounter < 60) {
            breakCounter++;
            breakTime = (breakTime % 60 === 0) ? breakTime + 60 : breakTime - (breakTime % 60) + 120;
            updateDisplay();
        }
    });

    $('#break-decrement').click(function () {
        if (breakCounter > 1) {
            breakCounter--;
            breakTime = (breakTime % 60 === 0) ? breakTime - 60 : breakTime - (breakTime % 60);
            updateDisplay();
        }
    });

    $('#session-increment').click(function () {
        if (sessionCounter < 60) {
            sessionCounter++;
            sessionTime = (sessionTime % 60 === 0) ? sessionTime + 60 : sessionTime - (sessionTime % 60) + 120;
            updateDisplay();
        }
    });

    $('#session-decrement').click(function () {
        if (sessionCounter > 1) {
            sessionCounter--;
            sessionTime = (sessionTime % 60 === 0) ? sessionTime - 60 : sessionTime - (sessionTime % 60);
            updateDisplay();
        }
    });

    function updateDisplay() {
        $('#break-length').text(breakCounter);
        $('#session-length').text(sessionCounter);
        if (sessionTime >= 0) {
            $('#time-left').text(formatTime(sessionTime));
            $('#timer-label').text('Session');
        } else {
            $('#time-left').text(formatTime(breakTime));
            $('#timer-label').text('Break');
        }

    }

    function formatTime(timeInSeconds) {
        var minutes = Math.floor(timeInSeconds / 60);
        var seconds = timeInSeconds % 60;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        return minutes + ":" + seconds;
    }

    function tick() {
        if (sessionTime == 0 || breakTime == 0) {
            var playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(function () {}).catch(function (error) {});
            }
            setTimeout(function () {
                audio.pause();
                audio.currentTime = 0;
            }, 2000);
        }
        if (sessionTime >= 0) {

            if (sessionTime === 0) {
                breakTime = breakCounter * 60;
            }
            sessionTime--;

        } else {
            breakTime--;
            if (breakTime < 0) {
                sessionTime = sessionCounter * 60;
            }
        }

        updateDisplay();

        function updateProgressBar() {
            var totalTime = (sessionTime >= 0) ? sessionCounter * 60 : breakCounter * 60;
            var remainingTime = (sessionTime >= 0) ? sessionTime : breakTime;
            var percentage = ((totalTime - remainingTime) / totalTime) * 100;
            $('#progress-bar').css('width', percentage + '%');
        }
        updateProgressBar();
    }

    function startStop() {
        if (isRunning) {
            clearInterval(intervalId);
            isRunning = false;
        } else {
            intervalId = setInterval(tick, 1000);
            isRunning = true;
        }
    }

    function reset() {
        clearInterval(intervalId);
        breakCounter = 5;
        sessionCounter = 25;
        sessionTime = 1500;
        breakTime = 300;
        isRunning = false;
        updateDisplay();
    }

    $('#start_stop').click(startStop);
    $('#reset').click(reset);
});