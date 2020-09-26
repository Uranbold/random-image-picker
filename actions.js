const IMAGES = []; // Will put all images in this
const ROUNDS = 1; // Amount of rounds the carousel will shift trough
const CAROUSEL_TIME = 5; // Total time in seconds carousel will spin

const AMOUNT_STEPS = 2;
let CURRENT_STEP = 1;

function previewImages() {
    $("#yourimagestitle").html("Images selected by you");
    $("#usage").html("");
    for (let file of document.getElementById("imagesInput").files) {
        let oFReader = new FileReader();
        oFReader.readAsDataURL(file);

        oFReader.onload = function(oFREvent) {
            data = $("#images").html()
            data += `<img class="img-thumbnail thumbnail" src='` + oFREvent.target.result + `'>`
            $("#images").html(data);
            IMAGES.push(oFREvent.target.result);
        };
    }
}

function pickRandomImage() {
    if (!IMAGES.length) {
        $("#information-text").html("No images left");
        $("#random-image").html("");
    } else {
        selected = Math.floor(Math.random() * IMAGES.length); // Pick random image
        const totalCarousel = ROUNDS * IMAGES.length + selected; // Total images that will be shown in carousel
        let durations = computeDurations(totalCarousel); // Compute a list of durations for each image display in the carousel
        doCarousel(0, durations);
    }
}

function doCarousel(index, durations) {
    index = index % IMAGES.length;
    let randomImage = $("#random-image");
    if (durations.length > 0) {
        randomImage.prop("src", IMAGES[index]);
        randomImage.css("background-color", "transparent");
        const duration = durations.shift();
        setTimeout(function() {
            doCarousel(index + 1, durations);
        }, duration * 1000);
    } else {
        // Freeze and remove image from list
        randomImage.prop("src", IMAGES[index]);
        setTimeout(function() {
            randomImage.css("background-color", "#343a40");
        }, 1000);
        IMAGES.splice(index, 1);
    }
}

function computeDurations(steps) {
    const times = [];
    for (let i = steps; i > 0; i -= 1) {
        times.push(f(i, steps));
    }
    return times;
}

/**
 * Some beautiful math to create a increasing-time effect in the carousel spin
 */
function f(x, steps) {
    const carousel_time = Math.min(CAROUSEL_TIME, IMAGES.length);
    sigm = 0;
    for (let i = 1; i <= steps; i += 1) {
        sigm += Math.log(i);
    }
    a = CAROUSEL_TIME / (steps * Math.log(steps) - sigm)
    c = (CAROUSEL_TIME * Math.log(steps)) / (steps * Math.log(steps) - sigm);
    return -a * Math.log(x) + c;
}

function nextStep() {
    if (CURRENT_STEP < AMOUNT_STEPS) {
        $(`#step-` + CURRENT_STEP).each(function() {
            $(this).css("display", "none");
        })
        $(`#step-` + (CURRENT_STEP + 1)).each(function() {
            $(this).css("display", "");
        });
        clearStep(CURRENT_STEP);
        CURRENT_STEP++;
    }
}

function previousStep() {
    if (CURRENT_STEP > 0) {
        $(`#step-` + CURRENT_STEP).each(function() {
            $(this).css("display", "none");
        })
        $(`#step-` + (CURRENT_STEP - 1)).each(function() {
            $(this).css("display", "");
        });
        clearStep(CURRENT_STEP);
        CURRENT_STEP--;
    }
}

function clearStep(step) {
    $(`.step-` + step + `-clear`).each(function() {
        $(this).html("");
    });
}